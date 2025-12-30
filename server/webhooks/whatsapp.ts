import type { Request, Response } from "express";
import crypto from "crypto";
import { getDb } from "../db";
import { conversations, inboundMessages, leads } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getIntegrationSettingByProvider } from "../db";

/**
 * WhatsApp Webhook Verification (GET)
 * Meta sends this to verify webhook URL
 */
export async function verifyWhatsAppWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Get verify token from integration settings
  const settings = await getIntegrationSettingByProvider("whatsapp");
  if (!settings) {
    return res.status(403).send("WhatsApp integration not configured");
  }

  const credentials = JSON.parse(settings.credentials);
  const VERIFY_TOKEN = credentials.verifyToken || "PIKALEADS_WEBHOOK_VERIFY";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[WhatsApp Webhook] Verification successful");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }
}

/**
 * WhatsApp Webhook Handler (POST)
 * Receives incoming messages from WhatsApp Business API
 */
export async function handleWhatsAppWebhook(req: Request, res: Response) {
  try {
    const body = req.body;

    // Verify webhook signature
    const signature = req.headers["x-hub-signature-256"] as string;
    if (!verifySignature(req.body, signature)) {
      return res.status(401).send("Invalid signature");
    }

    // Process webhook payload
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            await processWhatsAppMessage(change.value);
          }
        }
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("[WhatsApp Webhook] Error:", error);
    res.status(500).send("Internal server error");
  }
}

/**
 * Verify webhook signature from Meta
 */
function verifySignature(payload: any, signature: string): boolean {
  if (!signature) return false;

  try {
    const settings = getIntegrationSettingByProvider("whatsapp");
    if (!settings) return false;

    const credentials = JSON.parse((settings as any).credentials);
    const APP_SECRET = credentials.appSecret;

    const expectedSignature =
      "sha256=" +
      crypto
        .createHmac("sha256", APP_SECRET)
        .update(JSON.stringify(payload))
        .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch (error) {
    console.error("[WhatsApp] Signature verification error:", error);
    return false;
  }
}

/**
 * Process incoming WhatsApp message
 */
async function processWhatsAppMessage(value: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const messages = value.messages || [];

  for (const message of messages) {
    const phoneNumber = message.from; // Sender's phone number
    const messageText = message.text?.body || "[Media message]";
    const messageType = message.type; // text, image, video, audio, document
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    // Find or create lead by phone number
    const leadResults = await db
      .select()
      .from(leads)
      .where(eq(leads.phone, phoneNumber));

    let leadId: number;

    if (leadResults.length > 0) {
      leadId = leadResults[0].id;
    } else {
      // Create new lead from WhatsApp message
      const insertResult = await db.insert(leads).values({
        name: value.contacts?.[0]?.profile?.name || "WhatsApp User",
        phone: phoneNumber,
        source: "whatsapp",
        quizName: "whatsapp-inbound",
        answers: JSON.stringify({}),
        statusId: 1, // Default to first status (usually "new")
        assignedTo: null,
        leadScore: 0,
      });
      leadId = insertResult[0].insertId;
    }

    // Find or create conversation
    const conversationResults = await db
      .select()
      .from(conversations)
      .where(
        and(
          eq(conversations.leadId, leadId),
          eq(conversations.channel, "whatsapp")
        )
      );

    let conversationId: number;

    if (conversationResults.length > 0) {
      conversationId = conversationResults[0].id;
      // Update conversation
      await db
        .update(conversations)
        .set({
          lastMessageAt: timestamp,
          unreadCount: conversationResults[0].unreadCount + 1,
        })
        .where(eq(conversations.id, conversationId));
    } else {
      // Create new conversation
      const insertResult = await db.insert(conversations).values({
        leadId,
        channel: "whatsapp",
        externalId: phoneNumber,
        lastMessageAt: timestamp,
        unreadCount: 1,
      });
      conversationId = insertResult[0].insertId;
    }

    // Save inbound message
    await db.insert(inboundMessages).values({
      conversationId,
      senderId: phoneNumber,
      senderName: value.contacts?.[0]?.profile?.name || "Unknown",
      content: messageText,
      messageType,
      mediaUrl: message.image?.id || message.video?.id || message.audio?.id || null,
      isRead: false,
      receivedAt: timestamp,
    });

    console.log(`[WhatsApp] Message saved: ${phoneNumber} -> ${messageText}`);
  }
}
