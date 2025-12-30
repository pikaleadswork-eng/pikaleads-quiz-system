import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";
import { storagePut } from "../storage";

export const leadActivitiesRouter = router({
  // Get all activities for a lead
  getActivities: protectedProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const activities = await db
        .select({
          id: schema.leadActivities.id,
          leadId: schema.leadActivities.leadId,
          userId: schema.leadActivities.userId,
          activityType: schema.leadActivities.activityType,
          title: schema.leadActivities.title,
          description: schema.leadActivities.description,
          metadata: schema.leadActivities.metadata,
          fileUrl: schema.leadActivities.fileUrl,
          fileName: schema.leadActivities.fileName,
          fileSize: schema.leadActivities.fileSize,
          fileMimeType: schema.leadActivities.fileMimeType,
          createdAt: schema.leadActivities.createdAt,
          userName: schema.users.name,
          userEmail: schema.users.email,
        })
        .from(schema.leadActivities)
        .leftJoin(schema.users, eq(schema.leadActivities.userId, schema.users.id))
        .where(eq(schema.leadActivities.leadId, input.leadId))
        .orderBy(desc(schema.leadActivities.createdAt));

      return activities;
    }),

  // Add a comment
  addComment: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        comment: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [activity] = await db.insert(schema.leadActivities).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        activityType: "comment",
        title: "Added a comment",
        description: input.comment,
        metadata: null,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileMimeType: null,
      });

      return { success: true, activityId: activity.insertId };
    }),

  // Upload a file
  uploadFile: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        fileName: z.string(),
        fileData: z.string(), // Base64 encoded file data
        fileMimeType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Decode base64 and upload to S3
      const fileBuffer = Buffer.from(input.fileData, "base64");
      const fileKey = `lead-files/${input.leadId}/${Date.now()}-${input.fileName}`;
      
      const { url } = await storagePut(fileKey, fileBuffer, input.fileMimeType);

      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [activity] = await db.insert(schema.leadActivities).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        activityType: "file_upload",
        title: `Uploaded file: ${input.fileName}`,
        description: null,
        metadata: JSON.stringify({ fileKey }),
        fileUrl: url,
        fileName: input.fileName,
        fileSize: fileBuffer.length,
        fileMimeType: input.fileMimeType,
      });

      return { success: true, activityId: activity.insertId, fileUrl: url };
    }),

  // Add a note
  addNote: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        title: z.string().min(1),
        note: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [activity] = await db.insert(schema.leadActivities).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        activityType: "note",
        title: input.title,
        description: input.note,
        metadata: null,
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileMimeType: null,
      });

      return { success: true, activityId: activity.insertId };
    }),

  // Log a call
  logCall: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        duration: z.number(), // Duration in seconds
        notes: z.string().optional(),
        outcome: z.string().optional(), // answered, no_answer, voicemail, busy
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [activity] = await db.insert(schema.leadActivities).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        activityType: "call",
        title: `Call - ${input.outcome || "completed"}`,
        description: input.notes || null,
        metadata: JSON.stringify({
          duration: input.duration,
          outcome: input.outcome,
        }),
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileMimeType: null,
      });

      return { success: true, activityId: activity.insertId };
    }),

  // Log an email
  logEmail: protectedProcedure
    .input(
      z.object({
        leadId: z.number(),
        subject: z.string(),
        body: z.string(),
        direction: z.enum(["sent", "received"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const [activity] = await db.insert(schema.leadActivities).values({
        leadId: input.leadId,
        userId: ctx.user.id,
        activityType: "email",
        title: `Email ${input.direction}: ${input.subject}`,
        description: input.body,
        metadata: JSON.stringify({
          subject: input.subject,
          direction: input.direction,
        }),
        fileUrl: null,
        fileName: null,
        fileSize: null,
        fileMimeType: null,
      });

      return { success: true, activityId: activity.insertId };
    }),

  // Delete an activity
  deleteActivity: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      // Check if user owns this activity or is admin
      const [activity] = await db
        .select()
        .from(schema.leadActivities)
        .where(eq(schema.leadActivities.id, input.activityId));

      if (!activity) {
        throw new Error("Activity not found");
      }

      if (activity.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Unauthorized");
      }

      await db.delete(schema.leadActivities).where(eq(schema.leadActivities.id, input.activityId));

      return { success: true };
    }),
});
