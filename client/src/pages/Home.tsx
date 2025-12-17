import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { createOrganizationSchema, createWebSiteSchema } from "@/lib/structuredData";

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

  // Structured data for homepage
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      createOrganizationSchema(),
      createWebSiteSchema(),
    ],
  };

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

  // Separate quizzes by platform
  const metaQuizzes = allQuizzes.filter(q => q.platform === 'meta_ads');
  const googleQuizzes = allQuizzes.filter(q => q.platform === 'google_ads');

  return (
    <>
      <SEO
        title={{
          uk: "PIKALEADS - Професійна реклама Meta Ads та Google Ads | Збільште продажі на 300%",
          ru: "PIKALEADS - Профессиональная реклама Meta Ads и Google Ads | Увеличьте продажи на 300%",
          en: "PIKALEADS - Professional Meta Ads & Google Ads Marketing | Increase Sales by 300%",
        }}
        description={{
          uk: "Запускаємо ефективну рекламу в Meta (Facebook, Instagram) та Google з фокусом на реальний результат. Безкоштовний маркетинговий аналіз для вашого бізнесу. Меблі, ремонт, e-commerce, Telegram, будівництво, доставка їжі, B2B.",
          ru: "Запускаем эффективную рекламу в Meta (Facebook, Instagram) и Google с фокусом на реальный результат. Бесплатный маркетинговый анализ для вашего бизнеса. Мебель, ремонт, e-commerce, Telegram, строительство, доставка еды, B2B.",
          en: "Launch effective Meta (Facebook, Instagram) and Google advertising focused on real results. Free marketing analysis for your business. Furniture, renovation, e-commerce, Telegram, construction, food delivery, B2B.",
        }}
        keywords={{
          uk: "meta ads україна, google ads, таргетована реклама, реклама facebook, реклама instagram, google реклама, просування бізнесу, інтернет маркетинг, реклама меблів, реклама ремонту, реклама e-commerce, реклама telegram, будівельна реклама, реклама доставки їжі, b2b реклама",
          ru: "meta ads украина, google ads, таргетированная реклама, реклама facebook, реклама instagram, google реклама, продвижение бизнеса, интернет маркетинг, реклама мебели, реклама ремонта, реклама e-commerce, реклама telegram, строительная реклама, реклама доставки еды, b2b реклама",
          en: "meta ads ukraine, google ads, targeted advertising, facebook ads, instagram ads, google advertising, business promotion, internet marketing, furniture ads, renovation ads, e-commerce ads, telegram ads, construction ads, food delivery ads, b2b advertising",
        }}
        canonical="/"
        structuredData={structuredData}
      />
      <QuizLayout
        title={t.homeTitle}
        subtitle={t.homeSubtitle}
      >
        <div className="max-w-7xl mx-auto space-y-16">
        {/* META ADS Quizzes */}
        {metaQuizzes.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-4xl font-black text-foreground text-center mb-8">
              {language === "uk" ? "META ADS Квізи" : language === "ru" ? "META ADS Квизы" : "META ADS Quizzes"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderQuizCards(metaQuizzes)}
            </div>
          </section>
        )}

        {/* GOOGLE ADS Quizzes */}
        {googleQuizzes.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-4xl font-black text-foreground text-center mb-8">
              {language === "uk" ? "GOOGLE ADS Квізи" : language === "ru" ? "GOOGLE ADS Квизы" : "GOOGLE ADS Quizzes"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderQuizCards(googleQuizzes)}
            </div>
          </section>
        )}

        {/* No quizzes message */}
        {allQuizzes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {language === "uk" ? "Квізи ще не додані" : "No quizzes available yet"}
            </p>
          </div>
        )}
      </div>
    </QuizLayout>
    </>
  );
}
