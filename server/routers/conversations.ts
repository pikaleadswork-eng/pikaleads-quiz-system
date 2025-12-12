import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import * as db from "../db";

export const conversationsRouter = router({
  // Get all conversations (admin/manager)
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await db.getAllConversations();
  }),

  // Get messages for a specific conversation
  getMessages: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .query(async ({ ctx, input }) => {
      return await db.getConversationMessages(input.conversationId);
    }),

  // Mark conversation as read
  markAsRead: protectedProcedure
    .input(z.object({ conversationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await db.markConversationAsRead(input.conversationId);
      return { success: true };
    }),
});
