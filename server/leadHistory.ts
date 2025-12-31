import { getDb } from "./db";
import { leadHistory, leads, users } from "../drizzle/schema";
import { eq, and, gte, lte, isNull, desc } from "drizzle-orm";

/**
 * Log a change to a lead field
 */
export async function logLeadChange(params: {
  leadId: number;
  userId: number;
  field: string;
  oldValue: string | null;
  newValue: string | null;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[LeadHistory] Database not available");
    return;
  }

  try {
    await db.insert(leadHistory).values({
      leadId: params.leadId,
      userId: params.userId,
      field: params.field,
      oldValue: params.oldValue,
      newValue: params.newValue,
    });
  } catch (error) {
    console.error("[LeadHistory] Failed to log change:", error);
  }
}

/**
 * Get lead change history with user names
 */
export async function getLeadHistory(leadId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[LeadHistory] Database not available");
    return [];
  }

  const history = await db
    .select({
      id: leadHistory.id,
      field: leadHistory.field,
      oldValue: leadHistory.oldValue,
      newValue: leadHistory.newValue,
      changedAt: leadHistory.changedAt,
      userId: leadHistory.userId,
      userName: users.name,
    })
    .from(leadHistory)
    .leftJoin(users, eq(leadHistory.userId, users.id))
    .where(eq(leadHistory.leadId, leadId))
    .orderBy(leadHistory.changedAt);

  return history;
}

/**
 * Compare old and new lead data and log all changes
 */
export async function logLeadChanges(params: {
  leadId: number;
  userId: number;
  oldData: any;
  newData: any;
}) {
  const { leadId, userId, oldData, newData } = params;

  const fieldsToTrack = [
    "status",
    "assignedTo",
    "name",
    "phone",
    "email",
    "telegram",
    "notes",
    "source",
  ];

  for (const field of fieldsToTrack) {
    const oldValue = oldData[field];
    const newValue = newData[field];

    if (oldValue !== newValue) {
      await logLeadChange({
        leadId,
        userId,
        field,
        oldValue: oldValue ? String(oldValue) : null,
        newValue: newValue ? String(newValue) : null,
      });
    }
  }
}
