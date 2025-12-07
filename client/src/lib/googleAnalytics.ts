// Google Analytics 4 Integration with placeholder support

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "";

export function initGA4() {
  if (!GA4_MEASUREMENT_ID) {
    console.warn("[GA4] No Measurement ID configured. Add VITE_GA4_MEASUREMENT_ID to enable tracking.");
    return;
  }

  // Initialize Google Analytics 4
  if (typeof window !== "undefined" && !window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA4_MEASUREMENT_ID);

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }
}

export function trackGA4Event(eventName: string, params?: Record<string, any>) {
  if (!GA4_MEASUREMENT_ID) {
    console.log("[GA4 - Mock]", eventName, params);
    return;
  }

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params);
  }
}

// Quiz-specific events
export function trackQuizStart(quizName: string, language: string) {
  trackGA4Event("quiz_start", {
    quiz_name: quizName,
    language: language,
  });
}

export function trackQuizStep(quizName: string, step: number, totalSteps: number, answer: string) {
  trackGA4Event("quiz_step", {
    quiz_name: quizName,
    step_number: step,
    total_steps: totalSteps,
    answer: answer,
  });
}

export function trackQuizComplete(quizName: string, language: string) {
  trackGA4Event("quiz_complete", {
    quiz_name: quizName,
    language: language,
  });
}

export function trackFormView(quizName: string) {
  trackGA4Event("form_view", {
    quiz_name: quizName,
  });
}

export function trackFormSubmit(quizName: string, language: string) {
  trackGA4Event("generate_lead", {
    quiz_name: quizName,
    language: language,
    value: 1,
  });
}

export function trackDropOff(quizName: string, step: number, totalSteps: number) {
  trackGA4Event("quiz_drop_off", {
    quiz_name: quizName,
    step_number: step,
    total_steps: totalSteps,
    drop_off_rate: ((step / totalSteps) * 100).toFixed(2),
  });
}
