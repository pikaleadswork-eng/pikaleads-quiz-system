import geoip from 'geoip-lite';

export type DetectedLanguage = 'uk' | 'ru' | 'en' | 'pl' | 'de';

/**
 * Detect language based on IP address geolocation
 */
export function detectLanguageFromIP(ip: string): DetectedLanguage {
  // Handle localhost/development
  if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') {
    return 'uk'; // Default to Ukrainian for local development
  }

  const geo = geoip.lookup(ip);
  
  if (!geo || !geo.country) {
    return 'en'; // Default to English if geolocation fails
  }

  const countryCode = geo.country;

  // Map country codes to languages
  const languageMap: Record<string, DetectedLanguage> = {
    'UA': 'uk', // Ukraine
    'RU': 'ru', // Russia
    'BY': 'ru', // Belarus
    'KZ': 'ru', // Kazakhstan
    'PL': 'pl', // Poland
    'DE': 'de', // Germany
    'AT': 'de', // Austria
    'CH': 'de', // Switzerland
    'US': 'en', // United States
    'GB': 'en', // United Kingdom
    'CA': 'en', // Canada
    'AU': 'en', // Australia
    'NZ': 'en', // New Zealand
    'IE': 'en', // Ireland
  };

  return languageMap[countryCode] || 'en';
}

/**
 * Get client IP address from request headers
 */
export function getClientIP(headers: Record<string, string | string[] | undefined>): string {
  // Check various headers for real IP (behind proxies/load balancers)
  const forwardedFor = headers['x-forwarded-for'];
  const realIP = headers['x-real-ip'];
  const cfConnectingIP = headers['cf-connecting-ip']; // Cloudflare

  if (typeof forwardedFor === 'string') {
    // X-Forwarded-For can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (typeof realIP === 'string') {
    return realIP;
  }

  if (typeof cfConnectingIP === 'string') {
    return cfConnectingIP;
  }

  // Fallback to localhost
  return '127.0.0.1';
}
