import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import QuizLayout from "./QuizLayout";
import ProgressBar from "./ProgressBar";
import QuizQuestion from "./QuizQuestion";
import LeadForm from "./LeadForm";
import { QuizConfig } from "@/lib/quizData";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";
import { getQuizTranslation } from "@/lib/quizTranslations";
import { translations } from "@/lib/translations";
import { trackQuizStep as trackMetaStep, trackQuizComplete as trackMetaComplete, trackFormSubmit as trackMetaFormSubmit } from "@/lib/metaPixel";
import { trackQuizStep as trackGA4Step, trackQuizComplete as trackGA4Complete, trackFormView, trackFormSubmit as trackGA4FormSubmit, trackDropOff } from "@/lib/googleAnalytics";
import { getOrCreateSessionId, getCurrentAssignment, assignVariant } from "@/lib/abTesting";
import { useUTMParams } from "@/hooks/useUTMParams";

interface QuizProps {
  config: QuizConfig;
}

export default function Quiz({ config }: QuizProps) {
  const [, setLocation] = useLocation();
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>();
  const [sessionId] = useState(() => getOrCreateSessionId());
  const [variantAssigned, setVariantAssigned] = useState(false);
  const utmParams = useUTMParams();
  
  // A/B Testing
  const { data: variants } = trpc.abTest.getVariants.useQuery({ quizId: config.id });
  const assignVariantMutation = trpc.abTest.assignVariant.useMutation();
  const trackConversionMutation = trpc.abTest.trackConversion.useMutation();

  const quizData = getQuizTranslation(config.id, language);
  const t = translations[language];
  const totalSteps = (quizData?.questions.length || config.questions.length) + 1;
  const isFormStep = currentStep > (quizData?.questions.length || config.questions.length);

  // Assign A/B test variant on mount
  useEffect(() => {
    if (variants && variants.length > 0 && !variantAssigned) {
      const assignment = getCurrentAssignment(config.id);
      
      if (!assignment) {
        const assigned = assignVariant(sessionId, config.id, variants as any);
        if (assigned) {
          assignVariantMutation.mutate({
            sessionId,
            quizId: config.id,
            variantId: assigned.id,
            variantName: assigned.variantName,
          });
        }
      }
      
      setVariantAssigned(true);
    }
  }, [variants, variantAssigned, sessionId, config.id, assignVariantMutation]);

  useEffect(() => {
    // Track drop-off when user leaves
    const handleBeforeUnload = () => {
      if (!isFormStep) {
        trackDropOff(config.id, currentStep, totalSteps);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [currentStep, isFormStep, config.id, totalSteps]);

  const submitLead = trpc.quiz.submitLead.useMutation({
    onSuccess: () => {
      // Track conversion for A/B test
      trackConversionMutation.mutate({
        sessionId,
        quizId: config.id,
      });
      
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

    // Track step completion
    trackMetaStep(config.id, currentStep, totalSteps);
    trackGA4Step(config.id, currentStep, totalSteps, answer);

    // Auto-advance after selection
    setTimeout(() => {
      const questionsLength = quizData?.questions.length || config.questions.length;
      if (currentStep < questionsLength) {
        setCurrentStep(currentStep + 1);
        setSelectedAnswer(answers[currentStep + 1]);
      } else {
        setCurrentStep(currentStep + 1);
        // Track form view
        trackFormView(config.id);
        trackMetaComplete(config.id);
        trackGA4Complete(config.id, language);
      }
    }, 300);
  };

  const handleFormSubmit = (data: { name: string; phone: string; telegram: string; email: string }) => {
    const answersArray = Object.entries(answers)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, answer]) => answer);
    
    // Get questions for Telegram message
    const questionsArray = quizData?.questions.map(q => q.question) || [];

    // Track form submission
    trackMetaFormSubmit(config.id);
    trackGA4FormSubmit(config.id, language);

    submitLead.mutate({
      quizName: config.id,
      answers: JSON.stringify(answersArray),
      questions: JSON.stringify(questionsArray),
      name: data.name,
      phone: data.phone,
      telegram: data.telegram || "",
      email: data.email || "",
      language: language,
      // Include UTM parameters
      ...utmParams,
    });
  };

  if (!quizData) {
    return <QuizLayout><div>Loading...</div></QuizLayout>;
  }

  return (
    <QuizLayout title={quizData.title} subtitle={quizData.subtitle}>
      <div className="max-w-5xl mx-auto">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        {!isFormStep ? (
          <QuizQuestion
            question={quizData.questions[currentStep - 1]!.question}
            options={quizData.questions[currentStep - 1]!.options}
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
