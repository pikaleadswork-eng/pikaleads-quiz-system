import axios from "axios";

/**
 * Instagram Direct API integration
 * 
 * Note: Instagram Direct API requires:
 * 1. Facebook App with Instagram Basic Display or Instagram Graph API
 * 2. Instagram Business Account
 * 3. Access Token with instagram_manage_messages permission
 * 
 * Setup instructions in CRM_INTEGRATION.md
 */

export interface InstagramMessage {
  id: string;
  from: {
    id: string;
    username: string;
  };
  to: {
    id: string;
  };
  message: string;
  timestamp: string;
}

/**
 * Send a message via Instagram Direct
 * Requires Instagram Graph API access token
 */
export async function sendInstagramMessage(
  recipientId: string,
  message: string,
  accessToken?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!accessToken) {
    return {
      success: false,
      error: "Instagram access token not configured. Please set INSTAGRAM_ACCESS_TOKEN in environment variables.",
    };
  }

  try {
    const response = await axios.post(
      `https://graph.instagram.com/v18.0/me/messages`,
      {
        recipient: {
          id: recipientId,
        },
        message: {
          text: message,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.message_id) {
      return {
        success: true,
        messageId: response.data.message_id,
      };
    } else {
      return {
        success: false,
        error: "Failed to send message",
      };
    }
  } catch (error: any) {
    console.error("[Instagram Direct] Failed to send message:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Get Instagram user ID by username
 * Requires Instagram Graph API access token
 */
export async function getInstagramUserId(
  username: string,
  accessToken?: string
): Promise<{ success: boolean; userId?: string; error?: string }> {
  if (!accessToken) {
    return {
      success: false,
      error: "Instagram access token not configured",
    };
  }

  try {
    const response = await axios.get(
      `https://graph.instagram.com/v18.0/${username}`,
      {
        params: {
          fields: "id,username",
          access_token: accessToken,
        },
      }
    );

    if (response.data.id) {
      return {
        success: true,
        userId: response.data.id,
      };
    } else {
      return {
        success: false,
        error: "User not found",
      };
    }
  } catch (error: any) {
    console.error("[Instagram Direct] Failed to get user ID:", error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message,
    };
  }
}

/**
 * Webhook handler for Instagram Direct messages
 * Call this from your webhook endpoint
 */
export function handleInstagramWebhook(payload: any): InstagramMessage[] {
  const messages: InstagramMessage[] = [];

  try {
    if (payload.object === "instagram" && payload.entry) {
      for (const entry of payload.entry) {
        if (entry.messaging) {
          for (const messagingEvent of entry.messaging) {
            if (messagingEvent.message) {
              messages.push({
                id: messagingEvent.message.mid,
                from: {
                  id: messagingEvent.sender.id,
                  username: messagingEvent.sender.username || "unknown",
                },
                to: {
                  id: messagingEvent.recipient.id,
                },
                message: messagingEvent.message.text || "",
                timestamp: new Date(messagingEvent.timestamp).toISOString(),
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("[Instagram Direct] Failed to parse webhook payload:", error);
  }

  return messages;
}
