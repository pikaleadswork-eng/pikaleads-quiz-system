import { useState } from "react";
import { useTranslation } from "react-i18next";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumCard from "@/components/PremiumCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import CollapsibleFAQ from "@/components/CollapsibleFAQ";
import MetaCaseStudiesSection from "@/components/MetaCaseStudiesSection";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function GoogleAdsPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    website: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLeadMutation = trpc.leads.submitLead.useMutation({
    onSuccess: () => {
      toast.success("Заявку відправлено! Ми зв'яжемось з вами найближчим часом.");
      setFormData({ name: "", contact: "", website: "" });
      setIsSubmitting(false);
    },
    onError: (error) => {
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
      source: formType === "audit" ? "Google Ads - Аудит" : "Google Ads - План запуску",
      notes: formData.website ? `Сайт/ніша: ${formData.website}` : ""
    });
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/google-ads" />
      
      <div className="min-h-screen bg-black text-white">
        {/* БЛОК 1. HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 py-12 sm:py-20">
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

          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "\'Bungee\', \'Eurostile Bold Extended\', sans-serif" }}>
                  <span className="text-white">Заявки за зрозумілою ціною — </span>
                  <span className="text-[#FFD93D]">без хаосу і зливу бюджету</span>
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Ми беремо на себе всю рекламу в Google, щоб ви стабільно отримували заявки і могли масштабуватися.
                </p>

                <p className="text-base sm:text-lg text-zinc-400" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Запуск, ведення та оптимізація реклами — під ключ, без вашої участі в процесі.
                </p>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button 
                    size="lg" 
                    className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4"
                    onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    ОТРИМАТИ АУДИТ <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4"
                    onClick={() => document.getElementById('final-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Залишити заявку
                  </Button>
                </div>

                
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD93D]/20 to-[#00F0FF]/20 blur-3xl" />
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  <img src="/google-ads-hero.png" alt="Google Ads" className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxHeight: "850px", minHeight: "500px" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 2. ВАМ ЦЕ ЗНАЙОМО? */}
        <section className="py-20 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Вам це знайомо?</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                Реклама в Google ніби працює, але не як стабільний бізнес-інструмент.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              {[
                { title: "Нерівномірні заявки", desc: "Заявки з'являються нерівномірно. Сьогодні є, завтра немає. Важко планувати роботу відділу продажів.", icon: "📉" },
                { title: "Незрозумілі витрати", desc: "Бюджет витрачається, але складно зрозуміти, що саме дає результат. Немає чіткої аналітики.", icon: "💸" },
                { title: "Постійні експерименти", desc: "Кожна зміна в рекламі виглядає як новий експеримент. Немає системного підходу до оптимізації.", icon: "🔄" },
                { title: "Неможливо планувати зростання", desc: "Важко планувати зростання, бо немає передбачуваності. Реклама забирає увагу замість того, щоб приносити спокій.", icon: "⏸️" }
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

            <div className="text-center space-y-4">
              <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                У результаті реклама починає забирати увагу, замість того щоб приносити заявки і спокій.
              </p>
              <p className="text-xl sm:text-2xl font-bold text-[#FFD93D]">
                Це не проблема реклами. Це відсутність системи.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 3. РІШЕННЯ — СИСТЕМА 1–2–3–4 */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>
                Як ми будуємо систему, яка приносить заявки
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                Ми забираємо всі незрозумілі рекламні задачі на себе і вибудовуємо послідовний процес, який працює в довгу.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              {[
                { title: "Аналіз і основа", desc: "Починаємо з розуміння бізнесу: що продаємо, кому і за якою логікою люди залишають заявки. Проводимо глибокий аналіз аудиторії та конкурентів для побудови ефективної стратегії.", icon: "🔍", color: "#FFD93D" },
                { title: "Структура реклами", desc: "Будуємо логічну структуру кампаній, де кожен елемент виконує конкретну задачу. Впроваджуємо чітку сегментацію та таргетинг для максимальної ефективності.", icon: "🏭️", color: "#00F0FF" },
                { title: "Оптимізація під результат", desc: "Регулярно працюємо з витратами і якістю заявок, прибираючи все зайве і підсилюючи те, що працює. Забезпечуємо постійний моніторинг KPI та швидке реагування на зміни.", icon: "⚙️", color: "#A855F7" },
                { title: "Масштабування", desc: "Коли система стабільна — бюджет можна збільшувати без різких просідань. Забезпечуємо прогнозований ріст та контрольоване масштабування вашого бізнесу.", icon: "📈", color: "#10B981" }
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
                Результат: стабільні заявки, зрозумілий процес і мінімальна участь з вашого боку.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 4. ЛІДГЕН З ОБМЕЖЕННЯМ */}
        <section id="audit-form" className="py-20 bg-gradient-to-br from-zinc-900 to-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>
                  Аудит реклами в Google
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-4" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Ми подивимось вашу ситуацію і дамо чітке розуміння:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <Card className="bg-zinc-800/50 border-[#FFD93D]/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-[#FFD93D] mx-auto mb-4" />
                    <p className="text-white">Чи можна зробити заявки стабільними</p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-[#00F0FF]/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-[#00F0FF] mx-auto mb-4" />
                    <p className="text-white">Де саме втрачається ефективність</p>
                  </CardContent>
                </Card>

                <Card className="bg-zinc-800/50 border-purple-500/30">
                  <CardContent className="p-6 text-center">
                    <CheckCircle2 className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                    <p className="text-white">Який формат роботи підійде саме вам</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-zinc-800/80 border-[#FFD93D]/50">
                <CardContent className="p-8">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8">
                    <p className="text-red-400 font-bold text-center">
                      ❗ Обмеження: Ми беремо обмежену кількість аудитів на тиждень, щоб опрацьовувати кожен проєкт якісно.
                    </p>
                  </div>

                  <form onSubmit={(e) => handleSubmit(e, "audit")} className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Ім'я *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ваше ім'я"
                        className="bg-zinc-900 border-zinc-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
                      <Input
                        type="text"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="+380..."
                        className="bg-zinc-900 border-zinc-700 text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Сайт або ніша</label>
                      <Input
                        type="text"
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="example.com або опишіть вашу нішу"
                        className="bg-zinc-900 border-zinc-700 text-white"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Відправка..." : "ОТРИМАТИ АУДИТ"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* БЛОК 5. ЯК МИ ПРАЦЮЄМО */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>
                Як виглядає робота з нами
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                Ми беремо рекламу в Google під ключ і відповідаємо за результат у своїй зоні відповідальності.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <PremiumCard
                icon={<CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />}
                title="Усі налаштування і ведення — на нашій стороні"
                description="Ми беремо на себе всю технічну роботу: від створення кампаній до щоденної оптимізації."
                borderColor="#FFD93D"
                iconBgColor="#FFD93D"
              />
              <PremiumCard
                icon={<CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />}
                title="Регулярна робота з ефективністю витрат"
                description="Постійний моніторинг та оптимізація для досягнення найкращого співвідношення ціни та результату."
                borderColor="#00F0FF"
                iconBgColor="#00F0FF"
              />
              <PremiumCard
                icon={<CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />}
                title="Фокус на заявках, а не процесі"
                description="Ви отримуєте готові заявки, а не звіти про кліки та покази. Результат, а не процес."
                borderColor="#A855F7"
                iconBgColor="#A855F7"
              />
              <PremiumCard
                icon={<CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-black" />}
                title="Зрозумілий результат у цифрах"
                description="Прозора аналітика: скільки витрачено, скільки заявок отримано, який CPL та ROAS."
                borderColor="#10B981"
                iconBgColor="#10B981"
              />
            </div>

            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#FFD93D]">
                Ви не занурюєтесь у деталі — ви просто бачите, як реклама працює для бізнесу.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6. КЕЙСИ / РЕЗУЛЬТАТИ */}
        <section className="py-20 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>
                До яких результатів ми приходимо з клієнтами
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto mb-8" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                Ми не обіцяємо однакові цифри для всіх. Ми будуємо систему, яка дає стабільність і можливість росту.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <PremiumCard
                icon={<span className="text-4xl sm:text-5xl">📈</span>}
                title="Вирівнювання потоку заявок"
                description="Стабільний потік лідів замість хаотичних спалахів і провалів."
                borderColor="#FFD93D"
                iconBgColor="#FFD93D"
              />
              <PremiumCard
                icon={<span className="text-4xl sm:text-5xl">💰</span>}
                title="Зменшення хаотичних витрат"
                description="Кожна гривня працює на результат, а не на експерименти."
                borderColor="#00F0FF"
                iconBgColor="#00F0FF"
              />
              <PremiumCard
                icon={<span className="text-4xl sm:text-5xl">🎯</span>}
                title="Розуміння, що саме масштабувати"
                description="Чітке розуміння, які канали та кампанії приносять найбільше заявок."
                borderColor="#A855F7"
                iconBgColor="#A855F7"
              />
              <PremiumCard
                icon={<span className="text-4xl sm:text-5xl">✅</span>}
                title="Передбачуваність у рекламі"
                description="Ви знаєте, скільки заявок отримаєте за конкретний бюджет."
                borderColor="#10B981"
                iconBgColor="#10B981"
              />
            </div>

            <div className="text-center">
              <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                Кожен проєкт починається з оцінки потенціалу і чесного розуміння можливого результату.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6.5. КЕЙСИ - Dynamic from Database */}
        <MetaCaseStudiesSection pageSlug="google-ads" />

        {/* БЛОК 7. FAQ */}
        <section className="py-20 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "'Bungee', sans-serif" }}>
                Питання та відповіді
              </h2>
            </div>

            <CollapsibleFAQ
              items={[
                {
                  question: "Коли з'являються перші заявки?",
                  answer: "Після запуску реклама починає працювати одразу. Далі ми доводимо її до стабільності.",
                  color: "#FFD93D"
                },
                {
                  question: "Чи потрібно мені бути залученим у процес?",
                  answer: "Ні. Ми беремо рекламні задачі на себе, вам достатньо обробляти заявки.",
                  color: "#00F0FF"
                },
                {
                  question: "Чи працюєте ви з будь-якою нішею?",
                  answer: "Перед стартом ми оцінюємо нішу і чесно кажемо, чи є сенс запуску.",
                  color: "#a855f7"
                },
                {
                  question: "Чи можна масштабувати рекламу?",
                  answer: "Так. Саме для цього ми і будуємо систему, а не разові кампанії.",
                  color: "#4ade80"
                }
              ]}
            />
          </div>
        </section>

        {/* БЛОК 8. ФІНАЛЬНИЙ ЛІДГЕН */}
        <section id="final-form" className="py-20 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>
                  Готові отримувати заявки без хаосу в рекламі?
                </h2>
                <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Залиште заявку — ми подивимось ваш бізнес і запропонуємо зрозумілий план дій.
                </p>
              </div>

              <Card className="bg-zinc-800/80 border-[#00F0FF]/50 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={(e) => handleSubmit(e, "plan")} className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Ім'я *</label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ваше ім'я"
                        className="bg-zinc-900 border-zinc-700 text-white text-lg p-6"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
                      <Input
                        type="text"
                        value={formData.contact}
                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        placeholder="+380..."
                        className="bg-zinc-900 border-zinc-700 text-white text-lg p-6"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-white font-semibold mb-2">Сайт або ніша *</label>
                      <Textarea
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        placeholder="Розкажіть про ваш бізнес..."
                        className="bg-zinc-900 border-zinc-700 text-white text-lg min-h-[120px]"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-xl py-8"
                      disabled={isSubmitting}
                    >
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
    </>
  );
}
