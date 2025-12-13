import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizzes, quizQuestions, quizAnswerOptions } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export const quizEditorRouter = router({
  // Get all quizzes
  getAll: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    return await db.select().from(quizzes).orderBy(desc(quizzes.createdAt));
  }),

  // Get single quiz with questions and options
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const quiz = await db.select().from(quizzes).where(eq(quizzes.id, input.id)).limit(1);
      if (!quiz[0]) throw new Error("Quiz not found");

      const questions = await db
        .select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, input.id))
        .orderBy(quizQuestions.order);

      const questionsWithOptions = await Promise.all(
        questions.map(async (question: any) => {
          const options = await db
            .select()
            .from(quizAnswerOptions)
            .where(eq(quizAnswerOptions.questionId, question.id))
            .orderBy(quizAnswerOptions.order);
          return { ...question, options };
        })
      );

      return { ...quiz[0], questions: questionsWithOptions };
    }),

  // Create new quiz
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(quizzes).values({
        name: input.name,
        slug: input.slug,
        description: input.description,
        createdBy: ctx.user.id,
      });
      return { id: Number((result as any).insertId) };
    }),

  // Update quiz
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(quizzes).set(data).where(eq(quizzes.id, id));
      return { success: true };
    }),

  // Delete quiz
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Delete options first
      const questions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, input.id));
      for (const question of questions as any[]) {
        await db.delete(quizAnswerOptions).where(eq(quizAnswerOptions.questionId, question.id));
      }
      // Delete questions
      await db.delete(quizQuestions).where(eq(quizQuestions.quizId, input.id));
      // Delete quiz
      await db.delete(quizzes).where(eq(quizzes.id, input.id));
      return { success: true };
    }),

  // Add question to quiz
  addQuestion: protectedProcedure
    .input(
      z.object({
        quizId: z.number(),
        questionText: z.string().min(1),
        questionType: z.enum([
          "single_choice",
          "multiple_choice",
          "image_choice",
          "text_input",
          "textarea",
          "slider",
          "rating",
          "file_upload",
          "email",
          "phone",
        ]),
        order: z.number(),
        isRequired: z.boolean().default(true),
        config: z.string().optional(), // JSON string
        conditionalLogic: z.string().optional(), // JSON string
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(quizQuestions).values(input);
      return { id: Number((result as any).insertId) };
    }),

  // Update question
  updateQuestion: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        questionText: z.string().optional(),
        questionType: z
          .enum([
            "single_choice",
            "multiple_choice",
            "image_choice",
            "text_input",
            "textarea",
            "slider",
            "rating",
            "file_upload",
            "email",
            "phone",
          ])
          .optional(),
        order: z.number().optional(),
        isRequired: z.boolean().optional(),
        config: z.string().optional(),
        conditionalLogic: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(quizQuestions).set(data).where(eq(quizQuestions.id, id));
      return { success: true };
    }),

  // Delete question
  deleteQuestion: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      // Delete options first
      await db.delete(quizAnswerOptions).where(eq(quizAnswerOptions.questionId, input.id));
      // Delete question
      await db.delete(quizQuestions).where(eq(quizQuestions.id, input.id));
      return { success: true };
    }),

  // Add answer option
  addOption: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        optionText: z.string().min(1),
        imageUrl: z.string().optional(),
        order: z.number(),
        score: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const result = await db.insert(quizAnswerOptions).values(input);
      return { id: Number((result as any).insertId) };
    }),

  // Update option
  updateOption: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        optionText: z.string().optional(),
        imageUrl: z.string().optional(),
        order: z.number().optional(),
        score: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      const { id, ...data } = input;
      await db.update(quizAnswerOptions).set(data).where(eq(quizAnswerOptions.id, id));
      return { success: true };
    }),

  // Delete option
  deleteOption: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      await db.delete(quizAnswerOptions).where(eq(quizAnswerOptions.id, input.id));
      return { success: true };
    }),
});
