import { ShoppingCart, Home, Sofa, Hammer, Briefcase, UtensilsCrossed, Building2, Smartphone, Send, Instagram } from "lucide-react";
import { useState } from "react";
import LeadFormModal from "@/components/LeadFormModal";

interface Niche {
  id: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  stats: string;
  color: string;
}

const niches: Niche[] = [
  {
    id: 1,
    icon: <ShoppingCart className="w-8 h-8" />,
    title: "E-COMMERCE",
    description: "Інтернет-магазини одягу, електроніки, товарів для дому. Налаштування Shopping Ads, ремаркетинг, збільшення ROAS до 680%.",
    stats: "ROAS 680%",
    color: "#3B82F6"
  },
  {
    id: 2,
    icon: <Home className="w-8 h-8" />,
    title: "НЕРУХОМІСТЬ",
    description: "Продаж квартир, будинків, комерційної нерухомості. Генерація якісних лідів через Meta Ads та Google Ads з CPL від $8.",
    stats: "CPL від $8",
    color: "#10B981"
  },
  {
    id: 3,
    icon: <Sofa className="w-8 h-8" />,
    title: "МЕБЛІ",
    description: "Виробники та магазини меблів. Візуальні креативи для Meta Ads, каталоги в Google Shopping. Конверсія до 14%.",
    stats: "Конверсія 14%",
    color: "#F59E0B"
  },
  {
    id: 4,
    icon: <Hammer className="w-8 h-8" />,
    title: "РЕМОНТ",
    description: "Будівельні компанії, ремонт квартир, оздоблювальні роботи. Локальна реклама в Google Maps, лідогенерація через квізи.",
    stats: "340 лідів/міс",
    color: "#EF4444"
  },
  {
    id: 5,
    icon: <Briefcase className="w-8 h-8" />,
    title: "B2B ПОСЛУГИ",
    description: "Консалтинг, IT-послуги, логістика, обладнання. LinkedIn Ads, Google Search, контент-маркетинг. ROI 420%.",
    stats: "ROI 420%",
    color: "#8B5CF6"
  },
  {
    id: 6,
    icon: <UtensilsCrossed className="w-8 h-8" />,
    title: "РЕСТОРАНИ",
    description: "Кафе, ресторани, доставка їжі. Instagram Ads, TikTok креативи, геотаргетинг. Збільшення замовлень на 280%.",
    stats: "+280% замовлень",
    color: "#EC4899"
  },
  {
    id: 7,
    icon: <Building2 className="w-8 h-8" />,
    title: "БУДІВНИЦТВО",
    description: "Забудовники, будівельні матеріали, інженерні системи. Performance Max, YouTube Ads. Ціль - довгостроковий ROI.",
    stats: "Довгостроковий ROI",
    color: "#06B6D4"
  },
  {
    id: 8,
    icon: <Smartphone className="w-8 h-8" />,
    title: "МОБІЛЬНІ ДОДАТКИ",
    description: "Просування застосунків iOS/Android. App Install кампанії в Meta, Google, TikTok. CPI від $0.85, retention 45%.",
    stats: "CPI $0.85",
    color: "#A855F7"
  },
  {
    id: 9,
    icon: <Send className="w-8 h-8" />,
    title: "TELEGRAM КАНАЛИ",
    description: "Розвиток Telegram каналів та груп. Органічне зростання підписників, таргетована реклама, контент-стратегія. Стабільні результати.",
    stats: "500 підписників/день",
    color: "#0088CC"
  },
  {
    id: 10,
    icon: <Instagram className="w-8 h-8" />,
    title: "INSTAGRAM GROWTH",
    description: "Набір підписників Instagram через таргетовану рекламу, Reels, Stories. Якісна аудиторія, висока активність, стабільний ріст.",
    stats: "1000 підписників/день",
    color: "#E4405F"
  }
];

export default function NichesSection() {
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,46,144,0.08)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,217,61,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,217,61,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
            <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              🎯 Наша експертиза
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
            <span className="text-white">НІШІ З ЯКИМИ МИ </span>
            <span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(255,217,61,0.5)' }}>ПРАЦЮЄМО</span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            Ми спеціалізуємося на performance-маркетингу для різних індустрій. 
            Кожна ніша має свої особливості — ми знаємо як отримати максимум результату.
          </p>
        </div>

        {/* Niches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {niches.map((niche, index) => (
            <div
              key={niche.id}
              className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(255,217,61,0.15)] transition-all duration-300 animate-fadeInUp flex flex-col h-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div 
                className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${niche.color}20`,
                  color: niche.color,
                  boxShadow: `0 0 20px ${niche.color}30`
                }}
              >
                {niche.icon}
              </div>

              {/* Title */}
              <h3 
                className="text-base sm:text-lg md:text-xl font-bold mb-2 sm:mb-3 transition-colors duration-300"
                style={{ 
                  fontFamily: 'Eurostile, sans-serif',
                  color: niche.color
                }}
              >
                {niche.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-grow">
                {niche.description}
              </p>

              {/* Stats Badge */}
              <div className="w-fit px-3 py-1.5 bg-black/50 border border-yellow-400/20 rounded-lg mt-auto">
                <span className="text-yellow-400 text-xs font-semibold">
                  {niche.stats}
                </span>
              </div>

              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${niche.color}10 0%, transparent 70%)`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12 md:mt-16 animate-fadeInUp" style={{ animationDelay: '0.8s' }}>
          <p className="text-gray-400 text-lg mb-4">
            Не знайшли свою нішу? Ми працюємо з будь-якими бізнесами, де потрібен результат.
          </p>
          <button
            onClick={() => setConsultationModalOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold rounded-xl hover:shadow-[0_0_30px_rgba(255,217,61,0.5)] transition-all duration-300 hover:scale-105"
            style={{ fontFamily: 'Eurostile, sans-serif' }}
          >
            ОБГОВОРИТИ ПРОЕКТ
          </button>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        formType="discuss_project"
      />
        </div>
      </div>
    </section>
  );
}
