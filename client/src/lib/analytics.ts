/**
 * Google Analytics 4 Event Tracking
 * Send custom events to GA4 for conversion tracking
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export interface LeadEventData {
  lead_type: string;
  lead_value?: number;
  currency?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

/**
 * Track lead submission event in Google Analytics
 */
export function trackLeadSubmission(data: LeadEventData): void {
  if (typeof window === 'undefined') return;

  // Check if gtag is available
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'generate_lead', {
      lead_type: data.lead_type,
      value: data.lead_value || 0,
      currency: data.currency || 'UAH',
      utm_source: data.utm_source,
      utm_medium: data.utm_medium,
      utm_campaign: data.utm_campaign,
    });

    console.log('[Analytics] Lead submission tracked:', data);
  } else {
    console.warn('[Analytics] Google Analytics (gtag) not available');
  }
}

/**
 * Track form start event
 */
export function trackFormStart(formType: string): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'begin_checkout', {
      form_type: formType,
    });

    console.log('[Analytics] Form start tracked:', formType);
  }
}

/**
 * Track button click event
 */
export function trackButtonClick(buttonName: string, location: string): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'click', {
      event_category: 'Button',
      event_label: buttonName,
      page_location: location,
    });

    console.log('[Analytics] Button click tracked:', buttonName);
  }
}

/**
 * Track page view
 */
export function trackPageView(pagePath: string, pageTitle: string): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: pagePath,
      page_title: pageTitle,
    });

    console.log('[Analytics] Page view tracked:', pagePath);
  }
}

/**
 * Set user properties
 */
export function setUserProperties(properties: Record<string, any>): void {
  if (typeof window === 'undefined') return;

  if (typeof window.gtag === 'function') {
    window.gtag('set', 'user_properties', properties);

    console.log('[Analytics] User properties set:', properties);
  }
}
