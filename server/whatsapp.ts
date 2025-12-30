/**
 * WhatsApp Business API Integration
 * Send and receive messages via WhatsApp
 */

/**
 * Send WhatsApp message to client
 */
export async function sendWhatsAppMessage(params: {
  to: string; // Phone number in international format (e.g., +380123456789)
  message: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, message } = params;
  
  const whatsappToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const whatsappPhoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!whatsappToken || !whatsappPhoneNumberId) {
    console.warn("[WhatsApp] Missing credentials (WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID)");
    return { success: false, error: "WhatsApp credentials not configured" };
  }
  
  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${whatsappPhoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${whatsappToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: to.replace(/[^0-9+]/g, ""), // Clean phone number
          type: "text",
          text: {
            body: message,
          },
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.text();
      console.error("[WhatsApp] Send failed:", error);
      return { success: false, error: `WhatsApp API error: ${response.status}` };
    }
    
    const data = await response.json();
    console.log("[WhatsApp] Message sent successfully:", data);
    
    return {
      success: true,
      messageId: data.messages?.[0]?.id,
    };
  } catch (error) {
    console.error("[WhatsApp] Send error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Verify WhatsApp webhook (required for setup)
 */
export function verifyWhatsAppWebhook(params: {
  mode: string;
  token: string;
  challenge: string;
}): string | null {
  const { mode, token, challenge } = params;
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || "pikaleads_verify_token_2024";
  
  if (mode === "subscribe" && token === verifyToken) {
    console.log("[WhatsApp] Webhook verified successfully");
    return challenge;
  }
  
  console.warn("[WhatsApp] Webhook verification failed");
  return null;
}

/**
 * Process incoming WhatsApp webhook
 */
export function processWhatsAppWebhook(body: any): {
  from: string;
  message: string;
  messageId: string;
  timestamp: number;
} | null {
  try {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const messages = value?.messages;
    
    if (!messages || messages.length === 0) {
      return null;
    }
    
    const message = messages[0];
    
    return {
      from: message.from,
      message: message.text?.body || "",
      messageId: message.id,
      timestamp: parseInt(message.timestamp) * 1000,
    };
  } catch (error) {
    console.error("[WhatsApp] Webhook processing error:", error);
    return null;
  }
}
