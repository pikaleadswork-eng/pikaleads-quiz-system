import crypto from "crypto";

// Meta Conversions API Configuration
const META_PIXEL_ID = "720023837850036";
const META_ACCESS_TOKEN = "EAAL2VLAkKwsBQArtQkl8yeawxXtASeC4sSoU5ci8Rbuul9XdaFqljBeZBoZCnYECBy1Txr1efCeT7ljBdImbK9CrrVEr45LbIU19CbKFVwngchOLS5KAZBKwHKUsKjQoQXZCtJyFySyUkDqxsn7dt1gtcZBoWS2IV7XGWTZAUDCVrc0ZC7ednm7dGHrJV9YvwZDZD";
const META_API_VERSION = "v21.0";

interface MetaEventData {
  event_name: string;
  event_time: number;
  event_id: string;
  action_source: "website";
  user_data: {
    em?: string[]; // hashed email
    ph?: string[]; // hashed phone
    client_ip_address?: string;
    client_user_agent?: string;
    fbp?: string; // Facebook browser pixel cookie
    fbc?: string; // Facebook click ID cookie
  };
  custom_data?: {
    currency?: string;
    value?: number;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    contents?: Array<{ id: string; quantity: number }>;
    [key: string]: any;
  };
}

/**
 * Hash data with SHA256 for Meta's privacy requirements
 */
function hashData(data: string): string {
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

/**
 * Send event to Meta Conversions API
 */
export async function sendMetaEvent(eventData: MetaEventData): Promise<boolean> {
  try {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${META_PIXEL_ID}/events`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [eventData],
        access_token: META_ACCESS_TOKEN,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[Meta Conversions API] Error:", result);
      return false;
    }

    console.log(`[Meta Conversions API] Event ${eventData.event_name} sent successfully`);
    return true;
  } catch (error) {
    console.error("[Meta Conversions API] Failed to send event:", error);
    return false;
  }
}

/**
 * Track CompleteRegistration event (Lead submission)
 */
export async function trackMetaLead(params: {
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  quizName?: string;
  leadValue?: number;
}): Promise<boolean> {
  const userData: MetaEventData["user_data"] = {
    client_ip_address: params.clientIp,
    client_user_agent: params.userAgent,
    fbp: params.fbp,
    fbc: params.fbc,
  };

  // Hash email and phone for privacy
  if (params.email) {
    userData.em = [hashData(params.email)];
  }
  if (params.phone) {
    userData.ph = [hashData(params.phone)];
  }

  return sendMetaEvent({
    event_name: "CompleteRegistration",
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency: "UAH",
      value: params.leadValue || 0,
      content_name: params.quizName || "Quiz Lead",
      content_category: "lead_generation",
    },
  });
}

/**
 * Track InitiateCheckout event (Call/Meeting scheduled)
 */
export async function trackMetaScheduleCall(params: {
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  callType?: string;
}): Promise<boolean> {
  const userData: MetaEventData["user_data"] = {
    client_ip_address: params.clientIp,
    client_user_agent: params.userAgent,
    fbp: params.fbp,
    fbc: params.fbc,
  };

  if (params.email) userData.em = [hashData(params.email)];
  if (params.phone) userData.ph = [hashData(params.phone)];

  return sendMetaEvent({
    event_name: "InitiateCheckout",
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: {
      content_name: params.callType || "Call Scheduled",
      content_category: "call_scheduling",
    },
  });
}

/**
 * Track AddToCart event (Callback requested)
 */
export async function trackMetaCallback(params: {
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
}): Promise<boolean> {
  const userData: MetaEventData["user_data"] = {
    client_ip_address: params.clientIp,
    client_user_agent: params.userAgent,
    fbp: params.fbp,
    fbc: params.fbc,
  };

  if (params.email) userData.em = [hashData(params.email)];
  if (params.phone) userData.ph = [hashData(params.phone)];

  return sendMetaEvent({
    event_name: "AddToCart",
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: {
      content_name: "Callback Requested",
      content_category: "callback",
    },
  });
}

/**
 * Track Purchase event (Sale completed)
 */
export async function trackMetaPurchase(params: {
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  value: number;
  currency?: string;
  contentName?: string;
  contentIds?: string[];
}): Promise<boolean> {
  const userData: MetaEventData["user_data"] = {
    client_ip_address: params.clientIp,
    client_user_agent: params.userAgent,
    fbp: params.fbp,
    fbc: params.fbc,
  };

  if (params.email) userData.em = [hashData(params.email)];
  if (params.phone) userData.ph = [hashData(params.phone)];

  return sendMetaEvent({
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: {
      currency: params.currency || "UAH",
      value: params.value,
      content_name: params.contentName || "Sale",
      content_ids: params.contentIds || [],
      content_category: "purchase",
    },
  });
}

/**
 * Track custom event (for CRM-specific events)
 */
export async function trackMetaCustomEvent(params: {
  eventName: string;
  eventId: string;
  email?: string;
  phone?: string;
  clientIp?: string;
  userAgent?: string;
  fbp?: string;
  fbc?: string;
  customData?: Record<string, any>;
}): Promise<boolean> {
  const userData: MetaEventData["user_data"] = {
    client_ip_address: params.clientIp,
    client_user_agent: params.userAgent,
    fbp: params.fbp,
    fbc: params.fbc,
  };

  if (params.email) userData.em = [hashData(params.email)];
  if (params.phone) userData.ph = [hashData(params.phone)];

  return sendMetaEvent({
    event_name: params.eventName,
    event_time: Math.floor(Date.now() / 1000),
    event_id: params.eventId,
    action_source: "website",
    user_data: userData,
    custom_data: params.customData || {},
  });
}
