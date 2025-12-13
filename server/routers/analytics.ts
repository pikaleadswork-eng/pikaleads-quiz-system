import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";

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
        .orderBy(schema.quizQuestions.order);

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
});
