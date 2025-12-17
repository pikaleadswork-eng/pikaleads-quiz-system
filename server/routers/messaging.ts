import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, adminProcedure } from "../_core/trpc";
import { getAllLeads } from "../db";
import type { Lead } from "../../drizzle/schema";
import { sendTelegramMessage } from "../telegramBot";
import { ENV } from "../_core/env";

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

      // Send messages via selected channel
      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      switch (channel) {
        case "telegram":
          if (!ENV.telegramBotToken) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Telegram Bot Token not configured. Please set TELEGRAM_BOT_TOKEN environment variable.",
            });
          }

          for (const lead of validRecipients) {
            if (!lead.telegram) continue;

            const result = await sendTelegramMessage(lead.telegram, message);
            if (result.success) {
              successCount++;
            } else {
              failedCount++;
              errors.push(`${lead.name}: ${result.error}`);
            }

            // Rate limiting: 30 messages per second
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          break;

        case "instagram":
          // TODO: Implement Instagram Graph API
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Instagram messaging not yet implemented. Coming soon!",
          });

        case "whatsapp":
          // TODO: Implement WhatsApp Business API
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "WhatsApp messaging not yet implemented. Coming soon!",
          });

        case "email":
          // TODO: Implement Email sending (SMTP or service provider)
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Email messaging not yet implemented. Coming soon!",
          });

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Unsupported channel: ${channel}`,
          });
      }

      const results = {
        channel,
        totalRecipients: validRecipients.length,
        successCount,
        failedCount,
        message: message.substring(0, 50) + "...",
        sentAt: new Date(),
        errors: errors.length > 0 ? errors : undefined,
      };

      console.log(
        `[Messaging] Sent ${channel} message: ${successCount} success, ${failedCount} failed`
      );

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
   * Get conversation history with a specific recipient
   */
  getConversation: adminProcedure
    .input(
      z.object({
        recipientId: z.string(),
        channel: z.enum(["telegram", "whatsapp", "email", "instagram"]),
      })
    )
    .query(async ({ input }) => {
      // Mock conversation data - replace with actual database query
      const mockConversation = [
        {
          id: 1,
          recipientId: input.recipientId,
          channel: input.channel,
          content: "Hello! I'm interested in your furniture quiz.",
          direction: "received" as const,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          id: 2,
          recipientId: input.recipientId,
          channel: input.channel,
          content: "Great! Let me send you the quiz link.",
          direction: "sent" as const,
          createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
        },
        {
          id: 3,
          recipientId: input.recipientId,
          channel: input.channel,
          content: "Thank you! I'll complete it now.",
          direction: "received" as const,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        },
      ];

      return mockConversation;
    }),

  /**
   * Send a message to a specific recipient
   */
  sendMessage: adminProcedure
    .input(
      z.object({
        recipientId: z.string(),
        channel: z.enum(["telegram", "whatsapp", "email", "instagram"]),
        message: z.string().min(1, "Message cannot be empty"),
      })
    )
    .mutation(async ({ input }) => {
      const { recipientId, channel, message } = input;

      // Send message via selected channel
      switch (channel) {
        case "telegram":
          if (!ENV.telegramBotToken) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "Telegram Bot Token not configured",
            });
          }

          const result = await sendTelegramMessage(recipientId, message);
          if (!result.success) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: result.error || "Failed to send Telegram message",
            });
          }
          break;

        case "instagram":
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Instagram messaging not yet implemented",
          });

        case "whatsapp":
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "WhatsApp messaging not yet implemented",
          });

        case "email":
          throw new TRPCError({
            code: "NOT_IMPLEMENTED",
            message: "Email messaging not yet implemented",
          });

        default:
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: `Unsupported channel: ${channel}`,
          });
      }

      return {
        success: true,
        sentAt: new Date(),
      };
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

  /**
   * Get full lead information by ID
   */
  getLeadInfo: adminProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input, ctx }) => {
      const { getLeadById, getLeadStatus } = await import("../db");
      const lead = await getLeadById(input.leadId);
      
      if (!lead) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Lead not found",
        });
      }

      // Get status details
      const status = lead.statusId ? await getLeadStatus(lead.statusId) : null;

      return {
        ...lead,
        status,
      };
    }),

  /**
   * Update lead status
   */
  updateLeadStatus: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        statusId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { updateLeadStatusOnly, getLeadById } = await import("../db");
      const { trackMetaScheduleCall, trackMetaCallback, trackMetaPurchase } = await import("../_core/metaConversionsAPI");
      const { trackGA4ScheduleCall, trackGA4Callback, trackGA4Purchase } = await import("../_core/ga4MeasurementProtocol");
      
      // Get lead data before updating
      const lead = await getLeadById(input.leadId);
      if (!lead) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
      }
      
      // Update status
      await updateLeadStatusOnly(input.leadId, input.statusId);

      // Log interaction
      const { createInteractionHistory } = await import("../db");
      await createInteractionHistory({
        leadId: input.leadId,
        type: "status_change",
        userId: ctx.user.id,
        metadata: JSON.stringify({ statusId: input.statusId }),
      });
      
      // Get status name to determine tracking event
      const { getLeadStatus } = await import("../db");
      const status = await getLeadStatus(input.statusId);
      const statusName = status?.name?.toLowerCase() || "";
      
      // Track events based on status change
      // Status names: "Новий", "В роботі", "Дзвінок заплановано", "Callback", "Виграно", "Програно"
      if (statusName.includes("дзвінок") || statusName.includes("заплановано")) {
        // InitiateCheckout - Call scheduled
        if (lead.eventId && lead.fbp) {
          await trackMetaScheduleCall({
            eventId: `${lead.eventId}_schedule_${Date.now()}`,
            email: lead.email || undefined,
            phone: lead.phone,
            clientIp: lead.clientIp || undefined,
            userAgent: lead.userAgent || undefined,
            fbp: lead.fbp,
            fbc: lead.fbc || undefined,
            callType: "scheduled_call",
          });
        }
        if (lead.ga4ClientId) {
          await trackGA4ScheduleCall({
            clientId: lead.ga4ClientId,
            userId: lead.id.toString(),
            callType: "scheduled_call",
          });
        }
      } else if (statusName.includes("callback")) {
        // AddToCart - Callback requested
        if (lead.eventId && lead.fbp) {
          await trackMetaCallback({
            eventId: `${lead.eventId}_callback_${Date.now()}`,
            email: lead.email || undefined,
            phone: lead.phone,
            clientIp: lead.clientIp || undefined,
            userAgent: lead.userAgent || undefined,
            fbp: lead.fbp,
            fbc: lead.fbc || undefined,
          });
        }
        if (lead.ga4ClientId) {
          await trackGA4Callback({
            clientId: lead.ga4ClientId,
            userId: lead.id.toString(),
          });
        }
      } else if (statusName.includes("виграно") || statusName.includes("won")) {
        // Purchase - Sale completed
        // Get actual sale amount from sales table
        const { getSaleByLeadId } = await import("../db");
        const sale = await getSaleByLeadId(input.leadId);
        const saleValue = sale ? Math.round(sale.totalAmount / 100) : 1000; // Convert from cents to UAH, default 1000 if no sale
        
        if (lead.eventId && lead.fbp) {
          await trackMetaPurchase({
            eventId: `${lead.eventId}_purchase_${Date.now()}`,
            email: lead.email || undefined,
            phone: lead.phone,
            clientIp: lead.clientIp || undefined,
            userAgent: lead.userAgent || undefined,
            fbp: lead.fbp,
            fbc: lead.fbc || undefined,
            value: saleValue,
            currency: "UAH",
            contentName: lead.quizName,
          });
        }
        if (lead.ga4ClientId) {
          await trackGA4Purchase({
            clientId: lead.ga4ClientId,
            userId: lead.id.toString(),
            transactionId: `lead_${lead.id}_${Date.now()}`,
            value: saleValue,
            currency: "UAH",
            source: lead.utmSource || undefined,
            medium: lead.utmMedium || undefined,
            campaign: lead.utmCampaign || undefined,
          });
        }
      }

      return { success: true };
    }),

  /**
   * Schedule a message for later sending
   */
  scheduleMessage: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        channel: z.enum(["telegram", "whatsapp", "email"]),
        message: z.string().min(1),
        scheduledAt: z.date(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { createScheduledMessage } = await import("../db");
      
      const scheduledMessage = await createScheduledMessage({
        leadId: input.leadId,
        channel: input.channel,
        message: input.message,
        scheduledAt: input.scheduledAt,
        createdBy: ctx.user.id,
      });

      // Log interaction
      const { createInteractionHistory } = await import("../db");
      await createInteractionHistory({
        leadId: input.leadId,
        type: "message",
        channel: input.channel,
        message: `Scheduled: ${input.message}`,
        direction: "outbound",
        userId: ctx.user.id,
      });

      return scheduledMessage;
    }),

  /**
   * Schedule a call with a lead
   */
  scheduleCall: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        scheduledAt: z.date(),
        duration: z.number().default(30),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { createScheduledCall } = await import("../db");
      
      const scheduledCall = await createScheduledCall({
        leadId: input.leadId,
        scheduledAt: input.scheduledAt,
        duration: input.duration,
        notes: input.notes,
        createdBy: ctx.user.id,
      });

      // Log interaction
      const { createInteractionHistory } = await import("../db");
      await createInteractionHistory({
        leadId: input.leadId,
        type: "call",
        message: `Scheduled call for ${input.scheduledAt.toLocaleString()}`,
        userId: ctx.user.id,
        metadata: JSON.stringify({ duration: input.duration, notes: input.notes }),
      });

      return scheduledCall;
    }),

  /**
   * Get interaction history for a lead
   */
  getInteractionHistory: adminProcedure
    .input(z.object({ leadId: z.number() }))
    .query(async ({ input }) => {
      const { getInteractionHistory } = await import("../db");
      return await getInteractionHistory(input.leadId);
    }),

  /**
   * Add a note to lead
   */
  addNote: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        note: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { createInteractionHistory } = await import("../db");
      
      await createInteractionHistory({
        leadId: input.leadId,
        type: "note",
        message: input.note,
        userId: ctx.user.id,
      });

      return { success: true };
    }),

  /**
   * Initiate call via Zadarma
   */
  initiateCall: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        phone: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { getIntegrationSettingByProvider } = await import("../db");
      const { initiateCall } = await import("../_core/zadarma");
      
      // Get Zadarma credentials
      const zadarmaSettings = await getIntegrationSettingByProvider("zadarma");
      if (!zadarmaSettings || !zadarmaSettings.isActive) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Zadarma integration not configured",
        });
      }

      const credentials = JSON.parse(zadarmaSettings.credentials);
      
      // Initiate call
      const callResult = await initiateCall(credentials, input.phone);
      
      // Log call to database
      const { callLogs } = await import("../../drizzle/schema");
      const { getDb } = await import("../db");
      const db = await getDb();
      if (db) {
        await db.insert(callLogs).values({
          leadId: input.leadId,
          managerId: ctx.user.id,
          phone: input.phone,
          provider: "zadarma",
          callId: callResult.callId,
          status: "initiated",
        });
      }
      
      // Log to interaction history
      const { createInteractionHistory } = await import("../db");
      await createInteractionHistory({
        leadId: input.leadId,
        type: "call",
        channel: "phone",
        message: `Call initiated to ${input.phone}`,
        direction: "outbound",
        userId: ctx.user.id,
      });

      return callResult;
    }),

  /**
   * Schedule a meeting (Google Meet or Zoom)
   */
  scheduleMeeting: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        platform: z.enum(["google_meet", "zoom"]),
        title: z.string(),
        description: z.string().optional(),
        scheduledAt: z.date(),
        duration: z.number().default(30),
        attendeeEmail: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { getIntegrationSettingByProvider } = await import("../db");
      const { createGoogleMeet, createZoomMeeting, generateSimpleMeetLink } = await import("../_core/meetings");
      
      let meetingUrl: string;
      let externalId: string | undefined;

      if (input.platform === "google_meet") {
        const settings = await getIntegrationSettingByProvider("google_meet");
        if (settings && settings.isActive) {
          const credentials = JSON.parse(settings.credentials);
          const result = await createGoogleMeet(credentials, {
            title: input.title,
            description: input.description,
            startTime: input.scheduledAt,
            duration: input.duration,
            attendeeEmail: input.attendeeEmail,
          });
          meetingUrl = result.meetingUrl;
          externalId = result.eventId;
        } else {
          // Fallback to simple meet link
          meetingUrl = await generateSimpleMeetLink();
        }
      } else {
        const settings = await getIntegrationSettingByProvider("zoom");
        if (!settings || !settings.isActive) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Zoom integration not configured",
          });
        }
        const credentials = JSON.parse(settings.credentials);
        const result = await createZoomMeeting(credentials, {
          title: input.title,
          description: input.description,
          startTime: input.scheduledAt,
          duration: input.duration,
        });
        meetingUrl = result.meetingUrl;
        externalId = result.meetingId;
      }

      // Save meeting to database
      const { meetings } = await import("../../drizzle/schema");
      const { getDb } = await import("../db");
      const db = await getDb();
      if (db) {
        await db.insert(meetings).values({
          leadId: input.leadId,
          managerId: ctx.user.id,
          platform: input.platform,
          meetingUrl,
          externalId,
          title: input.title,
          description: input.description,
          scheduledAt: input.scheduledAt,
          duration: input.duration,
          status: "scheduled",
        });
      }

      // Log to interaction history
      const { createInteractionHistory } = await import("../db");
      await createInteractionHistory({
        leadId: input.leadId,
        type: "meeting",
        message: `Meeting scheduled: ${input.title}`,
        userId: ctx.user.id,
        metadata: JSON.stringify({ platform: input.platform, meetingUrl }),
      });

      return { meetingUrl, externalId };
    }),

  /**
   * Create a reminder
   */
  createReminder: adminProcedure
    .input(
      z.object({
        leadId: z.number().optional(),
        type: z.enum(["call", "meeting", "follow_up", "task"]),
        title: z.string(),
        message: z.string().optional(),
        scheduledAt: z.date(),
        notifyVia: z.enum(["crm", "telegram", "email"]).default("crm"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { reminders } = await import("../../drizzle/schema");
      const { getDb } = await import("../db");
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const result = await db.insert(reminders).values({
        leadId: input.leadId,
        managerId: ctx.user.id,
        type: input.type,
        title: input.title,
        message: input.message,
        scheduledAt: input.scheduledAt,
        status: "pending",
        notifyVia: input.notifyVia,
      });

      return { id: (result as any).insertId, ...input };
    }),

  /**
   * Get upcoming reminders for current user
   */
  getUpcomingReminders: adminProcedure.query(async ({ ctx }) => {
    const { reminders } = await import("../../drizzle/schema");
    const { getDb } = await import("../db");
    const { eq, and, gte } = await import("drizzle-orm");
    const db = await getDb();
    
    if (!db) return [];

    return db
      .select()
      .from(reminders)
      .where(
        and(
          eq(reminders.managerId, ctx.user.id),
          eq(reminders.status, "pending"),
          gte(reminders.scheduledAt, new Date())
        )
      )
      .orderBy(reminders.scheduledAt);
  }),

  /**
   * Assign manager to conversation
   */
  assignManager: adminProcedure
    .input(
      z.object({
        conversationId: z.number(),
        managerId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { conversations } = await import("../../drizzle/schema");
      const { getDb } = await import("../db");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

       await db
        .update(conversations)
        .set({ assignedManagerId: input.managerId })
        .where(eq(conversations.id, input.conversationId));
      return { success: true };
    }),

  /**
   * Assign manager to lead
   */
  assignManagerToLead: adminProcedure
    .input(
      z.object({
        leadId: z.number(),
        managerId: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { leads, interactionHistory } = await import("../../drizzle/schema");
      const { getDb } = await import("../db");
      const { eq } = await import("drizzle-orm");
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      // Update lead's assigned manager
      await db
        .update(leads)
        .set({ assignedTo: input.managerId })
        .where(eq(leads.id, input.leadId));

      // Log the change to interaction history
      await db.insert(interactionHistory).values({
        leadId: input.leadId,
        type: "manager_assigned",
        channel: "system",
        message: `Manager assigned: ${input.managerId}`,
        userId: input.managerId,
      });

      return { success: true };
    }),
});
