import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizzes } from "../../drizzle/schema";
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

});
