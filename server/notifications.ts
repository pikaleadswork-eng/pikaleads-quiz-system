/**
 * Lead Notification System
 * Sends notifications to managers when leads are assigned
 */

import { getDb } from "./db";
import { users, leads } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Notify manager about new lead assignment
 */
export async function notifyManagerAboutLead(managerId: number, leadId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  // Get manager details
  const manager = await db.select().from(users).where(eq(users.id, managerId)).limit(1);
  if (!manager || manager.length === 0) {
    console.warn(`[Notifications] Manager ${managerId} not found`);
    return false;
  }
  
  // Get lead details
  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead || lead.length === 0) {
    console.warn(`[Notifications] Lead ${leadId} not found`);
    return false;
  }
  
  const managerData = manager[0];
  const leadData = lead[0];
  
  // Try to send email notification
  let emailSent = false;
  if (managerData.email) {
    try {
      const { sendEmail } = await import("./email");
      const result = await sendEmail({
        to: managerData.email,
        subject: `New Lead Assigned: ${leadData.name}`,
        html: `
          <h2>New Lead Assigned</h2>
          <p>Hi ${managerData.name || "Manager"},</p>
          <p>A new lead has been assigned to you:</p>
          <ul>
            <li><strong>Name:</strong> ${leadData.name}</li>
            <li><strong>Phone:</strong> ${leadData.phone}</li>
            <li><strong>Email:</strong> ${leadData.email || "N/A"}</li>
            <li><strong>Quiz:</strong> ${leadData.quizName}</li>
            <li><strong>Score:</strong> ${leadData.leadScore || 0}/100</li>
          </ul>
          <p>Please log in to the CRM to view full details and follow up.</p>
          <p><a href="${process.env.VITE_OAUTH_PORTAL_URL || "https://your-domain.com"}/crm">Open CRM</a></p>
        `,
      });
      emailSent = result.success;
    } catch (error) {
      console.warn("[Notifications] Email notification failed:", error);
    }
  }
  
  // Try to send Telegram notification (if manager has telegram username)
  let telegramSent = false;
  if (managerData.email && managerData.email.includes("@telegram")) {
    // This is a placeholder - in production you'd need manager's telegram chat ID
    console.log("[Notifications] Telegram notification would be sent to", managerData.name);
  }
  
  return emailSent || telegramSent;
}
