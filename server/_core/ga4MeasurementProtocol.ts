// Google Analytics 4 Measurement Protocol Configuration
const GA4_MEASUREMENT_ID = "G-BS1VTVTWVC";
const GA4_API_SECRET = "mafjIn1MRsSueyQ7d6NF2A";
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`;

interface GA4Event {
  name: string;
  params: {
    [key: string]: any;
  };
}

interface GA4Payload {
  client_id: string; // Required: unique client identifier
  user_id?: string; // Optional: user ID from your system
  timestamp_micros?: number; // Optional: event timestamp
  user_properties?: {
    [key: string]: {
      value: string | number | boolean;
    };
  };
  events: GA4Event[];
}

/**
 * Send event to GA4 via Measurement Protocol
 */
export async function sendGA4Event(payload: GA4Payload): Promise<boolean> {
  try {
    const response = await fetch(GA4_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error("[GA4 Measurement Protocol] Error:", response.status, response.statusText);
      return false;
    }

    console.log(`[GA4 Measurement Protocol] Events sent successfully:`, payload.events.map(e => e.name).join(", "));
    return true;
  } catch (error) {
    console.error("[GA4 Measurement Protocol] Failed to send event:", error);
    return false;
  }
}

/**
 * Track generate_lead event (Lead submission)
 */
export async function trackGA4Lead(params: {
  clientId: string;
  userId?: string;
  quizName?: string;
  leadValue?: number;
  currency?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "generate_lead",
        params: {
          currency: params.currency || "UAH",
          value: params.leadValue || 0,
          quiz_name: params.quizName || "Unknown Quiz",
          lead_source: params.source || "direct",
          // UTM parameters
          campaign_source: params.source || "",
          campaign_medium: params.medium || "",
          campaign_name: params.campaign || "",
          campaign_content: params.content || "",
          campaign_term: params.term || "",
        },
      },
    ],
  });
}

/**
 * Track begin_checkout event (Call/Meeting scheduled)
 */
export async function trackGA4ScheduleCall(params: {
  clientId: string;
  userId?: string;
  callType?: string;
  value?: number;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "begin_checkout",
        params: {
          call_type: params.callType || "scheduled_call",
          value: params.value || 0,
          currency: "UAH",
        },
      },
    ],
  });
}

/**
 * Track add_to_cart event (Callback requested)
 */
export async function trackGA4Callback(params: {
  clientId: string;
  userId?: string;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "add_to_cart",
        params: {
          item_name: "Callback Requested",
          item_category: "callback",
        },
      },
    ],
  });
}

/**
 * Track purchase event (Sale completed)
 */
export async function trackGA4Purchase(params: {
  clientId: string;
  userId?: string;
  transactionId: string;
  value: number;
  currency?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    price: number;
    quantity: number;
  }>;
  source?: string;
  medium?: string;
  campaign?: string;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "purchase",
        params: {
          transaction_id: params.transactionId,
          value: params.value,
          currency: params.currency || "UAH",
          items: params.items || [],
          // Original UTM parameters
          campaign_source: params.source || "",
          campaign_medium: params.medium || "",
          campaign_name: params.campaign || "",
        },
      },
    ],
  });
}

/**
 * Track custom event (for CRM-specific events)
 */
export async function trackGA4CustomEvent(params: {
  clientId: string;
  userId?: string;
  eventName: string;
  eventParams?: Record<string, string | number | boolean>;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: params.eventName,
        params: params.eventParams || {},
      },
    ],
  });
}

/**
 * Track call_completed event
 */
export async function trackGA4CallCompleted(params: {
  clientId: string;
  userId?: string;
  callDuration?: number;
  callOutcome?: string;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "call_completed",
        params: {
          call_duration: params.callDuration || 0,
          call_outcome: params.callOutcome || "completed",
        },
      },
    ],
  });
}

/**
 * Track no_answer event (Lead didn't answer)
 */
export async function trackGA4NoAnswer(params: {
  clientId: string;
  userId?: string;
  attemptNumber?: number;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "no_answer",
        params: {
          attempt_number: params.attemptNumber || 1,
        },
      },
    ],
  });
}

/**
 * Track meeting_completed event
 */
export async function trackGA4MeetingCompleted(params: {
  clientId: string;
  userId?: string;
  meetingDuration?: number;
  meetingType?: string;
}): Promise<boolean> {
  return sendGA4Event({
    client_id: params.clientId,
    user_id: params.userId,
    events: [
      {
        name: "meeting_completed",
        params: {
          meeting_duration: params.meetingDuration || 0,
          meeting_type: params.meetingType || "google_meet",
        },
      },
    ],
  });
}
