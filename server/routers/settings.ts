import { router, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const settingsRouter = router({
  // Roles Management
  getRoles: protectedProcedure.query(async () => {
    const { getDb } = await import("../db");
    const { roles } = await import("../../drizzle/schema");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    return db.select().from(roles);
  }),

  createRole: adminProcedure
    .input(z.object({
      name: z.string(),
      description: z.string().optional(),
      permissions: z.string(), // JSON string
    }))
    .mutation(async ({ input }) => {
      const { getDb } = await import("../db");
      const { roles } = await import("../../drizzle/schema");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      await db.insert(roles).values({
        name: input.name,
        description: input.description,
        permissions: input.permissions,
        isSystem: false,
      });
      
      return { success: true };
    }),

  deleteRole: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { getDb } = await import("../db");
      const { roles } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Check if it's a system role
      const role = await db.select().from(roles).where(eq(roles.id, input.id)).limit(1);
      if (role[0]?.isSystem) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Cannot delete system role" });
      }
      
      await db.delete(roles).where(eq(roles.id, input.id));
      return { success: true };
    }),

  // User Invitations
  getUserInvitations: adminProcedure.query(async () => {
    const { getDb } = await import("../db");
    const { userInvitations } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    return db.select().from(userInvitations).where(eq(userInvitations.status, "pending"));
  }),

  inviteUser: adminProcedure
    .input(z.object({
      email: z.string().email(),
      roleName: z.string(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { getDb } = await import("../db");
      const { userInvitations } = await import("../../drizzle/schema");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      // Generate invitation token
      const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiration
      
      await db.insert(userInvitations).values({
        email: input.email,
        roleName: input.roleName,
        token,
        status: "pending",
        invitedBy: ctx.user.id,
        expiresAt,
      });
      
      // TODO: Send invitation email
      return { success: true, token };
    }),

  // Lead Statuses Management
  getLeadStatuses: protectedProcedure.query(async () => {
    const { getDb } = await import("../db");
    const { leadStatuses } = await import("../../drizzle/schema");
    const { asc } = await import("drizzle-orm");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    return db.select().from(leadStatuses).orderBy(asc(leadStatuses.order));
  }),

  createLeadStatus: adminProcedure
    .input(z.object({
      name: z.string(),
      color: z.string(),
      order: z.number(),
      isDefault: z.boolean().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { getDb } = await import("../db");
      const { leadStatuses } = await import("../../drizzle/schema");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      await db.insert(leadStatuses).values({
        name: input.name,
        color: input.color,
        order: input.order,
        isDefault: input.isDefault ? 1 : 0,
        createdBy: ctx.user.id,
      });
      
      return { success: true };
    }),

  updateLeadStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      color: z.string().optional(),
      order: z.number().optional(),
      isDefault: z.boolean().optional(),
    }))
    .mutation(async ({ input }) => {
      const { getDb } = await import("../db");
      const { leadStatuses } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.color) updates.color = input.color;
      if (input.order !== undefined) updates.order = input.order;
      if (input.isDefault !== undefined) updates.isDefault = input.isDefault ? 1 : 0;
      
      await db.update(leadStatuses).set(updates).where(eq(leadStatuses.id, input.id));
      return { success: true };
    }),

  deleteLeadStatus: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const { getDb } = await import("../db");
      const { leadStatuses } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      await db.delete(leadStatuses).where(eq(leadStatuses.id, input.id));
      return { success: true };
    }),

  // IP Telephony Settings
  getIPTelephonySettings: protectedProcedure.query(async () => {
    const { getDb } = await import("../db");
    const { integrationSettings } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const settings = await db.select()
      .from(integrationSettings)
      .where(eq(integrationSettings.provider, "zadarma"));
    
    if (settings.length === 0) return null;
    
    const config = JSON.parse(settings[0].credentials);
    return {
      apiKey: config.apiKey || "",
      apiSecret: config.apiSecret || "",
      sipNumber: config.sipNumber || "",
    };
  }),

  saveIPTelephonySettings: adminProcedure
    .input(z.object({
      apiKey: z.string(),
      apiSecret: z.string(),
      sipNumber: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const { getDb } = await import("../db");
      const { integrationSettings } = await import("../../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      
      const credentials = JSON.stringify({
        apiKey: input.apiKey,
        apiSecret: input.apiSecret,
        sipNumber: input.sipNumber || "",
      });
      
      // Check if settings exist
      const existing = await db.select()
        .from(integrationSettings)
        .where(eq(integrationSettings.provider, "zadarma"));
      
      if (existing.length > 0) {
        await db.update(integrationSettings)
          .set({ credentials, isActive: true })
          .where(eq(integrationSettings.provider, "zadarma"));
      } else {
        await db.insert(integrationSettings).values({
          provider: "zadarma",
          credentials,
          isActive: true,
        });
      }
      
      return { success: true };
    }),

  testZadarmaConnection: adminProcedure.mutation(async () => {
    const { testCredentials } = await import("../_core/zadarma");
    const { getDb } = await import("../db");
    const { integrationSettings } = await import("../../drizzle/schema");
    const { eq } = await import("drizzle-orm");
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
    
    const settings = await db.select()
      .from(integrationSettings)
      .where(eq(integrationSettings.provider, "zadarma"));
    
    if (settings.length === 0) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Zadarma settings not configured" });
    }
    
    const config = JSON.parse(settings[0].credentials);
    const result = await testCredentials(config);
    
    return result;
  }),
});
