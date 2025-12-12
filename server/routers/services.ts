import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import * as db from "../db";

export const servicesRouter = router({
  // Get all services
  getAll: protectedProcedure.query(async () => {
    return db.getAllServices();
  }),

  // Get service by ID
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return db.getServiceById(input.id);
    }),

  // Create service (admin only)
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        type: z.string().min(1),
        price: z.number().int().positive(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create services");
      }
      const id = await db.createService(input);
      return { id };
    }),

  // Update service (admin only)
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        type: z.string().min(1).optional(),
        price: z.number().int().positive().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update services");
      }
      const { id, ...updates } = input;
      await db.updateService(id, updates);
      return { success: true };
    }),

  // Delete service (admin only, soft delete)
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete services");
      }
      await db.deleteService(input.id);
      return { success: true };
    }),

  // Additional Services
  getAllAdditional: protectedProcedure.query(async () => {
    return db.getAllAdditionalServices();
  }),

  createAdditional: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        price: z.number().int().positive(),
        description: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can create additional services");
      }
      const id = await db.createAdditionalService(input);
      return { id };
    }),

  updateAdditional: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        price: z.number().int().positive().optional(),
        description: z.string().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can update additional services");
      }
      const { id, ...updates } = input;
      await db.updateAdditionalService(id, updates);
      return { success: true };
    }),

  deleteAdditional: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Only admins can delete additional services");
      }
      await db.deleteAdditionalService(input.id);
      return { success: true };
    }),
});
