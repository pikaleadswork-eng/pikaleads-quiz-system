import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const salesScriptsRouter = router({
  // Get all scripts
  getAll: protectedProcedure.query(async () => {
    return db.getAllSalesScripts();
  }),

  // Get scripts by category
  getByCategory: protectedProcedure
    .input(z.object({ category: z.string() }))
    .query(async ({ input }) => {
      return db.getSalesScriptsByCategory(input.category);
    }),

  // Create script
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        category: z.enum(["Cold Call", "Follow-up", "Objection Handling", "Closing"]),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await db.createSalesScript({
        ...input,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  // Update script
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        category: z.enum(["Cold Call", "Follow-up", "Objection Handling", "Closing"]).optional(),
        content: z.string().min(1).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      await db.updateSalesScript(id, updates);
      return { success: true };
    }),

  // Delete script
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete scripts");
      }
      await db.deleteSalesScript(input.id);
      return { success: true };
    }),
});
