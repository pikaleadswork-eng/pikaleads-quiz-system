import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizTemplates } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const quizTemplatesRouter = router({
  // Get all templates
  getAll: protectedProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const templates = await db.select()
        .from(quizTemplates)
        .where(eq(quizTemplates.isActive, 1))
        .orderBy(quizTemplates.usageCount);
      
      return templates;
    }),

  // Get templates by niche
  getByNiche: protectedProcedure
    .input(z.object({
      niche: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const templates = await db.select()
        .from(quizTemplates)
        .where(eq(quizTemplates.niche, input.niche))
        .orderBy(quizTemplates.usageCount);
      
      return templates;
    }),

  // Get template by ID
  getById: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      const template = await db.select()
        .from(quizTemplates)
        .where(eq(quizTemplates.id, input.id))
        .limit(1);
      
      return template[0] || null;
    }),

  // Increment usage count when template is used
  incrementUsage: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      await db.update(quizTemplates)
        .set({
          usageCount: (quizTemplates.usageCount as any) + 1,
        })
        .where(eq(quizTemplates.id, input.id));
      
      return { success: true };
    }),
});
