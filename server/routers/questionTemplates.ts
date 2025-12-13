import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { questionTemplates } from "../../drizzle/schema";
import { eq, like, desc } from "drizzle-orm";

export const questionTemplatesRouter = router({
  // Get all question templates with optional category filter
  getAll: protectedProcedure
    .input(
      z.object({
        category: z.string().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not initialized");

      let templates;
      
      if (input.category && input.category !== "all" && input.search) {
        templates = await db
          .select()
          .from(questionTemplates)
          .where(eq(questionTemplates.category, input.category))
          .orderBy(desc(questionTemplates.usageCount));
      } else if (input.category && input.category !== "all") {
        templates = await db
          .select()
          .from(questionTemplates)
          .where(eq(questionTemplates.category, input.category))
          .orderBy(desc(questionTemplates.usageCount));
      } else {
        templates = await db
          .select()
          .from(questionTemplates)
          .orderBy(desc(questionTemplates.usageCount));
      }
      
      return templates.map((t: any) => ({
        ...t,
        options: JSON.parse(t.options),
      }));
    }),

  // Save new question template
  save: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        category: z.string(),
        questionText: z.string().min(1),
        questionType: z.enum(["single", "multiple", "text"]),
        options: z.array(z.string()),
        isRequired: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not initialized");

      const [template] = await db.insert(questionTemplates).values({
        title: input.title,
        category: input.category,
        questionText: input.questionText,
        questionType: input.questionType,
        options: JSON.stringify(input.options),
        isRequired: input.isRequired ? 1 : 0,
        createdBy: ctx.user.id,
        usageCount: 0,
      });

      return { success: true, templateId: template.insertId };
    }),

  // Use template (increment usage count and return template data)
  use: protectedProcedure
    .input(z.object({ templateId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not initialized");

      // Get current template
      const [currentTemplate] = await db
        .select()
        .from(questionTemplates)
        .where(eq(questionTemplates.id, input.templateId));
      
      if (!currentTemplate) {
        throw new Error("Template not found");
      }

      // Increment usage count
      await db
        .update(questionTemplates)
        .set({ usageCount: currentTemplate.usageCount + 1 })
        .where(eq(questionTemplates.id, input.templateId));

      // Return template data
      const [template] = await db
        .select()
        .from(questionTemplates)
        .where(eq(questionTemplates.id, input.templateId));

      if (!template) {
        throw new Error("Template not found");
      }

      return {
        ...template,
        options: JSON.parse(template.options),
      };
    }),

  // Delete template
  delete: protectedProcedure
    .input(z.object({ templateId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not initialized");

      await db
        .delete(questionTemplates)
        .where(eq(questionTemplates.id, input.templateId));

      return { success: true };
    }),
});
