/**
 * Lead Scoring System
 * Calculates lead quality score (0-100) based on quiz answers and UTM parameters
 */

interface LeadData {
  answers: string; // JSON string
  utmCampaign?: string | null;
  utmKeyword?: string | null;
  utmSource?: string | null;
  email?: string | null;
  telegram?: string | null;
}

export function calculateLeadScore(lead: LeadData): number {
  let score = 0;
  
  // Base score: 20 points for completing the quiz
  score += 20;
  
  // Contact information quality (30 points max)
  if (lead.email) {
    score += 15; // Email provided
  }
  if (lead.telegram) {
    score += 15; // Telegram provided
  }
  
  // Quiz answers quality (30 points max)
  try {
    const answers = JSON.parse(lead.answers);
    const answerCount = Object.keys(answers).length;
    
    // More detailed answers = higher quality
    if (answerCount >= 5) {
      score += 30;
    } else if (answerCount >= 3) {
      score += 20;
    } else if (answerCount >= 1) {
      score += 10;
    }
  } catch (error) {
    // Invalid JSON, give minimum points
    score += 5;
  }
  
  // UTM quality (20 points max)
  score += calculateUTMScore(lead);
  
  // Cap at 100
  return Math.min(score, 100);
}

function calculateUTMScore(lead: LeadData): number {
  let utmScore = 0;
  
  // Campaign quality (10 points)
  if (lead.utmCampaign) {
    // Branded campaigns are higher quality
    const isBranded = /brand|trademark|company|official/i.test(lead.utmCampaign);
    utmScore += isBranded ? 10 : 5;
  }
  
  // Keyword quality (5 points)
  if (lead.utmKeyword) {
    // Long-tail keywords indicate higher intent
    const wordCount = lead.utmKeyword.split(/\s+/).length;
    if (wordCount >= 3) {
      utmScore += 5;
    } else if (wordCount >= 2) {
      utmScore += 3;
    } else {
      utmScore += 1;
    }
  }
  
  // Source quality (5 points)
  if (lead.utmSource) {
    // Paid sources are typically higher quality
    const isPaid = /google|facebook|instagram|linkedin|paid/i.test(lead.utmSource);
    utmScore += isPaid ? 5 : 2;
  }
  
  return utmScore;
}

/**
 * Get score badge color based on score
 */
export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return "green";
  if (score >= 60) return "yellow";
  if (score >= 40) return "orange";
  return "red";
}

/**
 * Get score explanation
 */
export function getScoreExplanation(score: number): string {
  if (score >= 80) {
    return "High quality lead with complete information and strong intent signals";
  }
  if (score >= 60) {
    return "Good quality lead with most information provided";
  }
  if (score >= 40) {
    return "Medium quality lead, some information missing";
  }
  return "Low quality lead, limited information or weak intent signals";
}
