import { getDb } from "../db";
import { calendarEvents, eventNotifications, users } from "../../drizzle/schema";
import { eq, and, lte, isNull } from "drizzle-orm";
import { sendEventReminder } from "../_core/telegramNotification";

/**
 * Check for pending event notifications and send them
 * Should be called every minute via cron
 */
export async function processEventNotifications() {
  const db = await getDb();
  if (!db) {
    console.error("[EventNotifications] Database not available");
    return;
  }

  const now = new Date();

  try {
    // Find pending notifications that should be sent now
    const pendingNotifications = await db
      .select({
        notificationId: eventNotifications.id,
        eventId: eventNotifications.eventId,
        userId: eventNotifications.userId,
        notificationType: eventNotifications.notificationType,
        eventTitle: calendarEvents.title,
        eventStartTime: calendarEvents.startTime,
        eventMeetingLink: calendarEvents.meetingLink,
        leadName: calendarEvents.leadId,
        userName: users.name,
        userEmail: users.email,
      })
      .from(eventNotifications)
      .innerJoin(calendarEvents, eq(eventNotifications.eventId, calendarEvents.id))
      .innerJoin(users, eq(eventNotifications.userId, users.id))
      .where(
        and(
          eq(eventNotifications.status, "pending"),
          lte(eventNotifications.scheduledFor, now),
          eq(calendarEvents.status, "scheduled") // Only send for scheduled events
        )
      )
      .limit(50); // Process max 50 at a time

    console.log(`[EventNotifications] Found ${pendingNotifications.length} pending notifications`);

    for (const notification of pendingNotifications) {
      try {
        // Get user's telegram chat ID from env or user table
        // For now, use TELEGRAM_CHAT_ID from env
        const chatId = process.env.TELEGRAM_CHAT_ID;
        
        if (!chatId) {
          console.warn(`[EventNotifications] No telegram chat ID for user ${notification.userId}`);
          await db
            .update(eventNotifications)
            .set({
              status: "failed",
              errorMessage: "No telegram chat ID configured",
            })
            .where(eq(eventNotifications.id, notification.notificationId));
          continue;
        }

        // Send Telegram notification
        const success = await sendEventReminder({
          chatId,
          managerName: notification.userName,
          eventTitle: notification.eventTitle,
          startTime: notification.eventStartTime,
          meetingLink: notification.eventMeetingLink || undefined,
        });

        if (success) {
          // Mark as sent
          await db
            .update(eventNotifications)
            .set({
              status: "sent",
              sentAt: new Date(),
            })
            .where(eq(eventNotifications.id, notification.notificationId));
          
          console.log(`[EventNotifications] Sent notification ${notification.notificationId} for event ${notification.eventId}`);
        } else {
          // Mark as failed
          await db
            .update(eventNotifications)
            .set({
              status: "failed",
              errorMessage: "Failed to send Telegram message",
            })
            .where(eq(eventNotifications.id, notification.notificationId));
          
          console.error(`[EventNotifications] Failed to send notification ${notification.notificationId}`);
        }
      } catch (error) {
        console.error(`[EventNotifications] Error processing notification ${notification.notificationId}:`, error);
        
        await db
          .update(eventNotifications)
          .set({
            status: "failed",
            errorMessage: error instanceof Error ? error.message : "Unknown error",
          })
          .where(eq(eventNotifications.id, notification.notificationId));
      }
    }
  } catch (error) {
    console.error("[EventNotifications] Error in processEventNotifications:", error);
  }
}

/**
 * Start the cron job (runs every minute)
 */
export function startEventNotificationsCron() {
  console.log("[EventNotifications] Starting cron job (every minute)");
  
  // Run immediately on startup
  processEventNotifications();
  
  // Then run every minute
  setInterval(processEventNotifications, 60 * 1000);
}
