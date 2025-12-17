/**
 * Microsoft Clarity Custom Events
 * Track user behavior for deeper analytics
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
function buildClaritySessionURL(metadata: ClarityMetadata): string {
  return `https://clarity.microsoft.com/player/${metadata.projectId}/${metadata.userId}/${metadata.sessionId}`;
}

/**
 * Log event with Clarity session tracking
 */
async function logClarityEvent(eventName: string, eventData: any) {
  if (!window.clarity) return;

  // Track event in Clarity
  window.clarity('event', eventName, eventData);

  // Get session metadata for backend logging
  const metadata = await getClarityMetadata();
  
  // TODO: Send to backend eventsLog.logEvent with clarityUserId, claritySessionId, clarityProjectId
  // This will be implemented when integrating with backend
  if (metadata) {
    console.log('Clarity session:', buildClaritySessionURL(metadata));
  }
}

export const ClarityEvents = {
  /**
   * Track CTA button clicks
   */
  trackCTAClick: (buttonText: string, location: string) => {
    if (window.clarity) {
      window.clarity('event', 'cta_click', {
        button_text: buttonText,
        location: location,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Track form field interactions
   */
  trackFormFieldFocus: (fieldName: string, formType: string) => {
    if (window.clarity) {
      window.clarity('event', 'form_field_focus', {
        field_name: fieldName,
        form_type: formType,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackFormFieldBlur: (fieldName: string, formType: string, hasValue: boolean) => {
    if (window.clarity) {
      window.clarity('event', 'form_field_blur', {
        field_name: fieldName,
        form_type: formType,
        has_value: hasValue,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Track quiz drop-off
   */
  trackQuizStart: (quizId: string, quizName: string) => {
    if (window.clarity) {
      window.clarity('event', 'quiz_start', {
        quiz_id: quizId,
        quiz_name: quizName,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackQuizQuestionView: (quizId: string, questionIndex: number, totalQuestions: number) => {
    if (window.clarity) {
      window.clarity('event', 'quiz_question_view', {
        quiz_id: quizId,
        question_index: questionIndex,
        total_questions: totalQuestions,
        progress_percentage: Math.round((questionIndex / totalQuestions) * 100),
        timestamp: new Date().toISOString()
      });
    }
  },

  trackQuizQuestionAnswer: (quizId: string, questionIndex: number, answerText: string) => {
    if (window.clarity) {
      window.clarity('event', 'quiz_question_answer', {
        quiz_id: quizId,
        question_index: questionIndex,
        answer_text: answerText,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackQuizDropOff: (quizId: string, questionIndex: number, totalQuestions: number, reason?: string) => {
    if (window.clarity) {
      window.clarity('event', 'quiz_drop_off', {
        quiz_id: quizId,
        question_index: questionIndex,
        total_questions: totalQuestions,
        drop_off_stage: `Question ${questionIndex} of ${totalQuestions}`,
        reason: reason || 'user_exit',
        timestamp: new Date().toISOString()
      });
    }
  },

  trackQuizComplete: (quizId: string, totalQuestions: number, timeSpent: number) => {
    if (window.clarity) {
      window.clarity('event', 'quiz_complete', {
        quiz_id: quizId,
        total_questions: totalQuestions,
        time_spent_seconds: timeSpent,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Track lead form submission
   */
  trackLeadFormStart: (quizId: string) => {
    if (window.clarity) {
      window.clarity('event', 'lead_form_start', {
        quiz_id: quizId,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackLeadFormSubmit: (quizId: string, hasEmail: boolean, hasTelegram: boolean) => {
    if (window.clarity) {
      window.clarity('event', 'lead_form_submit', {
        quiz_id: quizId,
        has_email: hasEmail,
        has_telegram: hasTelegram,
        timestamp: new Date().toISOString()
      });
    }
  },

  /**
   * Track page interactions
   */
  trackScrollDepth: (percentage: number, page: string) => {
    if (window.clarity) {
      window.clarity('event', 'scroll_depth', {
        percentage: percentage,
        page: page,
        timestamp: new Date().toISOString()
      });
    }
  },

  trackTimeOnPage: (seconds: number, page: string) => {
    if (window.clarity) {
      window.clarity('event', 'time_on_page', {
        seconds: seconds,
        page: page,
        timestamp: new Date().toISOString()
      });
    }
  }
};
