import { useEffect, useState } from "react";

export interface UTMParams {
  utmCampaign?: string;
  utmAdGroup?: string;
  utmAd?: string;
  utmPlacement?: string;
  utmKeyword?: string;
  utmSite?: string;
  utmSource?: string;
  utmMedium?: string;
  utmContent?: string;
  utmTerm?: string;
}

/**
 * Hook to capture and persist UTM parameters from URL
 * Stores them in sessionStorage to maintain across page navigation
 */
export function useUTMParams(): UTMParams {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    // Check if we already have UTM params in sessionStorage
    const storedParams = sessionStorage.getItem("utm_params");
    if (storedParams) {
      try {
        setUtmParams(JSON.parse(storedParams));
        return;
      } catch (e) {
        console.warn("Failed to parse stored UTM params:", e);
      }
    }

    // Capture UTM params from URL
    const urlParams = new URLSearchParams(window.location.search);
    
    const params: UTMParams = {
      // Custom parameters for ad tracking
      utmCampaign: urlParams.get("utm_campaign") || undefined,
      utmAdGroup: urlParams.get("utm_adgroup") || urlParams.get("utm_ad_group") || undefined,
      utmAd: urlParams.get("utm_ad") || urlParams.get("utm_creative") || undefined,
      utmPlacement: urlParams.get("utm_placement") || urlParams.get("utm_source") || undefined,
      utmKeyword: urlParams.get("utm_keyword") || urlParams.get("utm_term") || undefined,
      utmSite: urlParams.get("utm_site") || urlParams.get("utm_network") || undefined,
      
      // Standard UTM parameters
      utmSource: urlParams.get("utm_source") || undefined,
      utmMedium: urlParams.get("utm_medium") || undefined,
      utmContent: urlParams.get("utm_content") || undefined,
      utmTerm: urlParams.get("utm_term") || undefined,
    };

    // Only store if we have at least one UTM parameter
    const hasParams = Object.values(params).some(value => value !== undefined);
    if (hasParams) {
      sessionStorage.setItem("utm_params", JSON.stringify(params));
      setUtmParams(params);
    }
  }, []);

  return utmParams;
}
