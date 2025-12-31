/**
 * Microsoft Clarity Custom Events
 * Track user behavior for deeper analytics with automatic backend logging
 */

declare global {
  interface Window {
    clarity?: (action: string, ...args: any[]) => void;
  }
}

interface ClarityMetadata {
  projectId: string;
  userId: string;
  sessionId: string;
}

/**
 * Get Clarity session metadata (userId, sessionId, projectId)
 */
function getClarityMetadata(): Promise<ClarityMetadata | null> {
  return new Promise((resolve) => {
    if (!window.clarity) {
      resolve(null);
      return;
    }

    try {
      window.clarity('metadata', (metadata: ClarityMetadata) => {
        if (metadata && metadata.projectId && metadata.userId && metadata.sessionId) {
          resolve(metadata);
        } else {
          resolve(null);
        }
      });
      
      // Timeout after 2 seconds
      setTimeout(() => resolve(null), 2000);
    } catch (error) {
      console.error('Error getting Clarity metadata:', error);
      resolve(null);
    }
  });
}

/**
 * Build Clarity session recording URL
 */
export function buildClaritySessionURL(metadata: ClarityMetadata): string {
  return `https://clarity.microsoft.com/player/${metadata.projectId}/${metadata.userId}/${metadata.sessionId}`;
}

/**
 * Log event with Clarity session tracking and send to backend
 */
async function logClarityEventToBackend(
  eventName: string,
  eventData: any,
  status: 'success' | 'fail' | 'pending' = 'success',
  errorMessage?: string
) {
  if (!window.clarity) return;

  // Track event in Clarity
  window.clarity('event', eventName, eventData);

  // Get session metadata for backend logging
  const metadata = await getClarityMetadata();
  
  // Send to backend eventsLog.logEvent
  try {
    const response = await fetch('/api/trpc/eventsLog.logEvent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType: eventName,
        platform: 'clarity',
        status,
        eventData,
        errorMessage,
        clarityUserId: metadata?.userId,
        claritySessionId: metadata?.sessionId,
        clarityProjectId: metadata?.projectId,
        responseTime: Date.now(),
      }),
    });

    if (!response.ok) {
      console.error('Failed to log Clarity event to backend:', response.statusText);
    }
  } catch (error) {
    console.error('Error logging Clarity event:', error);
  }
}

export const ClarityEvents = {
  /**
   * Track CTA button clicks
   */
  trackCTAClick: async (buttonText: string, location: string) => {
    await logClarityEventToBackend('cta_click', {
      button_text: buttonText,
      location: location,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Track form field interactions
   */
  trackFormFieldFocus: async (fieldName: string, formType: string) => {
    await logClarityEventToBackend('form_field_focus', {
      field_name: fieldName,
      form_type: formType,
      timestamp: new Date().toISOString()
    });
  },

  trackFormFieldBlur: async (fieldName: string, formType: string, hasValue: boolean) => {
    await logClarityEventToBackend('form_field_blur', {
      field_name: fieldName,
      form_type: formType,
      has_value: hasValue,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Track quiz progress
   */
  trackQuizStart: async (quizId: string, quizName: string) => {
    await logClarityEventToBackend('quiz_start', {
      quiz_id: quizId,
      quiz_name: quizName,
      timestamp: new Date().toISOString()
    });
  },

  trackQuizQuestionView: async (quizId: string, questionIndex: number, totalQuestions: number) => {
    await logClarityEventToBackend('quiz_question_view', {
      quiz_id: quizId,
      question_index: questionIndex,
      total_questions: totalQuestions,
      progress_percentage: Math.round((questionIndex / totalQuestions) * 100),
      timestamp: new Date().toISOString()
    });
  },

  trackQuizQuestionAnswer: async (quizId: string, questionIndex: number, answerText: string) => {
    await logClarityEventToBackend('quiz_question_answer', {
      quiz_id: quizId,
      question_index: questionIndex,
      answer_text: answerText,
      timestamp: new Date().toISOString()
    });
  },

  trackQuizDropOff: async (quizId: string, questionIndex: number, totalQuestions: number, reason?: string) => {
    await logClarityEventToBackend('quiz_drop_off', {
      quiz_id: quizId,
      question_index: questionIndex,
      total_questions: totalQuestions,
      drop_off_percentage: Math.round((questionIndex / totalQuestions) * 100),
      reason: reason,
      timestamp: new Date().toISOString()
    });
  },

  trackQuizComplete: async (quizId: string, totalQuestions: number, timeSpent: number) => {
    await logClarityEventToBackend('quiz_complete', {
      quiz_id: quizId,
      total_questions: totalQuestions,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString()
    });
  },

  /**
   * Track lead form submission
   */
  trackLeadFormSubmit: async (formType: string, leadData: any) => {
    await logClarityEventToBackend('lead_form_submit', {
      form_type: formType,
      ...leadData,
      timestamp: new Date().toISOString()
    });
  },
};
