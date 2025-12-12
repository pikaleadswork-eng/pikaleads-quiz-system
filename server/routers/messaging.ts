import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure } from "../_core/trpc";
import { getAllLeads } from "../db";
import type { Lead } from "../../drizzle/schema";

/**
 * Messaging Router
 * Handles bulk messaging operations for Telegram, Instagram, WhatsApp, and Email
 */

export const messagingRouter = router({
  /**
   * Send bulk message to selected leads
   */
  sendBulkMessage: adminProcedure
    .input(
      z.object({
        channel: z.enum(["telegram", "instagram", "whatsapp", "email"]),
        message: z.string().min(1, "Message cannot be empty"),
        leadIds: z.array(z.number()).optional(), // If empty, send to all
        filters: z
          .object({
            utmCampaign: z.string().optional(),
            utmSource: z.string().optional(),
            source: z.string().optional(),
            statusId: z.number().optional(),
          })
          .optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { channel, message, leadIds, filters } = input;

      // Get leads based on filters or IDs
      let targetLeads = await getAllLeads();

      // Apply filters if provided
      if (filters) {
        targetLeads = targetLeads.filter((lead: Lead) => {
          if (filters.utmCampaign && lead.utmCampaign !== filters.utmCampaign) return false;
          if (filters.utmSource && lead.utmSource !== filters.utmSource) return false;
          if (filters.source && lead.source !== filters.source) return false;
          if (filters.statusId && lead.statusId !== filters.statusId) return false;
          return true;
        });
      }

      // Filter by lead IDs if provided
      if (leadIds && leadIds.length > 0) {
        targetLeads = targetLeads.filter((lead: Lead) => leadIds.includes(lead.id));
      }

      // Validate recipients based on channel
      const validRecipients = targetLeads.filter((lead: Lead) => {
        switch (channel) {
          case "telegram":
            return !!lead.telegram;
          case "instagram":
            return !!lead.telegram; // Assuming Instagram handles are stored in telegram field
          case "whatsapp":
            return !!lead.phone;
          case "email":
            return !!lead.email;
          default:
            return false;
        }
      });

      if (validRecipients.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `No valid recipients found for ${channel}`,
        });
      }

      // Simulate sending messages (replace with actual API calls)
      const results = {
        channel,
        totalRecipients: validRecipients.length,
        successCount: validRecipients.length,
        failedCount: 0,
        message: message.substring(0, 50) + "...",
        sentAt: new Date(),
      };

      // TODO: Implement actual messaging APIs
      // - Telegram: Use Telegram Bot API
      // - Instagram: Use Instagram Graph API
      // - WhatsApp: Use WhatsApp Business API
      // - Email: Use SMTP or email service provider

      console.log(`[Messaging] Sent ${channel} message to ${validRecipients.length} recipients`);

      return results;
    }),

  /**
   * Get recent messaging history
   */
  getRecentMessages: adminProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        channel: z.enum(["telegram", "instagram", "whatsapp", "email", "all"]).default("all"),
      })
    )
    .query(async ({ input }) => {
      // Mock data - replace with actual database query
      const mockMessages = [
        {
          id: 1,
          channel: "telegram" as const,
          message: "Welcome to PIKALEADS! Your furniture quiz results are ready.",
          recipientCount: 15,
          successCount: 15,
          failedCount: 0,
          sentBy: "Admin",
          sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        },
        {
          id: 2,
          channel: "email" as const,
          message: "Thank you for completing our apartment renovation quiz!",
          recipientCount: 8,
          successCount: 7,
          failedCount: 1,
          sentBy: "Admin",
          sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        },
        {
          id: 3,
          channel: "whatsapp" as const,
          message: "Your e-commerce consultation is scheduled for tomorrow.",
          recipientCount: 3,
          successCount: 3,
          failedCount: 0,
          sentBy: "Admin",
          sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
      ];

      // Filter by channel if not "all"
      const filtered =
        input.channel === "all"
          ? mockMessages
          : mockMessages.filter((msg) => msg.channel === input.channel);

      return filtered.slice(0, input.limit);
    }),

  /**
   * Get messaging statistics
   */
  getMessagingStats: adminProcedure.query(async () => {
    // Mock statistics - replace with actual database aggregation
    return {
      totalMessagesSent: 156,
      totalRecipients: 423,
      byChannel: {
        telegram: { sent: 45, recipients: 128, successRate: 0.97 },
        instagram: { sent: 23, recipients: 67, successRate: 0.94 },
        whatsapp: { sent: 52, recipients: 145, successRate: 0.99 },
        email: { sent: 36, recipients: 83, successRate: 0.92 },
      },
      last7Days: {
        telegram: 12,
        instagram: 5,
        whatsapp: 18,
        email: 9,
      },
    };
  }),
});
