import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizLayout from "./QuizLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getQuizTranslation } from "@/lib/quizTranslations";
import { translations } from "@/lib/translations";
import { CheckCircle2, Zap, Target, TrendingUp } from "lucide-react";
import { initMetaPixel, trackQuizStart as trackMetaQuizStart } from "@/lib/metaPixel";
import { initGA4, trackQuizStart as trackGA4QuizStart } from "@/lib/googleAnalytics";

interface QuizLandingProps {
  quizId: string;
  onStartQuiz: () => void;
}

export default function QuizLanding({ quizId, onStartQuiz }: QuizLandingProps) {
  const { language } = useLanguage();
  const [isStarting, setIsStarting] = useState(false);
  const quizData = getQuizTranslation(quizId, language);
  const t = translations[language];

  useEffect(() => {
    // Initialize analytics on mount
    initMetaPixel();
    initGA4();
  }, []);

  if (!quizData) {
    return <div>Quiz not found</div>;
  }

  const handleStart = () => {
    setIsStarting(true);
    
    // Track quiz start in both platforms
    trackMetaQuizStart(quizId);
    trackGA4QuizStart(quizId, language);
    
    setTimeout(() => {
      onStartQuiz();
    }, 300);
  };

  const benefits = [
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      text: language === "uk" ? "Персональна стратегія запуску" :
            language === "ru" ? "Персональная стратегия запуска" :
            language === "pl" ? "Spersonalizowana strategia uruchomienia" :
            language === "de" ? "Personalisierte Startstrategie" :
            "Personalized launch strategy"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      text: language === "uk" ? "Швидкий старт за 24-48 годин" :
            language === "ru" ? "Быстрый старт за 24-48 часов" :
            language === "pl" ? "Szybki start w 24-48 godzin" :
            language === "de" ? "Schnellstart in 24-48 Stunden" :
            "Quick start in 24-48 hours"
    },
    {
      icon: <Target className="w-6 h-6" />,
      text: language === "uk" ? "Точний таргетинг на вашу аудиторію" :
            language === "ru" ? "Точный таргетинг на вашу аудиторию" :
            language === "pl" ? "Precyzyjne targetowanie Twojej grupy docelowej" :
            language === "de" ? "Präzises Targeting Ihrer Zielgruppe" :
            "Precise targeting of your audience"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      text: language === "uk" ? "Прогноз результатів та ROI" :
            language === "ru" ? "Прогноз результатов и ROI" :
            language === "pl" ? "Prognoza wyników i ROI" :
            language === "de" ? "Ergebnisprognose und ROI" :
            "Results forecast and ROI"
    },
  ];

  return (
    <QuizLayout>
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
            {quizData.title}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            {quizData.subtitle}
          </p>
          
          {/* Bonus Badge */}
          <div className="inline-block bg-gradient-to-r from-accent/20 to-primary/20 border-2 border-accent rounded-2xl px-8 py-4 mb-8">
            <p className="text-lg font-bold text-accent mb-2">{t.freeBonus}</p>
            <p className="text-foreground font-semibold">{quizData.bonus}</p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleStart}
            disabled={isStarting}
            size="lg"
            className="h-20 px-16 text-2xl font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-accent/50 transition-all duration-300 hover:scale-105"
          >
            {isStarting ? "..." : t.startQuiz + " →"}
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            {language === "uk" ? "⏱️ Займе лише 2 хвилини" :
             language === "ru" ? "⏱️ Займёт всего 2 минуты" :
             language === "pl" ? "⏱️ Zajmie tylko 2 minuty" :
             language === "de" ? "⏱️ Dauert nur 2 Minuten" :
             "⏱️ Takes only 2 minutes"}
          </p>
        </div>

        {/* Benefits Section */}
        <div className="bg-card border-2 border-border rounded-2xl p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
            {t.whyChooseUs}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-secondary/50 rounded-xl">
                <div className="text-accent flex-shrink-0 mt-1">
                  {benefit.icon}
                </div>
                <p className="text-lg text-foreground font-medium">{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <span className="text-sm">
              {language === "uk" ? "500+ клієнтів вже отримали результати" :
               language === "ru" ? "500+ клиентов уже получили результаты" :
               language === "pl" ? "500+ klientów już uzyskało wyniki" :
               language === "de" ? "500+ Kunden haben bereits Ergebnisse erzielt" :
               "500+ clients already got results"}
            </span>
          </div>
        </div>
      </div>
    </QuizLayout>
  );
}
