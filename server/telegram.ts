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

export interface LeadData {
  quizName: string;
  answers: string;
  questions?: string; // JSON string of questions
  name: string;
  phone: string;
  telegram?: string | null;
  email?: string | null;
  // UTM parameters
  utmCampaign?: string | null;
  utmAdGroup?: string | null;
  utmAd?: string | null;
  utmPlacement?: string | null;
  utmKeyword?: string | null;
  utmSite?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmContent?: string | null;
  utmTerm?: string | null;
}

export function formatLeadMessage(data: LeadData): string {
  const answersRaw = JSON.parse(data.answers);
  let questionsArray: string[] = [];
  
  // Parse questions if available
  if (data.questions) {
    try {
      questionsArray = JSON.parse(data.questions);
    } catch (e) {
      console.warn("[Telegram] Failed to parse questions:", e);
    }
  }
  
  // Format Q&A section - handle both formats:
  // 1. New format: [{question: "...", answer: "..."}, ...]
  // 2. Old format: ["answer1", "answer2", ...]
  let qaText = "";
  
  if (Array.isArray(answersRaw) && answersRaw.length > 0) {
    // Check if it's the new format (array of objects)
    if (typeof answersRaw[0] === "object" && answersRaw[0] !== null && "question" in answersRaw[0]) {
      // New format: [{question: "...", answer: "..."}, ...]
      qaText = answersRaw.map((item: { question: string; answer: string }, index: number) => 
        `<b>Q${index + 1}:</b> ${item.question}\n<b>A${index + 1}:</b> ${item.answer}`
      ).join("\n\n");
    } else if (questionsArray.length > 0 && questionsArray.length === answersRaw.length) {
      // Old format with separate questions array
      qaText = answersRaw.map((answer: string, index: number) => 
        `<b>Q${index + 1}:</b> ${questionsArray[index]}\n<b>A${index + 1}:</b> ${answer}`
      ).join("\n\n");
    } else {
      // Fallback to just answers (convert objects to strings if needed)
      qaText = answersRaw.map((answer: any, index: number) => {
        const answerText = typeof answer === "object" ? JSON.stringify(answer) : String(answer);
        return `${index + 1}. ${answerText}`;
      }).join("\n");
    }
  }

  // Build contact section
  let contactInfo = `• 👤 <b>Ім'я:</b> ${data.name}\n`;
  contactInfo += `• 📱 <b>Телефон:</b> ${data.phone}\n`;
  if (data.email) {
    contactInfo += `• 📧 <b>Email:</b> ${data.email}\n`;
  }
  if (data.telegram) {
    contactInfo += `• 💬 <b>Telegram:</b> ${data.telegram}\n`;
  }

  // Build UTM section
  let utmInfo = "";
  const hasUtm = data.utmCampaign || data.utmAdGroup || data.utmAd || 
                 data.utmPlacement || data.utmKeyword || data.utmSite ||
                 data.utmSource || data.utmMedium || data.utmContent || data.utmTerm;
  
  if (hasUtm) {
    utmInfo = "\n\n📊 <b>UTM Мітки:</b>\n";
    if (data.utmCampaign) utmInfo += `• 🎯 <b>Кампанія:</b> ${data.utmCampaign}\n`;
    if (data.utmAdGroup) utmInfo += `• 📁 <b>Група оголошень:</b> ${data.utmAdGroup}\n`;
    if (data.utmAd) utmInfo += `• 📢 <b>Оголошення:</b> ${data.utmAd}\n`;
    if (data.utmPlacement) utmInfo += `• 📍 <b>Плейсмент (Source):</b> ${data.utmPlacement}\n`;
    if (data.utmKeyword) utmInfo += `• 🔑 <b>Ключовий запит:</b> ${data.utmKeyword}\n`;
    if (data.utmSite) utmInfo += `• 🌐 <b>Сайт показу:</b> ${data.utmSite}\n`;
    if (data.utmSource) utmInfo += `• 📤 <b>UTM Source:</b> ${data.utmSource}\n`;
    if (data.utmMedium) utmInfo += `• 🔗 <b>UTM Medium:</b> ${data.utmMedium}\n`;
    if (data.utmContent) utmInfo += `• 📝 <b>UTM Content:</b> ${data.utmContent}\n`;
    if (data.utmTerm) utmInfo += `• 🏷 <b>UTM Term:</b> ${data.utmTerm}\n`;
  }

  return `
🎯 <b>Новий Лід з PIKALEADS Quiz</b>

📋 <b>Квіз:</b> ${data.quizName}

👥 <b>Контактна інформація:</b>
${contactInfo}

💬 <b>Відповіді на питання:</b>
${qaText}${utmInfo}

⏰ <b>Час:</b> ${new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" })}
  `.trim();
}
