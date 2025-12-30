/**
 * Zadarma IP Telephony Integration
 * 
 * Provides functions to initiate calls, check call status, and manage call recordings
 * using the Zadarma API.
 * 
 * Setup:
 * 1. Create Zadarma account at https://zadarma.com
 * 2. Get API credentials from Settings → API
 * 3. Add to integration_settings table via Settings page
 * 
 * Required env vars (stored in integration_settings):
 * - ZADARMA_API_KEY
 * - ZADARMA_API_SECRET
 * - ZADARMA_SIP_NUMBER (your Zadarma SIP number to call from)
 */

import crypto from "crypto";

interface ZadarmaCredentials {
  apiKey: string;
  apiSecret: string;
  sipNumber: string;
}

/**
 * Generate Zadarma API signature
 */
function generateSignature(
  method: string,
  path: string,
  params: Record<string, string>,
  apiSecret: string
): string {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = `${method}${path}${sortedParams}`;
  const signature = crypto
    .createHmac("sha1", apiSecret)
    .update(stringToSign, "utf8")
    .digest("base64");

  return signature;
}

/**
 * Make authenticated request to Zadarma API
 */
async function zadarmaRequest(
  credentials: ZadarmaCredentials,
  method: "GET" | "POST",
  path: string,
  params: Record<string, string> = {}
): Promise<any> {
  const signature = generateSignature(
    method,
    path,
    params,
    credentials.apiSecret
  );

  const url = new URL(`https://api.zadarma.com${path}`);
  if (method === "GET" && Object.keys(params).length > 0) {
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
  }

  const headers: Record<string, string> = {
    Authorization: `${credentials.apiKey}:${signature}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (method === "POST" && Object.keys(params).length > 0) {
    options.body = new URLSearchParams(params).toString();
  }

  const response = await fetch(url.toString(), options);
  const data = await response.json();

  if (!response.ok || data.status !== "success") {
    throw new Error(
      data.message || `Zadarma API error: ${response.statusText}`
    );
  }

  return data;
}

/**
 * Initiate a call from Zadarma SIP number to destination number
 * 
 * @param credentials - Zadarma API credentials
 * @param toNumber - Destination phone number (E.164 format, e.g., +380501234567)
 * @param sipNumber - Your Zadarma SIP number to call from (optional, uses default from credentials)
 * @returns Call ID and status
 */
export async function initiateCall(
  credentials: ZadarmaCredentials,
  toNumber: string,
  sipNumber?: string
): Promise<{ callId: string; status: string }> {
  const params = {
    from: sipNumber || credentials.sipNumber,
    to: toNumber,
    sip: "100", // SIP extension (default 100)
  };

  const result = await zadarmaRequest(
    credentials,
    "POST",
    "/v1/request/callback/",
    params
  );

  return {
    callId: result.call_id || "",
    status: result.status || "initiated",
  };
}

/**
 * Get call status and details
 * 
 * @param credentials - Zadarma API credentials
 * @param callId - Call ID from initiateCall
 * @returns Call status and details
 */
export async function getCallStatus(
  credentials: ZadarmaCredentials,
  callId: string
): Promise<{
  status: string;
  duration: number;
  recordingUrl?: string;
}> {
  const params = { call_id: callId };

  const result = await zadarmaRequest(
    credentials,
    "GET",
    "/v1/statistics/call/",
    params
  );

  return {
    status: result.disposition || "unknown",
    duration: parseInt(result.billsec || "0", 10),
    recordingUrl: result.record_link || undefined,
  };
}

/**
 * Get call history for a specific period
 * 
 * @param credentials - Zadarma API credentials
 * @param startDate - Start date (YYYY-MM-DD)
 * @param endDate - End date (YYYY-MM-DD)
 * @returns Array of call records
 */
export async function getCallHistory(
  credentials: ZadarmaCredentials,
  startDate: string,
  endDate: string
): Promise<any[]> {
  const params = {
    start: startDate,
    end: endDate,
  };

  const result = await zadarmaRequest(
    credentials,
    "GET",
    "/v1/statistics/",
    params
  );

  return result.calls || [];
}

/**
 * Get account balance
 * 
 * @param credentials - Zadarma API credentials
 * @returns Account balance and currency
 */
export async function getBalance(
  credentials: ZadarmaCredentials
): Promise<{ balance: number; currency: string }> {
  const result = await zadarmaRequest(credentials, "GET", "/v1/info/balance/");

  return {
    balance: parseFloat(result.balance || "0"),
    currency: result.currency || "USD",
  };
}

/**
 * Test Zadarma API credentials
 * 
 * @param credentials - Zadarma API credentials to test
 * @returns True if credentials are valid
 */
export async function testCredentials(
  credentials: ZadarmaCredentials
): Promise<boolean> {
  try {
    await getBalance(credentials);
    return true;
  } catch (error) {
    console.error("[Zadarma] Credential test failed:", error);
    return false;
  }
}
