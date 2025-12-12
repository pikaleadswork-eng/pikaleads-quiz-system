import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { detectLanguageFromIP, getClientIP } from "./geolocation";
import { messagingRouter } from "./routers/messaging";
import { servicesRouter } from "./routers/services";
import { salesRouter } from "./routers/sales";
import { salesScriptsRouter } from "./routers/salesScripts";
import { integrationsRouter } from "./routers/integrations";
import { conversationsRouter } from "./routers/conversations";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    detectLanguage: publicProcedure.query(({ ctx }) => {
      const clientIP = getClientIP(ctx.req.headers);
      const language = detectLanguageFromIP(clientIP);
      return { language, ip: clientIP };
    }),
  }),

  quiz: router({
    submitLead: publicProcedure
      .input(
        z.object({
          quizName: z.string(),
          answers: z.string(),
          questions: z.string().optional(),
          name: z.string(),
          phone: z.string(),
          telegram: z.string().optional(),
          email: z.string().optional(),
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
        })
      )
      .mutation(async ({ input }) => {
        const { createLead, autoAssignLead } = await import("./db");
        const { sendTelegramMessage, formatLeadMessage } = await import("./telegram");
        const { calculateLeadScore } = await import("./leadScoring");
        
        // Calculate lead quality score
        const leadScore = calculateLeadScore({
          answers: input.answers,
          utmCampaign: input.utmCampaign,
          utmKeyword: input.utmKeyword,
          utmSource: input.utmSource,
          email: input.email,
          telegram: input.telegram,
        });
        
        // Save to database with UTM parameters and score
        const leadId = await createLead({
          quizName: input.quizName,
          answers: input.answers,
          name: input.name,
          phone: input.phone,
          telegram: input.telegram || null,
          email: input.email || null,
          language: input.language || null,
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
          leadScore,
        });
        
        // Send to Telegram with full details
        const message = formatLeadMessage({
          quizName: input.quizName,
          answers: input.answers,
          questions: input.questions,
          name: input.name,
          phone: input.phone,
          telegram: input.telegram,
          email: input.email,
          utmCampaign: input.utmCampaign,
          utmAdGroup: input.utmAdGroup,
          utmAd: input.utmAd,
          utmPlacement: input.utmPlacement,
          utmKeyword: input.utmKeyword,
          utmSite: input.utmSite,
          utmSource: input.utmSource,
          utmMedium: input.utmMedium,
          utmContent: input.utmContent,
          utmTerm: input.utmTerm,
        });
        
        // Auto-assign lead to manager if rules exist
        let assignedManagerName: string | undefined;
        try {
          const managerId = await autoAssignLead(leadId, input.quizName);
          if (managerId) {
            const { users } = await import("../drizzle/schema");
            const { getDb } = await import("./db");
            const { eq } = await import("drizzle-orm");
            const db = await getDb();
            if (db) {
              const manager = await db.select().from(users).where(eq(users.id, managerId)).limit(1);
              assignedManagerName = manager[0]?.name;
            }
          }
        } catch (error) {
          console.warn("[Quiz] Auto-assignment failed:", error);
        }
        
        // Send new format Telegram notification
        const { sendLeadNotification } = await import("./_core/telegramNotifications");
        try {
          await sendLeadNotification({
            quizName: input.quizName,
            firstName: input.name.split(" ")[0] || input.name,
            lastName: input.name.split(" ").slice(1).join(" ") || undefined,
            phone: input.phone,
            telegram: input.telegram,
            email: input.email,
            utmSource: input.utmSource,
            utmMedium: input.utmMedium,
            utmCampaign: input.utmCampaign,
            utmContent: input.utmContent,
            utmTerm: input.utmTerm,
            assignedManager: assignedManagerName,
            leadScore,
          });
        } catch (error) {
          console.warn("[Quiz] New Telegram notification failed:", error);
        }
        
        // Keep old format for backward compatibility
        const telegramSent = await sendTelegramMessage(message);
        if (!telegramSent) {
          console.warn("[Quiz] Lead saved but old Telegram notification failed");
        }
        
        return { success: true, leadId };
      }),
  }),

  admin: router({
    getDashboardStats: adminProcedure.query(async () => {
      const { getAllLeads, getAllManagers, getActiveVariantsForQuiz } = await import("./db");
      
      const leads = await getAllLeads();
      const managers = await getAllManagers();
      
      // Count active A/B tests by checking unique quiz IDs with variants
      const quizIds = ['furniture', 'apartment-renovation', 'e-commerce'];
      let activeTestsCount = 0;
      for (const quizId of quizIds) {
        const variants = await getActiveVariantsForQuiz(quizId);
        if (variants.length > 0) activeTestsCount++;
      }
      const activeTests = { length: activeTestsCount };
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const leadsToday = leads.filter(lead => {
        const leadDate = new Date(lead.createdAt);
        leadDate.setHours(0, 0, 0, 0);
        return leadDate.getTime() === today.getTime();
      }).length;
      
      return {
        totalLeads: leads.length,
        totalManagers: managers.length,
        activeTests: activeTests.length,
        leadsToday,
      };
    }),
    
    getLeads: adminProcedure.query(async () => {
      const { getAllLeads } = await import("./db");
      return await getAllLeads();
    }),
    
    getUTMAnalytics: adminProcedure.query(async () => {
      const { getUTMAnalytics } = await import("./db");
      return await getUTMAnalytics();
    }),
    
    // Assignment Rules
    getAssignmentRules: adminProcedure.query(async () => {
      const { getAllAssignmentRules } = await import("./db");
      return await getAllAssignmentRules();
    }),
    
    createAssignmentRule: adminProcedure
      .input(z.object({
        name: z.string(),
        quizName: z.string(),
        managerId: z.number(),
        priority: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { createAssignmentRule } = await import("./db");
        await createAssignmentRule({
          ...input,
          isActive: 1,
        });
        return { success: true };
      }),
    
    updateAssignmentRule: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string(),
        quizName: z.string(),
        managerId: z.number(),
        priority: z.number(),
      }))
      .mutation(async ({ input }) => {
        const { updateAssignmentRule } = await import("./db");
        const { id, ...updates } = input;
        await updateAssignmentRule(id, updates);
        return { success: true };
      }),
    
    deleteAssignmentRule: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteAssignmentRule } = await import("./db");
        await deleteAssignmentRule(input.id);
        return { success: true };
      }),
    
    toggleAssignmentRule: adminProcedure
      .input(z.object({
        id: z.number(),
        isActive: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        const { updateAssignmentRule } = await import("./db");
        await updateAssignmentRule(input.id, { isActive: input.isActive ? 1 : 0 });
        return { success: true };
      }),
    
    // Managers
    getManagers: adminProcedure.query(async () => {
      const { getAllManagers } = await import("./db");
      return await getAllManagers();
    }),
    
    // Manager Performance
    getManagerPerformance: adminProcedure.query(async () => {
      const { getManagerPerformanceStats } = await import("./db");
      return await getManagerPerformanceStats();
    }),
    
    // Retargeting
    getLowQualityLeads: adminProcedure.query(async () => {
      const { getLowQualityLeads } = await import("./facebookRetargeting");
      return await getLowQualityLeads();
    }),
    
    exportToFacebook: adminProcedure
      .input(z.object({
        leadIds: z.array(z.number()),
        audienceName: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { getAllLeads } = await import("./db");
        const { exportToFacebookAudience } = await import("./facebookRetargeting");
        
        const allLeads = await getAllLeads();
        const selectedLeads = allLeads.filter(lead => input.leadIds.includes(lead.id));
        
        const leadsData = selectedLeads.map(lead => ({
          email: lead.email || undefined,
          phone: lead.phone,
          name: lead.name,
        }));
        
        const result = await exportToFacebookAudience({
          leads: leadsData,
          audienceName: input.audienceName,
        });
        
        return result;
      }),
  }),

  crm: router({
    // Lead Statuses
    getStatuses: publicProcedure.query(async () => {
      const { getLeadStatuses } = await import("./db");
      return await getLeadStatuses();
    }),
    
    createStatus: adminProcedure
      .input(z.object({
        name: z.string(),
        color: z.string(),
        order: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createLeadStatus } = await import("./db");
        await createLeadStatus({
          ...input,
          isDefault: 0,
          createdBy: ctx.user.id,
        });
        return { success: true };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        color: z.string().optional(),
        order: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { updateLeadStatus } = await import("./db");
        const { id, ...updates } = input;
        await updateLeadStatus(id, updates);
        return { success: true };
      }),
    
    deleteStatus: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const { deleteLeadStatus } = await import("./db");
        await deleteLeadStatus(input.id);
        return { success: true };
      }),
    
    // Lead Management
    createLead: protectedProcedure
      .input(z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().optional(),
        telegram: z.string().optional(),
        source: z.string(),
        quizName: z.string(),
        utmCampaign: z.string().optional(),
        utmSource: z.string().optional(),
        utmMedium: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createLead } = await import("./db");
        const leadId = await createLead({
          ...input,
          answers: JSON.stringify([]),
          language: "en",
          leadScore: 0,
          statusId: 1,
          assignedTo: ctx.user.role === "manager" ? ctx.user.id : null,
        });
        return { success: true, leadId };
      }),
    
    getLeads: protectedProcedure.query(async ({ ctx }) => {
      const { getAllLeads } = await import("./db");
      const allLeads = await getAllLeads();
      
      // Managers only see their assigned leads
      if (ctx.user.role === 'manager') {
        return allLeads.filter(lead => lead.assignedTo === ctx.user.id);
      }
      
      return allLeads;
    }),
    
    updateLeadStatus: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        statusId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { updateLeadStatusById } = await import("./db");
        await updateLeadStatusById(input.leadId, input.statusId, ctx.user.id);
        return { success: true };
      }),
    
    assignLead: adminProcedure
      .input(z.object({
        leadId: z.number(),
        managerId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { assignLeadToManager } = await import("./db");
        await assignLeadToManager(input.leadId, input.managerId, ctx.user.id);
        return { success: true };
      }),
    
    updateLead: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        telegram: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        const { leads } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const { leadId, ...updates } = input;
        await db.update(leads).set(updates).where(eq(leads.id, leadId));
        return { success: true };
      }),
    
    // Comments
    getComments: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        const { getLeadComments } = await import("./db");
        return await getLeadComments(input.leadId);
      }),
    
    addComment: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        comment: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createLeadComment, logActivity } = await import("./db");
        await createLeadComment({
          leadId: input.leadId,
          userId: ctx.user.id,
          comment: input.comment,
        });
        
        await logActivity({
          userId: ctx.user.id,
          leadId: input.leadId,
          action: 'comment_added',
          details: null,
        });
        
        return { success: true };
      }),
    
    // Messages
    getMessages: protectedProcedure
      .input(z.object({ leadId: z.number() }))
      .query(async ({ input }) => {
        const { getLeadMessages } = await import("./db");
        return await getLeadMessages(input.leadId);
      }),
    
    sendMessage: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        platform: z.enum(['instagram', 'telegram', 'whatsapp', 'sms']),
        message: z.string(),
        chatId: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createMessage, logActivity } = await import("./db");
        const { ENV } = await import("./_core/env");
        
        let externalId: string | null = null;
        let success = false;
        
        if (input.platform === 'telegram') {
          const { sendTelegramMessage } = await import("./telegramBot");
          const chatId = input.chatId || ENV.telegramChatId;
          const result = await sendTelegramMessage(chatId, input.message);
          
          if (result.success) {
            externalId = result.messageId?.toString() || null;
            success = true;
          }
        } else if (input.platform === 'instagram') {
          const { sendInstagramMessage } = await import("./instagramDirect");
          const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
          
          if (input.chatId && instagramAccessToken) {
            const result = await sendInstagramMessage(input.chatId, input.message, instagramAccessToken);
            
            if (result.success) {
              externalId = result.messageId || null;
              success = true;
            }
          } else {
            console.warn('[CRM] Instagram Direct: Missing chatId or access token');
          }
        } else if (input.platform === 'whatsapp') {
          const { sendWhatsAppMessage } = await import("./whatsapp");
          
          if (input.chatId) {
            const result = await sendWhatsAppMessage({ to: input.chatId, message: input.message });
            
            if (result.success) {
              externalId = result.messageId || null;
              success = true;
            }
          } else {
            console.warn('[CRM] WhatsApp: Missing phone number');
          }
        } else if (input.platform === 'sms') {
          const { sendSMS } = await import("./sms");
          
          if (input.chatId) {
            const smsSuccess = await sendSMS({ to: input.chatId, message: input.message });
            success = smsSuccess;
          } else {
            console.warn('[CRM] SMS: Missing phone number');
          }
        }
        
        await createMessage({
          leadId: input.leadId,
          platform: input.platform,
          direction: 'outbound',
          message: input.message,
          sentBy: ctx.user.id,
          externalId,
        });
        
        await logActivity({
          userId: ctx.user.id,
          leadId: input.leadId,
          action: 'message_sent',
          details: JSON.stringify({ platform: input.platform, success }),
        });
        
        return { success };
      }),
  }),

  managers: router({
    // Send invitation to manager
    inviteManager: adminProcedure
      .input(z.object({
        email: z.string().email(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createManagerInvitation } = await import("./db");
        const { sendManagerInvitation } = await import("./email");
        const crypto = await import("crypto");
        
        // Generate unique token
        const token = crypto.randomBytes(32).toString('hex');
        
        // Set expiration to 7 days from now
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        
        await createManagerInvitation({
          email: input.email,
          token,
          invitedBy: ctx.user.id,
          status: "pending",
          expiresAt,
        });
        
        // Generate invitation URL
        const baseUrl = process.env.VITE_APP_URL || 'http://localhost:3000';
        const invitationUrl = `${baseUrl}/register-manager?token=${token}`;
        
        // Send email invitation
        const emailResult = await sendManagerInvitation({
          email: input.email,
          invitationUrl,
          invitedBy: ctx.user.name || 'Admin',
        });
        
        if (!emailResult.success) {
          console.warn('[Managers] Email send failed:', emailResult.error);
          // Still return success since invitation was created
          return {
            success: true,
            invitationUrl,
            token,
            emailSent: false,
            emailError: emailResult.error,
          };
        }
        
        return { 
          success: true, 
          invitationUrl,
          token,
          emailSent: true,
        };
      }),
    
    // Get all invitations
    getInvitations: adminProcedure.query(async () => {
      const { getAllManagerInvitations } = await import("./db");
      return await getAllManagerInvitations();
    }),
    
    // Verify invitation token
    verifyInvitation: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const { getManagerInvitationByToken } = await import("./db");
        
        const invitation = await getManagerInvitationByToken(input.token);
        
        if (!invitation) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Invitation not found" });
        }
        
        if (invitation.status !== "pending") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation already used or expired" });
        }
        
        if (new Date() > new Date(invitation.expiresAt)) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Invitation expired" });
        }
        
        return { 
          valid: true, 
          email: invitation.email 
        };
      }),
    
    // Accept invitation and create manager account
    // acceptInvitation removed - OAuth not used
  }),

  abTest: router({
    createVariant: adminProcedure
      .input(z.object({
        quizId: z.string(),
        variantName: z.string(),
        trafficPercentage: z.number().min(0).max(100),
        title: z.string().optional(),
        subtitle: z.string().optional(),
        questions: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { createABTestVariant } = await import("./db");
        
        await createABTestVariant({
          quizId: input.quizId,
          variantName: input.variantName,
          trafficPercentage: input.trafficPercentage,
          title: input.title || null,
          subtitle: input.subtitle || null,
          questions: input.questions || null,
          isActive: 1,
        });
        
        return { success: true };
      }),
    
    getVariants: publicProcedure
      .input(z.object({ quizId: z.string() }))
      .query(async ({ input }) => {
        const { getActiveVariantsForQuiz } = await import("./db");
        return await getActiveVariantsForQuiz(input.quizId);
      }),
    
    assignVariant: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        quizId: z.string(),
        variantId: z.number(),
        variantName: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { assignVariantToSession } = await import("./db");
        
        await assignVariantToSession({
          sessionId: input.sessionId,
          quizId: input.quizId,
          variantId: input.variantId,
          converted: 0,
        });
        
        return { success: true };
      }),
    
    trackConversion: publicProcedure
      .input(z.object({
        sessionId: z.string(),
        quizId: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { markConversion } = await import("./db");
        await markConversion(input.sessionId, input.quizId);
        return { success: true };
      }),
    
    getTestResults: adminProcedure
      .input(z.object({ quizId: z.string() }))
      .query(async ({ input }) => {
        const { getABTestStats, getActiveVariantsForQuiz } = await import("./db");
        
        const assignments = await getABTestStats(input.quizId);
        const variants = await getActiveVariantsForQuiz(input.quizId);
        
        const stats = variants.map(variant => {
          const variantAssignments = assignments.filter(a => a.variantId === variant.id);
          const total = variantAssignments.length;
          const conversions = variantAssignments.filter(a => a.converted === 1).length;
          const conversionRate = total > 0 ? (conversions / total) * 100 : 0;
          
          return {
            variantId: variant.id,
            variantName: variant.variantName,
            total,
            conversions,
            conversionRate,
          };
        });
        
        return stats;
      }),
  }),

  messaging: messagingRouter,
  services: servicesRouter,
  sales: salesRouter,
  salesScripts: salesScriptsRouter,
  integrations: integrationsRouter,
  conversations: conversationsRouter,

  calendar: router({
    getAppointments: protectedProcedure.query(async () => {
      const { getAppointments } = await import("./db");
      return await getAppointments();
    }),

    createAppointment: protectedProcedure
      .input(z.object({
        leadId: z.number(),
        title: z.string(),
        description: z.string().optional(),
        scheduledAt: z.string(),
        duration: z.number(),
        meetingLink: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createAppointment } = await import("./db");
        const appointmentId = await createAppointment({
          ...input,
          managerId: ctx.user.id,
        });
        return { success: true, appointmentId };
      }),

    updateAppointmentStatus: protectedProcedure
      .input(z.object({
        appointmentId: z.number(),
        status: z.string(),
      }))
      .mutation(async ({ input }) => {
        const { updateAppointmentStatus } = await import("./db");
        await updateAppointmentStatus(input.appointmentId, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
