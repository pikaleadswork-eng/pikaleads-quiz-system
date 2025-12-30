import { useEffect } from 'react';
import { trpc } from '@/lib/trpc';

/**
 * AnalyticsScripts component
 * Automatically injects GA4, Meta Pixel, and Microsoft Clarity tracking codes
 * based on saved settings in the database
 */
export function AnalyticsScripts() {
  const { data: analyticsSettings } = trpc.analyticsSettings.getAll.useQuery();

  useEffect(() => {
    if (!analyticsSettings) return;

    // Find active settings
    const ga4 = analyticsSettings.find(s => s.provider === 'ga4' && s.isActive);
    const metaPixel = analyticsSettings.find(s => s.provider === 'meta_pixel' && s.isActive);
    const clarity = analyticsSettings.find(s => s.provider === 'microsoft_clarity' && s.isActive);
    const gtm = analyticsSettings.find(s => s.provider === 'google_tag_manager' && s.isActive);

    // Inject Google Analytics 4
    if (ga4) {
      // Check if already loaded
      if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${ga4.trackingId}"]`)) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4.trackingId}`;
        document.head.appendChild(script);

        const inlineScript = document.createElement('script');
        inlineScript.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${ga4.trackingId}');
        `;
        document.head.appendChild(inlineScript);
      }
    }

    // Inject Meta Pixel
    if (metaPixel) {
      // Check if already loaded (prevent duplicates)
      if (!document.querySelector(`script[data-pixel-id="${metaPixel.trackingId}"]`)) {
        const script = document.createElement('script');
        script.setAttribute('data-pixel-id', metaPixel.trackingId);
        script.innerHTML = `
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${metaPixel.trackingId}');
          fbq('track', 'PageView');
        `;
        document.head.appendChild(script);

        // Add noscript fallback (only if not already present)
        // Note: This is for browsers with JavaScript disabled
        // Meta Pixel Helper may count this as "2 pixels" but it's correct implementation
        if (!document.querySelector(`noscript img[src*="${metaPixel.trackingId}"]`)) {
          const noscript = document.createElement('noscript');
          const img = document.createElement('img');
          img.height = 1;
          img.width = 1;
          img.style.display = 'none';
          img.src = `https://www.facebook.com/tr?id=${metaPixel.trackingId}&ev=PageView&noscript=1`;
          noscript.appendChild(img);
          // Insert at the beginning of body (Facebook's recommendation)
          document.body.insertBefore(noscript, document.body.firstChild);
        }
      }
    }

    // Inject Google Tag Manager
    if (gtm) {
      if (!document.querySelector(`script[data-gtm-id="${gtm.trackingId}"]`)) {
        // GTM Head Script
        const headScript = document.createElement('script');
        headScript.setAttribute('data-gtm-id', gtm.trackingId);
        headScript.innerHTML = `
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${gtm.trackingId}');
        `;
        document.head.insertBefore(headScript, document.head.firstChild);

        // GTM Body Noscript
        const noscript = document.createElement('noscript');
        const iframe = document.createElement('iframe');
        iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtm.trackingId}`;
        iframe.height = '0';
        iframe.width = '0';
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
        noscript.appendChild(iframe);
        document.body.insertBefore(noscript, document.body.firstChild);
      }
    }

    // Inject Microsoft Clarity
    if (clarity) {
      if (!document.querySelector(`script[data-clarity-id="${clarity.trackingId}"]`)) {
        const script = document.createElement('script');
        script.setAttribute('data-clarity-id', clarity.trackingId);
        script.innerHTML = `
          (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarity.trackingId}");
        `;
        document.head.appendChild(script);
      }
    }
  }, [analyticsSettings]);

  return null; // This component doesn't render anything
}
