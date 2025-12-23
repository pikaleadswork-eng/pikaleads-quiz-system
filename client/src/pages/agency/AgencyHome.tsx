import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";

export default function AgencyHome() {
  const { t } = useTranslation();

  return (
    <>
      {/* Navigation */}
      <CyberpunkNavigation currentPath="/" />
      
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - AI Neural Network Style */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }}
        />

        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left - Text Content */}
            <div className="space-y-8 text-center lg:text-left">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F0FF]/30 bg-black/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                <span className="text-[#FFD93D] text-sm font-mono tracking-wider">
                  SYSTEM: LEAD ENGINE ACTIVE
                </span>
              </div>

              {/* Main Heading */}
                    <h1 
                className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
                style={{
                  fontFamily: "'Eurostile Bold Extended', 'Nasalization', 'Rajdhani', sans-serif",
                  letterSpacing: "0.05em",
                  fontWeight: 700
                }}
              >
                <span 
                  className="text-white inline-block"
                  style={{
                    textShadow: "0 0 30px rgba(255, 217, 61, 0.3)"
                  }}
                >
                  ОБИРАЙ НЕ АГЕНСТВО.
                </span>
                <br />
                <span 
                  className="text-[#FFD93D] inline-block"
                  style={{
                    textShadow: "0 0 40px rgba(255, 217, 61, 0.6), 0 0 80px rgba(255, 217, 61, 0.3)"
                  }}
                >
                  ОБИРАЙ РЕЗУЛЬТАТ.
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
                <span className="text-[#FFD93D] font-semibold">PikaLeads</span> – твій партнер з performance-маркетингу. Коли кожен лід має значення.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start justify-center lg:justify-start">
                <Link href="/quizzes" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#FFD93D]/30">
                    Отримати консультацію
                  </button>
                </Link>
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-[#FFD93D] text-[#FFD93D] hover:bg-[#FFD93D]/10 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Отримати стратегію
                </button>
              </div>
            </div>

            {/* Right - Pikachu Hero Visual */}
            <div className="relative h-[500px] md:h-[600px] lg:h-[800px] flex items-center justify-center">
              
              {/* Pikachu Character - Center */}
              <div className="relative z-0">
                <img 
                  src="/pikachu-transparent-user.png" 
                  alt="Pikachu Lead Generator"
                  className="w-[400px] md:w-[500px] lg:w-[750px] xl:w-[850px] max-w-none"
                  style={{
                    filter: "drop-shadow(0 0 60px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 30px rgba(255, 217, 61, 0.3))",
                    animation: "floatPikachu 6s ease-in-out infinite"
                  }}
                />
              </div>

              {/* Floating Cards Around Pikachu */}
              <div className="absolute inset-0 pointer-events-none z-20 hidden lg:block">
                
                {/* Card 1: 300% - Top Left */}
                <div 
                  className="absolute top-[1%] left-[5%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-2xl p-6 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 5s ease-in-out infinite"
                  }}
                >
                  <div className="text-5xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    300%
                  </div>
                  <div className="text-sm text-gray-400 mt-2 font-mono uppercase tracking-wider">
                    Зростання продажів
                  </div>
                </div>

                {/* Card 2: 97% ROI - Top Right */}
                <div 
                  className="absolute top-[15%] right-[5%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-2xl p-6 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 5.5s ease-in-out infinite",
                    animationDelay: "0.5s"
                  }}
                >
                  <div className="text-5xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    97%
                  </div>
                  <div className="text-sm text-gray-400 mt-2 font-mono uppercase tracking-wider">
                    ROI
                  </div>
                </div>

                {/* Card 3: 500+ - Bottom Right */}
                <div 
                  className="absolute bottom-[10%] right-[8%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-2xl p-6 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 6s ease-in-out infinite",
                    animationDelay: "1s"
                  }}
                >
                  <div className="text-5xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    500+
                  </div>
                  <div className="text-sm text-gray-400 mt-2 font-mono uppercase tracking-wider">
                    Успішних кампаній
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Why Us Section - Cyberpunk Style */}
      <section className="relative py-16 bg-black overflow-hidden">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4"
              style={{
                fontFamily: "'Eurostile Bold Extended', 'Nasalization', sans-serif",
                letterSpacing: "0.05em"
              }}
            >
              ЧОМУ МИ?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Ми не просто генеруємо ліди. Ми створюємо систему, яка працює на ваш бізнес 24/7.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Feature 1 - Performance Marketing */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#FFD93D]/20 rounded-2xl p-6 sm:p-8 hover:border-[#FFD93D]/40 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#FFD93D]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  PERFORMANCE
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Платиш тільки за результат. Кожна гривня працює на твій прибуток.
                </p>
              </div>
            </div>

            {/* Feature 2 - AI Technology */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#00F0FF]/20 rounded-2xl p-6 sm:p-8 hover:border-[#00F0FF]/40 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#00F0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  AI-TECH
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Штучний інтелект аналізує поведінку та підбирає найкращі рішення для кожного ліда.
                </p>
              </div>
            </div>

            {/* Feature 3 - Full Analytics */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8 hover:border-purple-500/40 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  АНАЛІТИКА
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Бачиш кожен крок клієнта: від кліку до покупки. Прозорість на 100%.
                </p>
              </div>
            </div>

            {/* Feature 4 - Expert Team */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#FFD93D]/20 rounded-2xl p-6 sm:p-8 hover:border-[#FFD93D]/40 transition-all duration-300">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#FFD93D]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  ЕКСПЕРТИ
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  Досвід у нішах: e-commerce, фінанси, освіта, нерухомість. Знаємо, що працює.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
    </>
  );
}
