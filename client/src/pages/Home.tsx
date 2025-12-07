import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { Zap, Target } from "lucide-react";

interface QuizCard {
  title: string;
  description: string;
  path: string;
  platform: "meta" | "google";
}

const quizCards: QuizCard[] = [
  {
    title: "Furniture",
    description: "Get 30+ quality leads daily for your furniture business",
    path: "/meta-furniture",
    platform: "meta",
  },
  {
    title: "Apartment Renovation",
    description: "5-15 hot leads daily for renovation services",
    path: "/meta-repair",
    platform: "meta",
  },
  {
    title: "E-Commerce",
    description: "Scale your online store with 30-120 leads daily",
    path: "/meta-ecom",
    platform: "meta",
  },
  {
    title: "Product Sales",
    description: "Boost your product sales with targeted advertising",
    path: "/meta-products",
    platform: "meta",
  },
  {
    title: "Telegram B2B",
    description: "200-1200 new Telegram subscribers weekly",
    path: "/meta-telegram",
    platform: "meta",
  },
  {
    title: "Furniture",
    description: "Quality furniture leads from Google Search",
    path: "/google-furniture",
    platform: "google",
  },
  {
    title: "Apartment Renovation",
    description: "Renovation leads from Google Search",
    path: "/google-repair",
    platform: "google",
  },
  {
    title: "E-Commerce",
    description: "Grow your store with Google Ads & Shopping",
    path: "/google-ecom",
    platform: "google",
  },
  {
    title: "Product Sales",
    description: "Sell more products with Google Ads",
    path: "/google-products",
    platform: "google",
  },
  {
    title: "Telegram B2B",
    description: "Grow your channel with Google & YouTube",
    path: "/google-telegram",
    platform: "google",
  },
];

export default function Home() {
  const metaQuizzes = quizCards.filter((q) => q.platform === "meta");
  const googleQuizzes = quizCards.filter((q) => q.platform === "google");

  return (
    <QuizLayout
      title="PIKALEADS Lead Engine"
      subtitle="Choose your niche and platform to get started with a free marketing analysis"
    >
      <div className="max-w-7xl mx-auto space-y-16">
        {/* META ADS Section */}
        <section>
          <div className="flex items-center justify-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-accent" />
            <h2 className="text-3xl md:text-4xl font-black text-foreground">
              META ADS Quizzes
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Get stable flow of 30+ leads daily with precise targeting and optimization
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metaQuizzes.map((quiz) => (
              <Link key={quiz.path} href={quiz.path}>
                <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{quiz.description}</p>
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Start Quiz →
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
              GOOGLE ADS Quizzes
            </h2>
          </div>
          <p className="text-center text-muted-foreground mb-8 text-lg">
            Get 20-50 quality leads daily from Google Search and YouTube
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {googleQuizzes.map((quiz) => (
              <Link key={quiz.path} href={quiz.path}>
                <div className="bg-card border-2 border-border rounded-xl p-6 hover:border-primary transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer h-full">
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {quiz.title}
                  </h3>
                  <p className="text-muted-foreground mb-4">{quiz.description}</p>
                  <Button
                    variant="default"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Start Quiz →
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
