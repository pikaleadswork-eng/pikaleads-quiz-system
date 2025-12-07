import { sendTelegramMessage as sendTelegramBotMessage } from "./telegramBot";
import { ENV } from "./_core/env";

export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!ENV.telegramBotToken || !ENV.telegramChatId) {
    console.error("[Telegram] Missing credentials");
    return false;
  }

  const result = await sendTelegramBotMessage(ENV.telegramChatId, message);
  return result.success;
}

export function formatLeadMessage(data: {
  quizName: string;
  answers: string;
  name: string;
  phone: string;
  telegram?: string | null;
}): string {
  const answersArray = JSON.parse(data.answers);
  const answersText = answersArray.map((answer: string, index: number) => 
    `${index + 1}. ${answer}`
  ).join("\n");

  return `
🎯 <b>New Lead from PIKALEADS Quiz</b>

📋 <b>Quiz:</b> ${data.quizName}

👤 <b>Contact Information:</b>
• Name: ${data.name}
• Phone: ${data.phone}
${data.telegram ? `• Telegram: ${data.telegram}` : ""}

💬 <b>Answers:</b>
${answersText}

⏰ <b>Time:</b> ${new Date().toLocaleString("en-US", { timeZone: "UTC" })}
  `.trim();
}
