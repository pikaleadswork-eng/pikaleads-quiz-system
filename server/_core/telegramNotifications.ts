/**
 * Telegram Notifications for New Leads
 * 
 * Sends formatted notifications to Telegram when new leads are created.
 * Uses the existing TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID from env.
 */

import { ENV } from "./env";

interface LeadNotificationData {
  quizName: string;
  firstName: string;
  lastName?: string;
  phone: string;
  telegram?: string;
  email?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  assignedManager?: string;
  leadScore?: number;
}

/**
 * Format lead data as Telegram message
 */
function formatLeadMessage(data: LeadNotificationData): string {
  const lines: string[] = [];

  lines.push("🎯 *Новий лід!*");
  lines.push("");
  lines.push(`📋 *Квіз:* ${data.quizName}`);
  lines.push(`👤 *Ім'я:* ${data.firstName}`);
  
  if (data.lastName) {
    lines.push(`👤 *Прізвище:* ${data.lastName}`);
  }

  lines.push(`📞 *Телефон:* ${data.phone}`);

  if (data.telegram) {
    lines.push(`💬 *Telegram:* @${data.telegram.replace("@", "")}`);
  }

  if (data.email) {
    lines.push(`📧 *Email:* ${data.email}`);
  }

  if (data.leadScore !== undefined) {
    lines.push(`⭐ *Lead Score:* ${data.leadScore}/100`);
  }

  // UTM parameters
  if (
    data.utmSource ||
    data.utmMedium ||
    data.utmCampaign ||
    data.utmContent ||
    data.utmTerm
  ) {
    lines.push("");
    lines.push("📊 *UTM мітки:*");
    if (data.utmSource) lines.push(`  • Source: ${data.utmSource}`);
    if (data.utmMedium) lines.push(`  • Medium: ${data.utmMedium}`);
    if (data.utmCampaign) lines.push(`  • Campaign: ${data.utmCampaign}`);
    if (data.utmContent) lines.push(`  • Content: ${data.utmContent}`);
    if (data.utmTerm) lines.push(`  • Term: ${data.utmTerm}`);
  }

  if (data.assignedManager) {
    lines.push("");
    lines.push(`👨‍💼 *Відповідальний менеджер:* ${data.assignedManager}`);
  }

  lines.push("");
  lines.push(`🕐 ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" })}`);

  return lines.join("\n");
}

/**
 * Send lead notification to Telegram
 * 
 * @param leadData - Lead information to send
 * @returns True if notification was sent successfully
 */
export async function sendLeadNotification(
  leadData: LeadNotificationData
): Promise<boolean> {
  const botToken = ENV.telegramBotToken;
  const chatId = ENV.telegramChatId;

  if (!botToken || !chatId) {
    console.warn(
      "[Telegram] Bot token or chat ID not configured, skipping notification"
    );
    return false;
  }

  try {
    const message = formatLeadMessage(leadData);

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[Telegram] Failed to send notification:", error);
      return false;
    }

    console.log("[Telegram] Lead notification sent successfully");
    return true;
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    return false;
  }
}

/**
 * Send reminder notification to Telegram
 * 
 * @param reminderData - Reminder information
 * @returns True if notification was sent successfully
 */
export async function sendReminderNotification(reminderData: {
  title: string;
  message: string;
  leadName?: string;
  leadPhone?: string;
  type: string;
}): Promise<boolean> {
  const botToken = ENV.telegramBotToken;
  const chatId = ENV.telegramChatId;

  if (!botToken || !chatId) {
    console.warn("[Telegram] Bot token or chat ID not configured");
    return false;
  }

  try {
    const lines: string[] = [];
    
    // Icon based on type
    const icon = reminderData.type === "call" ? "📞" : 
                 reminderData.type === "meeting" ? "🎥" : "⏰";
    
    lines.push(`${icon} *Нагадування*`);
    lines.push("");
    lines.push(`*${reminderData.title}*`);
    
    if (reminderData.message) {
      lines.push("");
      lines.push(reminderData.message);
    }

    if (reminderData.leadName) {
      lines.push("");
      lines.push(`👤 *Лід:* ${reminderData.leadName}`);
    }

    if (reminderData.leadPhone) {
      lines.push(`📞 *Телефон:* ${reminderData.leadPhone}`);
    }

    const message = lines.join("\n");

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("[Telegram] Failed to send reminder:", error);
      return false;
    }

    console.log("[Telegram] Reminder notification sent successfully");
    return true;
  } catch (error) {
    console.error("[Telegram] Error sending reminder:", error);
    return false;
  }
}

/**
 * Test Telegram bot configuration
 * 
 * @returns True if bot is configured and working
 */
export async function testTelegramBot(): Promise<boolean> {
  const botToken = ENV.telegramBotToken;

  if (!botToken) {
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/getMe`
    );

    return response.ok;
  } catch (error) {
    console.error("[Telegram] Bot test failed:", error);
    return false;
  }
}
