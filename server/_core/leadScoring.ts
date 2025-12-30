/**
 * Lead Scoring System
 * Automatically assigns quality scores (0-100) to leads based on multiple factors
 */

export interface LeadScoringFactors {
  // Response quality (0-30 points)
  responseSpeed?: number; // How quickly they filled the quiz (seconds)
  answerCompleteness?: number; // How many questions answered
  answerQuality?: string; // JSON of answers for analysis
  
  // Traffic source quality (0-25 points)
  utmSource?: string | null;
  utmCampaign?: string | null;
  utmMedium?: string | null;
  
  // Engagement (0-25 points)
  timeOnSite?: number; // Time spent on site in seconds
  
  // Contact quality (0-20 points)
  hasEmail?: boolean;
  hasTelegram?: boolean;
  hasPhone?: boolean;
}

/**
 * Calculate lead score based on multiple factors
 * Returns score from 0-100
 */
export function calculateLeadScore(factors: LeadScoringFactors): number {
  let score = 0;

  // 1. Response Speed Score (0-15 points)
  // Faster responses indicate higher intent
  if (factors.responseSpeed !== undefined) {
    const speedMinutes = factors.responseSpeed / 60;
    if (speedMinutes < 2) score += 15; // Very fast (< 2 min)
    else if (speedMinutes < 5) score += 12; // Fast (2-5 min)
    else if (speedMinutes < 10) score += 8; // Medium (5-10 min)
    else if (speedMinutes < 30) score += 4; // Slow (10-30 min)
    // else 0 points for very slow
  }

  // 2. Answer Completeness (0-15 points)
  if (factors.answerCompleteness !== undefined) {
    const completeness = factors.answerCompleteness;
    if (completeness >= 0.9) score += 15; // 90%+ answered
    else if (completeness >= 0.7) score += 12; // 70-90% answered
    else if (completeness >= 0.5) score += 8; // 50-70% answered
    else if (completeness >= 0.3) score += 4; // 30-50% answered
    // else 0 points for < 30%
  }

  // 3. Traffic Source Quality (0-25 points)
  // Prioritize high-intent sources
  const source = factors.utmSource?.toLowerCase() || '';
  const medium = factors.utmMedium?.toLowerCase() || '';
  
  if (source === 'google' && medium === 'cpc') {
    score += 25; // Google Search Ads - highest intent
  } else if (source === 'google' && medium === 'organic') {
    score += 22; // Organic search - high intent
  } else if (source === 'facebook' || source === 'instagram') {
    score += 15; // Social ads - medium intent
  } else if (source === 'email') {
    score += 18; // Email - good intent
  } else if (source === 'direct') {
    score += 20; // Direct - returning visitor
  } else if (medium === 'referral') {
    score += 16; // Referral - decent intent
  } else {
    score += 10; // Other sources - baseline
  }

  // 4. Time on Site (0-25 points)
  // More time = more interest
  if (factors.timeOnSite !== undefined) {
    const timeMinutes = factors.timeOnSite / 60;
    if (timeMinutes >= 10) score += 25; // 10+ minutes - very engaged
    else if (timeMinutes >= 5) score += 20; // 5-10 minutes - engaged
    else if (timeMinutes >= 3) score += 15; // 3-5 minutes - interested
    else if (timeMinutes >= 1) score += 10; // 1-3 minutes - browsing
    else score += 5; // < 1 minute - quick look
  }

  // 5. Contact Information Quality (0-20 points)
  let contactScore = 0;
  if (factors.hasPhone) contactScore += 10; // Phone is most valuable
  if (factors.hasEmail) contactScore += 7; // Email is good
  if (factors.hasTelegram) contactScore += 3; // Telegram is nice to have
  score += Math.min(contactScore, 20); // Cap at 20 points

  // Ensure score is between 0-100
  return Math.min(Math.max(Math.round(score), 0), 100);
}

/**
 * Get lead score category label
 */
export function getLeadScoreLabel(score: number): string {
  if (score >= 80) return 'Hot Lead 🔥';
  if (score >= 60) return 'Warm Lead 🌡️';
  if (score >= 40) return 'Cool Lead ❄️';
  return 'Cold Lead 🧊';
}

/**
 * Get lead score color for UI
 */
export function getLeadScoreColor(score: number): string {
  if (score >= 80) return '#ef4444'; // red-500
  if (score >= 60) return '#f97316'; // orange-500
  if (score >= 40) return '#eab308'; // yellow-500
  return '#6b7280'; // gray-500
}

/**
 * Get priority order based on score
 * Higher score = higher priority (lower number)
 */
export function getLeadPriority(score: number): number {
  if (score >= 80) return 1; // Highest priority
  if (score >= 60) return 2; // High priority
  if (score >= 40) return 3; // Medium priority
  return 4; // Low priority
}
