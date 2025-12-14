import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { Zap, Target } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];

  // Load quizzes from database
  const { data: allQuizzes = [], isLoading } = trpc.quizzes.list.useQuery();

  // Filter by platform
  const metaQuizzes = allQuizzes.filter((q) => q.platform === "meta_ads");
  const googleQuizzes = allQuizzes.filter((q) => q.platform === "google_ads");

  if (isLoading) {
    return (
      <QuizLayout title={t.homeTitle} subtitle={t.homeSubtitle}>
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-muted-foreground">Loading quizzes...</p>
        </div>
      </QuizLayout>
    );
  }

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
            {metaQuizzes.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No Meta Ads quizzes available yet.</p>
              </div>
            ) : (
              metaQuizzes.map((quiz) => (
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
              ))
            )}
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
            {googleQuizzes.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No Google Ads quizzes available yet.</p>
              </div>
            ) : (
              googleQuizzes.map((quiz) => (
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
              ))
            )}
          </div>
        </section>
      </div>
    </QuizLayout>
  );
}
