import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, and, gte, lte, sql, desc, count } from "drizzle-orm";

export const analyticsRouter = router({
  getQuizAnalytics: protectedProcedure
    .input(
      z.object({
        quizId: z.union([z.number(), z.string()]),
        timeRange: z.enum(["24h", "7d", "30d", "90d", "all"]).default("7d"),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Calculate time threshold
      const now = new Date();
      let timeThreshold = new Date(0); // all time
      if (input.timeRange === "24h") {
        timeThreshold = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      } else if (input.timeRange === "7d") {
        timeThreshold = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (input.timeRange === "30d") {
        timeThreshold = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      } else if (input.timeRange === "90d") {
        timeThreshold = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      }

      // Get quiz info (by ID or slug)
      const quiz = typeof input.quizId === "number"
        ? await db
            .select()
            .from(schema.quizzes)
            .where(eq(schema.quizzes.id, input.quizId))
            .limit(1)
        : await db
            .select()
            .from(schema.quizzes)
            .where(eq(schema.quizzes.slug, input.quizId))
            .limit(1);

      if (!quiz || quiz.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Quiz not found",
        });
      }

      // Get all sessions for this quiz in the time range
      const sessions = await db
        .select()
        .from(schema.quizSessions)
        .where(
          and(
            eq(schema.quizSessions.quizId, quiz[0].id),
            gte(schema.quizSessions.startedAt, timeThreshold)
          )
        );

      const totalSessions = sessions.length;
      const completedSessions = sessions.filter((s) => s.status === "completed");
      const abandonedSessions = sessions.filter((s) => s.status === "abandoned");
      const totalCompletions = completedSessions.length;
      const totalAbandoned = abandonedSessions.length;

      const completionRate = totalSessions > 0 ? (totalCompletions / totalSessions) * 100 : 0;

      // Calculate average time spent (only completed sessions)
      const avgTimeSpent =
        completedSessions.length > 0
          ? completedSessions.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / completedSessions.length
          : 0;

      // Get leads created from this quiz
      const leads = await db
        .select()
        .from(schema.leads)
        .where(
          and(
            eq(schema.leads.quizName, quiz[0].name),
            gte(schema.leads.createdAt, timeThreshold)
          )
        );

      const conversionRate = totalSessions > 0 ? (leads.length / totalSessions) * 100 : 0;

      // Get quiz questions
      const questions = await db
        .select()
        .from(schema.quizQuestions)
        .where(eq(schema.quizQuestions.quizId, quiz[0].id))
        .orderBy(schema.quizQuestions.orderIndex);

      // Get all question events for this quiz
      const sessionIds = sessions.map((s) => s.sessionId);
      const questionEvents = sessionIds.length > 0
        ? await db
            .select()
            .from(schema.quizQuestionEvents)
            .where(sql`${schema.quizQuestionEvents.sessionId} IN (${sql.join(sessionIds.map((id) => sql`${id}`), sql`, `)})`)
        : [];

      // Build funnel steps and question performance
      const funnelSteps = [];
      const timeAnalysis = [];
      const questionPerformance = [];

      for (let i = 0; i < questions.length; i++) {
        const question = questions[i];
        const questionNumber = i + 1;

        // Get events for this question
        const viewEvents = questionEvents.filter(
          (e) => e.questionId === question.id && e.eventType === "viewed"
        );
        const answerEvents = questionEvents.filter(
          (e) => e.questionId === question.id && e.eventType === "answered"
        );

        const views = viewEvents.length;
        const answers = answerEvents.length;
        const dropOffs = views - answers;
        const dropOffRate = views > 0 ? (dropOffs / views) * 100 : 0;
        const answerRate = views > 0 ? (answers / views) * 100 : 0;

        // Calculate time metrics
        const times = answerEvents.map((e) => e.timeSpent || 0).filter((t) => t > 0);
        const avgTime = times.length > 0 ? times.reduce((sum, t) => sum + t, 0) / times.length : 0;
        const minTime = times.length > 0 ? Math.min(...times) : 0;
        const maxTime = times.length > 0 ? Math.max(...times) : 0;

        funnelSteps.push({
          questionNumber,
          questionText: question.questionText,
          views,
          answers,
          dropOffs,
          dropOffRate,
        });

        timeAnalysis.push({
          questionNumber,
          questionText: question.questionText,
          avgTime: Math.round(avgTime),
          minTime: Math.round(minTime),
          maxTime: Math.round(maxTime),
        });

        questionPerformance.push({
          questionNumber,
          questionText: question.questionText,
          questionType: question.questionType,
          views,
          answers,
          answerRate,
          avgTime: Math.round(avgTime),
          dropOffRate,
        });
      }

      // TODO: Calculate previous period comparison (for trend indicators)
      const previousPeriodComparison = undefined;

      return {
        quizName: quiz[0].name,
        overview: {
          completionRate,
          avgTimeSpent: Math.round(avgTimeSpent),
          totalSessions,
          totalCompletions,
          totalAbandoned,
          conversionRate,
          previousPeriodComparison,
        },
        funnelSteps,
        timeAnalysis,
        questionPerformance,
      };
    }),

  /**
   * Get Sales Pipeline metrics
   * Returns funnel data with conversion rates at each stage
   */
  getPipelineMetrics: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const startDate = input.startDate ? new Date(input.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate ? new Date(input.endDate) : new Date();

      // Get all leads in date range
      const allLeads = await db
        .select({ count: count() })
        .from(schema.leads)
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate)
          )
        );

      const totalLeads = allLeads[0]?.count || 0;

      // Get leads with calls scheduled
      const leadsWithCalls = await db
        .select({ count: count() })
        .from(schema.leads)
        .innerJoin(schema.leadStatuses, eq(schema.leads.statusId, schema.leadStatuses.id))
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate),
            sql`${schema.leadStatuses.name} IN ('Дзвінок заплановано', 'Call Scheduled', 'Contacted')`
          )
        );

      const callsScheduled = leadsWithCalls[0]?.count || 0;

      // Get leads with sales
      const leadsWithSales = await db
        .select({ count: count() })
        .from(schema.leads)
        .innerJoin(schema.sales, eq(schema.leads.id, schema.sales.leadId))
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate)
          )
        );

      const salesClosed = leadsWithSales[0]?.count || 0;

      // Calculate total revenue
      const revenueData = await db
        .select({ 
          totalRevenue: sql<number>`SUM(${schema.sales.totalAmount})`,
        })
        .from(schema.sales)
        .innerJoin(schema.leads, eq(schema.sales.leadId, schema.leads.id))
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate)
          )
        );

      const totalRevenue = (revenueData[0]?.totalRevenue || 0) / 100;

      // Calculate total ad spend
      const spendData = await db
        .select({ 
          totalSpend: sql<number>`SUM(${schema.leads.spentAmount})`,
        })
        .from(schema.leads)
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate)
          )
        );

      const totalSpend = parseFloat(spendData[0]?.totalSpend?.toString() || "0");

      // Calculate metrics
      const leadToCallRate = totalLeads > 0 ? (callsScheduled / totalLeads) * 100 : 0;
      const callToSaleRate = callsScheduled > 0 ? (salesClosed / callsScheduled) * 100 : 0;
      const leadToSaleRate = totalLeads > 0 ? (salesClosed / totalLeads) * 100 : 0;
      const averageCheck = salesClosed > 0 ? totalRevenue / salesClosed : 0;
      const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
      const cpl = totalLeads > 0 ? totalSpend / totalLeads : 0;
      const cpa = salesClosed > 0 ? totalSpend / salesClosed : 0;

      return {
        totalLeads,
        callsScheduled,
        salesClosed,
        totalRevenue,
        totalSpend,
        leadToCallRate: Math.round(leadToCallRate * 10) / 10,
        callToSaleRate: Math.round(callToSaleRate * 10) / 10,
        leadToSaleRate: Math.round(leadToSaleRate * 10) / 10,
        averageCheck: Math.round(averageCheck * 100) / 100,
        roas: Math.round(roas * 100) / 100,
        cpl: Math.round(cpl * 100) / 100,
        cpa: Math.round(cpa * 100) / 100,
      };
    }),

  /**
   * Get Lead Source Attribution Report
   */
  getSourceAttribution: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      groupBy: z.enum(["source", "campaign", "medium"]).default("source"),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const startDate = input.startDate ? new Date(input.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate ? new Date(input.endDate) : new Date();

      const groupByField = 
        input.groupBy === "source" ? schema.leads.utmSource :
        input.groupBy === "campaign" ? schema.leads.utmCampaign :
        schema.leads.utmMedium;

      const attributionData = await db
        .select({
          source: groupByField,
          leadCount: count(schema.leads.id),
          totalSpend: sql<number>`SUM(${schema.leads.spentAmount})`,
          totalRevenue: sql<number>`COALESCE(SUM(${schema.sales.totalAmount}), 0)`,
          salesCount: sql<number>`COUNT(DISTINCT ${schema.sales.id})`,
        })
        .from(schema.leads)
        .leftJoin(schema.sales, eq(schema.leads.id, schema.sales.leadId))
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate)
          )
        )
        .groupBy(groupByField)
        .orderBy(desc(sql`leadCount`));

      const results = attributionData.map((row) => {
        const source = row.source || "Unknown";
        const leadCount = row.leadCount || 0;
        const totalSpend = parseFloat(row.totalSpend?.toString() || "0");
        const totalRevenue = (row.totalRevenue || 0) / 100;
        const salesCount = row.salesCount || 0;

        const conversionRate = leadCount > 0 ? (salesCount / leadCount) * 100 : 0;
        const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;
        const cpl = leadCount > 0 ? totalSpend / leadCount : 0;
        const cpa = salesCount > 0 ? totalSpend / salesCount : 0;
        const averageCheck = salesCount > 0 ? totalRevenue / salesCount : 0;

        return {
          source,
          leadCount,
          salesCount,
          totalSpend: Math.round(totalSpend * 100) / 100,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          conversionRate: Math.round(conversionRate * 10) / 10,
          roas: Math.round(roas * 100) / 100,
          cpl: Math.round(cpl * 100) / 100,
          cpa: Math.round(cpa * 100) / 100,
          averageCheck: Math.round(averageCheck * 100) / 100,
        };
      });

      return results;
    }),

  /**
   * Get top performing campaigns
   */
  getTopCampaigns: protectedProcedure
    .input(z.object({
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      limit: z.number().default(10),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const startDate = input.startDate ? new Date(input.startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const endDate = input.endDate ? new Date(input.endDate) : new Date();

      const campaigns = await db
        .select({
          campaign: schema.leads.utmCampaign,
          source: schema.leads.utmSource,
          leadCount: count(schema.leads.id),
          totalRevenue: sql<number>`COALESCE(SUM(${schema.sales.totalAmount}), 0)`,
          salesCount: sql<number>`COUNT(DISTINCT ${schema.sales.id})`,
          totalSpend: sql<number>`SUM(${schema.leads.spentAmount})`,
        })
        .from(schema.leads)
        .leftJoin(schema.sales, eq(schema.leads.id, schema.sales.leadId))
        .where(
          and(
            gte(schema.leads.createdAt, startDate),
            lte(schema.leads.createdAt, endDate)
          )
        )
        .groupBy(schema.leads.utmCampaign, schema.leads.utmSource)
        .orderBy(desc(sql`totalRevenue`))
        .limit(input.limit);

      return campaigns.map((row) => {
        const totalSpend = parseFloat(row.totalSpend?.toString() || "0");
        const totalRevenue = (row.totalRevenue || 0) / 100;
        const roas = totalSpend > 0 ? totalRevenue / totalSpend : 0;

        return {
          campaign: row.campaign || "Unknown",
          source: row.source || "Unknown",
          leadCount: row.leadCount || 0,
          salesCount: row.salesCount || 0,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          totalSpend: Math.round(totalSpend * 100) / 100,
          roas: Math.round(roas * 100) / 100,
        };
      });
    }),
});
