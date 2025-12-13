/**
 * Conditional Logic Types for Quiz Questions
 * 
 * Enables question branching based on answers:
 * - If answer = X → show question Y
 * - If budget < 500 → skip to question Z
 * - If service contains "premium" → show upsell question
 */

export type ConditionOperator =
  | "equals"           // answer === value
  | "not_equals"       // answer !== value
  | "greater_than"     // answer > value (for numbers/sliders)
  | "less_than"        // answer < value (for numbers/sliders)
  | "contains"         // answer.includes(value) (for text)
  | "not_contains"     // !answer.includes(value)
  | "is_empty"         // !answer || answer === ""
  | "is_not_empty";    // answer && answer !== ""

export type ConditionAction =
  | "show_question"    // Show specific question
  | "skip_to_question" // Skip to specific question
  | "end_quiz"         // End quiz immediately
  | "show_result";     // Show specific result page

export interface Condition {
  id: string;
  questionId: number;           // Which question's answer to check
  operator: ConditionOperator;
  value: string | number;       // Value to compare against
  action: ConditionAction;
  targetQuestionId?: number;    // Target question ID (for show/skip actions)
  targetResultId?: string;      // Target result ID (for show_result action)
}

export interface ConditionalLogicRule {
  id: string;
  conditions: Condition[];      // Multiple conditions (AND logic)
  matchType: "all" | "any";     // ALL conditions must match OR ANY condition matches
}

export interface QuestionConditionalLogic {
  rules: ConditionalLogicRule[];
  defaultAction?: {
    action: ConditionAction;
    targetQuestionId?: number;
  };
}

/**
 * Helper functions for conditional logic
 */

export function evaluateCondition(
  condition: Condition,
  answer: any
): boolean {
  const { operator, value } = condition;

  switch (operator) {
    case "equals":
      return answer === value;
    case "not_equals":
      return answer !== value;
    case "greater_than":
      return Number(answer) > Number(value);
    case "less_than":
      return Number(answer) < Number(value);
    case "contains":
      return String(answer).toLowerCase().includes(String(value).toLowerCase());
    case "not_contains":
      return !String(answer).toLowerCase().includes(String(value).toLowerCase());
    case "is_empty":
      return !answer || answer === "";
    case "is_not_empty":
      return answer && answer !== "";
    default:
      return false;
  }
}

export function evaluateRule(
  rule: ConditionalLogicRule,
  answers: Record<number, any>
): boolean {
  const { conditions, matchType } = rule;

  if (matchType === "all") {
    return conditions.every((condition) =>
      evaluateCondition(condition, answers[condition.questionId])
    );
  } else {
    return conditions.some((condition) =>
      evaluateCondition(condition, answers[condition.questionId])
    );
  }
}

export function getNextQuestion(
  currentQuestionId: number,
  answers: Record<number, any>,
  questions: Array<{ id: number; conditionalLogic?: string }>
): number | null {
  const currentQuestion = questions.find((q) => q.id === currentQuestionId);
  if (!currentQuestion || !currentQuestion.conditionalLogic) {
    // No conditional logic, go to next question in order
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
    return questions[currentIndex + 1]?.id || null;
  }

  try {
    const logic: QuestionConditionalLogic = JSON.parse(currentQuestion.conditionalLogic);

    // Evaluate rules in order
    for (const rule of logic.rules) {
      if (evaluateRule(rule, answers)) {
        // Rule matched, execute action
        const firstCondition = rule.conditions[0];
        if (firstCondition.action === "show_question" || firstCondition.action === "skip_to_question") {
          return firstCondition.targetQuestionId || null;
        } else if (firstCondition.action === "end_quiz") {
          return null;
        }
      }
    }

    // No rule matched, use default action or next question
    if (logic.defaultAction?.action === "show_question") {
      return logic.defaultAction.targetQuestionId || null;
    }

    // Fall back to next question
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
    return questions[currentIndex + 1]?.id || null;
  } catch (error) {
    console.error("Error parsing conditional logic:", error);
    // Fall back to next question
    const currentIndex = questions.findIndex((q) => q.id === currentQuestionId);
    return questions[currentIndex + 1]?.id || null;
  }
}
