import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const analyticsSettingsRouter = router({
  /**
   * Get all analytics settings
   * Public procedure - needed for analytics scripts on all pages including home
   */
  getAll: publicProcedure.query(async () => {
    const db = await getDb();
    
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const settings = await db.select().from(schema.analyticsSettings);
    return settings;
  }),

  /**
   * Get analytics setting by provider
   */
  getByProvider: protectedProcedure
    .input(z.object({
      provider: z.enum(["ga4", "meta_pixel", "microsoft_clarity", "gtm"]),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [setting] = await db
        .select()
        .from(schema.analyticsSettings)
        .where(eq(schema.analyticsSettings.provider, input.provider));
      
      return setting || null;
    }),

  /**
   * Save or update analytics setting
   */
  save: protectedProcedure
    .input(z.object({
      provider: z.enum(["ga4", "meta_pixel", "microsoft_clarity", "gtm"]),
      trackingId: z.string().min(1),
      apiSecret: z.string().optional(),
      serverContainerUrl: z.string().optional(),
      isActive: z.boolean().default(true),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Check if setting already exists
      const [existing] = await db
        .select()
        .from(schema.analyticsSettings)
        .where(eq(schema.analyticsSettings.provider, input.provider));

      if (existing) {
        // Update existing
        await db
          .update(schema.analyticsSettings)
          .set({
            trackingId: input.trackingId,
            apiSecret: input.apiSecret,
            serverContainerUrl: input.serverContainerUrl,
            isActive: input.isActive,
            updatedAt: new Date(),
          })
          .where(eq(schema.analyticsSettings.provider, input.provider));
      } else {
        // Insert new
        await db.insert(schema.analyticsSettings).values({
          provider: input.provider,
          trackingId: input.trackingId,
          apiSecret: input.apiSecret,
          serverContainerUrl: input.serverContainerUrl,
          isActive: input.isActive,
        });
      }

      return { success: true };
    }),

  /**
   * Delete analytics setting
   */
  delete: protectedProcedure
    .input(z.object({
      provider: z.enum(["ga4", "meta_pixel", "microsoft_clarity", "gtm"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .delete(schema.analyticsSettings)
        .where(eq(schema.analyticsSettings.provider, input.provider));

      return { success: true };
    }),

  /**
   * Toggle analytics setting active status
   */
  toggleActive: protectedProcedure
    .input(z.object({
      provider: z.enum(["ga4", "meta_pixel", "microsoft_clarity", "gtm"]),
      isActive: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .update(schema.analyticsSettings)
        .set({
          isActive: input.isActive,
          updatedAt: new Date(),
        })
        .where(eq(schema.analyticsSettings.provider, input.provider));

      return { success: true };
    }),

  /**
   * Test analytics integration by sending a test event
   */
  test: protectedProcedure
    .input(z.object({
      provider: z.enum(["ga4", "meta_pixel", "microsoft_clarity", "gtm"]),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Get settings for the provider
      const [setting] = await db
        .select()
        .from(schema.analyticsSettings)
        .where(eq(schema.analyticsSettings.provider, input.provider));

      if (!setting) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No settings found for ${input.provider}`,
        });
      }

      // Test based on provider
      try {
        switch (input.provider) {
          case 'ga4':
            if (!setting.apiSecret) {
              throw new Error('GA4 API Secret is required for testing');
            }
            // Send test event to GA4 Measurement Protocol
            const ga4Response = await fetch(
              `https://www.google-analytics.com/mp/collect?measurement_id=${setting.trackingId}&api_secret=${setting.apiSecret}`,
              {
                method: 'POST',
                body: JSON.stringify({
                  client_id: 'test_client_' + Date.now(),
                  events: [{
                    name: 'test_event',
                    params: {
                      test_parameter: 'test_value',
                      timestamp: new Date().toISOString(),
                    },
                  }],
                }),
              }
            );
            if (!ga4Response.ok) {
              throw new Error(`GA4 API returned ${ga4Response.status}`);
            }
            break;

          case 'meta_pixel':
            if (!setting.apiSecret) {
              throw new Error('Meta Pixel Access Token is required for testing');
            }
            // Send test event to Meta Conversions API
            const metaResponse = await fetch(
              `https://graph.facebook.com/v18.0/${setting.trackingId}/events`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  data: [{
                    event_name: 'Test',
                    event_time: Math.floor(Date.now() / 1000),
                    action_source: 'website',
                    event_source_url: 'https://example.com/test',
                    user_data: {
                      client_ip_address: '127.0.0.1',
                      client_user_agent: 'Test Agent',
                    },
                  }],
                  test_event_code: 'TEST' + Date.now(),
                  access_token: setting.apiSecret,
                }),
              }
            );
            const metaData = await metaResponse.json();
            if (!metaResponse.ok || metaData.error) {
              throw new Error(metaData.error?.message || `Meta API returned ${metaResponse.status}`);
            }
            break;

          case 'gtm':
            // GTM doesn't have a test API, just verify the container ID format
            if (!setting.trackingId.startsWith('GTM-')) {
              throw new Error('Invalid GTM Container ID format');
            }
            // Success - GTM is client-side only
            break;

          case 'microsoft_clarity':
            // Clarity doesn't have a test API, just verify project ID exists
            if (!setting.trackingId || setting.trackingId.length < 5) {
              throw new Error('Invalid Clarity Project ID');
            }
            // Success - Clarity is client-side only
            break;
        }

        return { 
          success: true, 
          message: `${input.provider} test completed successfully`,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: error.message || `Failed to test ${input.provider}`,
        });
      }
    }),
});
