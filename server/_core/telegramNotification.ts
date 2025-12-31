import { ENV } from "./env";

interface TelegramMessage {
  chatId: string;
  text: string;
  parseMode?: "HTML" | "Markdown";
}

/**
 * Send Telegram notification to user
 * Uses TELEGRAM_BOT_TOKEN and user's telegram chat ID
 */
export async function sendTelegramNotification(
  message: TelegramMessage
): Promise<boolean> {
  const botToken = ENV.telegramBotToken;
  
  if (!botToken) {
    console.error("[Telegram] Bot token not configured");
    return false;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: message.chatId,
          text: message.text,
          parse_mode: message.parseMode || "HTML",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("[Telegram] Failed to send notification:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[Telegram] Error sending notification:", error);
    return false;
  }
}

/**
 * Send event reminder to manager
 */
export async function sendEventReminder(params: {
  chatId: string;
  managerName: string;
  eventTitle: string;
  startTime: Date;
  leadName?: string;
  meetingLink?: string;
}): Promise<boolean> {
  const { chatId, managerName, eventTitle, startTime, leadName, meetingLink } = params;
  
  const timeStr = startTime.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });

  let text = `🔔 <b>Нагадування про дзвінок</b>\n\n`;
  text += `👤 <b>${managerName}</b>\n`;
  text += `📅 <b>${eventTitle}</b>\n`;
  text += `⏰ Початок: <b>${timeStr}</b> (через 15 хвилин)\n`;
  
  if (leadName) {
    text += `👥 Клієнт: <b>${leadName}</b>\n`;
  }
  
  if (meetingLink) {
    text += `\n🔗 <a href="${meetingLink}">Приєднатися до зустрічі</a>`;
  }

  return sendTelegramNotification({
    chatId,
    text,
    parseMode: "HTML",
  });
}
