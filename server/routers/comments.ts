import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const commentsRouter = router({
  /**
   * Add a comment to a lead
   */
  add: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        comment: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await db.createLeadComment({
          leadId: input.leadId,
          userId: ctx.user.id,
          comment: input.comment,
        });

        return {
          success: true,
        };
      } catch (error) {
        console.error("Error adding comment:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to add comment",
        });
      }
    }),

  /**
   * Get all comments for a lead
   */
  getByLeadId: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      try {
        const comments = await db.getLeadComments(input.leadId);
        return comments;
      } catch (error) {
        console.error("Error fetching comments:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch comments",
        });
      }
    }),
});
