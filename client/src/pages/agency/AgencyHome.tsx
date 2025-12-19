import { ArrowRight, Zap } from "lucide-react";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import { useEffect, useRef } from "react";

export default function AgencyHome() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Particle animation effect
    const hero = heroRef.current;
    if (!hero) return;

    const particles: HTMLDivElement[] = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: ${i % 2 === 0 ? "#FFD93D" : "#00F0FF"};
        border-radius: 50%;
        opacity: 0;
        animation: particleFloat ${3 + Math.random() * 3}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        box-shadow: 0 0 10px ${i % 2 === 0 ? "#FFD93D" : "#00F0FF"};
      `;
      hero.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  return (
    <>
      {/* Navigation */}
      <CyberpunkNavigation currentPath="/" />
      
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Animated Cyber Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
              animation: "gridMove 20s linear infinite"
            }}
          />
        </div>

        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
        >
          {/* Gradient Glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD93D] rounded-full blur-[150px] opacity-20 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F0FF] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A855F7] rounded-full blur-[200px] opacity-10" />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                {/* System Status HUD */}
                <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/60 backdrop-blur-sm border border-[#00F0FF]/30 rounded-full">
                  <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                  <span className="text-[#00F0FF] text-sm font-mono tracking-wider">
                    SYSTEM: LEAD ENGINE ACTIVE
                  </span>
                </div>

                {/* Main Headline */}
                <div className="space-y-4">
                  <h1 
                    className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
                    style={{
                      fontFamily: "Bungee, sans-serif",
                      textShadow: "0 0 30px rgba(255, 217, 61, 0.3)",
                      letterSpacing: "0.02em"
                    }}
                  >
                    <span className="text-white inline-block animate-glitch">
                      ОБИРАЙ НЕ АГЕНСТВО.
                    </span>
                    <br />
                    <span className="text-[#FFD93D] inline-block" style={{
                      textShadow: "0 0 40px rgba(255, 217, 61, 0.6), 0 0 80px rgba(255, 217, 61, 0.3)"
                    }}>
                      ОБИРАЙ РЕЗУЛЬТАТ.
                    </span>
                  </h1>
                  
                  <p className="text-gray-300 text-lg md:text-xl max-w-xl leading-relaxed" style={{ fontFamily: "Rajdhani, sans-serif" }}>
                    <span className="text-[#00F0FF] font-bold">PikaLeads</span> — твій партнер з performance-маркетингу,
                    <br />
                    коли кожен лід має значення.
                  </p>
                </div>

                {/* HUD Info Tags */}
                <div className="flex flex-wrap gap-3">
                  {["Meta Ads", "Google Ads", "Funnels"].map((tag, idx) => (
                    <div 
                      key={idx}
                      className="px-4 py-2 bg-black/40 backdrop-blur-sm border border-[#FFD93D]/30 rounded-lg"
                      style={{
                        boxShadow: "0 0 15px rgba(255, 217, 61, 0.1)"
                      }}
                    >
                      <span className="text-[#FFD93D] font-mono text-sm tracking-wide">
                        {tag}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA Button with Lightning Effect */}
                <div className="pt-4">
                  <button 
                    className="group relative px-8 py-4 bg-gradient-to-r from-[#FFD93D] to-[#FFA500] text-black font-bold rounded-lg overflow-hidden transition-all hover:scale-105 hover:shadow-2xl"
                    style={{
                      boxShadow: "0 0 40px rgba(255, 217, 61, 0.5), 0 0 80px rgba(255, 217, 61, 0.2)",
                      fontFamily: "Rajdhani, sans-serif",
                      fontSize: "1.125rem",
                      letterSpacing: "0.05em"
                    }}
                  >
                    {/* Lightning Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute top-0 left-1/4 w-px h-full bg-white animate-lightning" />
                      <div className="absolute top-0 right-1/3 w-px h-full bg-white animate-lightning" style={{ animationDelay: "0.1s" }} />
                    </div>
                    
                    <span className="relative z-10 flex items-center gap-3">
                      <Zap className="w-5 h-5" />
                      Хочу почати працювати
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </span>
                  </button>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-6">
                  {[
                    { label: "ROI Driven", value: "300%" },
                    { label: "Performance", value: "Only" },
                    { label: "Markets", value: "UA•EU•USA" }
                  ].map((metric, idx) => (
                    <div 
                      key={idx}
                      className="text-center p-4 bg-black/30 backdrop-blur-sm border border-gray-800 rounded-lg hover:border-[#00F0FF]/50 transition-all"
                    >
                      <div className="text-2xl font-black text-[#00F0FF]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                        {metric.value}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 font-mono">
                        {metric.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right - Cyber Pikachu */}
              <div className="relative flex justify-center items-center min-h-[600px]">
                {/* Energy Field */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className="w-[500px] h-[500px] rounded-full animate-pulse"
                    style={{
                      background: "radial-gradient(circle, rgba(255, 217, 61, 0.15) 0%, rgba(0, 240, 255, 0.1) 50%, transparent 70%)",
                      animation: "energyPulse 3s ease-in-out infinite"
                    }}
                  />
                </div>

                {/* Digital Rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  {[1, 2, 3].map((ring) => (
                    <div
                      key={ring}
                      className="absolute rounded-full border-2"
                      style={{
                        width: `${300 + ring * 80}px`,
                        height: `${300 + ring * 80}px`,
                        borderColor: ring % 2 === 0 ? "rgba(255, 217, 61, 0.2)" : "rgba(0, 240, 255, 0.2)",
                        animation: `ringRotate ${10 + ring * 5}s linear infinite ${ring % 2 === 0 ? "reverse" : ""}`
                      }}
                    />
                  ))}
                </div>

                {/* Lightning Bolts */}
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="absolute top-1/4 left-1/4 w-32 h-32 text-[#FFD93D] opacity-60 animate-lightning" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                  </svg>
                  <svg className="absolute bottom-1/3 right-1/4 w-24 h-24 text-[#00F0FF] opacity-50 animate-lightning" style={{ animationDelay: "0.5s" }} viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" />
                  </svg>
                </div>

                {/* Pikachu Image */}
                <img 
                  src="/pikachu-hero-transparent.png" 
                  alt="PikaLeads Cyber Power" 
                  className="relative z-10 w-full max-w-[550px] h-auto"
                  style={{
                    filter: "drop-shadow(0 0 50px rgba(255, 217, 61, 0.5)) drop-shadow(0 0 100px rgba(0, 240, 255, 0.3))",
                    animation: "float 6s ease-in-out infinite"
                  }}
                />

                {/* HUD Overlay Elements */}
                <div className="absolute top-10 right-10 bg-black/80 backdrop-blur-sm border border-[#00F0FF] rounded-lg p-4 font-mono text-xs text-[#00F0FF]">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                    <span>MODE: PERFORMANCE</span>
                  </div>
                  <div className="text-[#FFD93D]">POWER: 97%</div>
                </div>

                <div className="absolute bottom-20 left-10 bg-black/80 backdrop-blur-sm border border-[#FFD93D] rounded-lg p-4 font-mono text-xs">
                  <div className="text-[#FFD93D] mb-1">⚡ ENERGY OUTPUT</div>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div 
                        key={i} 
                        className="w-1 h-6 bg-gradient-to-t from-[#FFD93D] to-[#00F0FF] rounded-full"
                        style={{
                          opacity: i < 8 ? 1 : 0.3,
                          animation: `barPulse 1s ease-in-out infinite`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#00F0FF] rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-[#00F0FF] rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* CSS Animations */}
        <style>{`
          @keyframes gridMove {
            0% { transform: translateY(0); }
            100% { transform: translateY(50px); }
          }

          @keyframes glitch {
            0%, 90%, 100% { transform: translateX(0); }
            92% { transform: translateX(-2px); }
            94% { transform: translateX(2px); }
            96% { transform: translateX(-2px); }
          }

          @keyframes lightning {
            0%, 90%, 100% { opacity: 0; }
            92%, 98% { opacity: 1; }
          }

          @keyframes energyPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.1); opacity: 0.5; }
          }

          @keyframes ringRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }

          @keyframes particleFloat {
            0% { 
              opacity: 0; 
              transform: translateY(100px) scale(0);
            }
            50% { 
              opacity: 1; 
              transform: translateY(-50px) scale(1);
            }
            100% { 
              opacity: 0; 
              transform: translateY(-200px) scale(0);
            }
          }

          @keyframes barPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }

          .animate-glitch {
            animation: glitch 5s infinite;
          }

          .animate-lightning {
            animation: lightning 2s infinite;
          }
        `}</style>
      </div>
    </>
  );
}
