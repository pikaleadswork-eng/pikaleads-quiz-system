import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import * as schema from "../../drizzle/schema";
import { eq, desc, and, sql } from "drizzle-orm";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const blogRouter = router({
  // Get all published posts (public)
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
      categoryId: z.number().optional(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const conditions = [eq(schema.blogPosts.status, "published")];
      if (input.categoryId) {
        conditions.push(eq(schema.blogPosts.categoryId, input.categoryId));
      }

      const posts = await db
        .select({
          id: schema.blogPosts.id,
          title: schema.blogPosts.title,
          slug: schema.blogPosts.slug,
          excerpt: schema.blogPosts.excerpt,
          coverImage: schema.blogPosts.coverImage,
          views: schema.blogPosts.views,
          publishedAt: schema.blogPosts.publishedAt,
          categoryId: schema.blogPosts.categoryId,
          authorId: schema.blogPosts.authorId,
          authorName: schema.users.name,
        })
        .from(schema.blogPosts)
        .leftJoin(schema.users, eq(schema.blogPosts.authorId, schema.users.id))
        .where(and(...conditions))
        .orderBy(desc(schema.blogPosts.publishedAt))
        .limit(input.limit)
        .offset(input.offset);

      const total = await db
        .select({ count: sql<number>`count(*)` })
        .from(schema.blogPosts)
        .where(and(...conditions));

      return {
        posts,
        total: total[0]?.count || 0,
      };
    }),

  // Get all posts for admin (including drafts)
  listAll: adminProcedure
    .input(z.object({
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const posts = await db
        .select({
          id: schema.blogPosts.id,
          title: schema.blogPosts.title,
          slug: schema.blogPosts.slug,
          excerpt: schema.blogPosts.excerpt,
          coverImage: schema.blogPosts.coverImage,
          status: schema.blogPosts.status,
          views: schema.blogPosts.views,
          publishedAt: schema.blogPosts.publishedAt,
          createdAt: schema.blogPosts.createdAt,
          updatedAt: schema.blogPosts.updatedAt,
          categoryId: schema.blogPosts.categoryId,
          authorId: schema.blogPosts.authorId,
          authorName: schema.users.name,
        })
        .from(schema.blogPosts)
        .leftJoin(schema.users, eq(schema.blogPosts.authorId, schema.users.id))
        .orderBy(desc(schema.blogPosts.updatedAt))
        .limit(input.limit)
        .offset(input.offset);

      return posts;
    }),

  // Get single post by slug (public)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const post = await db
        .select({
          id: schema.blogPosts.id,
          title: schema.blogPosts.title,
          slug: schema.blogPosts.slug,
          excerpt: schema.blogPosts.excerpt,
          content: schema.blogPosts.content,
          coverImage: schema.blogPosts.coverImage,
          views: schema.blogPosts.views,
          publishedAt: schema.blogPosts.publishedAt,
          categoryId: schema.blogPosts.categoryId,
          authorId: schema.blogPosts.authorId,
          authorName: schema.users.name,
        })
        .from(schema.blogPosts)
        .leftJoin(schema.users, eq(schema.blogPosts.authorId, schema.users.id))
        .where(
          and(
            eq(schema.blogPosts.slug, input.slug),
            eq(schema.blogPosts.status, "published")
          )
        )
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      // Get SEO data
      const seo = await db
        .select()
        .from(schema.blogSeo)
        .where(eq(schema.blogSeo.postId, post[0].id))
        .limit(1);

      return {
        ...post[0],
        seo: seo[0] || null,
      };
    }),

  // Get post by ID for editing (admin)
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const post = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.id, input.id))
        .limit(1);

      if (!post[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      // Get SEO data
      const seo = await db
        .select()
        .from(schema.blogSeo)
        .where(eq(schema.blogSeo.postId, post[0].id))
        .limit(1);

      return {
        ...post[0],
        seo: seo[0] || null,
      };
    }),

  // Create new post (admin)
  create: adminProcedure
    .input(z.object({
      title: z.string().min(1).max(255),
      slug: z.string().min(1).max(255),
      excerpt: z.string().min(1),
      content: z.string().min(1),
      coverImage: z.string().optional(),
      categoryId: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
      seo: z.object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        keywords: z.string().optional(),
        ogImage: z.string().optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if slug already exists
      const existing = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.slug, input.slug))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Slug already exists" });
      }

      // Create post
      const [post] = await db.insert(schema.blogPosts).values({
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt,
        content: input.content,
        coverImage: input.coverImage || null,
        authorId: ctx.user.id,
        categoryId: input.categoryId || null,
        status: input.status,
        publishedAt: input.status === "published" ? new Date() : null,
      });

      const postId = post.insertId;

      // Create SEO data if provided
      if (input.seo) {
        await db.insert(schema.blogSeo).values({
          postId,
          metaTitle: input.seo.metaTitle || null,
          metaDescription: input.seo.metaDescription || null,
          keywords: input.seo.keywords || null,
          ogImage: input.seo.ogImage || null,
          ogTitle: input.seo.ogTitle || null,
          ogDescription: input.seo.ogDescription || null,
        });
      }

      return { id: postId };
    }),

  // Update post (admin)
  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().min(1).max(255).optional(),
      slug: z.string().min(1).max(255).optional(),
      excerpt: z.string().min(1).optional(),
      content: z.string().min(1).optional(),
      coverImage: z.string().optional(),
      categoryId: z.number().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
      seo: z.object({
        metaTitle: z.string().optional(),
        metaDescription: z.string().optional(),
        keywords: z.string().optional(),
        ogImage: z.string().optional(),
        ogTitle: z.string().optional(),
        ogDescription: z.string().optional(),
      }).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if post exists
      const existing = await db
        .select()
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.id, input.id))
        .limit(1);

      if (!existing[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Post not found" });
      }

      // Check slug uniqueness if changing
      if (input.slug && input.slug !== existing[0].slug) {
        const slugExists = await db
          .select()
          .from(schema.blogPosts)
          .where(eq(schema.blogPosts.slug, input.slug))
          .limit(1);

        if (slugExists.length > 0) {
          throw new TRPCError({ code: "CONFLICT", message: "Slug already exists" });
        }
      }

      // Update post
      const updateData: any = {};
      if (input.title !== undefined) updateData.title = input.title;
      if (input.slug !== undefined) updateData.slug = input.slug;
      if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
      if (input.content !== undefined) updateData.content = input.content;
      if (input.coverImage !== undefined) updateData.coverImage = input.coverImage;
      if (input.categoryId !== undefined) updateData.categoryId = input.categoryId;
      if (input.status !== undefined) {
        updateData.status = input.status;
        // Set publishedAt when publishing for the first time
        if (input.status === "published" && !existing[0].publishedAt) {
          updateData.publishedAt = new Date();
        }
      }

      if (Object.keys(updateData).length > 0) {
        await db
          .update(schema.blogPosts)
          .set(updateData)
          .where(eq(schema.blogPosts.id, input.id));
      }

      // Update SEO data if provided
      if (input.seo) {
        const existingSeo = await db
          .select()
          .from(schema.blogSeo)
          .where(eq(schema.blogSeo.postId, input.id))
          .limit(1);

        if (existingSeo.length > 0) {
          await db
            .update(schema.blogSeo)
            .set({
              metaTitle: input.seo.metaTitle || null,
              metaDescription: input.seo.metaDescription || null,
              keywords: input.seo.keywords || null,
              ogImage: input.seo.ogImage || null,
              ogTitle: input.seo.ogTitle || null,
              ogDescription: input.seo.ogDescription || null,
            })
            .where(eq(schema.blogSeo.postId, input.id));
        } else {
          await db.insert(schema.blogSeo).values({
            postId: input.id,
            metaTitle: input.seo.metaTitle || null,
            metaDescription: input.seo.metaDescription || null,
            keywords: input.seo.keywords || null,
            ogImage: input.seo.ogImage || null,
            ogTitle: input.seo.ogTitle || null,
            ogDescription: input.seo.ogDescription || null,
          });
        }
      }

      return { success: true };
    }),

  // Delete post (admin)
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .delete(schema.blogPosts)
        .where(eq(schema.blogPosts.id, input.id));

      return { success: true };
    }),

  // Increment views
  incrementViews: publicProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const post = await db
        .select({ id: schema.blogPosts.id, views: schema.blogPosts.views })
        .from(schema.blogPosts)
        .where(eq(schema.blogPosts.slug, input.slug))
        .limit(1);

      if (post[0]) {
        await db
          .update(schema.blogPosts)
          .set({ views: (post[0].views || 0) + 1 })
          .where(eq(schema.blogPosts.id, post[0].id));
      }

      return { success: true };
    }),

  // Get categories
  getCategories: publicProcedure.query(async () => {
    const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    return await db.select().from(schema.blogCategories).orderBy(schema.blogCategories.name);
  }),

  // Create category (admin)
  createCategory: adminProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      slug: z.string().min(1).max(100),
      description: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [category] = await db.insert(schema.blogCategories).values({
        name: input.name,
        slug: input.slug,
        description: input.description || null,
      });

      return { id: category.insertId };
    }),
});
