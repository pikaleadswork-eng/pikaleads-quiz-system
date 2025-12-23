import { eq, desc, and, gte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, abTestVariants, abTestAssignments, incompleteQuizSessions, InsertABTestVariant, InsertABTestAssignment, InsertIncompleteQuizSession, leadStatuses, InsertLeadStatus, leadComments, InsertLeadComment, activityLog, InsertActivityLog, messages, InsertMessage, assignmentRules, InsertAssignmentRule, assignmentHistory, systemSettings, appointments, managerInvitations, InsertManagerInvitation } from "../drizzle/schema";
import { sql } from "drizzle-orm";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// OAuth functions removed - using email/password authentication

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create user: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(users).values(user);
    return result;
  } catch (error) {
    console.error("[Database] Failed to create user:", error);
    throw error;
  }
}

export async function updateUserLastSignIn(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  try {
    await db.update(users)
      .set({ lastSignedIn: new Date() })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error("[Database] Failed to update user last sign in:", error);
    throw error;
  }
}

export async function createLead(lead: InsertLead) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create lead: database not available");
    throw new Error("Database not available");
  }

  try {
    const result = await db.insert(leads).values(lead);
    // Get the inserted ID from the result
    const insertId = (result as any).insertId || (result as any)[0]?.insertId;
    return insertId as number;
  } catch (error) {
    console.error("[Database] Failed to create lead:", error);
    throw error;
  }
}

export async function getAllLeads() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get leads: database not available");
    return [];
  }

  try {
    const result = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    return [];
  }
}

// Delete leads function
export async function deleteLeads(leadIds: number[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  try {
    for (const id of leadIds) {
      await db.delete(leads).where(eq(leads.id, id));
    }
    return { success: true, deletedCount: leadIds.length };
  } catch (error) {
    console.error("[Database] Failed to delete leads:", error);
    throw error;
  }
}

// A/B Testing functions
export async function createABTestVariant(variant: InsertABTestVariant) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(abTestVariants).values(variant);
  return result;
}

export async function getActiveVariantsForQuiz(quizId: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(abTestVariants)
    .where(eq(abTestVariants.quizId, quizId));
}

export async function assignVariantToSession(assignment: InsertABTestAssignment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(abTestAssignments).values(assignment);
}

export async function markConversion(sessionId: string, quizId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(abTestAssignments)
    .set({ converted: 1 })
    .where(eq(abTestAssignments.sessionId, sessionId));
}

export async function getABTestStats(quizId: string) {
  const db = await getDb();
  if (!db) return [];
  const assignments = await db.select()
    .from(abTestAssignments)
    .where(eq(abTestAssignments.quizId, quizId));
  return assignments;
}

// Remarketing functions
export async function saveIncompleteSession(session: InsertIncompleteQuizSession) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(incompleteQuizSessions).values(session)
    .onDuplicateKeyUpdate({
      set: {
        currentStep: session.currentStep,
        answers: session.answers,
        name: session.name,
        phone: session.phone,
        email: session.email,
        updatedAt: new Date(),
      }
    });
}

export async function getIncompleteSessions() {
  const db = await getDb();
  if (!db) return [];
  
  return db.select().from(incompleteQuizSessions)
    .where(eq(incompleteQuizSessions.completed, 0));
}

export async function markSessionCompleted(sessionId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(incompleteQuizSessions)
    .set({ completed: 1, updatedAt: new Date() })
    .where(eq(incompleteQuizSessions.sessionId, sessionId));
}

export async function incrementReminderCount(sessionId: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(incompleteQuizSessions)
    .set({ 
      remindersSent: sql`${incompleteQuizSessions.remindersSent} + 1`,
      lastReminderAt: new Date(),
      updatedAt: new Date()
    })
    .where(eq(incompleteQuizSessions.sessionId, sessionId));
}

// CRM Functions

export async function getLeadStatuses() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(leadStatuses).orderBy(leadStatuses.order);
}

export async function createLeadStatus(status: InsertLeadStatus) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(leadStatuses).values(status);
}

export async function updateLeadStatus(id: number, updates: Partial<InsertLeadStatus>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leadStatuses).set(updates).where(eq(leadStatuses.id, id));
}

export async function deleteLeadStatus(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(leadStatuses).where(eq(leadStatuses.id, id));
}

export async function getLeadComments(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  
  const comments = await db
    .select({
      id: leadComments.id,
      leadId: leadComments.leadId,
      userId: leadComments.userId,
      comment: leadComments.comment,
      createdAt: leadComments.createdAt,
      userName: users.name,
    })
    .from(leadComments)
    .leftJoin(users, eq(leadComments.userId, users.id))
    .where(eq(leadComments.leadId, leadId))
    .orderBy(desc(leadComments.createdAt));
  
  return comments;
}

export async function createLeadComment(comment: InsertLeadComment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(leadComments).values(comment);
}

export async function logActivity(activity: InsertActivityLog) {
  const db = await getDb();
  if (!db) return;
  await db.insert(activityLog).values(activity);
}

export async function getLeadMessages(leadId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(messages).where(eq(messages.leadId, leadId)).orderBy(messages.createdAt);
}

export async function createMessage(message: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(messages).values(message);
}

export async function updateLeadStatusById(leadId: number, statusId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get old status for logging
  const [oldLead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!oldLead) throw new Error("Lead not found");
  
  await db.update(leads).set({ statusId }).where(eq(leads.id, leadId));
  
  // Log activity
  await logActivity({
    userId,
    leadId,
    action: "status_change",
    details: JSON.stringify({ newStatusId: statusId }),
  });
  
  // Log to lead history
  const { logLeadChange } = await import("./leadHistory");
  await logLeadChange({
    leadId,
    userId,
    field: "statusId",
    oldValue: oldLead.statusId ? String(oldLead.statusId) : null,
    newValue: String(statusId),
  });
}

export async function assignLeadToManager(leadId: number, managerId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get old assignment for logging
  const [oldLead] = await db.select().from(leads).where(eq(leads.id, leadId));
  if (!oldLead) throw new Error("Lead not found");
  
  await db.update(leads).set({ assignedTo: managerId }).where(eq(leads.id, leadId));
  
  // Log activity
  await logActivity({
    userId: adminId,
    leadId,
     action: "assign_lead",
    details: JSON.stringify({ managerId }),
  });
  
  // Log to lead history
  const { logLeadChange } = await import("./leadHistory");
  await logLeadChange({
    leadId,
    userId: adminId,
    field: "assignedTo",
    oldValue: oldLead.assignedTo ? String(oldLead.assignedTo) : null,
    newValue: String(managerId),
  });
}

/**
 * Manager Invitation functions
 */

export async function createManagerInvitation(invitation: InsertManagerInvitation) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(managerInvitations).values(invitation);
  return result;
}

export async function getManagerInvitationByToken(token: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(managerInvitations).where(eq(managerInvitations.token, token));
  return result[0] || null;
}

export async function updateManagerInvitationStatus(
  id: number,
  status: "pending" | "accepted" | "expired",
  acceptedAt?: Date
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status };
  if (acceptedAt) {
    updateData.acceptedAt = acceptedAt;
  }
  
  await db.update(managerInvitations).set(updateData).where(eq(managerInvitations.id, id));
}

export async function getAllManagerInvitations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(managerInvitations);
  return result;
}

/**
 * Find lead by Telegram username or chat ID
 */
export async function getLeadByTelegram(telegram: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(leads).where(eq(leads.telegram, telegram));
  return result[0] || null;
}

/**
 * Find lead by Instagram username
 * Note: You may need to add an instagram field to the leads table
 */
export async function getLeadByInstagram(instagram: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // For now, search by telegram field (can be used for Instagram username too)
  // In production, add a separate instagram field to the leads table
  const result = await db.select().from(leads).where(eq(leads.telegram, instagram));
  return result[0] || null;
}

/**
 * Get UTM analytics data
 */
export async function getUTMAnalytics() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const allLeads = await db.select().from(leads);
  const totalLeads = allLeads.length;
  
  // Helper to calculate stats
  const calculateStats = (field: keyof typeof leads.$inferSelect) => {
    const grouped = allLeads.reduce((acc, lead) => {
      const value = lead[field] as string | null;
      if (value) {
        if (!acc[value]) {
          acc[value] = 0;
        }
        acc[value]++;
      }
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(grouped)
      .map(([name, count]) => ({
        name,
        count,
        conversionRate: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);
  };
  
  return {
    totalLeads,
    topCampaigns: calculateStats('utmCampaign'),
    topAdGroups: calculateStats('utmAdGroup'),
    topAds: calculateStats('utmAd'),
    topPlacements: calculateStats('utmPlacement'),
    topKeywords: calculateStats('utmKeyword'),
    topSites: calculateStats('utmSite'),
  };
}

/**
 * Assignment Rules functions
 */
export async function getAllAssignmentRules() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(assignmentRules).orderBy(desc(assignmentRules.priority));
}

export async function createAssignmentRule(rule: InsertAssignmentRule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(assignmentRules).values(rule);
}

export async function updateAssignmentRule(id: number, updates: Partial<InsertAssignmentRule>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(assignmentRules).set(updates).where(eq(assignmentRules.id, id));
}

export async function deleteAssignmentRule(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(assignmentRules).where(eq(assignmentRules.id, id));
}

/**
 * Get managers (users with role=manager)
 */
export async function getAllManagers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(users).where(eq(users.role, "manager"));
}

/**
 * System Settings functions
 */
export async function getSystemSetting(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const results = await db.select().from(systemSettings).where(eq(systemSettings.settingKey, key));
  return results[0] || null;
}

export async function setSystemSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getSystemSetting(key);
  if (existing) {
    await db.update(systemSettings)
      .set({ settingValue: value })
      .where(eq(systemSettings.settingKey, key));
  } else {
    await db.insert(systemSettings).values({ settingKey: key, settingValue: value });
  }
}

/**
 * Auto-assign lead to manager based on rules
 */
export async function autoAssignLead(leadId: number, quizName: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Check if auto-assignment is enabled
  const autoAssignSetting = await getSystemSetting("auto_assign_enabled");
  if (autoAssignSetting?.settingValue !== "true") {
    return null;
  }
  
  // Get active rules, prioritize quiz-specific rules
  const rules = await db.select()
    .from(assignmentRules)
    .where(eq(assignmentRules.isActive, 1))
    .orderBy(desc(assignmentRules.priority));
  
  // Find matching rule (quiz-specific first, then general)
  let matchedRule = rules.find(r => r.quizName === quizName);
  if (!matchedRule) {
    matchedRule = rules.find(r => !r.quizName); // general rule
  }
  
  if (!matchedRule) {
    return null;
  }
  
  // Only proceed if we have a managerId
  if (!matchedRule.managerId) {
    console.warn("[AutoAssign] Matched rule has no managerId:", matchedRule);
    return null;
  }
  
  // Update lead with assigned manager
  await db.update(leads)
    .set({ assignedTo: matchedRule.managerId })
    .where(eq(leads.id, leadId));
  
  // Log assignment history
  await db.insert(assignmentHistory).values({
    leadId,
    managerId: matchedRule.managerId,
    ruleId: matchedRule.id,
    assignedBy: null, // auto-assignment
  });
  
  // Send notification to assigned manager
  if (matchedRule.managerId) {
    try {
      const { notifyManagerAboutLead } = await import("./notifications");
      await notifyManagerAboutLead(matchedRule.managerId, leadId);
    } catch (error) {
      console.warn("[AutoAssign] Failed to notify manager:", error);
    }
  }
  
  return matchedRule.managerId;
}

/**
 * Get assignment history for a lead
 */
export async function getAssignmentHistory(leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(assignmentHistory).where(eq(assignmentHistory.leadId, leadId));
}


/**
 * Get manager performance statistics
 */
export async function getManagerPerformanceStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const managers = await db.select().from(users).where(eq(users.role, "manager"));
  const allLeads = await db.select().from(leads);
  
  const stats = managers.map((manager) => {
    const assignedLeads = allLeads.filter(lead => lead.assignedTo === manager.id);
    const processedLeads = assignedLeads.filter(lead => lead.statusId !== null);
    
    // Calculate average response time (simplified - using createdAt as proxy)
    // In production, you'd track actual response times in activity log
    const responseTimes: number[] = [];
    // For now, we'll use a placeholder calculation
    // TODO: Track actual response times in activity log
    
    const avgResponseTime = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : null;
    
    // Calculate conversion rate (processed / assigned)
    const conversionRate = assignedLeads.length > 0
      ? Math.round((processedLeads.length / assignedLeads.length) * 100)
      : 0;
    
    return {
      managerId: manager.id,
      managerName: manager.name || "Unknown",
      managerEmail: manager.email || "",
      totalAssigned: assignedLeads.length,
      totalProcessed: processedLeads.length,
      avgResponseTime,
      conversionRate,
    };
  });
  
  // Sort by total processed (descending)
  return stats.sort((a, b) => b.totalProcessed - a.totalProcessed);
}


/**
 * Find lead by phone number
 */
export async function getLeadByPhone(phone: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(leads).where(eq(leads.phone, phone)).limit(1);
  return result[0] || null;
}

/**
 * Appointments functions
 */

export async function createAppointment(data: {
  leadId: number;
  managerId: number;
  title: string;
  description?: string;
  scheduledAt: string;
  duration: number;
  meetingLink?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const [result] = await db.insert(appointments).values({
    leadId: data.leadId,
    managerId: data.managerId,
    title: data.title,
    description: data.description || null,
    scheduledAt: new Date(data.scheduledAt),
    duration: data.duration,
    meetingLink: data.meetingLink || null,
    status: 'scheduled',
  });
  return (result as any).insertId as number;
}

export async function getAppointments() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(appointments).orderBy(desc(appointments.scheduledAt));
}

export async function getUpcomingAppointments(managerId?: number) {
  const db = await getDb();
  if (!db) return [];
  
  const now = new Date();
  
  if (managerId) {
    return await db
      .select()
      .from(appointments)
      .where(and(
        gte(appointments.scheduledAt, now),
        eq(appointments.status, 'scheduled'),
        eq(appointments.managerId, managerId)
      ))
      .orderBy(appointments.scheduledAt);
  }
  
  return await db
    .select()
    .from(appointments)
    .where(and(
      gte(appointments.scheduledAt, now),
      eq(appointments.status, 'scheduled')
    ))
    .orderBy(appointments.scheduledAt);
}

export async function updateAppointmentStatus(appointmentId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(appointments).set({ status }).where(eq(appointments.id, appointmentId));
}


// ==================== Services Management ====================

export async function getAllServices() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { services } = await import("../drizzle/schema");
  return db.select().from(services).where(eq(services.isActive, true)).orderBy(services.name);
}

export async function getServiceById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { services } = await import("../drizzle/schema");
  const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createService(data: { name: string; type: string; price: number; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { services } = await import("../drizzle/schema");
  const result = await db.insert(services).values(data);
  return result[0].insertId;
}

export async function updateService(id: number, updates: { name?: string; type?: string; price?: number; description?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { services } = await import("../drizzle/schema");
  await db.update(services).set(updates).where(eq(services.id, id));
}

export async function deleteService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { services } = await import("../drizzle/schema");
  await db.update(services).set({ isActive: false }).where(eq(services.id, id));
}

// ==================== Additional Services Management ====================

export async function getAllAdditionalServices() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { additionalServices } = await import("../drizzle/schema");
  return db.select().from(additionalServices).where(eq(additionalServices.isActive, true)).orderBy(additionalServices.name);
}

export async function createAdditionalService(data: { name: string; price: number; description?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { additionalServices } = await import("../drizzle/schema");
  const result = await db.insert(additionalServices).values(data);
  return result[0].insertId;
}

export async function updateAdditionalService(id: number, updates: { name?: string; price?: number; description?: string; isActive?: boolean }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { additionalServices } = await import("../drizzle/schema");
  await db.update(additionalServices).set(updates).where(eq(additionalServices.id, id));
}

export async function deleteAdditionalService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { additionalServices } = await import("../drizzle/schema");
  await db.update(additionalServices).set({ isActive: false }).where(eq(additionalServices.id, id));
}

// ==================== Sales Management ====================

export async function createSale(data: {
  leadId: number;
  serviceId: number;
  additionalServices?: number[];
  totalAmount: number;
  managerId: number;
  notes?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { sales } = await import("../drizzle/schema");
  const result = await db.insert(sales).values({
    leadId: data.leadId,
    serviceId: data.serviceId,
    additionalServices: data.additionalServices ? JSON.stringify(data.additionalServices) : null,
    totalAmount: data.totalAmount,
    managerId: data.managerId,
    notes: data.notes,
  });
  return result[0].insertId;
}

export async function getAllSales() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { sales } = await import("../drizzle/schema");
  return db.select().from(sales).orderBy(desc(sales.saleDate));
}

export async function getSalesByManager(managerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { sales } = await import("../drizzle/schema");
  return db.select().from(sales).where(eq(sales.managerId, managerId)).orderBy(desc(sales.saleDate));
}

export async function getSaleByLeadId(leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { sales } = await import("../drizzle/schema");
  const result = await db.select().from(sales).where(eq(sales.leadId, leadId)).orderBy(desc(sales.saleDate)).limit(1);
  return result[0] || null;
}

export async function getSalesStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { sales } = await import("../drizzle/schema");
  
  const allSales = await db.select().from(sales);
  const totalRevenue = allSales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalSales = allSales.length;
  
  // Group by manager
  const byManager = allSales.reduce((acc, sale) => {
    if (!acc[sale.managerId]) {
      acc[sale.managerId] = { count: 0, revenue: 0 };
    }
    acc[sale.managerId].count++;
    acc[sale.managerId].revenue += sale.totalAmount;
    return acc;
  }, {} as Record<number, { count: number; revenue: number }>);
  
  // Group by service
  const byService = allSales.reduce((acc, sale) => {
    if (!acc[sale.serviceId]) {
      acc[sale.serviceId] = { count: 0, revenue: 0 };
    }
    acc[sale.serviceId].count++;
    acc[sale.serviceId].revenue += sale.totalAmount;
    return acc;
  }, {} as Record<number, { count: number; revenue: number }>);
  
  return {
    totalRevenue,
    totalSales,
    byManager,
    byService,
  };
}

// ==================== Sales Scripts Management ====================

export async function getAllSalesScripts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesScripts } = await import("../drizzle/schema");
  return db.select().from(salesScripts).orderBy(salesScripts.category, salesScripts.title);
}

export async function getSalesScriptsByCategory(category: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesScripts } = await import("../drizzle/schema");
  return db.select().from(salesScripts).where(eq(salesScripts.category, category)).orderBy(salesScripts.title);
}

export async function createSalesScript(data: { title: string; category: string; content: string; createdBy: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesScripts } = await import("../drizzle/schema");
  const result = await db.insert(salesScripts).values(data);
  return result[0].insertId;
}

export async function updateSalesScript(id: number, updates: { title?: string; category?: string; content?: string }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesScripts } = await import("../drizzle/schema");
  await db.update(salesScripts).set(updates).where(eq(salesScripts.id, id));
}

export async function deleteSalesScript(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { salesScripts } = await import("../drizzle/schema");
  await db.delete(salesScripts).where(eq(salesScripts.id, id));
}

// ==================== Integration Settings Management ====================

export async function getAllIntegrationSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { integrationSettings } = await import("../drizzle/schema");
  return db.select().from(integrationSettings);
}

export async function getIntegrationSettingByProvider(provider: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { integrationSettings } = await import("../drizzle/schema");
  const results = await db
    .select()
    .from(integrationSettings)
    .where(eq(integrationSettings.provider, provider));
  return results[0];
}

export async function saveIntegrationSetting(data: {
  provider: string;
  credentials: string;
  isActive: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { integrationSettings } = await import("../drizzle/schema");
  
  // Check if setting already exists
  const existing = await getIntegrationSettingByProvider(data.provider);
  
  if (existing) {
    // Update existing
    await db
      .update(integrationSettings)
      .set({
        credentials: data.credentials,
        isActive: data.isActive,
        updatedAt: new Date(),
      })
      .where(eq(integrationSettings.provider, data.provider));
    return getIntegrationSettingByProvider(data.provider);
  } else {
    // Insert new
    await db.insert(integrationSettings).values(data);
    return getIntegrationSettingByProvider(data.provider);
  }
}

export async function deleteIntegrationSetting(provider: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { integrationSettings } = await import("../drizzle/schema");
  await db
    .delete(integrationSettings)
    .where(eq(integrationSettings.provider, provider));
}

// ==================== Conversations & Inbound Messages ====================

export async function getAllConversations() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { conversations, leads } = await import("../drizzle/schema");
  
  // Join conversations with leads to get lead info
  const results = await db
    .select({
      id: conversations.id,
      leadId: conversations.leadId,
      leadName: leads.name,
      leadPhone: leads.phone,
      leadEmail: leads.email,
      channel: conversations.channel,
      externalId: conversations.externalId,
      lastMessageAt: conversations.lastMessageAt,
      unreadCount: conversations.unreadCount,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .leftJoin(leads, eq(conversations.leadId, leads.id))
    .orderBy(conversations.lastMessageAt);
    
  return results;
}

export async function getConversationMessages(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { inboundMessages } = await import("../drizzle/schema");
  
  return db
    .select()
    .from(inboundMessages)
    .where(eq(inboundMessages.conversationId, conversationId))
    .orderBy(inboundMessages.receivedAt);
}

export async function markConversationAsRead(conversationId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { conversations, inboundMessages } = await import("../drizzle/schema");
  
  // Mark all messages as read
  await db
    .update(inboundMessages)
    .set({ isRead: true })
    .where(eq(inboundMessages.conversationId, conversationId));
    
  // Reset unread count
  await db
    .update(conversations)
    .set({ unreadCount: 0 })
    .where(eq(conversations.id, conversationId));
}

// ===== Lead Info & Status Management =====

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getLeadStatus(statusId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(leadStatuses).where(eq(leadStatuses.id, statusId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateLeadStatusOnly(leadId: number, statusId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.update(leads).set({ statusId }).where(eq(leads.id, leadId));
}

// ===== Scheduled Messages =====

export async function createScheduledMessage(data: {
  leadId: number;
  channel: string;
  message: string;
  scheduledAt: Date;
  createdBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { scheduledMessages } = await import("../drizzle/schema");
  
  const result = await db.insert(scheduledMessages).values({
    leadId: data.leadId,
    channel: data.channel,
    message: data.message,
    scheduledAt: data.scheduledAt,
    status: "pending",
    createdBy: data.createdBy,
  });
  
  return { id: (result as any).insertId, ...data };
}

export async function getScheduledMessages(leadId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { scheduledMessages } = await import("../drizzle/schema");
  
  if (leadId) {
    return db.select().from(scheduledMessages).where(eq(scheduledMessages.leadId, leadId));
  }
  
  return db.select().from(scheduledMessages);
}

export async function updateScheduledMessageStatus(id: number, status: string, sentAt?: Date, errorMessage?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { scheduledMessages } = await import("../drizzle/schema");
  
  await db.update(scheduledMessages)
    .set({ status, sentAt, errorMessage })
    .where(eq(scheduledMessages.id, id));
}

// ===== Scheduled Calls =====

export async function createScheduledCall(data: {
  leadId: number;
  scheduledAt: Date;
  duration?: number;
  notes?: string;
  createdBy: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { scheduledCalls } = await import("../drizzle/schema");
  
  const result = await db.insert(scheduledCalls).values({
    leadId: data.leadId,
    scheduledAt: data.scheduledAt,
    duration: data.duration || 30,
    notes: data.notes,
    status: "scheduled",
    createdBy: data.createdBy,
  });
  
  return { id: (result as any).insertId, ...data };
}

export async function getScheduledCalls(leadId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { scheduledCalls } = await import("../drizzle/schema");
  
  if (leadId) {
    return db.select().from(scheduledCalls).where(eq(scheduledCalls.leadId, leadId));
  }
  
  return db.select().from(scheduledCalls);
}

export async function updateScheduledCallStatus(id: number, status: string, completedAt?: Date, outcome?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { scheduledCalls } = await import("../drizzle/schema");
  
  await db.update(scheduledCalls)
    .set({ status, completedAt, outcome })
    .where(eq(scheduledCalls.id, id));
}

// ===== Interaction History =====

export async function createInteractionHistory(data: {
  leadId: number;
  type: string;
  channel?: string;
  message?: string;
  direction?: string;
  userId?: number;
  metadata?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { interactionHistory } = await import("../drizzle/schema");
  
  await db.insert(interactionHistory).values({
    leadId: data.leadId,
    type: data.type,
    channel: data.channel,
    message: data.message,
    direction: data.direction,
    userId: data.userId,
    metadata: data.metadata,
  });
}

export async function getInteractionHistory(leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { interactionHistory } = await import("../drizzle/schema");
  
  return db
    .select()
    .from(interactionHistory)
    .where(eq(interactionHistory.leadId, leadId))
    .orderBy(interactionHistory.createdAt);
}

// ============= TEAM MEMBERS =============

export async function getAllTeamMembers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { teamMembers } = await import("../drizzle/schema");
  
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isActive, 1))
    .orderBy(teamMembers.orderIndex);
}

export async function getTeamMemberById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { teamMembers } = await import("../drizzle/schema");
  
  const result = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  
  return result.length > 0 ? result[0] : undefined;
}

export async function createTeamMember(data: {
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  experience?: string;
  metaBlueprintCertified?: number;
  googleAdsCertified?: number;
  tiktokCertified?: number;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  orderIndex?: number;
  isActive?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { teamMembers } = await import("../drizzle/schema");
  
  const result = await db.insert(teamMembers).values({
    name: data.name,
    position: data.position,
    bio: data.bio,
    photoUrl: data.photoUrl,
    experience: data.experience,
    metaBlueprintCertified: data.metaBlueprintCertified ?? 0,
    googleAdsCertified: data.googleAdsCertified ?? 0,
    tiktokCertified: data.tiktokCertified ?? 0,
    linkedinUrl: data.linkedinUrl,
    facebookUrl: data.facebookUrl,
    instagramUrl: data.instagramUrl,
    telegramUrl: data.telegramUrl,
    orderIndex: data.orderIndex ?? 0,
    isActive: data.isActive ?? 1,
  });
  
  return result;
}

export async function updateTeamMember(id: number, updates: {
  name?: string;
  position?: string;
  bio?: string;
  photoUrl?: string;
  experience?: string;
  metaBlueprintCertified?: number;
  googleAdsCertified?: number;
  tiktokCertified?: number;
  linkedinUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  telegramUrl?: string;
  orderIndex?: number;
  isActive?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { teamMembers } = await import("../drizzle/schema");
  
  return db
    .update(teamMembers)
    .set(updates)
    .where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { teamMembers } = await import("../drizzle/schema");
  
  return db.delete(teamMembers).where(eq(teamMembers.id, id));
}

export async function updateTeamMemberOrder(updates: { id: number; orderIndex: number }[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const { teamMembers } = await import("../drizzle/schema");
  
  // Update each team member's order
  for (const update of updates) {
    await db
      .update(teamMembers)
      .set({ orderIndex: update.orderIndex })
      .where(eq(teamMembers.id, update.id));
  }
  
  return { success: true };
}
