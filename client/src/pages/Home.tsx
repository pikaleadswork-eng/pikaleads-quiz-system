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
import { toast } from "sonner";


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
              <h3 className="text-2xl font-bold mb-3 text-[#FFD93D] group-hover:neon-glow-green transition-all uppercase" style={{ fontFamily: 'Bungee, sans-serif' }}>
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
                fontFamily: 'Bungee, sans-serif'
              }}
              onClick={() => {
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
          {/* Hero Section - 50/50 Layout */}
          <section className="container mx-auto px-4 py-16 md:py-24 min-h-[90vh] flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center w-full">
              {/* Left Side - Text Content */}
              <div className="space-y-8">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF00]/30 bg-[#00FF00]/5">
                  <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                  <span className="text-[#00FF00] text-sm font-bold uppercase tracking-wider">
                    {language === "uk" ? "СИСТЕМА АКТИВНА" : language === "ru" ? "СИСТЕМА АКТИВНА" : "SYSTEM ACTIVE"}
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight" style={{ fontFamily: 'Bungee, sans-serif' }}>
                  <span className="block text-white mb-2">
                    {language === "uk" ? "КВІЗ СИСТЕМИ" : language === "ru" ? "КВИЗ СИСТЕМЫ" : "QUIZ SYSTEMS"}
                  </span>
                  <span className="block text-white mb-2">
                    {language === "uk" ? "ДЛЯ ВАШОГО" : language === "ru" ? "ДЛЯ ВАШЕГО" : "FOR YOUR"}
                  </span>
                  <span className="block text-white mb-2">
                    {language === "uk" ? "БІЗНЕСУ, ЩО" : language === "ru" ? "БИЗНЕСА, ЧТО" : "BUSINESS THAT"}
                  </span>
                  <span className="block text-[#FFD93D]" style={{
                    textShadow: '0 0 20px rgba(255,217,61,0.6), 0 0 40px rgba(255,217,61,0.4)'
                  }}>
                    {language === "uk" ? "ПРАЦЮЮТЬ НА РЕЗУЛЬТАТ" : language === "ru" ? "РАБОТАЮТ НА РЕЗУЛЬТАТ" : "WORK FOR RESULTS"}
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-xl text-gray-400 leading-relaxed max-w-xl">
                  {language === "uk" 
                    ? "PikaLeads – твій партнер з performance-маркетингу. Запускаємо Meta Ads та Google Ads з фокусом на реальний результат."
                    : language === "ru"
                    ? "PikaLeads – твой партнер по performance-маркетингу. Запускаем Meta Ads и Google Ads с фокусом на реальный результат."
                    : "PikaLeads – your performance marketing partner. We launch Meta Ads and Google Ads focused on real results."}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    className="px-8 py-4 bg-[#FFD93D] text-black font-bold rounded-lg hover:bg-[#FFD93D]/90 transition-all flex items-center justify-center gap-2 text-lg"
                    style={{
                      boxShadow: '0 0 30px rgba(255, 217, 61, 0.4)',
                      fontFamily: 'Rajdhani, sans-serif'
                    }}
                    onClick={() => {
                      ClarityEvents.trackCTAClick('Get Started', 'hero_cta');
                      toast.info(language === "uk" ? "Функція в розробці" : language === "ru" ? "Функция в разработке" : "Feature coming soon");
                    }}
                  >
                    <Zap className="w-5 h-5" />
                    {language === "uk" ? "ПОЧАТИ ЗАРАЗ" : language === "ru" ? "НАЧАТЬ СЕЙЧАС" : "GET STARTED"}
                  </button>
                </div>
              </div>

              {/* Right Side - Visual with Floating Cards */}
              <div className="relative h-[600px] hidden lg:block">
                {/* Pikachu Hero Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/pikachu-quiz-hero.png" 
                    alt="PikaLeads Mascot" 
                    className="w-[500px] h-auto object-contain animate-float drop-shadow-2xl"
                    style={{
                      filter: 'drop-shadow(0 0 40px rgba(255, 217, 61, 0.4))'
                    }}
                  />
                </div>

                {/* Floating Card 1 - Top Left */}
                <div 
                  className="absolute top-8 left-0 w-48 animate-float"
                  style={{ animationDelay: '0s' }}
                >
                  <CyberpunkCard variant="purple" glow={true} className="p-4">
                    <div className="text-3xl font-black text-[#FFD93D] mb-1">300%</div>
                    <div className="text-xs text-gray-400 uppercase">
                      {language === "uk" ? "Зростання продажів" : language === "ru" ? "Рост продаж" : "Sales Growth"}
                    </div>
                  </CyberpunkCard>
                </div>

                {/* Floating Card 2 - Top Right */}
                <div 
                  className="absolute top-16 right-0 w-52 animate-float"
                  style={{ animationDelay: '1s' }}
                >
                  <CyberpunkCard variant="purple" glow={true} className="p-4">
                    <div className="text-3xl font-black text-[#FFD93D] mb-1">500+</div>
                    <div className="text-xs text-gray-400 uppercase">
                      {language === "uk" ? "Успішних кампаній" : language === "ru" ? "Успешных кампаний" : "Successful Campaigns"}
                    </div>
                  </CyberpunkCard>
                </div>

                {/* Floating Card 3 - Middle Left */}
                <div 
                  className="absolute top-1/2 left-8 w-56 -translate-y-1/2 animate-float"
                  style={{ animationDelay: '2s' }}
                >
                  <CyberpunkCard variant="purple" glow={true} className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFD93D]/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-[#FFD93D]" />
                      </div>
                      <div className="text-sm font-bold text-white uppercase">
                        {language === "uk" ? "Performance" : language === "ru" ? "Performance" : "Performance"}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      {language === "uk" ? "AI-керована оптимізація" : language === "ru" ? "AI-управляемая оптимизация" : "AI-Driven Optimization"}
                    </div>
                  </CyberpunkCard>
                </div>

                {/* Floating Card 4 - Bottom Right */}
                <div 
                  className="absolute bottom-8 right-8 w-48 animate-float"
                  style={{ animationDelay: '1.5s' }}
                >
                  <CyberpunkCard variant="purple" glow={true} className="p-4">
                    <div className="text-3xl font-black text-[#FFD93D] mb-1">97%</div>
                    <div className="text-xs text-gray-400 uppercase">
                      {language === "uk" ? "Окупність реклами" : language === "ru" ? "Окупаемость рекламы" : "ROI"}
                    </div>
                  </CyberpunkCard>
                </div>

                {/* Floating Card 5 - Bottom Center */}
                <div 
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 w-64 animate-float"
                  style={{ animationDelay: '0.5s' }}
                >
                  <CyberpunkCard variant="purple" glow={true} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">{language === "uk" ? "Зростання" : language === "ru" ? "Рост" : "Growth"}</span>
                      <span className="text-[#00FF00] text-sm font-bold">+23% {language === "uk" ? "цього тижня" : language === "ru" ? "на этой неделе" : "this week"}</span>
                    </div>
                    <div className="h-16 flex items-end gap-1">
                      {[40, 55, 45, 70, 60, 85, 75].map((height, i) => (
                        <div 
                          key={i} 
                          className="flex-1 bg-gradient-to-t from-[#00FF00] to-[#00FF00]/50 rounded-t"
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </CyberpunkCard>
                </div>
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
