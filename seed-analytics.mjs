import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";
import { randomUUID } from "crypto";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

console.log("🌱 Seeding quiz analytics data...");

// Get first quiz
const quizzes = await db.select().from(schema.quizzes).limit(1);
if (quizzes.length === 0) {
  console.log("❌ No quizzes found. Please create a quiz first.");
  process.exit(1);
}

const quiz = quizzes[0];
console.log(`✅ Found quiz: ${quiz.name} (ID: ${quiz.id})`);

// Get quiz questions
const questions = await db
  .select()
  .from(schema.quizQuestions)
  .where(schema.quizQuestions.quizId.eq(quiz.id))
  .orderBy(schema.quizQuestions.order);

if (questions.length === 0) {
  console.log("❌ No questions found for this quiz.");
  process.exit(1);
}

console.log(`✅ Found ${questions.length} questions`);

// Create 100 quiz sessions with realistic data
const now = new Date();
const sessionsToCreate = 100;

for (let i = 0; i < sessionsToCreate; i++) {
  const sessionId = randomUUID();
  const startedAt = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000); // Last 7 days
  
  // Determine session outcome
  const random = Math.random();
  let status, completedAt, answeredQuestions, timeSpent;
  
  if (random < 0.65) {
    // 65% completion rate
    status = "completed";
    answeredQuestions = questions.length;
    timeSpent = Math.floor(60 + Math.random() * 180); // 1-4 minutes
    completedAt = new Date(startedAt.getTime() + timeSpent * 1000);
  } else {
    // 35% abandoned
    status = "abandoned";
    answeredQuestions = Math.floor(Math.random() * questions.length);
    timeSpent = Math.floor(10 + Math.random() * 60); // 10-70 seconds
    completedAt = null;
  }

  // Insert session
  await db.insert(schema.quizSessions).values({
    quizId: quiz.id,
    sessionId,
    startedAt,
    completedAt,
    status,
    totalQuestions: questions.length,
    answeredQuestions,
    timeSpent,
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
  });

  // Create question events
  for (let j = 0; j < answeredQuestions; j++) {
    const question = questions[j];
    const questionTime = Math.floor(5 + Math.random() * 30); // 5-35 seconds per question
    
    // View event
    await db.insert(schema.quizQuestionEvents).values({
      sessionId,
      questionId: question.id,
      eventType: "viewed",
      timeSpent: 0,
      timestamp: new Date(startedAt.getTime() + j * questionTime * 1000),
    });

    // Answer event
    await db.insert(schema.quizQuestionEvents).values({
      sessionId,
      questionId: question.id,
      eventType: "answered",
      answer: JSON.stringify({ value: "Sample answer" }),
      timeSpent: questionTime,
      timestamp: new Date(startedAt.getTime() + (j + 1) * questionTime * 1000),
    });
  }

  if ((i + 1) % 10 === 0) {
    console.log(`✅ Created ${i + 1}/${sessionsToCreate} sessions`);
  }
}

console.log("✅ Seed data created successfully!");
await connection.end();
