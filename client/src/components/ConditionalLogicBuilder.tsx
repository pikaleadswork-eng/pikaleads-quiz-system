import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GitBranch, ArrowRight } from "lucide-react";
import type {
  QuestionConditionalLogic,
  ConditionalLogicRule,
  Condition,
  ConditionOperator,
  ConditionAction,
} from "../../../shared/conditionalLogic";
import { useTranslation } from "react-i18next";

interface ConditionalLogicBuilderProps {
  questions: Array<{ id: number; questionText: string; questionType: string }>;
  currentQuestionId: number;
  logic: QuestionConditionalLogic | null;
  onChange: (logic: QuestionConditionalLogic) => void;
}

export default function ConditionalLogicBuilder({
  questions,
  currentQuestionId,
  logic,
  onChange,
}: ConditionalLogicBuilderProps) {
  const { t } = useTranslation();

  const [rules, setRules] = useState<ConditionalLogicRule[]>(
    logic?.rules || []
  );

  const operators: Array<{ value: ConditionOperator; label: string }> = [
    { value: "equals", label: t("conditionalLogic.equals") },
    { value: "not_equals", label: t("conditionalLogic.notEquals") },
    { value: "greater_than", label: t("conditionalLogic.greaterThan") },
    { value: "less_than", label: t("conditionalLogic.lessThan") },
    { value: "contains", label: t("conditionalLogic.contains") },
    { value: "not_contains", label: t("conditionalLogic.notContains") },
    { value: "is_empty", label: t("conditionalLogic.isEmpty") },
    { value: "is_not_empty", label: t("conditionalLogic.isNotEmpty") },
  ];

  const actions: Array<{ value: ConditionAction; label: string }> = [
    { value: "show_question", label: t("conditionalLogic.showQuestion") },
    { value: "skip_to_question", label: t("conditionalLogic.skipToQuestion") },
    { value: "end_quiz", label: t("conditionalLogic.endQuiz") },
  ];

  const addRule = () => {
    const newRule: ConditionalLogicRule = {
      id: `rule_${Date.now()}`,
      matchType: "all",
      conditions: [
        {
          id: `condition_${Date.now()}`,
          questionId: questions[0]?.id || 0,
          operator: "equals",
          value: "",
          action: "show_question",
          targetQuestionId: questions[0]?.id || 0,
        },
      ],
    };

    const updatedRules = [...rules, newRule];
    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const removeRule = (ruleId: string) => {
    const updatedRules = rules.filter((r) => r.id !== ruleId);
    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const addCondition = (ruleId: string) => {
    const updatedRules = rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: [
            ...rule.conditions,
            {
              id: `condition_${Date.now()}`,
              questionId: questions[0]?.id || 0,
              operator: "equals" as ConditionOperator,
              value: "",
              action: "show_question" as ConditionAction,
              targetQuestionId: questions[0]?.id || 0,
            },
          ],
        };
      }
      return rule;
    });

    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const removeCondition = (ruleId: string, conditionId: string) => {
    const updatedRules = rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.filter((c) => c.id !== conditionId),
        };
      }
      return rule;
    });

    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const updateCondition = (
    ruleId: string,
    conditionId: string,
    field: keyof Condition,
    value: any
  ) => {
    const updatedRules = rules.map((rule) => {
      if (rule.id === ruleId) {
        return {
          ...rule,
          conditions: rule.conditions.map((condition) => {
            if (condition.id === conditionId) {
              return { ...condition, [field]: value };
            }
            return condition;
          }),
        };
      }
      return rule;
    });

    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  const updateRuleMatchType = (ruleId: string, matchType: "all" | "any") => {
    const updatedRules = rules.map((rule) => {
      if (rule.id === ruleId) {
        return { ...rule, matchType };
      }
      return rule;
    });

    setRules(updatedRules);
    onChange({ rules: updatedRules });
  };

  // Filter out current question from target options
  const availableQuestions = questions.filter(
    (q) => q.id !== currentQuestionId
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg font-semibold text-foreground">
            {t("conditionalLogic.title")}
          </h3>
        </div>
        <Button onClick={addRule} size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          {t("conditionalLogic.addRule")}
        </Button>
      </div>

      {rules.length === 0 ? (
        <Card className="p-8 text-center">
          <GitBranch className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">
            {t("conditionalLogic.noRules")}
          </p>
          <Button onClick={addRule} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" />
            {t("conditionalLogic.addFirstRule")}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {rules.map((rule, ruleIndex) => (
            <Card key={rule.id} className="p-4 border-l-4 border-l-purple-500">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {t("conditionalLogic.rule")} {ruleIndex + 1}
                  </span>
                  <Select
                    value={rule.matchType}
                    onValueChange={(value: "all" | "any") =>
                      updateRuleMatchType(rule.id, value)
                    }
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">
                        {t("conditionalLogic.matchAll")}
                      </SelectItem>
                      <SelectItem value="any">
                        {t("conditionalLogic.matchAny")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => removeRule(rule.id)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {rule.conditions.map((condition, conditionIndex) => (
                  <div
                    key={condition.id}
                    className="grid grid-cols-12 gap-2 items-end"
                  >
                    {/* Question Selector */}
                    <div className="col-span-3">
                      <Label className="text-xs text-muted-foreground">
                        {t("conditionalLogic.ifAnswer")}
                      </Label>
                      <Select
                        value={String(condition.questionId)}
                        onValueChange={(value) =>
                          updateCondition(
                            rule.id,
                            condition.id,
                            "questionId",
                            parseInt(value)
                          )
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questions.map((q) => (
                            <SelectItem key={q.id} value={String(q.id)}>
                              Q{q.id}: {q.questionText.substring(0, 30)}...
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Operator Selector */}
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        {t("conditionalLogic.operator")}
                      </Label>
                      <Select
                        value={condition.operator}
                        onValueChange={(value: ConditionOperator) =>
                          updateCondition(
                            rule.id,
                            condition.id,
                            "operator",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {operators.map((op) => (
                            <SelectItem key={op.value} value={op.value}>
                              {op.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Value Input */}
                    {!["is_empty", "is_not_empty"].includes(
                      condition.operator
                    ) && (
                      <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                          {t("conditionalLogic.value")}
                        </Label>
                        <Input
                          value={condition.value}
                          onChange={(e) =>
                            updateCondition(
                              rule.id,
                              condition.id,
                              "value",
                              e.target.value
                            )
                          }
                          placeholder={t("conditionalLogic.enterValue")}
                          className="h-9"
                        />
                      </div>
                    )}

                    {/* Arrow */}
                    <div className="col-span-1 flex justify-center pb-2">
                      <ArrowRight className="w-5 h-5 text-muted-foreground" />
                    </div>

                    {/* Action Selector */}
                    <div className="col-span-2">
                      <Label className="text-xs text-muted-foreground">
                        {t("conditionalLogic.action")}
                      </Label>
                      <Select
                        value={condition.action}
                        onValueChange={(value: ConditionAction) =>
                          updateCondition(
                            rule.id,
                            condition.id,
                            "action",
                            value
                          )
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {actions.map((action) => (
                            <SelectItem key={action.value} value={action.value}>
                              {action.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Target Question Selector */}
                    {(condition.action === "show_question" ||
                      condition.action === "skip_to_question") && (
                      <div className="col-span-2">
                        <Label className="text-xs text-muted-foreground">
                          {t("conditionalLogic.targetQuestion")}
                        </Label>
                        <Select
                          value={String(condition.targetQuestionId || "")}
                          onValueChange={(value) =>
                            updateCondition(
                              rule.id,
                              condition.id,
                              "targetQuestionId",
                              parseInt(value)
                            )
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableQuestions.map((q) => (
                              <SelectItem key={q.id} value={String(q.id)}>
                                Q{q.id}: {q.questionText.substring(0, 30)}...
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Remove Condition Button */}
                    {rule.conditions.length > 1 && (
                      <div className="col-span-1 pb-2">
                        <Button
                          onClick={() => removeCondition(rule.id, condition.id)}
                          variant="ghost"
                          size="sm"
                          className="h-9 w-full text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => addCondition(rule.id)}
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("conditionalLogic.addCondition")}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {rules.length > 0 && (
        <Card className="p-4 bg-muted/50">
          <h4 className="text-sm font-medium text-foreground mb-2">
            {t("conditionalLogic.logicPreview")}
          </h4>
          <div className="text-xs text-muted-foreground space-y-1">
            {rules.map((rule, index) => (
              <div key={rule.id}>
                <span className="font-medium">
                  {t("conditionalLogic.rule")} {index + 1}:
                </span>{" "}
                {rule.matchType === "all"
                  ? t("conditionalLogic.ifAllConditions")
                  : t("conditionalLogic.ifAnyCondition")}{" "}
                →{" "}
                {rule.conditions[0]?.action === "show_question"
                  ? t("conditionalLogic.showQuestionAction")
                  : rule.conditions[0]?.action === "skip_to_question"
                  ? t("conditionalLogic.skipToQuestionAction")
                  : t("conditionalLogic.endQuizAction")}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
