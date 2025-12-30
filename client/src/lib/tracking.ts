/**
 * Tracking utilities for Meta Pixel, GA4, and GTM
 * Handles event tracking with deduplication support
 */

/**
 * Get or create Facebook Browser Pixel cookie (_fbp)
 */
export function getFbp(): string | null {
  const match = document.cookie.match(/_fbp=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Get Facebook Click ID cookie (_fbc)
 */
export function getFbc(): string | null {
  const match = document.cookie.match(/_fbc=([^;]+)/);
  return match ? match[1] : null;
}

/**
 * Get GA4 Client ID from cookie
 */
export function getGA4ClientId(): string | null {
  // GA4 stores client ID in _ga cookie as GA1.2.XXXXX.XXXXX
  const match = document.cookie.match(/_ga=([^;]+)/);
  if (match) {
    const parts = match[1].split(".");
    if (parts.length >= 4) {
      return `${parts[2]}.${parts[3]}`;
    }
  }
  return null;
}

/**
 * Generate unique event ID for deduplication
 */
export function generateEventId(prefix: string = "event"): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get UTM parameters from URL
 */
export function getUTMParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    utm_ad: params.get("utm_ad") || "",
    utm_adgroup: params.get("utm_adgroup") || "",
    utm_placement: params.get("utm_placement") || "",
    utm_keyword: params.get("utm_keyword") || "",
    utm_site: params.get("utm_site") || "",
  };
}

/**
 * Save UTM parameters to localStorage for later use
 */
export function saveUTMParams(): void {
  const utmParams = getUTMParams();
  if (Object.values(utmParams).some((v) => v)) {
    localStorage.setItem("utm_params", JSON.stringify(utmParams));
  }
}

/**
 * Get saved UTM parameters from localStorage
 */
export function getSavedUTMParams(): Record<string, string> {
  const saved = localStorage.getItem("utm_params");
  return saved ? JSON.parse(saved) : {};
}

/**
 * Track Meta Pixel event with event ID
 */
export function trackMetaEvent(
  eventName: string,
  params?: any,
  eventId?: string
): void {
  if (typeof window.fbq === "function") {
    // Meta Pixel accepts only 3 arguments: action, event, params
    // eventID should be inside params object
    const pixelParams = eventId ? { ...params, eventID: eventId } : params;
    window.fbq("track", eventName, pixelParams);
    console.log(`[Meta Pixel] ${eventName}`, pixelParams);
  }
}

/**
 * Push event to Google Tag Manager dataLayer
 */
export function pushToDataLayer(event: string, params?: any): void {
  if (window.dataLayer) {
    window.dataLayer.push({
      event,
      ...params,
    });
    console.log(`[GTM dataLayer] ${event}`, params);
  }
}

/**
 * Track quiz view (ViewContent event)
 */
export function trackQuizView(quizName: string): void {
  const eventId = generateEventId("quiz_view");

  // Meta Pixel
  trackMetaEvent(
    "ViewContent",
    {
      content_name: quizName,
      content_category: "quiz",
    },
    eventId
  );

  // GTM
  pushToDataLayer("quiz_view", {
    quiz_name: quizName,
    event_id: eventId,
  });
}

/**
 * Track quiz start (first question)
 */
export function trackQuizStart(quizName: string): void {
  const eventId = generateEventId("quiz_start");

  // GTM
  pushToDataLayer("quiz_start", {
    quiz_name: quizName,
    event_id: eventId,
  });
}

/**
 * Track lead submission (CompleteRegistration / generate_lead)
 * Returns event ID for server-side tracking
 */
export function trackLeadSubmission(params: {
  quizName: string;
  leadId?: number;
  value?: number;
}): string {
  const eventId = params.leadId
    ? `lead_${params.leadId}_${Date.now()}`
    : generateEventId("lead");

  // Meta Pixel
  trackMetaEvent(
    "CompleteRegistration",
    {
      content_name: params.quizName,
      content_category: "lead_generation",
      value: params.value || 0,
      currency: "UAH",
    },
    eventId
  );

  // GTM
  pushToDataLayer("generate_lead", {
    quiz_name: params.quizName,
    lead_id: params.leadId,
    value: params.value || 0,
    currency: "UAH",
    event_id: eventId,
    ...getSavedUTMParams(),
  });

  return eventId;
}

/**
 * Get all tracking data for server-side submission
 */
export function getTrackingData(): {
  fbp: string | null;
  fbc: string | null;
  ga4ClientId: string | null;
  clientIp?: string;
  userAgent: string;
  utmParams: Record<string, string>;
} {
  return {
    fbp: getFbp(),
    fbc: getFbc(),
    ga4ClientId: getGA4ClientId(),
    userAgent: navigator.userAgent,
    utmParams: getSavedUTMParams(),
  };
}

/**
 * Initialize tracking on page load
 */
export function initTracking(): void {
  // Save UTM parameters if present
  saveUTMParams();

  // Track page view in GTM
  pushToDataLayer("page_view", {
    page_path: window.location.pathname,
    page_title: document.title,
    ...getSavedUTMParams(),
  });
}
