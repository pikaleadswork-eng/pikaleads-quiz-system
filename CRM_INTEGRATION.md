# CRM Integration Guide

## Overview

The PIKALEADS CRM system includes messaging capabilities for Instagram Direct and Telegram. This guide explains how to complete the integration.

---

## Instagram Direct API Integration

### Prerequisites
1. Instagram Business Account
2. Facebook App with Instagram Graph API access
3. Access Token with `instagram_basic`, `instagram_manage_messages` permissions

### Setup Steps

1. **Create Facebook App**
   - Go to https://developers.facebook.com/apps/
   - Create new app → Business type
   - Add Instagram Graph API product

2. **Get Access Token**
   - Go to Graph API Explorer
   - Select your app
   - Request permissions: `instagram_basic`, `instagram_manage_messages`
   - Generate token

3. **Add to Environment Variables**
   ```bash
   INSTAGRAM_ACCESS_TOKEN=your_access_token_here
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_account_id_here
   ```

4. **Implement Sending Logic**
   
   Create `server/instagram.ts`:
   ```typescript
   import axios from "axios";
   
   const INSTAGRAM_API_URL = "https://graph.facebook.com/v18.0";
   const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
   const BUSINESS_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
   
   export async function sendInstagramMessage(username: string, message: string) {
     try {
       // First, get the Instagram user ID from username
       const userResponse = await axios.get(
         `${INSTAGRAM_API_URL}/${BUSINESS_ACCOUNT_ID}`,
         {
           params: {
             fields: "followers",
             access_token: ACCESS_TOKEN,
           },
         }
       );
       
       // Send message
       const response = await axios.post(
         `${INSTAGRAM_API_URL}/me/messages`,
         {
           recipient: { username },
           message: { text: message },
         },
         {
           params: { access_token: ACCESS_TOKEN },
         }
       );
       
       return { success: true, messageId: response.data.message_id };
     } catch (error) {
       console.error("[Instagram] Failed to send message:", error);
       return { success: false, error };
     }
   }
   
   export async function getInstagramConversation(userId: string) {
     try {
       const response = await axios.get(
         `${INSTAGRAM_API_URL}/${userId}/conversations`,
         {
           params: {
             platform: "instagram",
             access_token: ACCESS_TOKEN,
           },
         }
       );
       
       return response.data.data;
     } catch (error) {
       console.error("[Instagram] Failed to get conversation:", error);
       return [];
     }
   }
   ```

5. **Update CRM Router**
   
   In `server/routers.ts`, update the `sendMessage` mutation:
   ```typescript
   sendMessage: protectedProcedure
     .input(z.object({
       leadId: z.number(),
       platform: z.enum(['instagram', 'telegram']),
       message: z.string(),
     }))
     .mutation(async ({ input, ctx }) => {
       const { createMessage, logActivity } = await import("./db");
       
       let externalId: string | null = null;
       
       if (input.platform === 'instagram') {
         const { sendInstagramMessage } = await import("./instagram");
         const lead = await db.getLeadById(input.leadId);
         
         if (lead?.telegram) { // Use telegram field as Instagram username
           const result = await sendInstagramMessage(lead.telegram, input.message);
           if (result.success) {
             externalId = result.messageId;
           }
         }
       }
       
       await createMessage({
         leadId: input.leadId,
         platform: input.platform,
         direction: 'outbound',
         message: input.message,
         sentBy: ctx.user.id,
         externalId,
       });
       
       await logActivity({
         userId: ctx.user.id,
         leadId: input.leadId,
         action: 'message_sent',
         details: JSON.stringify({ platform: input.platform }),
       });
       
       return { success: true };
     }),
   ```

---

## Telegram Bot Integration for Two-Way Communication

### Prerequisites
1. Telegram Bot Token (from @BotFather)
2. Webhook URL (your server URL + `/api/telegram/webhook`)

### Setup Steps

1. **Create Telegram Bot**
   - Open Telegram and search for @BotFather
   - Send `/newbot` and follow instructions
   - Save the bot token

2. **Add to Environment Variables**
   ```bash
   TELEGRAM_BOT_TOKEN_CRM=your_bot_token_here
   ```

3. **Implement Two-Way Communication**
   
   Create `server/telegramBot.ts`:
   ```typescript
   import axios from "axios";
   import { createMessage } from "./db";
   
   const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN_CRM;
   const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;
   
   export async function sendTelegramMessageToUser(chatId: string, message: string) {
     try {
       const response = await axios.post(`${TELEGRAM_API}/sendMessage`, {
         chat_id: chatId,
         text: message,
       });
       
       return { success: true, messageId: response.data.result.message_id };
     } catch (error) {
       console.error("[Telegram] Failed to send message:", error);
       return { success: false, error };
     }
   }
   
   export async function handleTelegramWebhook(update: any) {
     if (update.message) {
       const chatId = update.message.chat.id.toString();
       const username = update.message.from.username;
       const text = update.message.text;
       
       // Find lead by telegram username
       const db = await import("./db");
       const leads = await db.getAllLeads();
       const lead = leads.find(l => l.telegram === `@${username}`);
       
       if (lead) {
         // Store incoming message
         await createMessage({
           leadId: lead.id,
           platform: 'telegram',
           direction: 'inbound',
           message: text,
           sentBy: null,
           externalId: update.message.message_id.toString(),
         });
       }
     }
   }
   
   export async function setTelegramWebhook(webhookUrl: string) {
     try {
       await axios.post(`${TELEGRAM_API}/setWebhook`, {
         url: webhookUrl,
       });
       console.log("[Telegram] Webhook set successfully");
     } catch (error) {
       console.error("[Telegram] Failed to set webhook:", error);
     }
   }
   ```

4. **Add Webhook Endpoint**
   
   In `server/_core/index.ts`, add webhook route:
   ```typescript
   import { handleTelegramWebhook } from "../telegramBot";
   
   app.post("/api/telegram/webhook", express.json(), async (req, res) => {
     try {
       await handleTelegramWebhook(req.body);
       res.sendStatus(200);
     } catch (error) {
       console.error("[Telegram Webhook] Error:", error);
       res.sendStatus(500);
     }
   });
   ```

5. **Set Webhook on Server Start**
   
   In `server/_core/index.ts`, after server starts:
   ```typescript
   import { setTelegramWebhook } from "../telegramBot";
   
   const PORT = process.env.PORT || 3000;
   app.listen(PORT, async () => {
     console.log(`Server running on port ${PORT}`);
     
     // Set Telegram webhook
     if (process.env.TELEGRAM_BOT_TOKEN_CRM) {
       const webhookUrl = `${process.env.PUBLIC_URL || 'https://your-domain.com'}/api/telegram/webhook`;
       await setTelegramWebhook(webhookUrl);
     }
   });
   ```

6. **Update CRM Router for Telegram**
   
   In `server/routers.ts`, update the `sendMessage` mutation:
   ```typescript
   if (input.platform === 'telegram') {
     const { sendTelegramMessageToUser } = await import("./telegramBot");
     const lead = await db.getLeadById(input.leadId);
     
     // Extract chat ID from previous messages or use username
     const previousMessages = await db.getLeadMessages(input.leadId);
     const lastInbound = previousMessages.find(m => m.direction === 'inbound' && m.platform === 'telegram');
     
     if (lastInbound?.externalId) {
       const result = await sendTelegramMessageToUser(lastInbound.externalId, input.message);
       if (result.success) {
         externalId = result.messageId.toString();
       }
     }
   }
   ```

---

## Testing

### Instagram
1. Send a test message from CRM to your Instagram account
2. Check Instagram Direct messages
3. Verify message appears in CRM message history

### Telegram
1. Start a conversation with your bot
2. Send a message to the bot
3. Check CRM to see if the message appears
4. Reply from CRM and verify it arrives in Telegram

---

## Troubleshooting

### Instagram
- **403 Forbidden**: Check access token permissions
- **User not found**: Ensure the username is correct and the user has messaged your business account first
- **Rate limits**: Instagram has strict rate limits, implement exponential backoff

### Telegram
- **Webhook not receiving**: Check webhook URL is publicly accessible with HTTPS
- **Bot not responding**: Verify bot token is correct
- **Messages not linking to leads**: Ensure telegram usernames in leads match exactly (with @)

---

## Security Considerations

1. **Never commit tokens** to version control
2. **Use environment variables** for all API keys
3. **Validate webhook signatures** (Telegram provides this)
4. **Implement rate limiting** to prevent abuse
5. **Log all API calls** for debugging and auditing

---

## Next Steps

1. Complete Instagram Direct API setup
2. Set up Telegram Bot webhook
3. Test both integrations thoroughly
4. Add error handling and retry logic
5. Implement message templates for common responses
6. Add notification system for new incoming messages

