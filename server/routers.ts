import { getSessionCookieOptions } from "./_core/cookies";
import { COOKIE_NAME } from "../shared/const";
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
import { settingsRouter } from "./routers/settings";
import { webhooksRouter } from "./routers/webhooks";
import { quizEditorRouter } from "./routers/quizEditor";
import { analyticsRouter } from "./routers/analytics";
import { analyticsSettingsRouter } from "./routers/analyticsSettings";
import { quizDesignRouter } from "./routers/quizDesign";
import { quizTemplatesRouter } from "./routers/quizTemplates";
import { questionTemplatesRouter } from "./routers/questionTemplates";
import { quizzesRouter } from "./routers/quizzes";
// import { abTestingRouter } from "./routers/abTesting"; // Disabled - conflicts with existing AB test implementation
import * as schema from "../drizzle/schema";
import { getDb } from "./db";

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
    getAllUsers: protectedProcedure.query(async () => {
      // Get all users for manager assignment
      const db = await getDb();
      
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }
      
      const users = await db.select({
        id: schema.users.id,
        name: schema.users.name,
        email: schema.users.email,
        role: schema.users.role,
      }).from(schema.users);
      return users;
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
        
        // Send single Telegram notification with full Q&A details
        const telegramSent = await sendTelegramMessage(message);
        if (!telegramSent) {
          console.warn("[Quiz] Lead saved but Telegram notification failed");
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
    
    getAnalyticsData: adminProcedure
      .input(z.object({
        dateRange: z.enum(["today", "yesterday", "last7Days", "last30Days", "thisMonth", "lastMonth", "custom"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        quizName: z.string().optional(),
        source: z.string().optional(),
        campaign: z.string().optional(),
      }))
      .query(async ({ input }) => {
        const { getAllLeads, getAllSales } = await import("./db");
        
        let leads = await getAllLeads();
        const sales = await getAllSales();
        
        // Apply date range filter
        if (input.dateRange) {
          const now = new Date();
          let startDate: Date | null = null;
          
          switch (input.dateRange) {
            case "today":
              startDate = new Date(now.setHours(0, 0, 0, 0));
              break;
            case "yesterday":
              startDate = new Date(now.setDate(now.getDate() - 1));
              startDate.setHours(0, 0, 0, 0);
              break;
            case "last7Days":
              startDate = new Date(now.setDate(now.getDate() - 7));
              break;
            case "last30Days":
              startDate = new Date(now.setDate(now.getDate() - 30));
              break;
            case "thisMonth":
              startDate = new Date(now.getFullYear(), now.getMonth(), 1);
              break;
            case "lastMonth":
              startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
              const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
              leads = leads.filter(lead => {
                const leadDate = new Date(lead.createdAt);
                return leadDate >= startDate! && leadDate <= endDate;
              });
              break;
            case "custom":
              if (input.startDate && input.endDate) {
                const customStart = new Date(input.startDate);
                const customEnd = new Date(input.endDate);
                leads = leads.filter(lead => {
                  const leadDate = new Date(lead.createdAt);
                  return leadDate >= customStart && leadDate <= customEnd;
                });
              }
              break;
          }
          
          if (startDate && input.dateRange !== "lastMonth" && input.dateRange !== "custom") {
            leads = leads.filter(lead => new Date(lead.createdAt) >= startDate!);
          }
        }
        
        // Apply other filters
        if (input.quizName) {
          leads = leads.filter(lead => lead.quizName === input.quizName);
        }
        if (input.source) {
          leads = leads.filter(lead => lead.source === input.source);
        }
        if (input.campaign) {
          leads = leads.filter(lead => lead.utmCampaign === input.campaign);
        }
        
        // Calculate metrics
        const totalLeads = leads.length;
        const totalSpent = leads.reduce((sum, lead) => sum + (parseFloat(lead.spentAmount?.toString() || "0")), 0);
        
        // Get sales for these leads
        const leadIds = leads.map(l => l.id);
        const relevantSales = sales.filter(sale => leadIds.includes(sale.leadId));
        const totalRevenue = relevantSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount.toString()), 0);
        const conversions = relevantSales.length;
        
        // Calculate ROMI (Return on Marketing Investment)
        // ROMI = (Revenue - Cost) / Cost * 100
        const romi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent * 100).toFixed(2) : "0";
        
        // Calculate ROAS (Return on Ad Spend)
        // ROAS = Revenue / Cost
        const roas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : "0";
        
        // Conversion rate
        const conversionRate = totalLeads > 0 ? ((conversions / totalLeads) * 100).toFixed(2) : "0";
        
        // Average time on site
        const avgTimeOnSite = totalLeads > 0 
          ? Math.round(leads.reduce((sum, lead) => sum + (lead.timeOnSite || 0), 0) / totalLeads)
          : 0;
        
        // Cost per lead
        const costPerLead = totalLeads > 0 ? (totalSpent / totalLeads).toFixed(2) : "0";
        
        // Leads by source
        const leadsBySource: Record<string, number> = {};
        leads.forEach(lead => {
          const source = lead.source || "Unknown";
          leadsBySource[source] = (leadsBySource[source] || 0) + 1;
        });
        
        // Top campaigns
        const campaignStats: Record<string, { leads: number; conversions: number; spent: number; revenue: number }> = {};
        leads.forEach(lead => {
          const campaign = lead.utmCampaign || "No Campaign";
          if (!campaignStats[campaign]) {
            campaignStats[campaign] = { leads: 0, conversions: 0, spent: 0, revenue: 0 };
          }
          campaignStats[campaign].leads++;
          campaignStats[campaign].spent += parseFloat(lead.spentAmount?.toString() || "0");
          
          const sale = relevantSales.find(s => s.leadId === lead.id);
          if (sale) {
            campaignStats[campaign].conversions++;
            campaignStats[campaign].revenue += parseFloat(sale.totalAmount.toString());
          }
        });
        
        const topCampaigns = Object.entries(campaignStats)
          .map(([campaign, stats]) => ({
            campaign,
            ...stats,
            romi: stats.spent > 0 ? ((stats.revenue - stats.spent) / stats.spent * 100).toFixed(2) : "0",
            roas: stats.spent > 0 ? (stats.revenue / stats.spent).toFixed(2) : "0",
          }))
          .sort((a, b) => b.leads - a.leads)
          .slice(0, 10);
        
        // Top ads
        const adStats: Record<string, { leads: number; conversions: number }> = {};
        leads.forEach(lead => {
          const ad = lead.utmAd || "No Ad";
          if (!adStats[ad]) {
            adStats[ad] = { leads: 0, conversions: 0 };
          }
          adStats[ad].leads++;
          
          const sale = relevantSales.find(s => s.leadId === lead.id);
          if (sale) adStats[ad].conversions++;
        });
        
        const topAds = Object.entries(adStats)
          .map(([ad, stats]) => ({
            ad,
            ...stats,
            ctr: stats.leads > 0 ? ((stats.conversions / stats.leads) * 100).toFixed(2) : "0",
          }))
          .sort((a, b) => b.leads - a.leads)
          .slice(0, 10);
        
        // Top keywords
        const keywordStats: Record<string, { leads: number; clicks: number }> = {};
        leads.forEach(lead => {
          const keyword = lead.utmKeyword || "No Keyword";
          if (!keywordStats[keyword]) {
            keywordStats[keyword] = { leads: 0, clicks: 0 };
          }
          keywordStats[keyword].leads++;
          keywordStats[keyword].clicks++; // Simplified - in real scenario track actual clicks
        });
        
        const topKeywords = Object.entries(keywordStats)
          .map(([keyword, stats]) => ({
            keyword,
            ...stats,
            impressions: stats.clicks * 10, // Simplified estimation
          }))
          .sort((a, b) => b.leads - a.leads)
          .slice(0, 10);
        
        return {
          summary: {
            totalLeads,
            conversionRate,
            romi,
            roas,
            avgTimeOnSite,
            totalSpent,
            totalRevenue,
            costPerLead,
          },
          leadsBySource,
          topCampaigns,
          topAds,
          topKeywords,
        };
      }),
    
    // Send Analytics Report via Email
    sendAnalyticsReport: adminProcedure
      .input(z.object({
        dateRange: z.enum(["today", "yesterday", "last7Days", "last30Days", "thisMonth", "lastMonth", "custom"]).optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        quizName: z.string().optional(),
        source: z.string().optional(),
        campaign: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { notifyOwner } = await import("./_core/notification");
        const { getAllLeads, getAllSales } = await import("./db");
        
        const leads = await getAllLeads();
        const sales = await getAllSales();
        
        // Apply date range filter
        let filteredLeads = leads;
        const now = new Date();
        
        if (input.dateRange && input.dateRange !== "custom") {
          const startDate = new Date();
          
          switch (input.dateRange) {
            case "today":
              startDate.setHours(0, 0, 0, 0);
              break;
            case "yesterday":
              startDate.setDate(startDate.getDate() - 1);
              startDate.setHours(0, 0, 0, 0);
              break;
            case "last7Days":
              startDate.setDate(startDate.getDate() - 7);
              break;
            case "last30Days":
              startDate.setDate(startDate.getDate() - 30);
              break;
            case "thisMonth":
              startDate.setDate(1);
              startDate.setHours(0, 0, 0, 0);
              break;
            case "lastMonth":
              startDate.setMonth(startDate.getMonth() - 1);
              startDate.setDate(1);
              startDate.setHours(0, 0, 0, 0);
              break;
          }
          
          filteredLeads = filteredLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= startDate && leadDate <= now;
          });
        } else if (input.startDate && input.endDate) {
          const start = new Date(input.startDate);
          const end = new Date(input.endDate);
          filteredLeads = filteredLeads.filter(lead => {
            const leadDate = new Date(lead.createdAt);
            return leadDate >= start && leadDate <= end;
          });
        }
        
        // Apply other filters
        if (input.quizName) {
          filteredLeads = filteredLeads.filter(lead => lead.quizName === input.quizName);
        }
        if (input.source) {
          filteredLeads = filteredLeads.filter(lead => lead.source === input.source);
        }
        if (input.campaign) {
          filteredLeads = filteredLeads.filter(lead => lead.utmCampaign === input.campaign);
        }
        
        // Calculate metrics
        const totalLeads = filteredLeads.length;
        const totalSpent = filteredLeads.reduce((sum, lead) => sum + (parseFloat(lead.spentAmount?.toString() || "0")), 0);
        
        const leadIds = filteredLeads.map(l => l.id);
        const relevantSales = sales.filter(sale => leadIds.includes(sale.leadId));
        const totalRevenue = relevantSales.reduce((sum, sale) => sum + parseFloat(sale.totalAmount.toString()), 0);
        const conversions = relevantSales.length;
        
        const romi = totalSpent > 0 ? ((totalRevenue - totalSpent) / totalSpent * 100).toFixed(2) : "0";
        const roas = totalSpent > 0 ? (totalRevenue / totalSpent).toFixed(2) : "0";
        const conversionRate = totalLeads > 0 ? ((conversions / totalLeads) * 100).toFixed(2) : "0";
        const avgTimeOnSite = totalLeads > 0 
          ? Math.round(filteredLeads.reduce((sum, lead) => sum + (lead.timeOnSite || 0), 0) / totalLeads)
          : 0;
        const costPerLead = totalLeads > 0 ? (totalSpent / totalLeads).toFixed(2) : "0";
        
        // Format period
        let periodText = "";
        if (input.dateRange) {
          const periodMap: Record<string, string> = {
            today: "Today",
            yesterday: "Yesterday",
            last7Days: "Last 7 Days",
            last30Days: "Last 30 Days",
            thisMonth: "This Month",
            lastMonth: "Last Month",
          };
          periodText = periodMap[input.dateRange] || "Custom Period";
        } else if (input.startDate && input.endDate) {
          periodText = `${new Date(input.startDate).toLocaleDateString()} - ${new Date(input.endDate).toLocaleDateString()}`;
        }
        
        // Create email content
        const title = `📊 Analytics Report: ${periodText}`;
        const content = `
**PIKALEADS Analytics Report**

**Period:** ${periodText}
${input.quizName ? `**Quiz:** ${input.quizName}\n` : ""}
${input.source ? `**Source:** ${input.source}\n` : ""}
${input.campaign ? `**Campaign:** ${input.campaign}\n` : ""}

---

**📊 Key Metrics:**

• **Total Leads:** ${totalLeads}
• **Conversion Rate:** ${conversionRate}%
• **ROMI:** ${romi}%
• **ROAS:** ${roas}x
• **Average Time on Site:** ${Math.floor(avgTimeOnSite / 60)}m ${avgTimeOnSite % 60}s

**💰 Financial:**

• **Total Spent:** $${totalSpent.toFixed(2)}
• **Total Revenue:** $${totalRevenue.toFixed(2)}
• **Cost Per Lead:** $${costPerLead}

---

👉 View detailed analytics at: [Admin Dashboard](/admin/analytics)
        `.trim();
        
        const success = await notifyOwner({ title, content });
        
        return {
          success,
          message: success 
            ? "Analytics report sent successfully" 
            : "Failed to send report. Please try again.",
        };
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
    
    getLeads: protectedProcedure
      .input(z.object({
        managerId: z.number().optional(),
        source: z.string().optional(),
        dateFrom: z.string().optional(), // ISO date string
        dateTo: z.string().optional(),   // ISO date string
      }).optional())
      .query(async ({ ctx, input }) => {
        const { getAllLeads } = await import("./db");
        let allLeads = await getAllLeads();
        
        // Managers only see their assigned leads
        if (ctx.user.role === 'manager') {
          allLeads = allLeads.filter(lead => lead.assignedTo === ctx.user.id);
        }
        
        // Apply filters if provided
        if (input) {
          if (input.managerId) {
            allLeads = allLeads.filter(lead => lead.assignedTo === input.managerId);
          }
          
          if (input.source) {
            allLeads = allLeads.filter(lead => 
              lead.utmSource?.toLowerCase() === input.source?.toLowerCase()
            );
          }
          
          if (input.dateFrom) {
            const fromDate = new Date(input.dateFrom);
            allLeads = allLeads.filter(lead => 
              new Date(lead.createdAt) >= fromDate
            );
          }
          
          if (input.dateTo) {
            const toDate = new Date(input.dateTo);
            toDate.setHours(23, 59, 59, 999); // End of day
            allLeads = allLeads.filter(lead => 
              new Date(lead.createdAt) <= toDate
            );
          }
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
    
    // Bulk operations
    bulkAssignLeads: adminProcedure
      .input(z.object({
        leadIds: z.array(z.number()),
        managerId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { assignLeadToManager } = await import("./db");
        for (const leadId of input.leadIds) {
          await assignLeadToManager(leadId, input.managerId, ctx.user.id);
        }
        return { success: true, count: input.leadIds.length };
      }),
    
    bulkUpdateStatus: protectedProcedure
      .input(z.object({
        leadIds: z.array(z.number()),
        statusId: z.number(),
      }))
      .mutation(async ({ input, ctx }) => {
        const { updateLeadStatusById } = await import("./db");
        for (const leadId of input.leadIds) {
          await updateLeadStatusById(leadId, input.statusId, ctx.user.id);
        }
        return { success: true, count: input.leadIds.length };
      }),
    
    bulkDeleteLeads: adminProcedure
      .input(z.object({
        leadIds: z.array(z.number()),
      }))
      .mutation(async ({ input }) => {
        const db = await import("./db").then(m => m.getDb());
        if (!db) throw new Error("Database not available");
        const { leads } = await import("../drizzle/schema");
        const { inArray } = await import("drizzle-orm");
        await db.delete(leads).where(inArray(leads.id, input.leadIds));
        return { success: true, count: input.leadIds.length };
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
    
    getStats: publicProcedure
      .input(z.object({ quizId: z.string() }))
      .query(async ({ input }) => {
        const { getABTestStats, getActiveVariantsForQuiz } = await import("./db");
        
        const assignments = await getABTestStats(input.quizId);
        const variants = await getActiveVariantsForQuiz(input.quizId);
        
        const stats = variants.map(variant => {
          const variantAssignments = assignments.filter((a: any) => a.variantId === variant.id);
          const impressions = variantAssignments.length;
          const conversions = variantAssignments.filter((a: any) => a.converted === 1).length;
          const conversionRate = impressions > 0 ? (conversions / impressions) * 100 : 0;
          
          // Calculate confidence level (simplified)
          const confidenceLevel = impressions > 100 ? Math.min(95, (impressions / 1000) * 100) : 0;
          
          return {
            variantId: variant.id,
            variantName: variant.variantName,
            impressions,
            conversions,
            conversionRate,
            isWinner: false,
            confidenceLevel,
          };
        });
        
        return stats;
      }),
    
    toggleVariant: adminProcedure
      .input(z.object({
        variantId: z.number(),
        isActive: z.number(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        
        const { abTestVariants } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.update(abTestVariants)
          .set({ isActive: input.isActive })
          .where(eq(abTestVariants.id, input.variantId));
        
        return { success: true };
      }),
    
    deleteVariant: adminProcedure
      .input(z.object({ variantId: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
        
        const { abTestVariants } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.delete(abTestVariants)
          .where(eq(abTestVariants.id, input.variantId));
        
        return { success: true };
      }),
  }),

  messaging: messagingRouter,
  services: servicesRouter,
  sales: salesRouter,
  salesScripts: salesScriptsRouter,
  integrations: integrationsRouter,
  conversations: conversationsRouter,
  webhooks: webhooksRouter,
  quizEditor: quizEditorRouter,
  quizzes: quizzesRouter,
  analytics: analyticsRouter,
  settings: settingsRouter,
  analyticsSettings: analyticsSettingsRouter,
  quizDesign: quizDesignRouter,
  quizTemplates: quizTemplatesRouter,
  questionTemplates: questionTemplatesRouter,

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

  // Filter Presets for CRM
  filterPresets: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const { filterPresets } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      
      const presets = await db.select().from(filterPresets).where(eq(filterPresets.userId, ctx.user.id));
      return presets.map(p => ({
        ...p,
        filters: JSON.parse(p.filters),
      }));
    }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1).max(100),
        filters: z.object({
          manager: z.string().optional(),
          source: z.string().optional(),
          dateFrom: z.string().optional(),
          dateTo: z.string().optional(),
          campaign: z.string().optional(),
          adGroup: z.string().optional(),
          ad: z.string().optional(),
          placement: z.string().optional(),
          keyword: z.string().optional(),
          site: z.string().optional(),
        }),
        isDefault: z.boolean().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { filterPresets } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        // If setting as default, unset other defaults
        if (input.isDefault) {
          await db.update(filterPresets)
            .set({ isDefault: false })
            .where(eq(filterPresets.userId, ctx.user.id));
        }
        
        const [result] = await db.insert(filterPresets).values({
          userId: ctx.user.id,
          name: input.name,
          filters: JSON.stringify(input.filters),
          isDefault: input.isDefault || false,
        });
        
        return { success: true, id: result.insertId };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { filterPresets } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        await db.delete(filterPresets).where(
          and(
            eq(filterPresets.id, input.id),
            eq(filterPresets.userId, ctx.user.id)
          )
        );
        
        return { success: true };
      }),

    setDefault: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { filterPresets } = await import("../drizzle/schema");
        const { eq, and } = await import("drizzle-orm");
        
        // Unset all defaults
        await db.update(filterPresets)
          .set({ isDefault: false })
          .where(eq(filterPresets.userId, ctx.user.id));
        
        // Set new default
        await db.update(filterPresets)
          .set({ isDefault: true })
          .where(
            and(
              eq(filterPresets.id, input.id),
              eq(filterPresets.userId, ctx.user.id)
            )
          );
        
        return { success: true };
      }),
  }),

  // Assignment Rules - automatic lead assignment based on rules
  assignmentRules: router({
    list: protectedProcedure
      .query(async ({ ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { assignmentRules, users } = await import("../drizzle/schema");
        const { eq, desc } = await import("drizzle-orm");
        
        // Get all rules (admins see all, managers see only their own)
        const rules = await db.select({
          id: assignmentRules.id,
          name: assignmentRules.name,
          type: assignmentRules.type,
          conditions: assignmentRules.conditions,
          managerId: assignmentRules.managerId,
          assignmentStrategy: assignmentRules.assignmentStrategy,
          priority: assignmentRules.priority,
          isActive: assignmentRules.isActive,
          createdAt: assignmentRules.createdAt,
          managerName: users.name,
        })
        .from(assignmentRules)
        .leftJoin(users, eq(assignmentRules.managerId, users.id))
        .orderBy(desc(assignmentRules.priority));
        
        return rules;
      }),

    create: protectedProcedure
      .input(z.object({
        name: z.string().min(1),
        type: z.enum(["manual", "workload", "source", "campaign"]),
        conditions: z.string().optional(),
        managerId: z.number().optional(),
        assignmentStrategy: z.enum(["specific", "balance_workload"]),
        priority: z.number().default(0),
        isActive: z.number().default(1),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { assignmentRules } = await import("../drizzle/schema");
        
        const [result] = await db.insert(assignmentRules).values({
          name: input.name,
          type: input.type,
          conditions: input.conditions,
          managerId: input.managerId,
          assignmentStrategy: input.assignmentStrategy,
          priority: input.priority,
          isActive: input.isActive,
        });
        
        return { id: result.insertId, success: true };
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().min(1).optional(),
        type: z.enum(["manual", "workload", "source", "campaign"]).optional(),
        conditions: z.string().optional(),
        managerId: z.number().optional(),
        assignmentStrategy: z.enum(["specific", "balance_workload"]).optional(),
        priority: z.number().optional(),
        isActive: z.number().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { assignmentRules } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        const { id, ...updates } = input;
        await db.update(assignmentRules)
          .set(updates)
          .where(eq(assignmentRules.id, id));
        
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { assignmentRules } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.delete(assignmentRules).where(eq(assignmentRules.id, input.id));
        
        return { success: true };
      }),

    toggle: protectedProcedure
      .input(z.object({ id: z.number(), isActive: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const db = await getDb();
        if (!db) throw new Error("Database connection failed");
        const { assignmentRules } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        
        await db.update(assignmentRules)
          .set({ isActive: input.isActive })
          .where(eq(assignmentRules.id, input.id));
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
