/**
 * IP Telephony Integration
 * Supports: Binotel, Ringostat, Zadarma
 * 
 * Setup Instructions:
 * 1. Add environment variables in .env:
 *    - TELEPHONY_PROVIDER=binotel|ringostat|zadarma
 *    - TELEPHONY_API_KEY=your_api_key
 *    - TELEPHONY_API_SECRET=your_api_secret (for Zadarma)
 * 
 * 2. Configure webhooks in your telephony provider dashboard:
 *    - Call started: POST /api/webhooks/telephony/call-started
 *    - Call ended: POST /api/webhooks/telephony/call-ended
 *    - Call recorded: POST /api/webhooks/telephony/call-recorded
 */

interface CallData {
  callId: string;
  from: string;
  to: string;
  duration?: number;
  status: "started" | "answered" | "no_answer" | "busy" | "ended";
  recordingUrl?: string;
  startedAt: Date;
  endedAt?: Date;
}

/**
 * Make a call through IP telephony provider
 */
export async function makeCall(params: {
  from: string; // Manager's phone or internal number
  to: string; // Lead's phone
  leadId: number;
}): Promise<{ success: boolean; callId?: string; error?: string }> {
  const provider = process.env.TELEPHONY_PROVIDER;
  
  if (!provider) {
    return { success: false, error: "Telephony provider not configured" };
  }

  try {
    switch (provider) {
      case "binotel":
        return await makeBinotelCall(params);
      case "ringostat":
        return await makeRingostatCall(params);
      case "zadarma":
        return await makeZadarmaCall(params);
      default:
        return { success: false, error: `Unknown provider: ${provider}` };
    }
  } catch (error) {
    console.error("Telephony error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get call history for a lead
 */
export async function getCallHistory(leadPhone: string): Promise<CallData[]> {
  const provider = process.env.TELEPHONY_PROVIDER;
  
  if (!provider) {
    return [];
  }

  try {
    switch (provider) {
      case "binotel":
        return await getBinotelCallHistory(leadPhone);
      case "ringostat":
        return await getRingostatCallHistory(leadPhone);
      case "zadarma":
        return await getZadarmaCallHistory(leadPhone);
      default:
        return [];
    }
  } catch (error) {
    console.error("Error fetching call history:", error);
    return [];
  }
}

// ==================== BINOTEL ====================

async function makeBinotelCall(params: {
  from: string;
  to: string;
  leadId: number;
}): Promise<{ success: boolean; callId?: string; error?: string }> {
  const apiKey = process.env.TELEPHONY_API_KEY;
  const apiSecret = process.env.TELEPHONY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return { success: false, error: "Binotel API credentials not configured" };
  }

  const response = await fetch("https://api.binotel.com/api/2.0/calls/start.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      key: apiKey,
      secret: apiSecret,
      externalNumber: params.to,
      internalNumber: params.from,
      customerData: {
        leadId: params.leadId,
      },
    }),
  });

  const data = await response.json();

  if (data.status === "success") {
    return { success: true, callId: data.callID };
  }

  return { success: false, error: data.message || "Binotel API error" };
}

async function getBinotelCallHistory(leadPhone: string): Promise<CallData[]> {
  const apiKey = process.env.TELEPHONY_API_KEY;
  const apiSecret = process.env.TELEPHONY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return [];
  }

  const response = await fetch(
    `https://api.binotel.com/api/2.0/stats.json?key=${apiKey}&secret=${apiSecret}&externalNumber=${leadPhone}`,
    { method: "GET" }
  );

  const data = await response.json();

  if (data.status !== "success" || !data.calls) {
    return [];
  }

  return data.calls.map((call: any) => ({
    callId: call.generalCallID,
    from: call.externalNumber,
    to: call.internalNumber,
    duration: call.billsec,
    status: call.disposition === "ANSWERED" ? "answered" : "no_answer",
    recordingUrl: call.recordingLink,
    startedAt: new Date(call.startTime),
    endedAt: new Date(call.endTime),
  }));
}

// ==================== RINGOSTAT ====================

async function makeRingostatCall(params: {
  from: string;
  to: string;
  leadId: number;
}): Promise<{ success: boolean; callId?: string; error?: string }> {
  const apiKey = process.env.TELEPHONY_API_KEY;

  if (!apiKey) {
    return { success: false, error: "Ringostat API key not configured" };
  }

  const response = await fetch("https://api.ringostat.com/v1/calls/make", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: params.from,
      to: params.to,
      metadata: {
        leadId: params.leadId,
      },
    }),
  });

  const data = await response.json();

  if (response.ok) {
    return { success: true, callId: data.call_id };
  }

  return { success: false, error: data.error || "Ringostat API error" };
}

async function getRingostatCallHistory(leadPhone: string): Promise<CallData[]> {
  const apiKey = process.env.TELEPHONY_API_KEY;

  if (!apiKey) {
    return [];
  }

  const response = await fetch(
    `https://api.ringostat.com/v1/calls?phone=${leadPhone}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.calls) {
    return [];
  }

  return data.calls.map((call: any) => ({
    callId: call.id,
    from: call.from,
    to: call.to,
    duration: call.duration,
    status: call.status,
    recordingUrl: call.recording_url,
    startedAt: new Date(call.started_at),
    endedAt: call.ended_at ? new Date(call.ended_at) : undefined,
  }));
}

// ==================== ZADARMA ====================

import crypto from "crypto";

function zadarmaSign(params: Record<string, any>): string {
  const apiSecret = process.env.TELEPHONY_API_SECRET || "";
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
  return crypto.createHmac("sha256", apiSecret).update(sortedParams).digest("hex");
}

async function makeZadarmaCall(params: {
  from: string;
  to: string;
  leadId: number;
}): Promise<{ success: boolean; callId?: string; error?: string }> {
  const apiKey = process.env.TELEPHONY_API_KEY;
  const apiSecret = process.env.TELEPHONY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return { success: false, error: "Zadarma API credentials not configured" };
  }

  const requestParams = {
    from: params.from,
    to: params.to,
    sip: params.from,
  };

  const signature = zadarmaSign(requestParams);

  const response = await fetch("https://api.zadarma.com/v1/request/callback/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `${apiKey}:${signature}`,
    },
    body: new URLSearchParams(requestParams).toString(),
  });

  const data = await response.json();

  if (data.status === "success") {
    return { success: true, callId: data.call_id };
  }

  return { success: false, error: data.message || "Zadarma API error" };
}

async function getZadarmaCallHistory(leadPhone: string): Promise<CallData[]> {
  const apiKey = process.env.TELEPHONY_API_KEY;
  const apiSecret = process.env.TELEPHONY_API_SECRET;

  if (!apiKey || !apiSecret) {
    return [];
  }

  const requestParams = {
    number: leadPhone,
    type: "all",
  };

  const signature = zadarmaSign(requestParams);

  const response = await fetch(
    `https://api.zadarma.com/v1/statistics/pbx/?${new URLSearchParams(requestParams).toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `${apiKey}:${signature}`,
      },
    }
  );

  const data = await response.json();

  if (data.status !== "success" || !data.calls) {
    return [];
  }

  return data.calls.map((call: any) => ({
    callId: call.id,
    from: call.from,
    to: call.to,
    duration: call.billsec,
    status: call.disposition,
    recordingUrl: call.record,
    startedAt: new Date(call.start),
    endedAt: new Date(call.end),
  }));
}
