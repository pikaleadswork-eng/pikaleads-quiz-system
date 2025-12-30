import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizzes, quizQuestions, quizDesignSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const quizzesRouter = router({
  // Create new quiz
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        slug: z.string().min(1),
        description: z.string().optional(),
        quizType: z.enum(["lead_generation", "ecommerce", "calculator", "test", "form", "video_consultant"]).optional(),
        platform: z.enum(["google_ads", "meta_ads", "telegram"]).optional(),
        niche: z.enum(["furniture", "renovation", "ecommerce", "services", "realestate", "other"]).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [newQuiz] = await db.insert(quizzes).values({
        name: input.name,
        slug: input.slug,
        description: input.description || "",
        quizType: input.quizType || "lead_generation",
        platform: input.platform || "meta_ads",
        niche: input.niche || "other",
        createdBy: ctx.user.id,
      });

      return { id: Number(newQuiz.insertId), name: input.name };
    }),

  // Get all quizzes
  list: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allQuizzes = await db.select().from(quizzes);
    return allQuizzes;
  }),

  // Get quiz by ID
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allQuizzes = await db.select().from(quizzes).where(eq(quizzes.id, input.id));
      const quiz = allQuizzes[0];
      return quiz;
    }),

  // Get quiz by slug
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const allQuizzes = await db.select().from(quizzes).where(eq(quizzes.slug, input.slug));
      const quiz = allQuizzes[0];
      return quiz;
    }),

  // Update quiz
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        slug: z.string().optional(),
        quizType: z.enum(["lead_generation", "ecommerce", "calculator", "test", "form", "video_consultant"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(quizzes).set({
        ...(input.name && { name: input.name }),
        ...(input.description && { description: input.description }),
        ...(input.slug && { slug: input.slug }),
        ...(input.quizType && { quizType: input.quizType }),
      }).where(eq(quizzes.id, input.id));

      return { success: true };
    }),

  // Delete quiz
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(quizzes).where(eq(quizzes.id, input.id));

      return { success: true };
    }),

  // Duplicate quiz with all questions and settings
  duplicate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get original quiz
      const originalQuizzes = await db.select().from(quizzes).where(eq(quizzes.id, input.id));
      const originalQuiz = originalQuizzes[0];
      if (!originalQuiz) throw new Error("Quiz not found");

      // Create new quiz with copied data
      const newSlug = `${originalQuiz.slug}-copy-${Date.now()}`;
      const [newQuizResult] = await db.insert(quizzes).values({
        name: `${originalQuiz.name} (Копія)`,
        slug: newSlug,
        description: originalQuiz.description,
        quizType: originalQuiz.quizType,
        platform: originalQuiz.platform,
        niche: originalQuiz.niche,
        createdBy: ctx.user.id,
      });
      const newQuizId = Number(newQuizResult.insertId);

      // Copy questions
      const originalQuestions = await db.select().from(quizQuestions).where(eq(quizQuestions.quizId, input.id));
      for (const q of originalQuestions) {
        await db.insert(quizQuestions).values({
          quizId: newQuizId,
          questionText: q.questionText,
          questionType: q.questionType,
          orderIndex: q.orderIndex,
          isRequired: q.isRequired,
          settings: q.settings,
          answerOptions: q.answerOptions,
        });
      }

      // Copy design settings
      const originalSettings = await db.select().from(quizDesignSettings).where(eq(quizDesignSettings.quizId, input.id));
      if (originalSettings.length > 0) {
        const s = originalSettings[0];
        await db.insert(quizDesignSettings).values({
          quizId: newQuizId,
          layoutType: s.layoutType,
          backgroundImage: s.backgroundImage,
          backgroundVideo: s.backgroundVideo,
          alignment: s.alignment,
          logoImage: s.logoImage,
          primaryColor: s.primaryColor,
          accentColor: s.accentColor,
          fontFamily: s.fontFamily,
          titleText: s.titleText,
          subtitleText: s.subtitleText,
          buttonText: s.buttonText,
          bonusEnabled: s.bonusEnabled,
          bonusText: s.bonusText,
          companyName: s.companyName,
          phoneNumber: s.phoneNumber,
        });
      }

      return { id: newQuizId, name: `${originalQuiz.name} (Копія)`, slug: newSlug };
    }),

});
