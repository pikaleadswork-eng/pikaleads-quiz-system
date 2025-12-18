import { Sparkles, Zap, TrendingUp, Users, ArrowRight, Target, Rocket, Award } from "lucide-react";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";

export default function AgencyHome() {
  return (
    <>
      {/* Navigation */}
      <CyberpunkNavigation currentPath="/" />
      
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Cyber Grid Background */}
        <div className="absolute inset-0 cyber-grid opacity-10" />
        
        {/* Hero Section - Brache Style */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Large Background Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h1 
              className="text-[20vw] font-black text-gray-800/20 select-none"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.1em'
              }}
            >
              FUTURISTIC
            </h1>
          </div>

          {/* Purple Glow Effects */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5B2E90] rounded-full blur-[150px] opacity-30 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FFD93D] rounded-full blur-[150px] opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />

          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 
                    className="text-sm font-bold tracking-[0.3em] text-[#FFD93D]"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}
                  >
                    COMMAND THE FUTURE
                  </h2>
                  <h1 
                    className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight"
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      textShadow: '0 0 30px rgba(255, 217, 61, 0.3)'
                    }}
                  >
                    <span className="text-white">OF </span>
                    <span className="text-[#FFD93D]">INNOVATION</span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-md" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Ми використовуємо найсучасніші технології для створення інноваційних рішень, які змінюють правила гри в digital marketing.
                  </p>
                </div>

                {/* CTA Button */}
                <button 
                  className="group relative px-8 py-4 bg-[#FFD93D] text-black font-bold rounded-lg overflow-hidden transition-all hover:scale-105"
                  style={{
                    boxShadow: '0 0 30px rgba(255, 217, 61, 0.5)',
                    fontFamily: 'Rajdhani, sans-serif'
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    РОЗПОЧАТИ
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-[#5B2E90] transform translate-y-full group-hover:translate-y-0 transition-transform" />
                </button>

                {/* Progress Bars */}
                <div className="space-y-4 pt-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Security</span>
                      <span className="text-[#FFD93D]" style={{ fontFamily: 'Space Mono, monospace' }}>92%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#FFD93D] to-[#5B2E90] rounded-full"
                        style={{ 
                          width: '92%',
                          boxShadow: '0 0 10px rgba(255, 217, 61, 0.5)'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Innovation</span>
                      <span className="text-[#FFD93D]" style={{ fontFamily: 'Space Mono, monospace' }}>97%</span>
                    </div>
                    <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#5B2E90] to-[#FFD93D] rounded-full"
                        style={{ 
                          width: '97%',
                          boxShadow: '0 0 10px rgba(91, 46, 144, 0.5)'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Right - Pikachu Hero Image */}
              <div className="relative flex justify-center items-center" style={{ background: 'transparent' }}>
                {/* Neon Glow Behind Pikachu */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[400px] h-[400px] bg-[#FFD93D] rounded-full blur-[100px] opacity-20" />
                  <div className="absolute w-[350px] h-[350px] bg-[#5B2E90] rounded-full blur-[80px] opacity-30" />
                </div>
                
                {/* Pikachu Image */}
                <img 
                  src="/pikachu-hero-clean.png" 
                  alt="Pikachu Boss" 
                  className="relative z-10 w-full max-w-[500px] h-auto drop-shadow-2xl"
                  style={{
                    filter: 'drop-shadow(0 0 40px rgba(255, 217, 61, 0.4))',
                    imageRendering: 'crisp-edges',
                    mixBlendMode: 'normal'
                  }}
                />

                {/* Stats Floating Cards */}
                <div 
                  className="absolute top-20 right-10 bg-black/80 backdrop-blur-sm border border-[#5B2E90] rounded-lg p-4"
                  style={{
                    boxShadow: '0 0 20px rgba(91, 46, 144, 0.3)'
                  }}
                >
                  <div className="text-4xl font-black text-[#FFD93D]" style={{ fontFamily: 'Orbitron, sans-serif' }}>45+</div>
                  <div className="text-sm text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Client Growth<br/>Impact</div>
                </div>

                <div 
                  className="absolute bottom-32 right-0 bg-black/80 backdrop-blur-sm border border-[#FFD93D] rounded-lg p-4"
                  style={{
                    boxShadow: '0 0 20px rgba(255, 217, 61, 0.3)'
                  }}
                >
                  <div className="text-4xl font-black text-[#5B2E90]" style={{ fontFamily: 'Orbitron, sans-serif' }}>120+</div>
                  <div className="text-sm text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Innovative<br/>Solutions</div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-[#FFD93D] rounded-full flex justify-center pt-2">
              <div className="w-1 h-3 bg-[#FFD93D] rounded-full" />
            </div>
          </div>
        </section>

        {/* STEP INTO THE PIKALEADS DIMENSION Section */}
        <section className="relative py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-[#5B2E90]/10 to-black" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left - Image Card */}
              <div 
                className="relative rounded-2xl overflow-hidden border-2 border-[#5B2E90]"
                style={{
                  boxShadow: '0 0 40px rgba(91, 46, 144, 0.3)'
                }}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-[#5B2E90]/20 to-black p-8 flex items-center justify-center">
                  <img 
                    src="/pikachu-hero-clean.png" 
                    alt="Pikachu Dimension" 
                    className="w-full h-auto"
                    style={{
                      filter: 'drop-shadow(0 0 30px rgba(255, 217, 61, 0.4))'
                    }}
                  />
                </div>
                
                {/* Overlay Badge */}
                <div className="absolute bottom-8 left-8 bg-black/90 backdrop-blur-sm border border-[#FFD93D] rounded-lg px-6 py-3">
                  <div className="text-2xl font-black text-[#FFD93D]" style={{ fontFamily: 'Orbitron, sans-serif' }}>PIKALEADS</div>
                  <div className="text-sm text-gray-400" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Innovative Solutions</div>
                </div>
              </div>

              {/* Right - Content */}
              <div className="space-y-8">
                <div>
                  <h2 
                    className="text-5xl md:text-6xl font-black mb-6"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    <span className="text-white">STEP INTO THE </span>
                    <span className="text-[#FFD93D]">PIKALEADS</span>
                    <br />
                    <span className="text-white">DIMENSION</span>
                  </h2>
                  <p className="text-gray-400 text-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    Ми створюємо унікальні рішення для вашого бізнесу, використовуючи найсучасніші технології та інноваційні підходи. Наша команда експертів готова вивести ваш проект на новий рівень.
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid gap-6">
                  {[
                    { icon: Target, title: "Software Development", desc: "Розробка програмного забезпечення з використанням найсучасніших технологій" },
                    { icon: Rocket, title: "Augmented Reality", desc: "Створення AR-рішень для покращення користувацького досвіду" },
                    { icon: Award, title: "Digital Branding", desc: "Побудова сильного цифрового бренду з унікальною ідентичністю" }
                  ].map((feature, idx) => (
                    <div 
                      key={idx}
                      className="group flex gap-4 p-6 bg-black/40 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-[#FFD93D] transition-all cursor-pointer"
                      style={{
                        boxShadow: '0 0 0 rgba(255, 217, 61, 0)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 217, 61, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = '0 0 0 rgba(255, 217, 61, 0)';
                      }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[#5B2E90]/20 border border-[#5B2E90] flex items-center justify-center group-hover:bg-[#FFD93D]/20 group-hover:border-[#FFD93D] transition-all">
                        <feature.icon className="w-6 h-6 text-[#FFD93D]" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, sans-serif' }}>{feature.title}</h3>
                        <p className="text-gray-400 text-sm" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{feature.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-[#FFD93D] group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>

                <button 
                  className="px-8 py-4 border-2 border-[#FFD93D] text-[#FFD93D] font-bold rounded-lg hover:bg-[#FFD93D] hover:text-black transition-all"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}
                >
                  LEARN MORE
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-32">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-[#FFD93D]/5 to-black" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <h2 
              className="text-5xl md:text-6xl font-black mb-8"
              style={{ 
                fontFamily: 'Orbitron, sans-serif',
                textShadow: '0 0 40px rgba(255, 217, 61, 0.3)'
              }}
            >
              <span className="text-white">ГОТОВІ </span>
              <span className="text-[#FFD93D]">РОЗПОЧАТИ?</span>
            </h2>
            <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Приєднуйтесь до нас та відкрийте нові можливості для вашого бізнесу
            </p>
            <button 
              className="px-12 py-5 bg-[#FFD93D] text-black font-bold text-lg rounded-lg hover:bg-[#5B2E90] hover:text-white transition-all transform hover:scale-105"
              style={{
                boxShadow: '0 0 40px rgba(255, 217, 61, 0.5)',
                fontFamily: 'Rajdhani, sans-serif'
              }}
            >
              ЗРОБИТИ ПЕРШИЙ КРОК
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative border-t border-gray-900 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center text-gray-500" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <p>&copy; 2025 PIKALEADS. All rights reserved.</p>
              <div className="mt-4 flex justify-center gap-6">
                <a href="/privacy" className="hover:text-[#FFD93D] transition-colors">Privacy</a>
                <a href="/contact" className="hover:text-[#FFD93D] transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
