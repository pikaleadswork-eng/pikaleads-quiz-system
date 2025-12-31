import { useEffect } from "react";
import { Link } from "wouter";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";

export default function ThankYou() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Navigation */}
      <CyberpunkNavigation />

      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px"
            }}
          />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FFD93D]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 py-24 flex flex-col items-center justify-center min-h-screen">
          <div className="max-w-2xl text-center space-y-8" style={{ animation: "fadeInUp 0.8s ease-out" }}>
            
            {/* Success Icon */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-[#FFD93D]/20 rounded-full blur-2xl" />
                <div className="relative w-24 h-24 bg-[#FFD93D]/10 border-2 border-[#FFD93D] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Main Heading */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-black text-white"
              style={{
                fontFamily: "'Eurostile Bold Extended', 'Nasalization', sans-serif",
                letterSpacing: "0.05em"
              }}
            >
              ДЯКУЄМО!
            </h1>

            <div className="space-y-4">
              <p className="text-xl md:text-2xl text-[#FFD93D] font-bold">
                Ваша заявка успішно відправлена
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                Наш менеджер зв'яжеться з вами протягом <span className="text-[#FFD93D] font-bold">15 хвилин</span> для обговорення деталей вашого проєкту.
              </p>
            </div>

            {/* What's Next Section */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-[#FFD93D]/20 rounded-2xl p-8 text-left space-y-6 mt-12">
              <h2 className="text-2xl font-bold text-white text-center" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                ЩО ДАЛІ?
              </h2>

              <div className="space-y-4">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FFD93D]/10 border border-[#FFD93D] rounded-lg flex items-center justify-center">
                    <span className="text-[#FFD93D] font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Дзвінок менеджера</h3>
                    <p className="text-gray-400 text-sm">
                      Обговоримо ваші цілі, бюджет та очікування від рекламної кампанії
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FFD93D]/10 border border-[#FFD93D] rounded-lg flex items-center justify-center">
                    <span className="text-[#FFD93D] font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Аналіз та стратегія</h3>
                    <p className="text-gray-400 text-sm">
                      Підготуємо персональну стратегію просування з прогнозом результатів
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#FFD93D]/10 border border-[#FFD93D] rounded-lg flex items-center justify-center">
                    <span className="text-[#FFD93D] font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">Запуск кампанії</h3>
                    <p className="text-gray-400 text-sm">
                      Налаштуємо рекламу та почнемо залучати перші ліди протягом 24-48 годин
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-zinc-900/30 border border-[#00F0FF]/20 rounded-xl p-6 mt-8">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-[#00F0FF] flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-left">
                  <p className="text-sm text-gray-300">
                    <span className="font-bold text-white">Важливо:</span> Перевірте, будь ласка, що ваш телефон доступний. 
                    Якщо ми не зможемо до вас додзвонитися, надішлемо SMS або повідомлення в Telegram.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
              <Link href="/">
                <button className="px-8 py-4 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-bold rounded-xl transition-all duration-300">
                  Повернутися на головну
                </button>
              </Link>
              <Link href="/quizzes">
                <button className="px-8 py-4 border-2 border-[#FFD93D] text-[#FFD93D] hover:bg-[#FFD93D]/10 font-bold rounded-xl transition-all duration-300">
                  Пройти квіз
                </button>
              </Link>
            </div>

            {/* Contact Info */}
            <div className="mt-12 pt-8 border-t border-zinc-800">
              <p className="text-gray-500 text-sm mb-4">
                Маєте термінове питання?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <a href="tel:+380992377117" className="text-[#FFD93D] hover:text-[#FFD93D]/80 font-bold transition-colors">
                  📞 +380 99 23 77 117
                </a>
                <span className="hidden sm:inline text-gray-700">|</span>
                <a href="https://t.me/pikaleads" target="_blank" rel="noopener noreferrer" className="text-[#00F0FF] hover:text-[#00F0FF]/80 font-bold transition-colors">
                  ✈️ Telegram
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
