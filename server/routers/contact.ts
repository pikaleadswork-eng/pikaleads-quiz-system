import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as schema from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";
import { notifyOwner } from "../_core/notification";

export const contactRouter = router({
  /**
   * Submit contact form message (public)
   */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        phone: z.string().optional(),
        message: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Insert contact message
      const [contactMessage] = await db.insert(schema.contactMessages).values({
        name: input.name,
        email: input.email,
        phone: input.phone || null,
        message: input.message,
        status: "new",
      });

      // Notify owner about new contact message
      try {
        await notifyOwner({
          title: "Нове повідомлення з форми контактів",
          content: `Від: ${input.name} (${input.email})\nПовідомлення: ${input.message.substring(0, 200)}${input.message.length > 200 ? '...' : ''}`,
        });
      } catch (error) {
        console.error("Failed to notify owner:", error);
        // Don't throw error - message was saved successfully
      }

      return { success: true, id: contactMessage.insertId };
    }),

  /**
   * Get all contact messages (admin only)
   */
  getAll: protectedProcedure
    .input(
      z.object({
        status: z.enum(["new", "read", "replied", "archived"]).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      let query = db.select().from(schema.contactMessages);

      if (input.status) {
        query = query.where(eq(schema.contactMessages.status, input.status)) as any;
      }

      const messages = await query
        .orderBy(desc(schema.contactMessages.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return messages;
    }),

  /**
   * Update contact message status (admin only)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["new", "read", "replied", "archived"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const updateData: any = {
        status: input.status,
      };

      if (input.notes) {
        updateData.notes = input.notes;
      }

      if (input.status === "replied") {
        updateData.repliedAt = new Date();
      }

      await db
        .update(schema.contactMessages)
        .set(updateData)
        .where(eq(schema.contactMessages.id, input.id));

      return { success: true };
    }),

  /**
   * Delete contact message (admin only)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Admin access required",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      await db
        .update(schema.contactMessages)
        .set({ status: "archived" })
        .where(eq(schema.contactMessages.id, input.id));

      return { success: true };
    }),
});
