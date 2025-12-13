import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { getNextQuestion } from "../../../shared/conditionalLogic";
import type { QuizQuestion } from "../../../drizzle/schema";

interface QuizPreviewProps {
  questions: QuizQuestion[];
  buttonStyle?: {
    text: string;
    color: string;
    icon?: string;
    animation?: string;
  };
  onClose?: () => void;
}

export default function QuizPreview({
  questions,
  buttonStyle,
  onClose,
}: QuizPreviewProps) {
  const { t } = useTranslation();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswer = (value: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
  };

  const handleNext = () => {
    // Check if conditional logic exists
    if (currentQuestion.conditionalLogic) {
      const nextQuestionId = getNextQuestion(
        currentQuestion.id,
        answers,
        questions
      );

      if (nextQuestionId === null) {
        // End quiz
        setIsCompleted(true);
        return;
      }

      // Find next question index
      const nextIndex = questions.findIndex((q) => q.id === nextQuestionId);
      if (nextIndex !== -1) {
        setCurrentQuestionIndex(nextIndex);
        return;
      }
    }

    // No conditional logic or not found, go to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
  };

  const renderQuestionInput = () => {
    const config = currentQuestion.config
      ? JSON.parse(currentQuestion.config)
      : {};

    switch (currentQuestion.questionType) {
      case "text_input":
        return (
          <Input
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={config.placeholder || t("quizPreview.enterAnswer")}
            className="bg-zinc-800"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={config.placeholder || t("quizPreview.enterAnswer")}
            className="bg-zinc-800 min-h-[100px]"
          />
        );

      case "email":
        return (
          <Input
            type="email"
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={config.placeholder || "email@example.com"}
            className="bg-zinc-800"
          />
        );

      case "phone":
        return (
          <Input
            type="tel"
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={config.placeholder || "+1 (555) 000-0000"}
            className="bg-zinc-800"
          />
        );

      case "single_choice":
        const singleOptions = config.options || [];
        return (
          <RadioGroup
            value={answers[currentQuestion.id]}
            onValueChange={handleAnswer}
          >
            {singleOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "multiple_choice":
        const multiOptions = config.options || [];
        const selectedOptions = answers[currentQuestion.id] || [];
        return (
          <div className="space-y-2">
            {multiOptions.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleAnswer([...selectedOptions, option]);
                    } else {
                      handleAnswer(
                        selectedOptions.filter((o: string) => o !== option)
                      );
                    }
                  }}
                  id={`multi-option-${index}`}
                />
                <Label
                  htmlFor={`multi-option-${index}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case "slider":
        const min = config.min || 0;
        const max = config.max || 100;
        const step = config.step || 1;
        const value = answers[currentQuestion.id] || min;
        return (
          <div className="space-y-4">
            <Slider
              value={[value]}
              onValueChange={(values) => handleAnswer(values[0])}
              min={min}
              max={max}
              step={step}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{min}</span>
              <span className="font-semibold text-foreground">{value}</span>
              <span>{max}</span>
            </div>
          </div>
        );

      case "rating":
        const stars = config.stars || 5;
        const rating = answers[currentQuestion.id] || 0;
        return (
          <div className="flex gap-2">
            {Array.from({ length: stars }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className={`text-3xl transition-colors ${
                  index < rating ? "text-yellow-400" : "text-gray-600"
                }`}
              >
                ★
              </button>
            ))}
          </div>
        );

      case "file_upload":
        return (
          <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAnswer(file.name);
                }
              }}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="text-muted-foreground">
                {answers[currentQuestion.id] || t("quizPreview.uploadFile")}
              </div>
            </Label>
          </div>
        );

      default:
        return (
          <Input
            value={answers[currentQuestion.id] || ""}
            onChange={(e) => handleAnswer(e.target.value)}
            placeholder={t("quizPreview.enterAnswer")}
            className="bg-zinc-800"
          />
        );
    }
  };

  if (isCompleted) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          {t("quizPreview.completed")}
        </h2>
        <p className="text-muted-foreground mb-6">
          {t("quizPreview.completedMessage")}
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            {t("quizPreview.restart")}
          </Button>
          {onClose && (
            <Button onClick={onClose}>{t("quizPreview.close")}</Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {t("quizPreview.question")} {currentQuestionIndex + 1} {t("quizPreview.of")}{" "}
            {questions.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {currentQuestion.questionText}
            </h3>
            {currentQuestion.isRequired && (
              <span className="text-sm text-red-400">
                * {t("quizPreview.required")}
              </span>
            )}
          </div>

          {renderQuestionInput()}
        </div>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-2 justify-between">
        <Button
          onClick={handleReset}
          variant="outline"
          className="gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          {t("quizPreview.restart")}
        </Button>

        <Button
          onClick={handleNext}
          disabled={
            currentQuestion.isRequired && !answers[currentQuestion.id]
          }
          style={{
            backgroundColor: buttonStyle?.color || "#FFD93D",
            color: "#000",
          }}
        >
          {currentQuestionIndex === questions.length - 1
            ? t("quizPreview.finish")
            : buttonStyle?.text || t("quizPreview.next")}
        </Button>
      </div>
    </div>
  );
}
