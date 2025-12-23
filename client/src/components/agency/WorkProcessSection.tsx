import { Search, Map, Palette, FlaskConical, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';

interface ProcessStep {
  id: number;
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  details: string[];
  color: string;
}

const steps: ProcessStep[] = [
  {
    id: 1,
    number: "01",
    icon: <Search className="w-8 h-8" />,
    title: "АУДИТ",
    description: "Пошук проблем і точок зростання",
    details: [
      "Аналіз поточної ситуації та конкурентів",
      "Виявлення слабких місць у маркетингу",
      "Оцінка потенціалу та можливостей",
      "Детальний звіт з рекомендаціями"
    ],
    color: "#3B82F6"
  },
  {
    id: 2,
    number: "02",
    icon: <Map className="w-8 h-8" />,
    title: "СТРАТЕГІЯ",
    description: "Дорожня карта проекту",
    details: [
      "Визначення цілей та KPI",
      "Вибір каналів та інструментів",
      "Розрахунок бюджету та прогнозів",
      "Покроковий план на 3-6 місяців"
    ],
    color: "#10B981"
  },
  {
    id: 3,
    number: "03",
    icon: <Palette className="w-8 h-8" />,
    title: "ПІДГОТОВКА",
    description: "Створення креативів та матеріалів",
    details: [
      "Дизайн банерів та візуалів",
      "Розробка лендінгів або сайтів",
      "Підготовка макетів та прототипів",
      "Налаштування аналітики та пікселів"
    ],
    color: "#F59E0B"
  },
  {
    id: 4,
    number: "04",
    icon: <FlaskConical className="w-8 h-8" />,
    title: "ТЕСТОВИЙ ЗАПУСК",
    description: "Запуск кампаній у режимі тесту",
    details: [
      "Запуск рекламних кампаній",
      "A/B тестування креативів",
      "Збір перших даних та метрик",
      "Швидка реакція на результати"
    ],
    color: "#EF4444"
  },
  {
    id: 5,
    number: "05",
    icon: <TrendingUp className="w-8 h-8" />,
    title: "ОПТИМІЗАЦІЯ",
    description: "Покращення результатів",
    details: [
      "Аналіз даних та пошук інсайтів",
      "Відключення неефективних каналів",
      "Масштабування успішних кампаній",
      "Зниження вартості ліда/продажу"
    ],
    color: "#8B5CF6"
  },
  {
    id: 6,
    number: "06",
    icon: <CheckCircle2 className="w-8 h-8" />,
    title: "СТАБІЛЬНА РОБОТА",
    description: "Вихід на постійний результат",
    details: [
      "Стабільний потік лідів/продажів",
      "Прогнозовані метрики та ROI",
      "Регулярні звіти та аналітика",
      "Постійна підтримка та розвиток"
    ],
    color: "#06B6D4"
  }
];

export default function WorkProcessSection() {
  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,46,144,0.08)_0%,transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,217,61,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,217,61,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

      {/* Connecting Lines */}
      <div className="absolute inset-0 hidden lg:block">
        <svg className="w-full h-full" style={{ opacity: 0.1 }}>
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: '#FFD93D', stopOpacity: 0 }} />
              <stop offset="50%" style={{ stopColor: '#FFD93D', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#FFD93D', stopOpacity: 0 }} />
            </linearGradient>
          </defs>
          <line x1="10%" y1="50%" x2="90%" y2="50%" stroke="url(#lineGradient)" strokeWidth="2" strokeDasharray="10,5" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 animate-fadeInUp">
          <div className="inline-block mb-4 px-4 py-1.5 bg-gradient-to-r from-purple-900/30 to-yellow-900/30 border border-yellow-400/20 rounded-full">
            <span className="text-yellow-400 text-xs md:text-sm font-semibold tracking-wider uppercase">
              ⚡ Перевірена методологія
            </span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-6" style={{ fontFamily: 'Eurostile, sans-serif' }}>
            <span className="text-white">ЯК МИ </span>
            <span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(255,217,61,0.5)' }}>ПРАЦЮЄМО</span>
          </h2>

          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto">
            6 етапів від аудиту до стабільного результату. 
            Прозорий процес, чіткі терміни, вимірювані результати.
          </p>
        </div>

        {/* Process Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:border-yellow-400/40 hover:shadow-[0_0_30px_rgba(255,217,61,0.15)] transition-all duration-300 animate-fadeInUp"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Step Number */}
              <div className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-black border-2 border-yellow-400/30 rounded-lg sm:rounded-xl flex items-center justify-center">
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400" style={{ fontFamily: 'Eurostile, sans-serif' }}>
                  {step.number}
                </span>
              </div>

              {/* Icon */}
              <div 
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-5 md:mb-6 transition-all duration-300 group-hover:scale-110"
                style={{ 
                  backgroundColor: `${step.color}20`,
                  color: step.color,
                  boxShadow: `0 0 20px ${step.color}30`
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3 
                className="text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3"
                style={{ 
                  fontFamily: 'Eurostile, sans-serif',
                  color: step.color
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm sm:text-base mb-4 sm:mb-5 md:mb-6">
                {step.description}
              </p>

              {/* Details List */}
              <ul className="space-y-2">
                {step.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                    <ArrowRight className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: step.color }} />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>

              {/* Hover Glow Effect */}
              <div 
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${step.color}10 0%, transparent 70%)`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Timeline Visualization (Mobile) */}
        <div className="lg:hidden mb-12 flex justify-center">
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: step.color }}
                ></div>
                {index < steps.length - 1 && (
                  <div className="w-8 h-0.5 bg-gradient-to-r from-yellow-400/50 to-purple-500/50"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <div className="max-w-2xl mx-auto p-8 md:p-12 bg-gradient-to-br from-purple-900/20 to-yellow-900/20 border border-yellow-400/30 rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: 'Eurostile, sans-serif' }}>
              ГОТОВІ ПОЧАТИ?
            </h3>
            <p className="text-gray-400 text-lg mb-6">
              Залиште заявку і отримайте безкоштовний аудит вашого проекту протягом 24 годин
            </p>
            <button
              className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-xl hover:shadow-[0_0_40px_rgba(255,217,61,0.6)] transition-all duration-300 hover:scale-105"
              style={{ fontFamily: 'Eurostile, sans-serif' }}
            >
              ПОЧАТИ ПРАЦЮВАТИ
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
