import { useState } from "react";
import { useLocation } from "wouter";
import QuizLayout from "./QuizLayout";
import ProgressBar from "./ProgressBar";
import QuizQuestion from "./QuizQuestion";
import LeadForm from "./LeadForm";
import { QuizConfig } from "@/lib/quizData";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface QuizProps {
  config: QuizConfig;
}

export default function Quiz({ config }: QuizProps) {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();

  const totalSteps = config.questions.length + 1; // questions + form
  const isFormStep = currentStep > config.questions.length;

  const submitLead = trpc.quiz.submitLead.useMutation({
    onSuccess: () => {
      toast.success("Thank you! Redirecting...");
      setTimeout(() => {
        setLocation("/thank-you");
      }, 500);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit. Please try again.");
    },
  });

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setAnswers({ ...answers, [currentStep]: answer });

    // Auto-advance after selection
    setTimeout(() => {
      if (currentStep < config.questions.length) {
        setCurrentStep(currentStep + 1);
        setSelectedAnswer(answers[currentStep + 1]);
      } else {
        setCurrentStep(currentStep + 1);
      }
    }, 300);
  };

  const handleFormSubmit = (data: { name: string; phone: string; telegram: string }) => {
    const answersArray = Object.entries(answers)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, answer]) => answer);

    submitLead.mutate({
      quizName: config.id,
      answers: JSON.stringify(answersArray),
      name: data.name,
      phone: data.phone,
      telegram: data.telegram || "",
    });
  };

  return (
    <QuizLayout title={config.title} subtitle={config.subtitle}>
      <div className="max-w-5xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {!isFormStep ? (
          <QuizQuestion
            question={config.questions[currentStep - 1]!.question}
            options={config.questions[currentStep - 1]!.options}
            onSelect={handleAnswerSelect}
            selectedAnswer={selectedAnswer}
          />
        ) : (
          <LeadForm onSubmit={handleFormSubmit} isLoading={submitLead.isPending} />
        )}
      </div>
    </QuizLayout>
  );
}
