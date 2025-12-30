import { useState } from "react";
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
import LeadFormModal from "@/components/LeadFormModal";
import Footer from "@/components/Footer";


export default function Home() {
  const { language } = useLanguage();
  const t = translations[language];
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false);

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
          en: "PIKALEADS - Professional Meta Ads and Google Ads | Increase Sales by 300%"
        }}
        description={{
          uk: "Експертна настройка та ведення реклами в Meta Ads (Facebook, Instagram) та Google Ads. Гарантуємо зростання продажів на 300%. Безкоштовна консультація!",
          ru: "Экспертная настройка и ведение рекламы в Meta Ads (Facebook, Instagram) и Google Ads. Гарантируем рост продаж на 300%. Бесплатная консультация!",
          en: "Expert setup and management of Meta Ads (Facebook, Instagram) and Google Ads. We guarantee 300% sales growth. Free consultation!"
        }}
        keywords={{uk: "Meta Ads, Facebook Ads, Instagram Ads, Google Ads, таргетована реклама, контекстна реклама, performance marketing, digital marketing, квіз маркетинг", ru: "Meta Ads, Facebook Ads, Instagram Ads, Google Ads, таргетированная реклама, контекстная реклама, performance marketing, digital marketing, квиз маркетинг", en: "Meta Ads, Facebook Ads, Instagram Ads, Google Ads, targeted advertising, contextual advertising, performance marketing, digital marketing, quiz marketing"}}
        ogImage="/og-image-home.jpg"
        structuredData={structuredData}
      />
      <CyberpunkNavigation currentPath="/" />

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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center w-full">
              
              {/* Right Side - Visual with Floating Cards (shows FIRST on mobile) */}
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] block lg:order-2">
                {/* Pikachu Hero Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src="/pikachu-transparent.png" 
                    alt="PikaLeads Mascot" 
                    className="w-[500px] md:w-[550px] lg:w-[600px] h-auto object-contain animate-float drop-shadow-2xl"
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

              {/* Left Side - Text Content (shows SECOND on mobile) */}
              <div className="space-y-8 lg:order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF00]/30 bg-[#00FF00]/5">
                  <div className="w-2 h-2 rounded-full bg-[#00FF00] animate-pulse" />
                  <span className="text-[#00FF00] text-sm font-bold uppercase tracking-wider">
                    {language === "uk" ? "СИСТЕМА АКТИВНА" : language === "ru" ? "СИСТЕМА АКТИВНА" : "SYSTEM ACTIVE"}
                  </span>
                </div>

                {/* Main Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-black leading-tight" style={{ fontFamily: "'Eurostile Bold Extended', 'Nasalization', 'Rajdhani', sans-serif", letterSpacing: '0.05em' }}>
                  <span className="block text-white mb-2">
                    {language === "uk" ? "КВІЗ" : language === "ru" ? "КВИЗ" : "QUIZ"}
                  </span>
                  <span className="block text-white mb-2">
                    {language === "uk" ? "МАРКЕТИНГ" : language === "ru" ? "МАРКЕТИНГ" : "MARKETING"}
                  </span>
                  <span className="block text-[#FFD93D]" style={{
                    textShadow: '0 0 20px rgba(255,217,61,0.6), 0 0 40px rgba(255,217,61,0.4)'
                  }}>
                    {language === "uk" ? "ДЛЯ ВАШОГО БІЗНЕСУ" : language === "ru" ? "ДЛЯ ВАШЕГО БИЗНЕСА" : "FOR YOUR BUSINESS"}
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
                    className="px-8 py-4 bg-[#FFD93D] text-black font-bold rounded-lg hover:bg-[#FFD93D]/90 transition-all text-lg"
                    style={{
                      boxShadow: '0 0 30px rgba(255, 217, 61, 0.4)',
                      fontFamily: 'Rajdhani, sans-serif',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onClick={() => {
                      ClarityEvents.trackCTAClick('Get Started', 'hero_cta');
                      setIsLeadFormOpen(true);
                    }}
                  >
                    <Zap className="w-5 h-5" />
                    <span>{language === "uk" ? "ПОЧАТИ ЗАРАЗ" : language === "ru" ? "НАЧАТЬ СЕЙЧАС" : "GET STARTED"}</span>
                  </button>
                </div>
              </div>

            </div>
          </section>

          {/* Quizzes Section */}
          <section className="container mx-auto px-4 py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                <GlitchText variant="purple">
                  {language === "uk" ? "Оберіть свою платформу" : language === "ru" ? "Выберите свою платформу" : "Choose Your Platform"}
                </GlitchText>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                {language === "uk" 
                  ? "Пройдіть квіз та отримайте персональну стратегію для вашого бізнесу"
                  : language === "ru"
                  ? "Пройдите квиз и получите персональную стратегию для вашего бизнеса"
                  : "Take a quiz and get a personalized strategy for your business"}
              </p>
            </div>

            {/* Meta Ads Section */}
            {metaQuizzes.length > 0 && (
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-8 text-center">
                  <span className="text-[#00FF00]" style={{ textShadow: '0 0 20px rgba(0, 255, 0, 0.5)' }}>
                    META ADS
                  </span>
                  <span className="text-gray-400 text-lg ml-4">
                    (Facebook & Instagram)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {renderQuizCards(metaQuizzes)}
                </div>
              </div>
            )}

            {/* Google Ads Section */}
            {googleQuizzes.length > 0 && (
              <div>
                <h3 className="text-3xl font-bold mb-8 text-center">
                  <span className="text-[#FFD93D]" style={{ textShadow: '0 0 20px rgba(255, 217, 61, 0.5)' }}>
                    GOOGLE ADS
                  </span>
                  <span className="text-gray-400 text-lg ml-4">
                    (Search & Display)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {renderQuizCards(googleQuizzes)}
                </div>
              </div>
            )}
          </section>

          {/* Our Clients Section */}
          <section className="py-20 relative">
            <div className="absolute inset-0 scan-lines opacity-5" />
            <div className="container relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  <GlitchText variant="cyan">
                    {language === "uk" ? "Наші клієнти" : language === "ru" ? "Наши клиенты" : "Our Clients"}
                  </GlitchText>
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4 items-center">
                {[
                  { name: "Maria Caruso", logo: "/clients/carusoshoes-enhanced.png" },
                  { name: "Ovita", logo: "/clients/optmaster-enhanced.png" },
                  { name: "ParkSide", logo: "/clients/parkside-enhanced.png" },
                  { name: "Nasledniki", logo: "/clients/nasledniki-enhanced.png" },
                  { name: "EMMI", logo: "/clients/emmi-enhanced.png" },
                  { name: "Vertera", logo: "/clients/client6-enhanced.png" }
                ].map((client, index) => (
                  <CyberpunkCard 
                    key={index} 
                    variant="cyan" 
                    className="flex items-center justify-center p-6 hover:scale-110 transition-all duration-500 group"
                    style={{
                      animation: `float ${3 + index * 0.5}s ease-in-out infinite`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="max-w-full h-20 object-contain transition-all duration-500 group-hover:scale-110"
                      style={{
                        filter: 'brightness(1) contrast(1)'
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="text-gray-400 text-sm">${client.name}</div>`;
                      }}
                    />
                  </CyberpunkCard>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 relative">
            <div className="absolute inset-0 scan-lines opacity-5" />
            <div className="container relative z-10">
              <div className="text-center mb-16">
                <GlitchText variant="purple" className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Bungee, sans-serif' }}>
                  {language === "uk" ? "ВІДГУКИ КЛІЄНТІВ" : language === "ru" ? "ОТЗЫВЫ КЛИЕНТОВ" : "CLIENT TESTIMONIALS"}
                </GlitchText>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  {language === "uk" ? "Що кажуть наші клієнти про співпрацю з нами" : language === "ru" ? "Что говорят наши клиенты о сотрудничестве с нами" : "What our clients say about working with us"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    id: 1,
                    name: language === "uk" ? "Інна Морозова" : "Инна Морозова",
                    rating: 5,
                    reviews: language === "uk" ? "6 відгуків" : "6 отзывов",
                    date: language === "uk" ? "1 тиждень тому" : "неделю назад",
                    text: language === "uk"
                      ? "Працюємо більше 3 років. Чітко розуміє, що потрібно, добре розуміє смисли. Глибоко розбирається в таргетингу і трафіку. Рекомендую і планую працювати разом далі!"
                      : "Работаем больше 3 лет. Четко понимает, что нужно, хорошо понимает смыслы. Глубоко разбирается в таргетинге и трафике. Рекомендую и планирую работать вместе дальше!",
                    tags: [language === "uk" ? "Якість" : "Качество", language === "uk" ? "Ставлення до клієнтів" : "Отношение к клиентам", language === "uk" ? "Професіоналізм" : "Профессионализм", language === "uk" ? "Ціна/якість" : "Цена/качество"]
                  },
                  {
                    id: 2,
                    name: "SH SH",
                    rating: 5,
                    reviews: language === "uk" ? "1 відгук" : "1 отзыв",
                    date: language === "uk" ? "2 тижні тому" : "2 недели назад",
                    text: language === "uk"
                      ? "Це агентство порекомендував мені партнер з іншого міста, їхньою роботою він дуже задоволений. Перших клієнтів він отримав через три дні роботи. Моя компанія з агентством працює близько місяця, у нас були проблеми з налаштуванням реклами (з нашої сторони), але агентство швидко все виправило і налаштувало."
                      : "Данное агентство порекомендовал мне партнер из другого города, их работой он очень доволен. Первых клиентов он получил через три дня работы. Моя компания с агентством работает около месяца, у нас были проблемы с настройкой рекламы (с нашей стороны), но агентство быстро все исправило и настроило.",
                    tags: [language === "uk" ? "Якість" : "Качество", language === "uk" ? "Ставлення до клієнтів" : "Отношение к клиентам", language === "uk" ? "Професіоналізм" : "Профессионализм", language === "uk" ? "Ціна/якість" : "Цена/качество"]
                  },
                  {
                    id: 3,
                    name: language === "uk" ? "Олексій Гріцай" : "Олексий Грицай",
                    rating: 5,
                    reviews: language === "uk" ? "26 відгуків" : "26 отзывов",
                    date: language === "uk" ? "2 тижні тому" : "2 недели назад",
                    text: language === "uk"
                      ? "Сервіс ідеальний, все швидко і якісно! Як тільки розберемося з клієнтами то повернуся обов'язково!"
                      : "Сервис идеальный, все быстро и качественно! Как только разберемся с клиентами то вернусь обязательно!",
                    tags: [language === "uk" ? "Якість" : "Качество", language === "uk" ? "Ставлення до клієнтів" : "Отношение к клиентам", language === "uk" ? "Професіоналізм" : "Профессионализм", language === "uk" ? "Ціна/якість" : "Цена/качество"]
                  },
                  {
                    id: 4,
                    name: language === "uk" ? "Олександр Більськой" : "Александр Бильской",
                    rating: 4,
                    reviews: language === "uk" ? "1 відгук" : "1 отзыв",
                    date: language === "uk" ? "2 тижні тому" : "2 недели назад",
                    text: language === "uk"
                      ? "Приценовав з агентством, зробили якісний сайт, налаштували CRM систему, налаштували рекламу, набрав замовлень дуже задоволений, розгребу замовлення буду продовжувати!"
                      : "Приценовав с агентством, сделали качественный сайт, настроили CRM систему, настроили рекламу, набрал заказов очень доволен, разгребу заказы буду продолжать!",
                    tags: [language === "uk" ? "Якість" : "Качество", language === "uk" ? "Ставлення до клієнтів" : "Отношение к клиентам", language === "uk" ? "Професіоналізм" : "Профессионализм", language === "uk" ? "Ціна/якість" : "Цена/качество"]
                  },
                  {
                    id: 5,
                    name: language === "uk" ? "Артем Білокур" : "Артем Билокур",
                    rating: 4,
                    reviews: language === "uk" ? "1 відгук" : "1 отзыв",
                    date: language === "uk" ? "2 тижні тому" : "2 недели назад",
                    text: language === "uk"
                      ? "Працюємо з хлопцями по рекламі доставки води, скажу так... Було 20 замовлень, стало 150, рост сильний добираю людей і будемо масштабуватися. Подобається підхід, строки, і созвони які тільки по справі без води і прочого"
                      : "Работаем с ребятами по рекламе доставки воды, скажу так... Было 20 заказов, стало 150, рост сильный добираю людей и будем масштабироваться. Нравится сильно подход, сроки, и созвоны которые только по делу без воды и прочего",
                    tags: [language === "uk" ? "Якість" : "Качество", language === "uk" ? "Ставлення до клієнтів" : "Отношение к клиентам", language === "uk" ? "Професіоналізм" : "Профессионализм", language === "uk" ? "Ціна/якість" : "Цена/качество"]
                  },
                  {
                    id: 6,
                    name: "Alla Dresses",
                    rating: 5,
                    reviews: language === "uk" ? "1 відгук" : "1 отзыв",
                    date: language === "uk" ? "2 тижні тому" : "2 недели назад",
                    text: language === "uk"
                      ? "Ми довго шукали хлопців для просування інстаграм для своїх проектів, знайшли, і тепер не відпускаємо, робота робиться завжди вчасно, завжди якісно і завжди на рівні, бувало таке що навіть посеред ночі ми дзвонили і хлопці вирішали проблему або пояснювали і знімали наші переживання"
                      : "Мы долго искали ребят для продвижения инстаграм для своих проектов, нашли, и теперь не отпускаем, работа делается всегда вовремя, всегда качественно и всегда на уровне, бывало такое что даже посреди ночи мы звонили и ребята решали проблему или объясняли и снимали наши переживания",
                    tags: [language === "uk" ? "Якість" : "Качество", language === "uk" ? "Ставлення до клієнтів" : "Отношение к клиентам", language === "uk" ? "Професіоналізм" : "Профессионализм"]
                  },
                ].map((testimonial) => (
                  <CyberpunkCard 
                    key={testimonial.id} 
                    variant="purple" 
                    glow={true}
                    className="p-6 hover:scale-105 transition-transform duration-300 flex flex-col"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg mb-1">{testimonial.name}</h4>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={i < testimonial.rating ? "text-[#FFD93D]" : "text-gray-600"}>
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-400">{testimonial.reviews}</p>
                      </div>
                      <span className="text-xs text-gray-500 uppercase px-2 py-1 bg-purple-900/30 rounded">
                        {language === "uk" ? "НОВЕ" : "НОВОЕ"}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {testimonial.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="text-gray-300 leading-relaxed flex-1 mb-4">
                      {testimonial.text}
                    </p>

                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <span>👍</span>
                      <span>{language === "uk" ? "Подобається" : "Нравится"}</span>
                    </div>
                  </CyberpunkCard>
                ))}
              </div>
            </div>
          </section>

          {/* Mobile CTA Section - показується тільки на мобільних */}
          <section className="py-12 md:hidden relative">
            <div className="absolute inset-0 scan-lines opacity-5" />
            <div className="container relative z-10 text-center">
              <CyberpunkCard variant="cyan" className="p-8">
                <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Bungee, sans-serif' }}>
                  {language === "uk" ? "ГОТОВІ ЗБІЛЬШИТИ ПРОДАЖІ?" : language === "ru" ? "ГОТОВЫ УВЕЛИЧИТЬ ПРОДАЖИ?" : "READY TO BOOST SALES?"}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {language === "uk" 
                    ? "Отримайте безкоштовну консультацію та дізнайтеся, як ми можемо допомогти вашому бізнесу" 
                    : language === "ru" 
                    ? "Получите бесплатную консультацию и узнайте, как мы можем помочь вашему бизнесу"
                    : "Get a free consultation and learn how we can help your business"}
                </p>
                <NeonButton 
                  variant="cyan"
                  size="lg" 
                  className="w-full"
                  onClick={() => setIsLeadFormOpen(true)}
                >
                  {language === "uk" ? "ОТРИМАТИ КОНСУЛЬТАЦІЮ" : language === "ru" ? "ПОЛУЧИТЬ КОНСУЛЬТАЦИЮ" : "GET CONSULTATION"}
                </NeonButton>
              </CyberpunkCard>
            </div>
          </section>
        </div>
      </div>
      {/* Footer */}
      <Footer />

      {/* Lead Form Modal */}
      <LeadFormModal 
        isOpen={isLeadFormOpen}
        onClose={() => setIsLeadFormOpen(false)}
        formType="consultation"
      />
    </>
  );
}
