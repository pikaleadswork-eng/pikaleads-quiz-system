import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const webhooksRouter = router({
  // Get all webhooks
  getAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Database not available",
      });
    }

    const webhooks = await db.select().from(schema.webhooks).orderBy(desc(schema.webhooks.createdAt));
    return webhooks;
  }),

  // Create webhook
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.enum(["hubspot", "salesforce", "custom"]),
        url: z.string().url(),
        headers: z.string().optional(),
        events: z.string(), // JSON array
        apiKey: z.string().optional(),
        config: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [webhook] = await db.insert(schema.webhooks).values({
        name: input.name,
        type: input.type,
        url: input.url,
        headers: input.headers,
        events: input.events,
        apiKey: input.apiKey,
        config: input.config,
        isActive: true,
      });

      return { success: true, webhookId: webhook.insertId };
    }),

  // Update webhook
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        url: z.string().url().optional(),
        headers: z.string().optional(),
        events: z.string().optional(),
        apiKey: z.string().optional(),
        config: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const { id, ...updates } = input;
      await db.update(schema.webhooks).set(updates).where(eq(schema.webhooks.id, id));

      return { success: true };
    }),

  // Delete webhook
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db.delete(schema.webhooks).where(eq(schema.webhooks.id, input.id));

      return { success: true };
    }),

  // Test webhook
  test: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [webhook] = await db
        .select()
        .from(schema.webhooks)
        .where(eq(schema.webhooks.id, input.id))
        .limit(1);

      if (!webhook) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Webhook not found",
        });
      }

      // Test payload
      const testPayload = {
        event: "webhook.test",
        timestamp: new Date().toISOString(),
        data: {
          test: true,
          message: "This is a test webhook from PIKALEADS",
        },
      };

      try {
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };

        // Parse custom headers
        if (webhook.headers) {
          const customHeaders = JSON.parse(webhook.headers);
          Object.assign(headers, customHeaders);
        }

        // Add API key for HubSpot/Salesforce
        if (webhook.apiKey) {
          if (webhook.type === "hubspot") {
            headers["Authorization"] = `Bearer ${webhook.apiKey}`;
          } else if (webhook.type === "salesforce") {
            headers["Authorization"] = `Bearer ${webhook.apiKey}`;
          }
        }

        const response = await fetch(webhook.url, {
          method: "POST",
          headers,
          body: JSON.stringify(testPayload),
        });

        const responseText = await response.text();

        // Log the test
        await db.insert(schema.webhookLogs).values({
          webhookId: webhook.id,
          event: "webhook.test",
          payload: JSON.stringify(testPayload),
          response: responseText,
          statusCode: response.status,
          success: response.ok,
          errorMessage: response.ok ? null : `HTTP ${response.status}: ${responseText}`,
        });

        return {
          success: response.ok,
          statusCode: response.status,
          response: responseText,
        };
      } catch (error: any) {
        // Log the error
        await db.insert(schema.webhookLogs).values({
          webhookId: webhook.id,
          event: "webhook.test",
          payload: JSON.stringify(testPayload),
          response: null,
          statusCode: null,
          success: false,
          errorMessage: error.message,
        });

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Webhook test failed: ${error.message}`,
        });
      }
    }),

  // Get webhook logs
  getLogs: adminProcedure
    .input(z.object({ webhookId: z.number(), limit: z.number().default(50) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const logs = await db
        .select()
        .from(schema.webhookLogs)
        .where(eq(schema.webhookLogs.webhookId, input.webhookId))
        .orderBy(desc(schema.webhookLogs.createdAt))
        .limit(input.limit);

      return logs;
    }),
});
