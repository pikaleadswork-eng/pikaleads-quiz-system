import { Shield, FileText, TrendingUp, Clock } from "lucide-react";
import { useState } from "react";
import LeadFormModal from "@/components/LeadFormModal";

export default function GuaranteesSection() {
  const [contractModalOpen, setContractModalOpen] = useState(false);
  const guarantees = [
    {
      icon: Shield,
      title: "Прозорість звітності",
      description: "Щотижневі детальні звіти з усіма метриками: CPL, CPA, ROAS, конверсії. Повний доступ до рекламних кабінетів.",
      color: "#FFD93D"
    },
    {
      icon: FileText,
      title: "Договір з KPI",
      description: "Чіткі метрики в договорі: кількість лідів, вартість ліда, конверсія. Все зафіксовано юридично.",
      color: "#00F0FF"
    },
    {
      icon: TrendingUp,
      title: "Гарантія результату",
      description: "Якщо не досягнемо узгоджених KPI протягом 3 місяців — повернемо 50% вартості послуг.",
      color: "#FFD93D"
    },
    {
      icon: Clock,
      title: "Без прихованих платежів",
      description: "Фіксована ціна за послуги. Рекламний бюджет йде напряму в Meta/Google. Ніяких комісій.",
      color: "#00F0FF"
    }
  ];

  return (
    <section className="relative py-20 bg-black overflow-hidden">
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

      <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD93D]/30 bg-black/50 backdrop-blur-sm mb-6">
            <Shield className="w-4 h-4 text-[#FFD93D]" />
            <span className="text-[#FFD93D] text-sm font-mono tracking-wider uppercase">
              Наші гарантії
            </span>
          </div>
          
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            style={{
              fontFamily: "'Eurostile Bold Extended', 'Nasalization', 'Rajdhani', sans-serif",
              letterSpacing: "0.05em"
            }}
          >
            ПРАЦЮЄМО <span className="text-[#FFD93D]">ПРОЗОРО</span>
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Знімаємо всі ризики. Ви платите за результат, а не за обіцянки.
          </p>
        </div>

        {/* Guarantees Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {guarantees.map((guarantee, index) => {
            const Icon = guarantee.icon;
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-zinc-900/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-2xl p-8 hover:border-[#FFD93D]/50 transition-all duration-300"
                style={{
                  boxShadow: "0 0 40px rgba(255, 217, 61, 0.05)",
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${guarantee.color}20, ${guarantee.color}10)`,
                    border: `2px solid ${guarantee.color}40`
                  }}
                >
                  <Icon 
                    className="w-8 h-8" 
                    style={{ color: guarantee.color }}
                  />
                </div>

                {/* Content */}
                <h3 
                  className="text-xl font-bold text-white mb-3"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  {guarantee.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {guarantee.description}
                </p>

                {/* Hover Glow Effect */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${guarantee.color}10, transparent 70%)`
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Хочете побачити приклад договору з KPI?
          </p>
          <button 
            onClick={() => setContractModalOpen(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#FFD93D]/30"
          >
            <FileText className="w-5 h-5" />
            Отримати зразок договору
          </button>
        </div>
      </div>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={contractModalOpen}
        onClose={() => setContractModalOpen(false)}
        formType="contract"
      />

      {/* Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
