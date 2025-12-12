import type { Request, Response } from "express";
import crypto from "crypto";
import { getDb } from "../db";
import { conversations, inboundMessages, leads } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { getIntegrationSettingByProvider } from "../db";

/**
 * Instagram Webhook Verification (GET)
 * Meta sends this to verify webhook URL
 */
export async function verifyInstagramWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // Get verify token from integration settings
  const settings = await getIntegrationSettingByProvider("instagram");
  if (!settings) {
    return res.status(403).send("Instagram integration not configured");
  }

  const credentials = JSON.parse(settings.credentials);
  const VERIFY_TOKEN = credentials.verifyToken || "PIKALEADS_WEBHOOK_VERIFY";

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("[Instagram Webhook] Verification successful");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }
}

/**
 * Instagram Webhook Handler (POST)
 * Receives incoming Direct Messages from Instagram
 */
export async function handleInstagramWebhook(req: Request, res: Response) {
  try {
    const body = req.body;

    // Verify webhook signature
    const signature = req.headers["x-hub-signature-256"] as string;
    if (!verifySignature(req.body, signature)) {
      return res.status(401).send("Invalid signature");
    }

    // Process webhook payload
    if (body.object === "instagram") {
      for (const entry of body.entry || []) {
        for (const messaging of entry.messaging || []) {
          if (messaging.message) {
            await processInstagramMessage(messaging);
          }
        }
      }
    }

    res.status(200).send("EVENT_RECEIVED");
  } catch (error) {
    console.error("[Instagram Webhook] Error:", error);
    res.status(500).send("Internal server error");
  }
}

/**
 * Verify webhook signature from Meta
 */
function verifySignature(payload: any, signature: string): boolean {
  if (!signature) return false;

  try {
    const settings = getIntegrationSettingByProvider("instagram");
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
    console.error("[Instagram] Signature verification error:", error);
    return false;
  }
}

/**
 * Process incoming Instagram Direct Message
 */
async function processInstagramMessage(messaging: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const senderId = messaging.sender.id; // Instagram User ID
  const messageText = messaging.message.text || "[Media message]";
  const timestamp = new Date(messaging.timestamp);

  // Find or create lead by Instagram username/ID
  // Note: You'll need to fetch username from Instagram Graph API using senderId
  const instagramUsername = await fetchInstagramUsername(senderId);

  // Search for lead by Instagram username in telegram field or email field
  const leadResults = await db
    .select()
    .from(leads)
    .where(eq(leads.email, `instagram:${instagramUsername}`));

  let leadId: number;

  if (leadResults.length > 0) {
    leadId = leadResults[0].id;
  } else {
    // Create new lead from Instagram message
    const insertResult = await db.insert(leads).values({
      name: instagramUsername || "Instagram User",
      phone: "", // Instagram doesn't provide phone
      telegram: instagramUsername, // Store Instagram username here
      source: "instagram",
      quizName: "instagram-inbound",
      answers: JSON.stringify({}),
      statusId: 1,
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
        eq(conversations.channel, "instagram")
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
      channel: "instagram",
      externalId: senderId,
      lastMessageAt: timestamp,
      unreadCount: 1,
    });
    conversationId = insertResult[0].insertId;
  }

  // Save inbound message
  await db.insert(inboundMessages).values({
    conversationId,
    senderId,
    senderName: instagramUsername || "Unknown",
    content: messageText,
    messageType: "text",
    mediaUrl: null,
    isRead: false,
    receivedAt: timestamp,
  });

  console.log(`[Instagram] Message saved: ${instagramUsername} -> ${messageText}`);
}

/**
 * Fetch Instagram username from User ID
 * Requires Instagram Graph API call
 */
async function fetchInstagramUsername(userId: string): Promise<string | null> {
  try {
    const settings = await getIntegrationSettingByProvider("instagram");
    if (!settings) return null;

    const credentials = JSON.parse(settings.credentials);
    const accessToken = credentials.accessToken;

    const response = await fetch(
      `https://graph.instagram.com/${userId}?fields=username&access_token=${accessToken}`
    );

    if (!response.ok) return null;

    const data = await response.json();
    return data.username || null;
  } catch (error) {
    console.error("[Instagram] Failed to fetch username:", error);
    return null;
  }
}
