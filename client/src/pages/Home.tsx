import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

interface QuizCard {
  title: string;
  descriptionKey: string;
  path: string;
  platform: "meta" | "google";
}

const quizCardsConfig: QuizCard[] = [
  {
    title: "Furniture",
    descriptionKey: "metaFurnitureDesc",
    path: "/meta-furniture",
    platform: "meta",
  },
  {
    title: "Apartment Renovation",
    descriptionKey: "metaRepairDesc",
    path: "/meta-repair",
    platform: "meta",
  },
  {
    title: "E-Commerce",
    descriptionKey: "metaEcomDesc",
    path: "/meta-ecom",
    platform: "meta",
  },
  {
    title: "Product Sales",
    descriptionKey: "metaProductsDesc",
    path: "/meta-products",
    platform: "meta",
  },
  {
    title: "Telegram B2B",
    descriptionKey: "metaTelegramDesc",
    path: "/meta-telegram",
    platform: "meta",
  },
  {
    title: "Furniture",
    descriptionKey: "googleFurnitureDesc",
    path: "/google-furniture",
    platform: "google",
  },
  {
    title: "Apartment Renovation",
    descriptionKey: "googleRepairDesc",
    path: "/google-repair",
    platform: "google",
  },
  {
    title: "E-Commerce",
    descriptionKey: "googleEcomDesc",
    path: "/google-ecom",
    platform: "google",
  },
  {
    title: "Product Sales",
    descriptionKey: "googleProductsDesc",
    path: "/google-products",
    platform: "google",
  },
  {
    title: "Telegram B2B",
    descriptionKey: "googleTelegramDesc",
    path: "/google-telegram",
    platform: "google",
  },
];

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  const metaQuizzes = quizCardsConfig.filter((q) => q.platform === "meta");
  const googleQuizzes = quizCardsConfig.filter((q) => q.platform === "google");

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metaQuizzes.map((quiz) => (
              <Link key={quiz.path} href={quiz.path}>
                <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t[quiz.descriptionKey as keyof typeof t] as string}
                  </p>
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    {t.startQuiz} →
                  </Button>
                </div>
              </Link>
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {googleQuizzes.map((quiz) => (
              <Link key={quiz.path} href={quiz.path}>
                <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {t[quiz.descriptionKey as keyof typeof t] as string}
                  </p>
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    {t.startQuiz} →
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </QuizLayout>
  );
}
