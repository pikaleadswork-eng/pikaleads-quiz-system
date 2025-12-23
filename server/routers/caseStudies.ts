import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as schema from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, desc, and } from "drizzle-orm";

export const caseStudiesRouter = router({
  /**
   * Get all published case studies (public)
   */
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const caseStudies = await db
        .select()
        .from(schema.caseStudies)
        .where(eq(schema.caseStudies.isPublished, true))
        .orderBy(desc(schema.caseStudies.orderIndex), desc(schema.caseStudies.publishedAt))
        .limit(input.limit)
        .offset(input.offset);

      return caseStudies;
    }),

  /**
   * Get single case study by slug (public)
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [caseStudy] = await db
        .select()
        .from(schema.caseStudies)
        .where(
          and(
            eq(schema.caseStudies.slug, input.slug),
            eq(schema.caseStudies.isPublished, true)
          )
        );

      if (!caseStudy) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Case study not found",
        });
      }

      // Increment view count
      await db
        .update(schema.caseStudies)
        .set({ viewCount: caseStudy.viewCount + 1 })
        .where(eq(schema.caseStudies.id, caseStudy.id));

      return caseStudy;
    }),

  /**
   * Get all case studies for admin (including unpublished)
   */
  getAll: protectedProcedure
    .input(
      z.object({
        includeUnpublished: z.boolean().default(true),
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

      let query = db.select().from(schema.caseStudies);

      if (!input.includeUnpublished) {
        query = query.where(eq(schema.caseStudies.isPublished, true)) as any;
      }

      const caseStudies = await query
        .orderBy(desc(schema.caseStudies.orderIndex), desc(schema.caseStudies.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return caseStudies;
    }),

  /**
   * Get single case study by ID (admin only)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
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

      const [caseStudy] = await db
        .select()
        .from(schema.caseStudies)
        .where(eq(schema.caseStudies.id, input.id));

      if (!caseStudy) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Case study not found",
        });
      }

      return caseStudy;
    }),

  /**
   * Create case study (admin only)
   */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        client: z.string().min(1),
        industry: z.string().optional(),
        description: z.string().min(1),
        content: z.string().min(1),
        coverImage: z.string().optional(),
        images: z.string().optional(), // JSON array
        results: z.string().optional(), // JSON object
        tags: z.string().optional(), // JSON array
        isPublished: z.boolean().default(false),
        orderIndex: z.number().default(0),
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

      // Check if slug already exists
      const [existing] = await db
        .select()
        .from(schema.caseStudies)
        .where(eq(schema.caseStudies.slug, input.slug));

      if (existing) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Case study with this slug already exists",
        });
      }

      const [caseStudy] = await db.insert(schema.caseStudies).values({
        ...input,
        publishedAt: input.isPublished ? new Date() : null,
        createdBy: ctx.user.id,
      });

      return { success: true, id: caseStudy.insertId };
    }),

  /**
   * Update case study (admin only)
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        client: z.string().min(1).optional(),
        industry: z.string().optional(),
        description: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        coverImage: z.string().optional(),
        images: z.string().optional(),
        results: z.string().optional(),
        tags: z.string().optional(),
        isPublished: z.boolean().optional(),
        orderIndex: z.number().optional(),
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

      const { id, ...updateData } = input;

      // If slug is being changed, check for conflicts
      if (updateData.slug) {
        const [existing] = await db
          .select()
          .from(schema.caseStudies)
          .where(eq(schema.caseStudies.slug, updateData.slug));

        if (existing && existing.id !== id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Case study with this slug already exists",
          });
        }
      }

      // If publishing for the first time, set publishedAt
      if (updateData.isPublished) {
        const [current] = await db
          .select()
          .from(schema.caseStudies)
          .where(eq(schema.caseStudies.id, id));

        if (current && !current.isPublished) {
          (updateData as any).publishedAt = new Date();
        }
      }

      await db
        .update(schema.caseStudies)
        .set(updateData)
        .where(eq(schema.caseStudies.id, id));

      return { success: true };
    }),

  /**
   * Delete case study (admin only)
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
        .delete(schema.caseStudies)
        .where(eq(schema.caseStudies.id, input.id));

      return { success: true };
    }),

  /**
   * Reorder case studies (admin only)
   */
  reorder: protectedProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.number(),
            orderIndex: z.number(),
          })
        ),
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

      // Update all case studies in a transaction
      for (const update of input.updates) {
        await db
          .update(schema.caseStudies)
          .set({ orderIndex: update.orderIndex })
          .where(eq(schema.caseStudies.id, update.id));
      }

      return { success: true };
    }),
});
