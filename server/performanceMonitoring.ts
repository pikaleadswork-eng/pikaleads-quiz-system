import { getDb } from "./db";
import { quizSessions, quizQuestionEvents, quizzes } from "../drizzle/schema";
import { eq, and, gte, sql } from "drizzle-orm";
import { sendTelegramMessage } from "./telegram";

interface PerformanceMetrics {
  quizId: number;
  quizName: string;
  completionRate: number;
  totalSessions: number;
  completedSessions: number;
  dropOffPoints: Array<{
    questionId: number;
    dropOffRate: number;
  }>;
}

/**
 * Calculate quiz performance metrics
 */
export async function calculatePerformanceMetrics(
  quizId: number,
  hours: number = 24
): Promise<PerformanceMetrics | null> {
  const cutoffDate = new Date(Date.now() - hours * 60 * 60 * 1000);

  // Get quiz info
  const db = await getDb();
  if (!db) return null;
  
  const quiz = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.id, quizId))
    .limit(1);

  if (!quiz.length) {
    return null;
  }

  // Get total sessions in time period
  const sessions = await db
    .select()
    .from(quizSessions)
    .where(
      and(
        eq(quizSessions.quizId, quizId),
        gte(quizSessions.startedAt, cutoffDate)
      )
    );

  const totalSessions = sessions.length;
  const completedSessions = sessions.filter((s: any) => s.completedAt !== null).length;
  const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;

  // Calculate drop-off points
  const questionEvents = await db
    .select()
    .from(quizQuestionEvents)
    .where(
      and(
        eq(quizQuestionEvents.quizId, quizId),
        gte(quizQuestionEvents.timestamp, cutoffDate)
      )
    );

  // Group by question and count views
  const questionViews: Record<number, number> = {};
  const questionAnswers: Record<number, number> = {};

  questionEvents.forEach((event: any) => {
    if (event.eventType === "viewed") {
      questionViews[event.questionId] = (questionViews[event.questionId] || 0) + 1;
    } else if (event.eventType === "answered") {
      questionAnswers[event.questionId] = (questionAnswers[event.questionId] || 0) + 1;
    }
  });

  // Calculate drop-off rate for each question
  const dropOffPoints = Object.keys(questionViews).map((questionId) => {
    const qId = parseInt(questionId);
    const views = questionViews[qId] || 0;
    const answers = questionAnswers[qId] || 0;
    const dropOffRate = views > 0 ? ((views - answers) / views) * 100 : 0;

    return {
      questionId: qId,
      dropOffRate,
    };
  });

  return {
    quizId,
    quizName: quiz[0].name,
    completionRate,
    totalSessions,
    completedSessions,
    dropOffPoints: dropOffPoints.sort((a, b) => b.dropOffRate - a.dropOffRate),
  };
}

/**
 * Check performance thresholds and send alerts
 */
export async function checkPerformanceAlerts(
  quizId: number,
  thresholds: {
    minCompletionRate: number;
    maxDropOffRate: number;
  }
): Promise<void> {
  const metrics = await calculatePerformanceMetrics(quizId, 24);

  if (!metrics) {
    return;
  }

  const alerts: string[] = [];

  // Check completion rate
  if (metrics.completionRate < thresholds.minCompletionRate) {
    alerts.push(
      `⚠️ Низький коефіцієнт завершення: ${metrics.completionRate.toFixed(1)}% (поріг: ${thresholds.minCompletionRate}%)`
    );
  }

  // Check drop-off points
  const highDropOffQuestions = metrics.dropOffPoints.filter(
    (point) => point.dropOffRate > thresholds.maxDropOffRate
  );

  if (highDropOffQuestions.length > 0) {
    alerts.push(
      `⚠️ Високий drop-off на ${highDropOffQuestions.length} питаннях:`
    );
    highDropOffQuestions.slice(0, 3).forEach((point) => {
      alerts.push(
        `  • Питання ${point.questionId}: ${point.dropOffRate.toFixed(1)}% drop-off`
      );
    });
  }

  // Send Telegram alert if there are any issues
  if (alerts.length > 0) {
    const message = [
      `🚨 <b>Алерт продуктивності квізу</b>`,
      ``,
      `<b>Квіз:</b> ${metrics.quizName}`,
      `<b>Період:</b> Останні 24 години`,
      `<b>Сесії:</b> ${metrics.totalSessions} (завершено: ${metrics.completedSessions})`,
      `<b>Коефіцієнт завершення:</b> ${metrics.completionRate.toFixed(1)}%`,
      ``,
      ...alerts,
      ``,
      `<i>Перевірте аналітику квізу для детальної інформації.</i>`,
    ].join("\n");

    await sendTelegramMessage(message);
  }
}

/**
 * Monitor all active quizzes
 */
export async function monitorAllQuizzes(
  thresholds: {
    minCompletionRate: number;
    maxDropOffRate: number;
  }
): Promise<void> {
  // Get all active quizzes
  const db = await getDb();
  if (!db) return;
  
  const activeQuizzes = await db
    .select()
    .from(quizzes)
    .where(eq(quizzes.isActive, true));

  // Check each quiz
  for (const quiz of activeQuizzes) {
    try {
      await checkPerformanceAlerts(quiz.id, thresholds);
    } catch (error) {
      console.error(`Error checking alerts for quiz ${quiz.id}:`, error);
    }
  }
}
