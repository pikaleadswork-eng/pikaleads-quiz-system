import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const integrationsRouter = router({
  // Get all integration settings (admin only)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
    }
    
    return await db.getAllIntegrationSettings();
  }),

  // Get integration setting by provider (admin only)
  getByProvider: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .query(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      
      return await db.getIntegrationSettingByProvider(input.provider);
    }),

  // Save integration setting (admin only)
  save: protectedProcedure
    .input(
      z.object({
        provider: z.string(),
        credentials: z.string(),
        isActive: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      
      return await db.saveIntegrationSetting(input);
    }),

  // Delete integration setting (admin only)
  delete: protectedProcedure
    .input(z.object({ provider: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }
      
      await db.deleteIntegrationSetting(input.provider);
      return { success: true };
    }),
});
