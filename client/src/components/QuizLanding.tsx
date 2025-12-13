import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizLayout from "./QuizLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { getQuizTranslation } from "@/lib/quizTranslations";
import { translations } from "@/lib/translations";
import { Lock } from "lucide-react";
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

  // Markviz-style layout: Split-screen with background image
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      {/* Background Image - Right Side */}
      <div className="absolute inset-0 lg:left-1/2">
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-900/95 to-transparent lg:from-transparent lg:via-transparent lg:to-transparent z-10" />
        <img
          src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80"
          alt="Background"
          className="w-full h-full object-cover opacity-30 lg:opacity-100"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text Content */}
            <div className="space-y-8">
              {/* Logo/Brand */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">PIKALEADS</span>
              </div>

              {/* Main Heading */}
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  {quizData.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                  {quizData.subtitle}
                </p>
              </div>

              {/* CTA Button - Markviz Style */}
              <div>
                <Button
                  onClick={handleStart}
                  disabled={isStarting}
                  className="h-16 px-12 text-xl font-bold rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-zinc-900 shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105"
                >
                  {isStarting ? "..." : (language === "uk" ? "Почати" : language === "ru" ? "Начать" : "Start")}
                </Button>
                <p className="text-sm text-gray-400 mt-3">
                  {language === "uk" ? "⏱️ Займе лише 2 хвилини" :
                   language === "ru" ? "⏱️ Займёт всего 2 минуты" :
                   language === "pl" ? "⏱️ Zajmie tylko 2 minuty" :
                   language === "de" ? "⏱️ Dauert nur 2 Minuten" :
                   "⏱️ Takes only 2 minutes"}
                </p>
              </div>

              {/* Bonuses Section - Markviz Style */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  {language === "uk" ? "Бонуси після проходження тесту" :
                   language === "ru" ? "Бонусы после прохождения теста" :
                   "Bonuses after completing the test"}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Bonus 1 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-xl p-4 hover:border-purple-500/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white mb-1">
                            {quizData.bonus}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bonus 2 */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all" />
                    <div className="relative bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 rounded-xl p-4 hover:border-blue-500/50 transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white mb-1">
                            {language === "uk" ? "Персональна консультація" :
                             language === "ru" ? "Персональная консультация" :
                             "Personal consultation"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Info */}
              <div className="pt-8 border-t border-zinc-700">
                <p className="text-sm text-gray-400">
                  +7-911-111-11-11
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  ООО «PIKALEADS»
                </p>
              </div>
            </div>

            {/* Right Side - Image (visible only on desktop) */}
            <div className="hidden lg:block" />
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <button className="fixed bottom-6 right-6 z-30 flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <span>
          {language === "uk" ? "Дисклеймер" :
           language === "ru" ? "Дисклеймер" :
           "Disclaimer"}
        </span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>

      {/* Powered by Markviz watermark */}
      <div className="fixed bottom-6 left-6 z-30 flex items-center gap-2 text-xs text-gray-500">
        <span>
          {language === "uk" ? "Створи свій" :
           language === "ru" ? "Создай свой" :
           "Create your"}
        </span>
        <span className="font-bold text-gray-400">PIKALEADS</span>
      </div>
    </div>
  );
}
