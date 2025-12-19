import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";
import { SEO } from "@/components/SEO";
import { createOrganizationSchema, createWebSiteSchema } from "@/lib/structuredData";
import { ClarityEvents } from "@/lib/clarityEvents";
import { CyberpunkCard, NeonButton, GlitchText } from "@/components/cyberpunk";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";

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
      <>
        <CyberpunkNavigation currentPath="/" />
        <div className="min-h-screen bg-black cyber-grid relative">
          <div className="absolute inset-0 scan-lines opacity-10" />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <GlitchText variant="purple" className="text-3xl">
              {language === "uk" ? "ЗАВАНТАЖЕННЯ..." : language === "ru" ? "ЗАГРУЗКА..." : "LOADING..."}
            </GlitchText>
          </div>
        </div>
      </>
    );
  }

  // Separate quizzes by platform
  const metaQuizzes = allQuizzes.filter(q => q.platform === 'meta_ads');
  const googleQuizzes = allQuizzes.filter(q => q.platform === 'google_ads');

  const renderQuizCards = (quizzes: typeof allQuizzes) => (
    <>
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/quiz/${quiz.slug}`}>
          <CyberpunkCard 
            variant="purple" 
            glow={true} 
            scanLines={false}
            hover={true}
            className="h-full flex flex-col cursor-pointer group"
          >
            <div className="flex-grow mb-6">
              <h3 className="text-2xl font-bold mb-3 text-[#FFD93D] group-hover:neon-glow-green transition-all uppercase">
                {quiz.name}
              </h3>
              <p className="text-muted-foreground font-normal leading-relaxed">
                {quiz.description || t.learnMore}
              </p>
            </div>
            <button
              className="w-full flex-shrink-0 px-6 py-3 bg-[#FFD93D] text-black font-bold rounded-lg border-2 border-[#FFD93D] hover:bg-[#FFD93D]/90 transition-all whitespace-nowrap"
              style={{
                boxShadow: '0 0 20px rgba(255, 217, 61, 0.3)',
                fontFamily: 'Rajdhani, sans-serif'
              }}
              onClick={(e) => {
                e.preventDefault();
                ClarityEvents.trackCTAClick(t.learnMore, `home_quiz_${quiz.slug}`);
              }}
            >
              <span className="inline-flex items-center justify-center gap-2">
                ДІЗНАТИСЬ БІЛЬШЕ
                <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </CyberpunkCard>
        </Link>
      ))}
    </>
  );

  return (
    <>
      <SEO
        title={{
          uk: "PIKALEADS - Професійна реклама Meta Ads та Google Ads | Збільште продажі на 300%",
          ru: "PIKALEADS - Профессиональная реклама Meta Ads и Google Ads | Увеличьте продажи на 300%",
          en: "PIKALEADS - Professional Meta Ads & Google Ads Marketing | Increase Sales by 300%",
        }}
        description={{
          uk: "Запускаємо ефективну рекламу в Meta (Facebook, Instagram) та Google з фокусом на реальний результат. Безкоштовний маркетинговий аналіз для вашого бізнесу.",
          ru: "Запускаем эффективную рекламу в Meta (Facebook, Instagram) и Google с фокусом на реальный результат. Бесплатный маркетинговый анализ для вашего бизнеса.",
          en: "Launch effective Meta (Facebook, Instagram) and Google advertising focused on real results. Free marketing analysis for your business.",
        }}
        keywords={{
          uk: "meta ads україна, google ads, таргетована реклама, pikaleads, медіа баїнг",
          ru: "meta ads украина, google ads, таргетированная реклама, pikaleads, медиа байинг",
          en: "meta ads ukraine, google ads, targeted advertising, pikaleads, media buying",
        }}
        canonical="/quiz-service"
        structuredData={structuredData}
      />
      
      {/* Navigation */}
      <CyberpunkNavigation currentPath="/quiz-service" />
      
      {/* Main Container with Cyberpunk Background */}
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-20" />
        
        {/* Scan Lines Overlay */}
        <div className="absolute inset-0 scan-lines opacity-5 pointer-events-none" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full animate-pulse"
              style={{
                background: i % 3 === 0 ? '#FFD93D' : i % 3 === 1 ? '#5B2E90' : '#00FF00',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 4}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 md:py-20">
            <div className="text-center space-y-8">
              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="block text-[#FFD93D] mb-2" style={{
                  textShadow: '0 0 10px rgba(255,217,61,0.8), 0 0 20px rgba(255,217,61,0.6), 0 0 40px rgba(255,217,61,0.4)'
                }}>
                  PIKALEADS
                </span>
                <span className="block text-[#5B2E90] text-3xl md:text-4xl lg:text-5xl" style={{
                  textShadow: '0 0 10px rgba(91,46,144,0.8), 0 0 20px rgba(91,46,144,0.6), 0 0 40px rgba(91,46,144,0.4)'
                }}>
                  {language === "uk" ? "КВІЗ СИСТЕМА" : language === "ru" ? "КВИЗ СИСТЕМА" : "QUIZ SYSTEM"}
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                {language === "uk" 
                  ? "Футуристична система для збору лідів з Meta Ads та Google Ads"
                  : language === "ru"
                  ? "Футуристическая система для сбора лидов из Meta Ads и Google Ads"
                  : "Futuristic lead generation system for Meta Ads and Google Ads"}
              </p>

              {/* Stats Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
                <CyberpunkCard variant="purple" glow={true} className="text-center">
                  <div className="text-4xl font-black text-[#FFD93D] mb-2 neon-glow-green">10K+</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    {language === "uk" ? "Лідів згенеровано" : language === "ru" ? "Лидов сгенерировано" : "Leads Generated"}
                  </div>
                </CyberpunkCard>
                
                <CyberpunkCard variant="purple" glow={true} className="text-center">
                  <div className="text-4xl font-black text-[#FFD93D] mb-2 neon-glow-green">300%</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    {language === "uk" ? "Зріст продажів" : language === "ru" ? "Рост продаж" : "Sales Growth"}
                  </div>
                </CyberpunkCard>
                
                <CyberpunkCard variant="purple" glow={true} className="text-center">
                  <div className="text-4xl font-black text-[#FFD93D] mb-2 neon-glow-green">50+</div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider">
                    {language === "uk" ? "Активних клієнтів" : language === "ru" ? "Активных клиентов" : "Active Clients"}
                  </div>
                </CyberpunkCard>
              </div>
            </div>
          </section>

          {/* Quizzes Section */}
          <section className="container mx-auto px-4 py-16">
            {/* META ADS Quizzes */}
            {metaQuizzes.length > 0 && (
              <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
                  <GlitchText variant="cyan" className="text-[#00F0FF]">
                    {language === "uk" ? "META ADS КВІЗИ" : language === "ru" ? "META ADS КВИЗЫ" : "META ADS QUIZZES"}
                  </GlitchText>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {renderQuizCards(metaQuizzes)}
                </div>
              </div>
            )}

            {/* GOOGLE ADS Quizzes */}
            {googleQuizzes.length > 0 && (
              <div className="mb-16">
                <h2 className="text-4xl md:text-5xl font-black text-center mb-12">
                  <GlitchText variant="purple" className="text-[#5B2E90]" style={{
                    textShadow: '0 0 10px rgba(91,46,144,0.8), 0 0 20px rgba(91,46,144,0.6)'
                  }}>
                    {language === "uk" ? "GOOGLE ADS КВІЗИ" : language === "ru" ? "GOOGLE ADS КВИЗЫ" : "GOOGLE ADS QUIZZES"}
                  </GlitchText>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {renderQuizCards(googleQuizzes)}
                </div>
              </div>
            )}

            {/* No quizzes message */}
            {allQuizzes.length === 0 && (
              <div className="text-center py-16">
                <CyberpunkCard variant="purple" className="max-w-md mx-auto">
                  <p className="text-gray-400 text-lg">
                    {language === "uk" ? "Квізи ще не додані" : language === "ru" ? "Квизы еще не добавлены" : "No quizzes available yet"}
                  </p>
                </CyberpunkCard>
              </div>
            )}
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 py-16 text-center">
            <CyberpunkCard variant="purple" glow={true} className="max-w-3xl mx-auto p-12">
              <h3 className="text-3xl md:text-4xl font-black mb-6 text-[#FFD93D] neon-glow-green">
                {language === "uk" ? "ГОТОВІ ЗБІЛЬШИТИ ПРОДАЖІ?" : language === "ru" ? "ГОТОВЫ УВЕЛИЧИТЬ ПРОДАЖИ?" : "READY TO INCREASE SALES?"}
              </h3>
              <p className="text-gray-300 text-lg mb-8">
                {language === "uk" 
                  ? "Пройдіть квіз та отримайте персональну стратегію для вашого бізнесу"
                  : language === "ru"
                  ? "Пройдите квиз и получите персональную стратегию для вашего бизнеса"
                  : "Take the quiz and get a personalized strategy for your business"}
              </p>
              <NeonButton 
                variant="green" 
                size="lg"
                className="bg-[#FFD93D] text-black border-[#FFD93D] hover:bg-[#FFD93D]/90 text-xl px-12 py-6 whitespace-nowrap"
              >
                <span className="inline-flex items-center gap-3">
                  <Zap className="w-6 h-6" />
                  {language === "uk" ? "ПОЧАТИ ЗАРАЗ" : language === "ru" ? "НАЧАТЬ СЕЙЧАС" : "START NOW"}
                </span>
              </NeonButton>
            </CyberpunkCard>
          </section>
        </div>
      </div>
    </>
  );
}
