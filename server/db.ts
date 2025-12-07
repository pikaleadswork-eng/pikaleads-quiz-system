import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, abTestVariants, abTestAssignments, incompleteQuizSessions, InsertABTestVariant, InsertABTestAssignment, InsertIncompleteQuizSession, leadStatuses, InsertLeadStatus, leadComments, InsertLeadComment, activityLog, InsertActivityLog, messages, InsertMessage, assignmentRules, InsertAssignmentRule, assignmentHistory, systemSettings } from "../drizzle/schema";
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
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
    const result = await db.select().from(leads).orderBy(leads.createdAt);
    return result;
  } catch (error) {
    console.error("[Database] Failed to get leads:", error);
    return [];
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
  return await db.select().from(leadComments).where(eq(leadComments.leadId, leadId));
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
  await db.update(leads).set({ statusId }).where(eq(leads.id, leadId));
  
  // Log activity
  await logActivity({
    userId,
    leadId,
    action: "status_change",
    details: JSON.stringify({ newStatusId: statusId }),
  });
}

export async function assignLeadToManager(leadId: number, managerId: number, adminId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set({ assignedTo: managerId }).where(eq(leads.id, leadId));
  
  // Log activity
  await logActivity({
    userId: adminId,
    leadId,
    action: "lead_assigned",
    details: JSON.stringify({ managerId }),
  });
}

/**
 * Manager Invitation functions
 */
import { managerInvitations, InsertManagerInvitation } from "../drizzle/schema";

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
  
  // Assign lead to manager
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
  try {
    const { notifyManagerAboutLead } = await import("./notifications");
    await notifyManagerAboutLead(matchedRule.managerId, leadId);
  } catch (error) {
    console.warn("[AutoAssign] Failed to notify manager:", error);
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
