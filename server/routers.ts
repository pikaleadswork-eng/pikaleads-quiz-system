import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
  }),

  quiz: router({
    submitLead: publicProcedure
      .input(
        z.object({
          quizName: z.string(),
          answers: z.string(),
          name: z.string(),
          phone: z.string(),
          telegram: z.string().optional(),
          language: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createLead } = await import("./db");
        const { sendTelegramMessage, formatLeadMessage } = await import("./telegram");
        
        // Save to database
        await createLead({
          quizName: input.quizName,
          answers: input.answers,
          name: input.name,
          phone: input.phone,
          telegram: input.telegram || null,
          language: input.language || null,
        });
        
        // Send to Telegram
        const message = formatLeadMessage({
          quizName: input.quizName,
          answers: input.answers,
          name: input.name,
          phone: input.phone,
          telegram: input.telegram,
        });
        
        const telegramSent = await sendTelegramMessage(message);
        if (!telegramSent) {
          console.warn("[Quiz] Lead saved but Telegram notification failed");
        }
        
        return { success: true };
      }),
  }),

  admin: router({
    getLeads: adminProcedure.query(async () => {
      const { getAllLeads } = await import("./db");
      return await getAllLeads();
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
        platform: z.enum(['instagram', 'telegram']),
        message: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { createMessage, logActivity } = await import("./db");
        await createMessage({
          leadId: input.leadId,
          platform: input.platform,
          direction: 'outbound',
          message: input.message,
          sentBy: ctx.user.id,
          externalId: null,
        });
        
        await logActivity({
          userId: ctx.user.id,
          leadId: input.leadId,
          action: 'message_sent',
          details: JSON.stringify({ platform: input.platform }),
        });
        
        // TODO: Actually send message via Instagram/Telegram API
        
        return { success: true };
      }),
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
});

export type AppRouter = typeof appRouter;
