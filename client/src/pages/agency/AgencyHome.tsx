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
            <div className="space-y-8">
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F0FF]/30 bg-black/50 backdrop-blur-sm">
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                <span className="text-[#FFD93D] text-sm font-mono tracking-wider">
                  SYSTEM: LEAD ENGINE ACTIVE
                </span>
              </div>

              {/* Main Heading */}
                    <h1 
                className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight"
                style={{
                  fontFamily: "'Nasalization', 'Rajdhani', sans-serif",
                  letterSpacing: "0.1em",
                  fontWeight: 400
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
              <p className="text-xl text-gray-400 max-w-xl">
                <span className="text-[#FFD93D] font-semibold">PikaLeads</span> – твій партнер з performance-маркетингу. Коли кожен лід має значення.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/quizzes">
                  <button className="px-8 py-4 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#FFD93D]/30">
                    Отримати консультацію
                  </button>
                </Link>
                <button className="px-8 py-4 border-2 border-[#FFD93D] text-[#FFD93D] hover:bg-[#FFD93D]/10 font-bold rounded-xl transition-all duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Отримати стратегію
                </button>
              </div>
            </div>

            {/* Right - Pikachu Hero Visual */}
            <div className="relative h-[700px] lg:h-[800px] flex items-center justify-center">
              
              {/* Pikachu Character - Center */}
              <div className="relative z-0">
                <img 
                  src="/pikachu-transparent-user.png" 
                  alt="Pikachu Lead Generator"
                  className="w-[600px] lg:w-[750px] xl:w-[850px] max-w-none"
                  style={{
                    filter: "drop-shadow(0 0 60px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 30px rgba(255, 217, 61, 0.3))",
                    animation: "floatPikachu 6s ease-in-out infinite"
                  }}
                />
              </div>

              {/* Floating Cards Around Pikachu */}
              <div className="absolute inset-0 pointer-events-none z-20">
                
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

      {/* Rest of the page... */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-black text-white mb-4">
            Business With Powerful AI Solutions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Our AI Business Technology platform provides cutting-edge solutions
          </p>
        </div>
      </section>
    </div>
    </>
  );
}
