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
            isActive: input.isActive,
            updatedAt: new Date(),
          })
          .where(eq(schema.analyticsSettings.provider, input.provider));
      } else {
        // Insert new
        await db.insert(schema.analyticsSettings).values({
          provider: input.provider,
          trackingId: input.trackingId,
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
});
