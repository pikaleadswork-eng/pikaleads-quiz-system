import axios from "axios";
import { ENV } from "./_core/env";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${ENV.telegramBotToken}`;

export interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    first_name: string;
    username?: string;
    type: string;
  };
  date: number;
  text?: string;
}

export interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
}

/**
 * Send a message to a Telegram user or chat
 */
export async function sendTelegramMessage(chatId: string | number, text: string): Promise<{ success: boolean; messageId?: number; error?: string }> {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
    });

    if (response.data.ok) {
      return {
        success: true,
        messageId: response.data.result.message_id,
      };
    } else {
      return {
        success: false,
        error: response.data.description || "Unknown error",
      };
    }
  } catch (error: any) {
    console.error("[Telegram Bot] Failed to send message:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.description || error.message,
    };
  }
}

/**
 * Get updates from Telegram Bot API (polling)
 */
export async function getTelegramUpdates(offset?: number): Promise<TelegramUpdate[]> {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getUpdates`, {
      params: {
        offset,
        timeout: 30,
      },
    });

    if (response.data.ok) {
      return response.data.result;
    } else {
      console.error("[Telegram Bot] Failed to get updates:", response.data);
      return [];
    }
  } catch (error: any) {
    console.error("[Telegram Bot] Failed to get updates:", error.message);
    return [];
  }
}

/**
 * Set webhook for Telegram Bot (for production use)
 */
export async function setTelegramWebhook(webhookUrl: string): Promise<boolean> {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, {
      url: webhookUrl,
    });

    if (response.data.ok) {
      console.log("[Telegram Bot] Webhook set successfully");
      return true;
    } else {
      console.error("[Telegram Bot] Failed to set webhook:", response.data);
      return false;
    }
  } catch (error: any) {
    console.error("[Telegram Bot] Failed to set webhook:", error.message);
    return false;
  }
}

/**
 * Delete webhook (switch back to polling)
 */
export async function deleteTelegramWebhook(): Promise<boolean> {
  try {
    const response = await axios.post(`${TELEGRAM_API_URL}/deleteWebhook`);

    if (response.data.ok) {
      console.log("[Telegram Bot] Webhook deleted successfully");
      return true;
    } else {
      console.error("[Telegram Bot] Failed to delete webhook:", response.data);
      return false;
    }
  } catch (error: any) {
    console.error("[Telegram Bot] Failed to delete webhook:", error.message);
    return false;
  }
}

/**
 * Get bot information
 */
export async function getTelegramBotInfo(): Promise<any> {
  try {
    const response = await axios.get(`${TELEGRAM_API_URL}/getMe`);

    if (response.data.ok) {
      return response.data.result;
    } else {
      console.error("[Telegram Bot] Failed to get bot info:", response.data);
      return null;
    }
  } catch (error: any) {
    console.error("[Telegram Bot] Failed to get bot info:", error.message);
    return null;
  }
}
