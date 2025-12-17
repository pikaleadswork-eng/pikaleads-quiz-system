import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { events_log } from "../../drizzle/schema";
import { desc, eq, and, gte, sql } from "drizzle-orm";

/**
 * Events Log Router
 * For tracking and monitoring analytics events
 */
export const eventsLogRouter = router({
  /**
   * Log an analytics event (public - called from frontend)
   */
  logEvent: publicProcedure
    .input(
      z.object({
        eventType: z.string(),
        platform: z.enum(["ga4", "meta_pixel", "gtm", "clarity"]),
        status: z.enum(["success", "fail", "pending"]).default("success"),
        eventData: z.any().optional(),
        errorMessage: z.string().optional(),
        userId: z.string().optional(),
        quizId: z.string().optional(),
        responseTime: z.number().optional(),
        ipAddress: z.string().optional(),
        userAgent: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }
      
      const [result] = await db.insert(events_log).values({
        eventType: input.eventType,
        platform: input.platform,
        status: input.status,
        eventData: input.eventData,
        errorMessage: input.errorMessage,
        userId: input.userId,
        quizId: input.quizId,
        responseTime: input.responseTime,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      });

      return {
        success: true,
        eventId: Number(result.insertId),
      };
    }),

  /**
   * Get recent events (admin only)
   */
  getRecentEvents: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(1000).default(100),
        platform: z.enum(["ga4", "meta_pixel", "gtm", "clarity", "all"]).default("all"),
        status: z.enum(["success", "fail", "pending", "all"]).default("all"),
        eventType: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const conditions = [];
      
      if (input.platform !== "all") {
        conditions.push(eq(events_log.platform, input.platform));
      }
      
      if (input.status !== "all") {
        conditions.push(eq(events_log.status, input.status));
      }

      if (input.eventType) {
        conditions.push(eq(events_log.eventType, input.eventType));
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const events = await db
        .select()
        .from(events_log)
        .where(whereClause)
        .orderBy(desc(events_log.timestamp))
        .limit(input.limit);

      return events;
    }),

  /**
   * Get event statistics (admin only)
   */
  getEventStats: protectedProcedure
    .input(
      z.object({
        timeRange: z.enum(["1h", "24h", "7d", "30d"]).default("24h"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      // Calculate time threshold
      const now = new Date();
      const thresholds = {
        "1h": new Date(now.getTime() - 60 * 60 * 1000),
        "24h": new Date(now.getTime() - 24 * 60 * 60 * 1000),
        "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      };
      const threshold = thresholds[input.timeRange];

      // Get total events
      const totalEvents = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(events_log)
        .where(gte(events_log.timestamp, threshold));

      // Get success rate
      const successEvents = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(events_log)
        .where(
          and(
            gte(events_log.timestamp, threshold),
            eq(events_log.status, "success")
          )
        );

      // Get failed events
      const failedEvents = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(events_log)
        .where(
          and(
            gte(events_log.timestamp, threshold),
            eq(events_log.status, "fail")
          )
        );

      // Get events by platform
      const eventsByPlatform = await db
        .select({
          platform: events_log.platform,
          count: sql<number>`COUNT(*)`,
        })
        .from(events_log)
        .where(gte(events_log.timestamp, threshold))
        .groupBy(events_log.platform);

      // Get events by type
      const eventsByType = await db
        .select({
          eventType: events_log.eventType,
          count: sql<number>`COUNT(*)`,
        })
        .from(events_log)
        .where(gte(events_log.timestamp, threshold))
        .groupBy(events_log.eventType)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(10);

      // Get average response time
      const avgResponseTime = await db
        .select({
          avg: sql<number>`AVG(${events_log.responseTime})`,
        })
        .from(events_log)
        .where(
          and(
            gte(events_log.timestamp, threshold),
            sql`${events_log.responseTime} IS NOT NULL`
          )
        );

      const total = Number(totalEvents[0]?.count || 0);
      const success = Number(successEvents[0]?.count || 0);
      const failed = Number(failedEvents[0]?.count || 0);

      return {
        totalEvents: total,
        successEvents: success,
        failedEvents: failed,
        successRate: total > 0 ? Math.round((success / total) * 100) : 0,
        eventsByPlatform: eventsByPlatform.map(e => ({
          platform: e.platform,
          count: Number(e.count),
        })),
        eventsByType: eventsByType.map(e => ({
          eventType: e.eventType,
          count: Number(e.count),
        })),
        avgResponseTime: Math.round(Number(avgResponseTime[0]?.avg || 0)),
      };
    }),

  /**
   * Clear old events (admin only)
   */
  clearOldEvents: protectedProcedure
    .input(
      z.object({
        daysToKeep: z.number().min(1).max(365).default(30),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error("Database not available");
      }

      const threshold = new Date();
      threshold.setDate(threshold.getDate() - input.daysToKeep);

      const [result] = await db
        .delete(events_log)
        .where(sql`${events_log.timestamp} < ${threshold}`);

      return {
        success: true,
        deletedCount: Number(result.affectedRows) || 0,
      };
    }),
});
