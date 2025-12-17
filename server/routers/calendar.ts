import { z } from "zod";
import { router, protectedProcedure } from "../_core/trpc";
import { getDb } from "../db";
import { calendarEvents, eventNotifications, users, leads } from "../../drizzle/schema";
import { eq, and, gte, lte, isNull, desc } from "drizzle-orm";

export const calendarRouter = router({
  /**
   * Create a new calendar event
   */
  createEvent: protectedProcedure
    .input(
      z.object({
        leadId: z.number().optional(),
        title: z.string().min(1),
        description: z.string().optional(),
        startTime: z.string(), // ISO timestamp
        endTime: z.string(), // ISO timestamp
        meetingLink: z.string().optional(),
        meetingType: z.enum(["call", "meeting", "demo"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const startTime = new Date(input.startTime);
      const endTime = new Date(input.endTime);

      // Create event
      const [event] = await db.insert(calendarEvents).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        title: input.title,
        description: input.description,
        startTime,
        endTime,
        meetingLink: input.meetingLink,
        meetingType: input.meetingType || "call",
        status: "scheduled",
      });

      // Create 15-minute reminder notification
      const reminderTime = new Date(startTime.getTime() - 15 * 60 * 1000);
      
      await db.insert(eventNotifications).values({
        eventId: event.insertId,
        userId: ctx.user.id,
        notificationType: "reminder_15min",
        scheduledFor: reminderTime,
        status: "pending",
      });

      return { success: true, eventId: event.insertId };
    }),

  /**
   * Get all events for current user
   */
  getMyEvents: protectedProcedure
    .input(
      z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      let query = db
        .select({
          id: calendarEvents.id,
          leadId: calendarEvents.leadId,
          leadName: leads.name,
          title: calendarEvents.title,
          description: calendarEvents.description,
          startTime: calendarEvents.startTime,
          endTime: calendarEvents.endTime,
          meetingLink: calendarEvents.meetingLink,
          meetingType: calendarEvents.meetingType,
          status: calendarEvents.status,
          createdAt: calendarEvents.createdAt,
        })
        .from(calendarEvents)
        .leftJoin(leads, eq(calendarEvents.leadId, leads.id))
        .where(eq(calendarEvents.userId, ctx.user.id))
        .orderBy(desc(calendarEvents.startTime));

      const events = await query;
      return events;
    }),

  /**
   * Update event status
   */
  updateEventStatus: protectedProcedure
    .input(
      z.object({
        eventId: z.number(),
        status: z.enum(["scheduled", "completed", "cancelled", "no_show"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .update(calendarEvents)
        .set({ status: input.status })
        .where(
          and(
            eq(calendarEvents.id, input.eventId),
            eq(calendarEvents.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),

  /**
   * Delete event
   */
  deleteEvent: protectedProcedure
    .input(z.object({ eventId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .delete(calendarEvents)
        .where(
          and(
            eq(calendarEvents.id, input.eventId),
            eq(calendarEvents.userId, ctx.user.id)
          )
        );

      return { success: true };
    }),
});
