import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as schema from "../../drizzle/schema";
import { getDb } from "../db";
import { eq, desc } from "drizzle-orm";
import axios from "axios";

/**
 * Send Telegram notification about new lead
 */
async function sendTelegramNotification(leadData: {
  name: string;
  phone: string;
  email?: string;
  telegram?: string;
  quizName?: string;
  source?: string;
}) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn("Telegram credentials not configured");
      return false;
    }

    const message = `
🎯 <b>Новий лід!</b>

👤 <b>Ім'я:</b> ${leadData.name}
📱 <b>Телефон:</b> ${leadData.phone}
${leadData.email ? `📧 <b>Email:</b> ${leadData.email}` : ""}
${leadData.telegram ? `💬 <b>Telegram:</b> ${leadData.telegram}` : ""}
${leadData.quizName ? `🎯 <b>Квіз:</b> ${leadData.quizName}` : ""}
${leadData.source ? `📍 <b>Джерело:</b> ${leadData.source}` : ""}

⏰ <b>Час:</b> ${new Date().toLocaleString("uk-UA")}
    `.trim();

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: chatId,
      text: message,
      parse_mode: "HTML",
    });

    return response.status === 200;
  } catch (error) {
    console.error("Failed to send Telegram notification:", error);
    return false;
  }
}

export const leadsRouter = router({
  /**
   * Submit a lead from homepage form or quiz (public)
   */
  submit: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "Ім'я обов'язкове"),
        phone: z.string().min(1, "Телефон обов'язковий"),
        email: z.string().email("Невірна адреса email").optional(),
        telegram: z.string().optional(),
        quizName: z.string().optional(),
        source: z.string().optional(), // "homepage", "quiz", "service_page", etc.
        answers: z.string().optional(), // JSON string of quiz answers
        language: z.string().optional(),
        // UTM parameters
        utmCampaign: z.string().optional(),
        utmAdGroup: z.string().optional(),
        utmAd: z.string().optional(),
        utmPlacement: z.string().optional(),
        utmKeyword: z.string().optional(),
        utmSite: z.string().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
        utmContent: z.string().optional(),
        utmTerm: z.string().optional(),
        // Tracking data
        fbp: z.string().optional(),
        fbc: z.string().optional(),
        clientIp: z.string().optional(),
        userAgent: z.string().optional(),
        ga4ClientId: z.string().optional(),
        eventId: z.string().optional(),
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

      try {
        // Insert lead into database
        const [result] = await db.insert(schema.leads).values({
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          telegram: input.telegram || null,
          quizName: input.quizName || "Форма контакту",
          source: input.source || "homepage",
          answers: input.answers || "{}",
          language: input.language || "uk",
          utmCampaign: input.utmCampaign || null,
          utmAdGroup: input.utmAdGroup || null,
          utmAd: input.utmAd || null,
          utmPlacement: input.utmPlacement || null,
          utmKeyword: input.utmKeyword || null,
          utmSite: input.utmSite || null,
          utmSource: input.utmSource || null,
          utmMedium: input.utmMedium || null,
          utmContent: input.utmContent || null,
          utmTerm: input.utmTerm || null,
          fbp: input.fbp || null,
          fbc: input.fbc || null,
          clientIp: input.clientIp || null,
          userAgent: input.userAgent || null,
          ga4ClientId: input.ga4ClientId || null,
          eventId: input.eventId || null,
        });

        // Build UTM metadata for CRM/Telegram
        const utmMetadata = {
          campaign: input.utmCampaign,
          source: input.utmSource,
          medium: input.utmMedium,
          content: input.utmContent,
          term: input.utmTerm,
        };

        // Log lead creation with UTM data
        console.log(`[Lead] New lead created: ${input.name} (${input.phone})`, {
          leadId: result.insertId,
          source: input.source,
          utm: utmMetadata,
        });

        // Send Telegram notification
        await sendTelegramNotification({
          name: input.name,
          phone: input.phone,
          email: input.email,
          telegram: input.telegram,
          quizName: input.quizName,
          source: input.source,
        });

        return {
          success: true,
          id: result.insertId,
          message: "Дякуємо! Ми зв'яжемося з вами найближчим часом.",
        };
      } catch (error) {
        console.error("Failed to submit lead:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Помилка при збереженні заявки. Спробуйте ще раз.",
        });
      }
    }),

  /**
   * Get all leads (admin/manager only)
   */
  getAll: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
        status: z.number().optional(),
        search: z.string().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      let query = db.select().from(schema.leads);

      if (input.status) {
        query = query.where(eq(schema.leads.statusId, input.status)) as any;
      }

      const leads = await query
        .orderBy(desc(schema.leads.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return leads;
    }),

  /**
   * Get single lead by ID (admin/manager only)
   */
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const [lead] = await db
        .select()
        .from(schema.leads)
        .where(eq(schema.leads.id, input.id));

      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      return lead;
    }),

  /**
   * Update lead status (admin/manager only)
   */
  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        statusId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin" && ctx.user.role !== "manager") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Access denied",
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
        .update(schema.leads)
        .set({ statusId: input.statusId })
        .where(eq(schema.leads.id, input.id));

      return { success: true };
    }),

  /**
   * Assign lead to manager (admin only)
   */
  assign: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        managerId: z.number(),
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

      await db
        .update(schema.leads)
        .set({ assignedTo: input.managerId })
        .where(eq(schema.leads.id, input.id));

      return { success: true };
    }),

  /**
   * Delete lead (admin only)
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

      // Soft delete by setting status to archived
      await db
        .update(schema.leads)
        .set({ statusId: 99 }) // Assuming 99 is archived status
        .where(eq(schema.leads.id, input.id));

      return { success: true };
    }),
});
