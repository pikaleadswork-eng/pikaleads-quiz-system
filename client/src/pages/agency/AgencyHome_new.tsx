import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function AgencyHome() {
  const { t } = useTranslation();

  return (
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
                <span className="text-[#00F0FF] text-sm font-mono tracking-wider">
                  SYSTEM: LEAD ENGINE ACTIVE
                </span>
              </div>

              {/* Main Heading */}
              <h1 className="text-5xl lg:text-7xl font-black leading-tight">
                <span className="text-white">ОБИРАЙ</span>
                <br />
                <span className="text-white">НЕ АГЕНСТВО.</span>
                <br />
                <span className="text-[#FFD93D]">ОБИРАЙ</span>
                <br />
                <span className="text-[#FFD93D]">РЕЗУЛЬТАТ.</span>
              </h1>

              {/* Description */}
              <p className="text-xl text-gray-400 max-w-xl">
                <span className="text-[#00F0FF] font-semibold">PikaLeads</span> – твій партнер з performance-маркетингу.
                <br />
                Коли кожен лід має значення.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link href="/quizzes">
                  <button className="px-8 py-4 bg-gradient-to-r from-[#00FF00] to-[#00CC00] hover:from-[#00CC00] hover:to-[#00AA00] text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#00FF00]/30">
                    Почати зараз
                  </button>
                </Link>
                <button className="px-8 py-4 border-2 border-[#00F0FF] text-[#00F0FF] hover:bg-[#00F0FF]/10 font-bold rounded-xl transition-all duration-300 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                  </svg>
                  Дивитись відео
                </button>
              </div>
            </div>

            {/* Right - 3D Neural Network Visual */}
            <div className="relative h-[700px] lg:h-[800px]">
              
              {/* Central Energy Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-[300px] h-[300px] rounded-full"
                  style={{
                    background: "radial-gradient(circle, rgba(255, 217, 61, 0.3) 0%, rgba(0, 240, 255, 0.2) 40%, rgba(168, 85, 247, 0.15) 70%, transparent 100%)",
                    boxShadow: "0 0 150px rgba(255, 217, 61, 0.4), 0 0 250px rgba(0, 240, 255, 0.3)",
                    animation: "energyPulse 4s ease-in-out infinite"
                  }}
                />
              </div>

              {/* Neural Network - Center Node */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-[#FFD93D] via-[#00F0FF] to-[#A855F7] flex items-center justify-center"
                  style={{
                    boxShadow: "0 0 60px rgba(255, 217, 61, 0.8), 0 0 100px rgba(0, 240, 255, 0.6)",
                    animation: "pulse 3s ease-in-out infinite"
                  }}
                >
                  <div className="w-20 h-20 rounded-full bg-black/60 backdrop-blur-sm border-2 border-white/20" />
                </div>
              </div>

              {/* Outer Network Nodes */}
              <div className="absolute inset-0">
                {[
                  { top: "8%", left: "50%", transform: "translateX(-50%)", color: "#FFD93D", size: "w-16 h-16" },
                  { top: "22%", right: "12%", color: "#00F0FF", size: "w-14 h-14" },
                  { top: "50%", right: "3%", transform: "translateY(-50%)", color: "#A855F7", size: "w-12 h-12" },
                  { bottom: "22%", right: "12%", color: "#FFD93D", size: "w-14 h-14" },
                  { bottom: "8%", left: "50%", transform: "translateX(-50%)", color: "#00F0FF", size: "w-16 h-16" },
                  { bottom: "22%", left: "12%", color: "#A855F7", size: "w-14 h-14" },
                  { top: "50%", left: "3%", transform: "translateY(-50%)", color: "#FFD93D", size: "w-12 h-12" },
                  { top: "22%", left: "12%", color: "#00F0FF", size: "w-14 h-14" }
                ].map((node, idx) => (
                  <div
                    key={idx}
                    className={`absolute ${node.size} rounded-full border-2 flex items-center justify-center`}
                    style={{
                      ...node,
                      borderColor: node.color,
                      background: `radial-gradient(circle, ${node.color}40 0%, transparent 70%)`,
                      boxShadow: `0 0 30px ${node.color}80`,
                      animation: `pulse 3s ease-in-out infinite`,
                      animationDelay: `${idx * 0.2}s`
                    }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: node.color }}
                    />
                  </div>
                ))}
              </div>

              {/* Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.3 }}>
                <defs>
                  <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD93D" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#A855F7" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <line x1="50%" y1="50%" x2="50%" y2="8%" stroke="url(#grad1)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="88%" y2="22%" stroke="url(#grad2)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="97%" y2="50%" stroke="url(#grad1)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="88%" y2="78%" stroke="url(#grad2)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="50%" y2="92%" stroke="url(#grad1)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="12%" y2="78%" stroke="url(#grad2)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="3%" y2="50%" stroke="url(#grad1)" strokeWidth="2" />
                <line x1="50%" y1="50%" x2="12%" y2="22%" stroke="url(#grad2)" strokeWidth="2" />
              </svg>

              {/* Floating Cards */}
              <div className="absolute inset-0 pointer-events-none">
                
                {/* Card 1: 300M+ - Top Left */}
                <div 
                  className="absolute top-[10%] left-[8%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-2xl p-5 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 5s ease-in-out infinite"
                  }}
                >
                  <div className="text-4xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    300%
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
                    Зростання продажів
                  </div>
                </div>

                {/* Card 2: 500+ - Top Right */}
                <div 
                  className="absolute top-[8%] right-[10%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-5 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(0, 240, 255, 0.15)",
                    animation: "floatCard 5.5s ease-in-out infinite",
                    animationDelay: "0.5s"
                  }}
                >
                  <div className="text-4xl font-black text-[#00F0FF]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    500+
                  </div>
                  <div className="text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider">
                    Успішних кампаній
                  </div>
                </div>

                {/* Card 3: Growth Badge - Middle Left */}
                <div 
                  className="absolute top-[42%] left-[5%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#A855F7]/20 rounded-2xl p-4 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(168, 85, 247, 0.15)",
                    animation: "floatCard 6s ease-in-out infinite",
                    animationDelay: "1s"
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-[#A855F7]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 7H7v6h6V7z" />
                      <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#A855F7] font-mono text-xs tracking-wider uppercase">
                      Growth with
                    </span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    AI-Driven Technology
                  </div>
                </div>

                {/* Card 4: 321+ - Bottom Right */}
                <div 
                  className="absolute bottom-[18%] right-[8%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-2xl p-5 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 5.2s ease-in-out infinite",
                    animationDelay: "1.5s"
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-5 h-5 text-[#FFD93D]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                      Powerful
                    </span>
                  </div>
                  <div className="text-4xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    97%
                  </div>
                </div>

                {/* Card 5: Chart - Bottom Left */}
                <div 
                  className="absolute bottom-[12%] left-[12%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#00F0FF]/20 rounded-2xl p-4 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(0, 240, 255, 0.15)",
                    animation: "floatCard 5.8s ease-in-out infinite",
                    animationDelay: "2s"
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-mono uppercase tracking-wider">
                      Insights with AI
                    </span>
                    <span className="text-[#00FF00] text-xs font-bold">+29%</span>
                  </div>
                  <div className="text-sm text-gray-400 mb-2 font-mono">
                    12,456,789
                    <span className="text-xs text-gray-600 ml-1">Visitors</span>
                  </div>
                  <svg className="w-40 h-16" viewBox="0 0 160 60" fill="none">
                    <path 
                      d="M 0 50 Q 20 48 40 42 T 80 28 T 120 18 T 160 10" 
                      stroke="#00FF00" 
                      strokeWidth="3" 
                      fill="none"
                      strokeLinecap="round"
                    />
                    <path 
                      d="M 0 50 Q 20 48 40 42 T 80 28 T 120 18 T 160 10 L 160 60 L 0 60 Z" 
                      fill="url(#chartGradient)" 
                      opacity="0.3"
                    />
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#00FF00" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#00FF00" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
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
  );
}
