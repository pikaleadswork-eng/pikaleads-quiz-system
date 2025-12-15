import { useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ArrowRight, Check, Phone, Mail, User } from "lucide-react";

// Helper to get translated text
function getTranslatedText(text: string | null | undefined, language: string): string {
  if (!text) return "";
  try {
    const parsed = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null) {
      return parsed[language] || parsed.uk || parsed.en || text;
    }
    return text;
  } catch {
    return text;
  }
}

// Helper to get translated options
function getTranslatedOptions(options: any[], language: string): string[] {
  if (!options || !Array.isArray(options)) return [];
  return options.map(opt => {
    if (typeof opt === "string") return opt;
    if (typeof opt === "object" && opt !== null) {
      // Handle {text: {uk: "...", ru: "..."}, imageUrl: "..."} format
      if (opt.text && typeof opt.text === "object") {
        return opt.text[language] || opt.text.uk || opt.text.en || "";
      }
      // Handle {text: "string", imageUrl: "..."} format
      if (opt.text && typeof opt.text === "string") {
        return opt.text;
      }
      // Handle {uk: "...", ru: "...", en: "..."} format directly
      return opt[language] || opt.uk || opt.en || "";
    }
    return "";
  });
}

export default function QuizPage() {
  const [, params] = useRoute("/quiz/:slug");
  const slug = params?.slug || "";
  const { language } = useLanguage();
  
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [textAnswer, setTextAnswer] = useState("");
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right'>('right');
  const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", telegram: "" });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load quiz by slug
  const { data: quiz, isLoading, error } = trpc.quizzes.getBySlug.useQuery({ slug });
  
  // Load quiz design settings
  const { data: designSettings } = trpc.quizDesign.getByQuizId.useQuery(
    { quizId: quiz?.id || 0 },
    { enabled: !!quiz?.id }
  );
  
  // Load quiz questions
  const { data: rawQuestions = [], isLoading: questionsLoading } = trpc.quizDesign.getQuestions.useQuery(
    { quizId: quiz?.id || 0 },
    { enabled: !!quiz?.id && quizStarted }
  );

  // Submit lead mutation
  const submitLead = trpc.quiz.submitLead.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setIsSubmitting(false);
      // Fire GA4 event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "generate_lead", {
          quiz_name: quiz?.name,
          quiz_slug: slug,
        });
      }
      // Fire Meta Pixel event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("track", "Lead", {
          content_name: quiz?.name,
        });
      }
    },
    onError: () => {
      setIsSubmitting(false);
    },
  });

  // Get translated title and subtitle
  const title = getTranslatedText(designSettings?.titleText, language) || quiz?.name || "";
  const subtitle = getTranslatedText(designSettings?.subtitleText, language) || quiz?.description || "";
  const buttonText = designSettings?.buttonText || (language === "uk" ? "Почати квіз" : language === "ru" ? "Начать квиз" : "Start Quiz");
  const backgroundImage = designSettings?.backgroundImage || "/quiz-images/general-bg.png";

  // Transform questions with translations
  const questions = rawQuestions.map(q => ({
    ...q,
    question: getTranslatedText(q.question, language),
    options: getTranslatedOptions(q.options, language),
  }));

  // Track quiz start event
  useEffect(() => {
    if (quizStarted && quiz) {
      // Fire GA4 event
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "quiz_start", {
          quiz_name: quiz.name,
          quiz_slug: slug,
        });
      }
      // Fire Meta Pixel event
      if (typeof window !== "undefined" && (window as any).fbq) {
        (window as any).fbq("trackCustom", "QuizStart", {
          content_name: quiz.name,
        });
      }
    }
  }, [quizStarted, quiz, slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {language === "uk" ? "Квіз не знайдено" : language === "ru" ? "Квиз не найден" : "Quiz not found"}
          </h1>
          <p className="text-gray-400">
            {language === "uk" ? "Квіз, який ви шукаєте, не існує." : language === "ru" ? "Квиз, который вы ищете, не существует." : "The quiz you're looking for doesn't exist."}
          </p>
        </div>
      </div>
    );
  }

  // Quiz start screen with split layout
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex">
        {/* Left side - Content */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 leading-relaxed">
              {subtitle}
            </p>
            <Button 
              onClick={() => setQuizStarted(true)}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-12 py-6 text-xl rounded-full shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300"
            >
              {buttonText} <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Right side - Image */}
        <div className="hidden lg:flex flex-1 items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-gray-900/50 z-10" />
          <img 
            src={backgroundImage} 
            alt="Quiz illustration"
            className="w-full h-full object-cover rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    );
  }

  // Thank you page
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-green-400 to-green-600 rounded-full mb-8 shadow-lg shadow-green-500/30">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            {language === "uk" ? "Дякуємо за вашу заявку!" : language === "ru" ? "Спасибо за вашу заявку!" : "Thank you for your submission!"}
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {language === "uk" ? "Ми зв'яжемось з вами протягом 15-20 хвилин" : language === "ru" ? "Мы свяжемся с вами в течение 15-20 минут" : "We will contact you within 15-20 minutes"}
          </p>
          <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-6 py-3 rounded-full text-lg font-semibold">
            {language === "uk" ? "Ваша знижка 15% 👍" : language === "ru" ? "Ваша скидка 15% 👍" : "Your 15% discount 👍"}
          </div>
        </div>
      </div>
    );
  }

  // Lead form
  if (showLeadForm) {
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      // Format answers for submission
      const formattedAnswers = questions.map((q, idx) => ({
        question: q.question,
        answer: answers[q.id]?.join(", ") || "",
      }));
      
      // Get UTM params from URL
      const urlParams = new URLSearchParams(window.location.search);
      
      await submitLead.mutateAsync({
        quizName: quiz.name,
        answers: JSON.stringify(formattedAnswers),
        questions: JSON.stringify(questions.map(q => q.question)),
        name: leadData.name,
        phone: leadData.phone,
        email: leadData.email || undefined,
        telegram: leadData.telegram || undefined,
        language,
        utmSource: urlParams.get("utm_source") || undefined,
        utmMedium: urlParams.get("utm_medium") || undefined,
        utmCampaign: urlParams.get("utm_campaign") || undefined,
        utmContent: urlParams.get("utm_content") || undefined,
        utmTerm: urlParams.get("utm_term") || undefined,
      });
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="max-w-5xl w-full grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - info */}
          <div className="hidden lg:block">
            <img 
              src={backgroundImage} 
              alt="Quiz illustration"
              className="w-full h-auto rounded-3xl shadow-2xl"
            />
          </div>

          {/* Right side - form */}
          <Card className="p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
            <div className="inline-block bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
              {language === "uk" ? "Ваша знижка 15% 👍" : language === "ru" ? "Ваша скидка 15% 👍" : "Your 15% discount 👍"}
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === "uk" ? "Залишіть свої контакти" : language === "ru" ? "Оставьте свои контакты" : "Leave your contacts"}
            </h2>
            <p className="text-gray-400 mb-6">
              {language === "uk" ? "Ми зв'яжемось з вами найближчим часом" : language === "ru" ? "Мы свяжемся с вами в ближайшее время" : "We will contact you soon"}
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="text-gray-300 text-sm font-medium">
                  {language === "uk" ? "Ваше ім'я *" : language === "ru" ? "Ваше имя *" : "Your name *"}
                </Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input 
                    type="text" 
                    required
                    placeholder={language === "uk" ? "Іван" : language === "ru" ? "Иван" : "John"}
                    value={leadData.name}
                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-yellow-500" 
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300 text-sm font-medium">
                  {language === "uk" ? "Телефон *" : language === "ru" ? "Телефон *" : "Phone *"}
                </Label>
                <div className="relative mt-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input 
                    type="tel" 
                    required
                    placeholder="+380 XX XXX XX XX"
                    value={leadData.phone}
                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-yellow-500" 
                  />
                </div>
              </div>
              
              <div>
                <Label className="text-gray-300 text-sm font-medium">
                  {language === "uk" ? "Email (необов'язково)" : language === "ru" ? "Email (необязательно)" : "Email (optional)"}
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
                  <Input 
                    type="email" 
                    placeholder="mail@example.com"
                    value={leadData.email}
                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-500 focus:border-yellow-500" 
                  />
                </div>
              </div>

              <div className="flex items-start gap-2 text-sm text-gray-400 pt-2">
                <Checkbox id="privacy" defaultChecked className="mt-0.5" />
                <Label htmlFor="privacy" className="cursor-pointer leading-relaxed">
                  {language === "uk" 
                    ? "Я погоджуюсь на обробку персональних даних" 
                    : language === "ru" 
                    ? "Я согласен на обработку персональных данных" 
                    : "I agree to the processing of personal data"}
                </Label>
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold py-4 text-lg rounded-full shadow-lg shadow-yellow-500/30 mt-4"
              >
                {isSubmitting 
                  ? (language === "uk" ? "Відправляємо..." : language === "ru" ? "Отправляем..." : "Submitting...") 
                  : (language === "uk" ? "Отримати результати" : language === "ru" ? "Получить результаты" : "Get results")}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Show quiz questions
  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center max-w-2xl px-4">
          <h1 className="text-3xl font-bold text-white mb-4">{quiz.name}</h1>
          <p className="text-yellow-400">
            {language === "uk" ? "🚧 Питання ще не додані до цього квізу" : language === "ru" ? "🚧 Вопросы еще не добавлены" : "🚧 Questions not yet added"}
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isTextInput = currentQuestion.type === "text" || currentQuestion.options.length === 0;

  const handleNext = () => {
    // Save text answer if it's a text input
    if (isTextInput && textAnswer.trim()) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: [textAnswer],
      });
      setTextAnswer("");
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      // Trigger animation
      setAnimationDirection('right');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setIsAnimating(false);
        // Fire GA4 event for question progress
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "quiz_progress", {
            quiz_name: quiz.name,
            question_number: currentQuestionIndex + 2,
            total_questions: questions.length,
          });
        }
      }, 200);
    } else {
      setShowLeadForm(true);
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setAnimationDirection('left');
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  const handleAnswerChange = (value: string) => {
    if (currentQuestion.type === "multiple") {
      // Multiple choice - don't auto-advance, user needs to click Next
      const current = answers[currentQuestion.id] || [];
      if (current.includes(value)) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: current.filter(a => a !== value),
        });
      } else {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...current, value],
        });
      }
    } else {
      // Single choice - save answer and auto-advance after short delay
      setAnswers({
        ...answers,
        [currentQuestion.id]: [value],
      });
      
      // Auto-advance to next question after 400ms with animation
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          setAnimationDirection('right');
          setIsAnimating(true);
          setTimeout(() => {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setIsAnimating(false);
            // Fire GA4 event for question progress
            if (typeof window !== "undefined" && (window as any).gtag) {
              (window as any).gtag("event", "quiz_progress", {
                quiz_name: quiz.name,
                question_number: currentQuestionIndex + 2,
                total_questions: questions.length,
              });
            }
          }, 200);
        } else {
          setShowLeadForm(true);
        }
      }, 300);
    }
  };

  const canProceed = isTextInput 
    ? textAnswer.trim().length > 0 
    : (answers[currentQuestion.id]?.length || 0) > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>
              {language === "uk" ? `Питання ${currentQuestionIndex + 1} з ${questions.length}` 
                : language === "ru" ? `Вопрос ${currentQuestionIndex + 1} из ${questions.length}` 
                : `Question ${currentQuestionIndex + 1} of ${questions.length}`}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question card with animation */}
        <Card className={`p-8 bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl transition-all duration-200 ease-out ${
          isAnimating 
            ? animationDirection === 'right' 
              ? 'opacity-0 translate-x-8' 
              : 'opacity-0 -translate-x-8'
            : 'opacity-100 translate-x-0'
        }`}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">{currentQuestion.question}</h2>
          
          {/* Text input for custom_input type */}
          {isTextInput && (
            <div className="mb-6">
              <Input
                type="text"
                placeholder={language === "uk" ? "Введіть вашу відповідь..." : language === "ru" ? "Введите ваш ответ..." : "Enter your answer..."}
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-500 text-lg py-6"
              />
            </div>
          )}
          
          {/* Radio options for single choice */}
          {!isTextInput && currentQuestion.type !== "multiple" && (
            <RadioGroup 
              value={answers[currentQuestion.id]?.[0] || ""}
              onValueChange={handleAnswerChange}
            >
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <div 
                    key={idx} 
                    className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      answers[currentQuestion.id]?.[0] === option 
                        ? "bg-yellow-500/20 border-2 border-yellow-500" 
                        : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                    }`}
                    onClick={() => handleAnswerChange(option)}
                  >
                    <RadioGroupItem value={option} id={`option-${idx}`} className="border-white/50" />
                    <Label htmlFor={`option-${idx}`} className="text-white cursor-pointer flex-1 text-lg">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {/* Checkbox options for multiple choice */}
          {!isTextInput && currentQuestion.type === "multiple" && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                    answers[currentQuestion.id]?.includes(option) 
                      ? "bg-yellow-500/20 border-2 border-yellow-500" 
                      : "bg-white/5 border-2 border-transparent hover:bg-white/10"
                  }`}
                  onClick={() => handleAnswerChange(option)}
                >
                  <Checkbox 
                    id={`option-${idx}`}
                    checked={answers[currentQuestion.id]?.includes(option) || false}
                    className="border-white/50"
                  />
                  <Label htmlFor={`option-${idx}`} className="text-white cursor-pointer flex-1 text-lg">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {/* Only show navigation buttons for multiple choice or text input questions */}
          {(currentQuestion.type === "multiple" || isTextInput || currentQuestionIndex > 0) && (
            <div className="flex gap-4 mt-8">
              {currentQuestionIndex > 0 && (
                <Button 
                  variant="outline"
                  onClick={handleBack}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  {language === "uk" ? "Назад" : language === "ru" ? "Назад" : "Back"}
                </Button>
              )}
              {/* Show Next/Finish button only for multiple choice or text input */}
              {(currentQuestion.type === "multiple" || isTextInput) && (
                <Button 
                  onClick={handleNext}
                  className={`flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold ${currentQuestionIndex === 0 ? "w-full" : ""}`}
                  disabled={!canProceed}
                >
                  {currentQuestionIndex < questions.length - 1 
                    ? (language === "uk" ? "Далі" : language === "ru" ? "Далее" : "Next") 
                    : (language === "uk" ? "Завершити" : language === "ru" ? "Завершить" : "Finish")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
