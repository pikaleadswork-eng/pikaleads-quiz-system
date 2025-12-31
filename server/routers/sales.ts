import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const salesRouter = router({
  // Create sale
  create: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        serviceId: z.number(),
        additionalServices: z.array(z.number()).optional(),
        totalAmount: z.number().int().positive(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await db.createSale({
        ...input,
        managerId: ctx.user.id,
      });
      return { id };
    }),

  // Get all sales
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role === "admin") {
      return db.getAllSales();
    } else {
      // Managers only see their own sales
      return db.getSalesByManager(ctx.user.id);
    }
  }),

  // Get sales statistics
  getStats: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Only admins can view sales statistics");
    }
    return db.getSalesStats();
  }),

  // Get sales by manager
  getByManager: protectedProcedure
    .input(z.object({ managerId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.id !== input.managerId) {
        throw new Error("You can only view your own sales");
      }
      return db.getSalesByManager(input.managerId);
    }),
});
