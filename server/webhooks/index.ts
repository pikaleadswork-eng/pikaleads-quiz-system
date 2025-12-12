export {
  verifyWhatsAppWebhook as handleWhatsAppWebhookVerification,
  handleWhatsAppWebhook as handleWhatsAppWebhookPost,
} from "./whatsapp";

export {
  verifyInstagramWebhook as handleInstagramWebhookVerification,
  handleInstagramWebhook as handleInstagramWebhookPost,
} from "./instagram";

// Telegram webhook is handled separately in telegramBot.ts
export const handleTelegramWebhook = async (req: any, res: any) => {
  res.status(200).send("Telegram webhook not implemented in this file");
};
