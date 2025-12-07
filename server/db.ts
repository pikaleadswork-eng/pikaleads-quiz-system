import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, leads, InsertLead, abTestVariants, abTestAssignments, incompleteQuizSessions, InsertABTestVariant, InsertABTestAssignment, InsertIncompleteQuizSession, leadStatuses, InsertLeadStatus, leadComments, InsertLeadComment, activityLog, InsertActivityLog, messages, InsertMessage } from "../drizzle/schema";
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
    return result;
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
