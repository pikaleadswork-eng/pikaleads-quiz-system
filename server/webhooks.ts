import { Request, Response } from "express";
import { handleInstagramWebhook } from "./instagramDirect";
import { createMessage } from "./db";

/**
 * Telegram Bot Webhook Handler
 * Receives incoming messages from Telegram Bot API
 */
export async function handleTelegramWebhook(req: Request, res: Response) {
  try {
    const update = req.body;
    
    // Verify webhook (optional but recommended)
    const secretToken = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secretToken) {
      const receivedToken = req.headers["x-telegram-bot-api-secret-token"];
      if (receivedToken !== secretToken) {
        console.warn("[Webhook] Invalid Telegram webhook token");
        return res.status(403).json({ error: "Forbidden" });
      }
    }
    
    // Handle incoming message
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id.toString();
      const messageText = update.message.text;
      const username = update.message.from?.username || update.message.from?.first_name || "Unknown";
      
      console.log(`[Webhook] Telegram message from ${username}: ${messageText}`);
      
      // Try to find lead by telegram username
      const { getLeadByTelegram } = await import("./db");
      const lead = await getLeadByTelegram(chatId);
      
      if (lead) {
        // Store incoming message
        await createMessage({
          leadId: lead.id,
          platform: "telegram",
          direction: "inbound",
          message: messageText,
          sentBy: null,
          externalId: update.message.message_id?.toString() || null,
        });
        
        console.log(`[Webhook] Stored message for lead ${lead.id}`);
      } else {
        console.warn(`[Webhook] No lead found for Telegram chat ${chatId}`);
      }
    }
    
    // Always return 200 OK to Telegram
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error("[Webhook] Telegram webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Instagram Webhook Handler
 * Receives incoming messages from Instagram Graph API
 */
export async function handleInstagramWebhookPost(req: Request, res: Response) {
  try {
    const payload = req.body;
    
    // Parse Instagram webhook payload
    const messages = handleInstagramWebhook(payload);
    
    if (messages.length > 0) {
      console.log(`[Webhook] Received ${messages.length} Instagram messages`);
      
      // Store each message
      for (const msg of messages) {
        // Try to find lead by Instagram username
        const { getLeadByInstagram } = await import("./db");
        const lead = await getLeadByInstagram(msg.from.username);
        
        if (lead) {
          await createMessage({
            leadId: lead.id,
            platform: "instagram",
            direction: "inbound",
            message: msg.message,
            sentBy: null,
            externalId: msg.id,
          });
          
          console.log(`[Webhook] Stored Instagram message for lead ${lead.id}`);
        } else {
          console.warn(`[Webhook] No lead found for Instagram user ${msg.from.username}`);
        }
      }
    }
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Webhook] Instagram webhook error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Instagram Webhook Verification (GET request)
 * Required by Instagram to verify webhook endpoint
 */
export function handleInstagramWebhookVerification(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  
  const verifyToken = process.env.INSTAGRAM_WEBHOOK_VERIFY_TOKEN || "pikaleads_verify_token";
  
  if (mode === "subscribe" && token === verifyToken) {
    console.log("[Webhook] Instagram webhook verified");
    res.status(200).send(challenge);
  } else {
    console.warn("[Webhook] Instagram webhook verification failed");
    res.status(403).json({ error: "Forbidden" });
  }
}
