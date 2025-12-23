/**
 * UTM Tracking Utility
 * Captures and stores UTM parameters from URL
 */

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  utm_ad?: string;
  utm_adgroup?: string;
  utm_placement?: string;
  utm_keyword?: string;
}

const UTM_STORAGE_KEY = 'pikaleads_utm_params';
const UTM_EXPIRY_DAYS = 30;

/**
 * Extract UTM parameters from URL
 */
export function getUTMFromURL(): UTMParams {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  // Standard UTM parameters
  const utmKeys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    'utm_ad',
    'utm_adgroup',
    'utm_placement',
    'utm_keyword',
  ];

  utmKeys.forEach((key) => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
}

/**
 * Save UTM parameters to localStorage with expiry
 */
export function saveUTMParams(params: UTMParams): void {
  if (typeof window === 'undefined') return;
  
  const data = {
    params,
    expiry: Date.now() + UTM_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
  };

  try {
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save UTM params:', error);
  }
}

/**
 * Get stored UTM parameters from localStorage
 */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    if (!stored) return {};

    const data = JSON.parse(stored);
    
    // Check if expired
    if (data.expiry && Date.now() > data.expiry) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return {};
    }

    return data.params || {};
  } catch (error) {
    console.error('Failed to get stored UTM params:', error);
    return {};
  }
}

/**
 * Initialize UTM tracking on page load
 * Call this in your app initialization
 */
export function initUTMTracking(): UTMParams {
  const urlParams = getUTMFromURL();
  
  // If URL has UTM params, save them
  if (Object.keys(urlParams).length > 0) {
    saveUTMParams(urlParams);
    return urlParams;
  }

  // Otherwise, return stored params
  return getStoredUTMParams();
}

/**
 * Get current UTM parameters (from URL or storage)
 */
export function getCurrentUTMParams(): UTMParams {
  const urlParams = getUTMFromURL();
  
  // Prefer URL params over stored params
  if (Object.keys(urlParams).length > 0) {
    return urlParams;
  }

  return getStoredUTMParams();
}

/**
 * Clear stored UTM parameters
 */
export function clearUTMParams(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear UTM params:', error);
  }
}
