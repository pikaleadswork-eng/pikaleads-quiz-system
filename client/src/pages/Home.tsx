import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

// Niche display names
const NICHE_LABELS: Record<string, { uk: string; ru: string; en: string }> = {
  furniture: { uk: "Меблі для дому", ru: "Мебель для дома", en: "Furniture" },
  renovation: { uk: "Ремонт квартир", ru: "Ремонт квартир", en: "Apartment Renovation" },
  ecommerce: { uk: "E-Commerce", ru: "E-Commerce", en: "E-Commerce" },
  services: { uk: "Послуги", ru: "Услуги", en: "Services" },
  realestate: { uk: "Нерухомість", ru: "Недвижимость", en: "Real Estate" },
  other: { uk: "Інше", ru: "Другое", en: "Other" },
};

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  // Load quizzes from database
  const { data: allQuizzes = [], isLoading } = trpc.quizzes.list.useQuery();

  if (isLoading) {
    return (
      <QuizLayout title={t.homeTitle} subtitle={t.homeSubtitle}>
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </QuizLayout>
    );
  }

  const renderQuizCards = (quizzes: typeof allQuizzes) => (
    <>
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/quiz/${quiz.slug}`} className="h-full">
          <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full flex flex-col">
            <div className="flex-grow">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {quiz.name}
              </h3>
              <p className="text-muted-foreground mb-4">
                {quiz.description || t.learnMore}
              </p>
            </div>
            <Button
              variant="default"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold flex-shrink-0"
            >
              {t.learnMore}
            </Button>
          </div>
        </Link>
      ))}
    </>
  );

  return (
    <QuizLayout
      title={t.homeTitle}
      subtitle={t.homeSubtitle}
    >
      <div className="max-w-7xl mx-auto">
        {/* Single section with all quizzes */}
        <section>
          <h2 className="text-3xl md:text-4xl font-black text-foreground text-center mb-8">
            {language === "uk" ? "Оберіть квіз" : "Choose Quiz"}
          </h2>

          {allQuizzes.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {language === "uk" ? "Квізи ще не додані" : "No quizzes available yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderQuizCards(allQuizzes)}
            </div>
          )}
        </section>
      </div>
    </QuizLayout>
  );
}
