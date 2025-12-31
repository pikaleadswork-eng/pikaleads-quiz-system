import { sendTelegramMessage } from "../telegramBot.js";
import { ENV } from "../_core/env.js";

const ALERT_CHAT_ID = ENV.telegramChatId;

/**
 * Send critical error alert to Telegram
 */
export async function sendCriticalErrorAlert(error: {
  type: string;
  message: string;
  stack?: string;
  endpoint?: string;
  timestamp: string;
}) {
  if (!ALERT_CHAT_ID) {
    console.warn("[Alert System] TELEGRAM_CHAT_ID not configured");
    return;
  }

  const alertMessage = `
🚨 <b>CRITICAL ERROR ALERT</b> 🚨

<b>Type:</b> ${error.type}
<b>Message:</b> ${error.message}
<b>Endpoint:</b> ${error.endpoint || "N/A"}
<b>Time:</b> ${error.timestamp}

<b>Stack Trace:</b>
<code>${error.stack?.substring(0, 500) || "No stack trace"}</code>

<i>Server: PIKALEADS Lead Engine</i>
  `.trim();

  try {
    await sendTelegramMessage(ALERT_CHAT_ID, alertMessage);
    console.log("[Alert System] Critical error alert sent to Telegram");
  } catch (telegramError) {
    console.error("[Alert System] Failed to send Telegram alert:", telegramError);
  }
}

/**
 * Send server restart notification
 */
export async function sendServerRestartAlert(reason: string) {
  if (!ALERT_CHAT_ID) return;

  const alertMessage = `
🔄 <b>SERVER RESTART</b>

<b>Reason:</b> ${reason}
<b>Time:</b> ${new Date().toISOString()}

<i>Server: PIKALEADS Lead Engine</i>
<i>Status: Restarting...</i>
  `.trim();

  try {
    await sendTelegramMessage(ALERT_CHAT_ID, alertMessage);
    console.log("[Alert System] Server restart alert sent to Telegram");
  } catch (error) {
    console.error("[Alert System] Failed to send restart alert:", error);
  }
}

/**
 * Send server health degradation alert
 */
export async function sendHealthDegradationAlert(metrics: {
  memoryUsage: string;
  dbStatus: string;
  responseTime: string;
}) {
  if (!ALERT_CHAT_ID) return;

  const alertMessage = `
⚠️ <b>SERVER HEALTH DEGRADATION</b>

<b>Memory Usage:</b> ${metrics.memoryUsage}
<b>Database Status:</b> ${metrics.dbStatus}
<b>Response Time:</b> ${metrics.responseTime}
<b>Time:</b> ${new Date().toISOString()}

<i>Server: PIKALEADS Lead Engine</i>
<i>Action: Monitoring closely</i>
  `.trim();

  try {
    await sendTelegramMessage(ALERT_CHAT_ID, alertMessage);
    console.log("[Alert System] Health degradation alert sent to Telegram");
  } catch (error) {
    console.error("[Alert System] Failed to send health alert:", error);
  }
}

/**
 * Send daily health report
 */
export async function sendDailyHealthReport(stats: {
  uptime: string;
  totalErrors: number;
  totalLeads: number;
  memoryUsage: string;
  dbStatus: string;
}) {
  if (!ALERT_CHAT_ID) return;

  const alertMessage = `
📊 <b>DAILY HEALTH REPORT</b>

<b>Uptime:</b> ${stats.uptime}
<b>Total Errors (24h):</b> ${stats.totalErrors}
<b>New Leads (24h):</b> ${stats.totalLeads}
<b>Memory Usage:</b> ${stats.memoryUsage}
<b>Database:</b> ${stats.dbStatus}

<i>Server: PIKALEADS Lead Engine</i>
<i>Date: ${new Date().toLocaleDateString("uk-UA")}</i>
  `.trim();

  try {
    await sendTelegramMessage(ALERT_CHAT_ID, alertMessage);
    console.log("[Alert System] Daily health report sent to Telegram");
  } catch (error) {
    console.error("[Alert System] Failed to send daily report:", error);
  }
}
