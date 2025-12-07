import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramMessage(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error("[Telegram] Missing credentials");
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await axios.post(url, {
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    });

    return response.data.ok === true;
  } catch (error) {
    console.error("[Telegram] Failed to send message:", error);
    return false;
  }
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
