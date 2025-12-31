/**
 * A/B Testing Module
 * Handles variant assignment, traffic splitting, and session management
 */

export interface ABTestVariant {
  id: number;
  variantName: string;
  trafficPercentage: number;
  content: {
    title?: string;
    subtitle?: string;
    questions?: Array<{
      question: string;
      options: string[];
    }>;
  };
}

export interface ABTestAssignment {
  sessionId: string;
  quizId: string;
  variantId: number;
  variantName: string;
}

/**
 * Generate a unique session ID for the user
 */
export function getOrCreateSessionId(): string {
  const SESSION_KEY = 'pikaleads_session_id';
  
  let sessionId = localStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

/**
 * Assign a variant to the user based on traffic percentages
 * Uses deterministic hashing to ensure consistent assignment
 */
export function assignVariant(
  sessionId: string,
  quizId: string,
  variants: ABTestVariant[]
): ABTestVariant | null {
  if (!variants || variants.length === 0) {
    return null;
  }

  // Check if user already has an assignment for this quiz
  const ASSIGNMENT_KEY = `ab_assignment_${quizId}`;
  const existingAssignment = localStorage.getItem(ASSIGNMENT_KEY);
  
  if (existingAssignment) {
    try {
      const parsed = JSON.parse(existingAssignment);
      const variant = variants.find(v => v.id === parsed.variantId);
      if (variant) {
        return variant;
      }
    } catch (e) {
      // Invalid stored data, continue with new assignment
    }
  }

  // Sort variants by traffic percentage for consistent assignment
  const sortedVariants = [...variants].sort((a, b) => a.id - b.id);
  
  // Simple hash function for deterministic assignment
  const hash = simpleHash(`${sessionId}_${quizId}`);
  const hashValue = hash % 100; // 0-99
  
  // Assign based on cumulative traffic percentages
  let cumulative = 0;
  let assignedVariant: ABTestVariant | null = null;
  
  for (const variant of sortedVariants) {
    cumulative += variant.trafficPercentage;
    if (hashValue < cumulative) {
      assignedVariant = variant;
      break;
    }
  }
  
  // Fallback to first variant if no match (shouldn't happen if percentages sum to 100)
  if (!assignedVariant && sortedVariants.length > 0) {
    assignedVariant = sortedVariants[0];
  }
  
  // Store assignment
  if (assignedVariant) {
    const assignment: ABTestAssignment = {
      sessionId,
      quizId,
      variantId: assignedVariant.id,
      variantName: assignedVariant.variantName,
    };
    localStorage.setItem(ASSIGNMENT_KEY, JSON.stringify(assignment));
  }
  
  return assignedVariant;
}

/**
 * Get the current variant assignment for a quiz
 */
export function getCurrentAssignment(quizId: string): ABTestAssignment | null {
  const ASSIGNMENT_KEY = `ab_assignment_${quizId}`;
  const stored = localStorage.getItem(ASSIGNMENT_KEY);
  
  if (!stored) return null;
  
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}

/**
 * Clear assignment for a quiz (useful for testing)
 */
export function clearAssignment(quizId: string): void {
  const ASSIGNMENT_KEY = `ab_assignment_${quizId}`;
  localStorage.removeItem(ASSIGNMENT_KEY);
}

/**
 * Simple hash function for deterministic variant assignment
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Calculate statistical significance for A/B test results
 * Returns p-value and confidence level
 */
export function calculateStatisticalSignificance(
  controlConversions: number,
  controlTotal: number,
  variantConversions: number,
  variantTotal: number
): {
  pValue: number;
  isSignificant: boolean;
  confidenceLevel: number;
  uplift: number;
} {
  // Calculate conversion rates
  const controlRate = controlTotal > 0 ? controlConversions / controlTotal : 0;
  const variantRate = variantTotal > 0 ? variantConversions / variantTotal : 0;
  
  // Calculate uplift
  const uplift = controlRate > 0 ? ((variantRate - controlRate) / controlRate) * 100 : 0;
  
  // Calculate pooled probability
  const pooledProb = (controlConversions + variantConversions) / (controlTotal + variantTotal);
  
  // Calculate standard error
  const se = Math.sqrt(pooledProb * (1 - pooledProb) * (1 / controlTotal + 1 / variantTotal));
  
  // Calculate z-score
  const zScore = se > 0 ? (variantRate - controlRate) / se : 0;
  
  // Calculate p-value (two-tailed test)
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
  
  // Determine significance (p < 0.05 means 95% confidence)
  const isSignificant = pValue < 0.05;
  const confidenceLevel = (1 - pValue) * 100;
  
  return {
    pValue,
    isSignificant,
    confidenceLevel: Math.min(confidenceLevel, 99.9),
    uplift,
  };
}

/**
 * Normal cumulative distribution function (approximation)
 */
function normalCDF(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - prob : prob;
}
