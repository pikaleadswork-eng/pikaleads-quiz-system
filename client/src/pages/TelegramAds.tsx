import { useState } from "react";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import Footer from "@/components/Footer";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumCard from "@/components/PremiumCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import CollapsibleFAQ from "@/components/CollapsibleFAQ";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function TelegramAdsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "", website: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLeadMutation = trpc.leads.submitLead.useMutation({
    onSuccess: () => {
      toast.success("Заявку відправлено! Ми зв'яжемось з вами найближчим часом.");
      setFormData({ name: "", contact: "", website: "" });
      setIsSubmitting(false);
    },
    onError: () => {
      toast.error("Помилка відправки. Спробуйте ще раз.");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = async (e: React.FormEvent, formType: "audit" | "plan") => {
    e.preventDefault();
    if (!formData.name || !formData.contact) {
      toast.error("Будь ласка, заповніть всі обов'язкові поля");
      return;
    }
    setIsSubmitting(true);
    submitLeadMutation.mutate({
      name: formData.name,
      phone: formData.contact,
      email: "",
      telegram: "",
      source: formType === "audit" ? "Telegram Ads - Аудит" : "Telegram Ads - План запуску",
      notes: formData.website ? `Сайт/ніша: ${formData.website}` : ""
    });
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/telegram-ads" />
      <div className="min-h-screen bg-black text-white">
        {/* БЛОК 1. HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 py-12 sm:py-20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "\'Bungee\', \'Eurostile Bold Extended\', sans-serif" }}>
                  <span className="text-white">Отримуйте від 20 заявок на день через </span>
                  <span className="text-[#FFD93D]">Telegram</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Стабільний потік заявок для вашого бізнесу з запуском за 72 години!
                </p>
                <p className="text-sm text-zinc-500">
                  Кількість заявок залежить від ніші, бюджету та продукту. Потенціал визначаємо під час аудиту.
                </p>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button size="lg" className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    ОТРИМАТИ АУДИТ <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button size="lg" className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => setModalOpen(true)}>
                    Залишити заявку
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD93D]/20 to-[#00F0FF]/20 blur-3xl" />
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  <img src="/telegram-ads-hero.png" alt="Telegram Ads" className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxHeight: "850px", minHeight: "500px" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 2. ВАМ ЦЕ ЗНАЙОМО? */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Вам це знайомо при роботі з Telegram Ads?</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-8 sm:mb-10">
              {[
                { title: "Низька конверсія", desc: "Реклама показується, але заявок мало. Складно зрозуміти, чому люди не реагують на оголошення.", icon: "📉" },
                { title: "Неправильний таргетинг", desc: "Реклама показується не тій аудиторії. Витрачаєте бюджет на покази, які не приносять заявок.", icon: "🎯" },
                { title: "Слабкі креативи", desc: "Оголошення не зупиняють увагу. Люди просто проскролюють повз вашу рекламу в стрічці.", icon: "👁️" },
                { title: "Відсутність системи", desc: "Немає чіткого плану дій. Кожен запуск — це новий експеримент без аналізу попередніх результатів.", icon: "🔄" }
              ].map((problem, i) => (
                <PremiumCard
                  key={i}
                  icon={<span className="text-4xl">{problem.icon}</span>}
                  title={problem.title}
                  description={problem.desc}
                  borderColor="#EF4444"
                  iconBgColor="rgba(239, 68, 68, 0.15)"
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#FFD93D]">
                👉 У результаті Telegram виглядає перспективно, але не працює як надійний канал заявок.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 3. РІШЕННЯ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Як ми приводимо заявки з Telegram</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Ми працюємо по чіткій логіці, без хаотичних розміщень.</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-8 sm:mb-10">
              {[
                { title: "Аналіз аудиторії", desc: "Глибоко вивчаємо вашу цільову аудиторію в Telegram: інтереси, канали, поведінку. Знаходимо найбільш релевантні сегменти.", icon: "🔍", color: "#FFD93D" },
                { title: "Створення креативів", desc: "Розробляємо оголошення, які зупиняють скрол. Тестуємо різні підходи та формати для максимальної конверсії.", icon: "🎨", color: "#00F0FF" },
                { title: "Налаштування кампаній", desc: "Запускаємо рекламу з правильним таргетингом та бюджетом. Постійно моніторимо та оптимізуємо показники.", icon: "⚙️", color: "#A855F7" },
                { title: "Масштабування результату", desc: "Коли знаходимо робочу зв'язку, масштабуємо її на більші бюджети. Стабільний потік заявок без зливу коштів.", icon: "📈", color: "#10B981" }
              ].map((step, i) => (
                <PremiumCard
                  key={i}
                  icon={<span className="text-3xl sm:text-4xl">{step.icon}</span>}
                  title={step.title}
                  description={step.desc}
                  borderColor={step.color}
                  iconBgColor={`${step.color}20`}
                />
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#00F0FF]">
                👉 У підсумку ви отримуєте керований потік заявок з Telegram, який можна планувати і збільшувати.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 4. ЛІДГЕН З ОБМЕЖЕННЯМ */}
        <section id="audit-form" className="py-12 sm:py-16 bg-gradient-to-br from-zinc-900 to-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Аудит Telegram Ads</h2>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-4" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Ми подивимось вашу ситуацію і скажемо:</p>
              </div>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-10">
                {[
                  { text: "чи реально вийти на 20+ заявок на день", color: "#FFD93D" },
                  { text: "які канали і формати підійдуть", color: "#00F0FF" },
                  { text: "який бюджет потрібен", color: "#A855F7" }
                ].map((item, i) => (
                  <Card key={i} className="bg-zinc-800/50" style={{ borderColor: `${item.color}30` }}>
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4" style={{ color: item.color }} />
                      <p className="text-white">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-zinc-800/80 border-[#FFD93D]/50">
                <CardContent className="p-8">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8">
                    <p className="text-red-400 font-bold text-center">
                      ❗ Обмеження: Ми беремо обмежену кількість проєктів, щоб працювати з кожним запуском якісно.
                    </p>
                  </div>
                  <form onSubmit={(e) => handleSubmit(e, "audit")} className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Ім'я *</label>
                      <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ваше ім'я" className="bg-zinc-900 border-zinc-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
                      <Input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="+380..." className="bg-zinc-900 border-zinc-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Сайт або ніша</label>
                      <Input type="text" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="example.com або опишіть вашу нішу" className="bg-zinc-900 border-zinc-700 text-white" />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-lg" disabled={isSubmitting}>
                      {isSubmitting ? "Відправка..." : "ОТРИМАТИ АУДИТ"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* БЛОК 5. ЯК МИ ПРАЦЮЄМО */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Як виглядає співпраця</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Ми беремо Telegram Ads під ключ.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { text: "аналізуємо продукт і цільову аудиторію", color: "#FFD93D" },
                { text: "готуємо рекламні матеріали", color: "#00F0FF" },
                { text: "розміщуємо рекламу в релевантних каналах", color: "#A855F7" },
                { text: "працюємо над стабільністю заявок", color: "#10B981" }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700 transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: item.color }} />
                    <p className="text-white font-semibold">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#FFD93D]">
                Вам не потрібно шукати канали і домовлятись — ви отримуєте заявки і бачите результат.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6. КЕЙСИ */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>До яких результатів приходять клієнти</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                Telegram може давати заявки, якщо працювати з ним правильно.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { emoji: "📈", text: "стабільний потік заявок" },
                { emoji: "💡", text: "зрозуміло, які канали працюють" },
                { emoji: "🚀", text: "можливість масштабування" },
                { emoji: "✅", text: "Telegram стає окремим каналом залучення клієнтів" }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="text-4xl font-black">{item.emoji}</div>
                    <p className="text-white font-semibold">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Кожен проєкт починається з оцінки потенціалу.</p>
            </div>
          </div>
        </section>

        {/* БЛОК 6.5. КЕЙСИ - Dynamic from Database */}
        <CaseStudiesSection pageSlug="telegram-ads" limit={4} />

        {/* БЛОК 7. FAQ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "'Bungee', sans-serif" }}>Питання та відповіді</h2>
            </div>

            <CollapsibleFAQ
              items={[
                {
                  question: "Чи підходить Telegram для мого бізнесу?",
                  answer: "Не для всіх. Це ми визначаємо на аудиті.",
                  color: "#FFD93D"
                },
                {
                  question: "Коли з'являються перші заявки?",
                  answer: "Після запуску і перших розміщень реклами.",
                  color: "#00F0FF"
                },
                {
                  question: "Чи потрібна моя участь?",
                  answer: "Ні. Ми беремо всю рекламну частину на себе.",
                  color: "#A855F7"
                },
                {
                  question: "Чи можна масштабувати результат?",
                  answer: "Так, якщо реклама показує стабільні заявки.",
                  color: "#10B981"
                }
              ]}
            />
          </div>
        </section>

        {/* БЛОК 8. ФІНАЛЬНИЙ ЛІДГЕН */}
        <section id="final-form" className="py-16 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Готові отримувати заявки з Telegram?</h2>
                <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Залиште заявку — ми подивимось ваш бізнес і запропонуємо чіткий план запуску Telegram Ads.
                </p>
              </div>
              <Card className="bg-zinc-800/80 border-[#00F0FF]/50 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={(e) => handleSubmit(e, "plan")} className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Ім'я *</label>
                      <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ваше ім'я" className="bg-zinc-900 border-zinc-700 text-white text-lg p-6" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
                      <Input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="+380..." className="bg-zinc-900 border-zinc-700 text-white text-lg p-6" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Сайт або ніша *</label>
                      <Textarea value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="Розкажіть про ваш бізнес..." className="bg-zinc-900 border-zinc-700 text-white text-lg min-h-[120px]" required />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-xl py-8" disabled={isSubmitting}>
                      {isSubmitting ? "Відправка..." : "🟢 Отримати план запуску"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <LeadCaptureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} source="Telegram Ads - Popup Modal" />
    </>
  );
}
