// Meta Pixel Integration with placeholder support

declare global {
  interface Window {
    fbq?: (action: string, event: string, params?: Record<string, any>) => void;
  }
}

const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";

export function initMetaPixel() {
  if (!META_PIXEL_ID) {
    console.warn("[Meta Pixel] No Pixel ID configured. Add VITE_META_PIXEL_ID to enable tracking.");
    return;
  }

  // Initialize Meta Pixel
  if (typeof window !== "undefined" && !window.fbq) {
    const script = document.createElement("script");
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${META_PIXEL_ID}');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(script);
  }
}

export function trackMetaEvent(eventName: string, params?: Record<string, any>) {
  if (!META_PIXEL_ID) {
    console.log("[Meta Pixel - Mock]", eventName, params);
    return;
  }

  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", eventName, params);
  }
}

// Quiz-specific events
export function trackQuizStart(quizName: string) {
  trackMetaEvent("Lead", {
    content_name: quizName,
    content_category: "quiz_start",
  });
}

export function trackQuizStep(quizName: string, step: number, totalSteps: number) {
  trackMetaEvent("ViewContent", {
    content_name: quizName,
    content_category: "quiz_progress",
    step: step,
    total_steps: totalSteps,
  });
}

export function trackQuizComplete(quizName: string) {
  trackMetaEvent("CompleteRegistration", {
    content_name: quizName,
    content_category: "quiz_complete",
  });
}

export function trackFormSubmit(quizName: string, value?: number) {
  trackMetaEvent("Lead", {
    content_name: quizName,
    content_category: "form_submit",
    value: value || 0,
    currency: "USD",
  });
}
