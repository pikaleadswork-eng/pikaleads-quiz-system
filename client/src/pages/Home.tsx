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

  // Filter by platform
  const metaQuizzes = allQuizzes.filter((q) => q.platform === "meta_ads");
  const googleQuizzes = allQuizzes.filter((q) => q.platform === "google_ads");

  // Group by niche
  const groupByNiche = (quizzes: typeof allQuizzes) => {
    const grouped: Record<string, typeof allQuizzes> = {};
    quizzes.forEach((quiz) => {
      const niche = quiz.niche || "other";
      if (!grouped[niche]) grouped[niche] = [];
      grouped[niche].push(quiz);
    });
    return grouped;
  };

  const metaByNiche = groupByNiche(metaQuizzes);
  const googleByNiche = groupByNiche(googleQuizzes);

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
        <Link key={quiz.id} href={`/quiz/${quiz.slug}`}>
          <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
            <h3 className="text-2xl font-bold text-foreground mb-3">
              {quiz.name}
            </h3>
            <p className="text-muted-foreground mb-4">
              {quiz.description || t.learnMore}
            </p>
            <Button
              variant="default"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
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
      <div className="max-w-7xl mx-auto space-y-16">
        {/* META ADS Section */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              {t.metaAdsTitle}
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            {t.metaAdsSubtitle}
          </p>

          {Object.keys(metaByNiche).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No Meta Ads quizzes available yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(metaByNiche).map(([niche, quizzes]) => (
                <div key={niche}>
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                    {NICHE_LABELS[niche]?.[language as keyof typeof NICHE_LABELS[typeof niche]] || NICHE_LABELS[niche]?.en || niche}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderQuizCards(quizzes)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* GOOGLE ADS Section */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Target className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              {t.googleAdsTitle}
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            {t.googleAdsSubtitle}
          </p>

          {Object.keys(googleByNiche).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No Google Ads quizzes available yet.</p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(googleByNiche).map(([niche, quizzes]) => (
                <div key={niche}>
                  <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
                    {NICHE_LABELS[niche]?.[language as keyof typeof NICHE_LABELS[typeof niche]] || NICHE_LABELS[niche]?.en || niche}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {renderQuizCards(quizzes)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </QuizLayout>
  );
}
