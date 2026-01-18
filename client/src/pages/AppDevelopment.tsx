import { useState, useEffect } from "react";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import Footer from "@/components/Footer";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PremiumCard from "@/components/PremiumCard";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, AlertCircle, Zap, Clock, FileText, Shield } from "lucide-react";
import CollapsibleFAQ from "@/components/CollapsibleFAQ";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function AppDevelopmentPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", contact: "", website: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitLeadMutation = trpc.leads.submit.useMutation({
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      source: "App Development - Прорахунок додатку",
      notes: formData.website ? `Опис: ${formData.website}` : ""
    });
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/app-development" />
      <div className="min-h-screen bg-black text-white">
        {/* БЛОК 1. HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 py-12 sm:py-20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "\'Bungee\', \'Eurostile Bold Extended\', sans-serif" }}>
                  <span className="text-white">Створюємо мобільні додатки, якими </span>
                  <span className="text-[#FFD93D]">користуються</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Під ключ: від ідеї до запуску в App Store і Google Play
                </p>
                <ul className="space-y-3 text-base sm:text-lg text-zinc-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Від 3 тижнів — і ваш додаток готовий</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Зрозумілий інтерфейс</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Публікація в сторах</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button size="lg" className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => document.getElementById('calc-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    Отримати прорахунок додатку <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button size="lg" className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => setModalOpen(true)}>
                    Показати приклади
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD93D]/20 to-[#00F0FF]/20 blur-3xl" />
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  <img src="/app-dev-hero.png" alt="App Development" className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxHeight: "850px", minHeight: "500px" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 2. ВАМ ЦЕ ЗНАЙОМО? */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12 max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Вам це знайомо, коли мова заходить про додаток?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { title: "Незрозуміло, з чого почати", desc: "Ідея є, але немає розуміння, як це перетворити на робочий додаток.", icon: "❓" },
                { title: "Страх витратити гроші дарма", desc: "Розробка здається дорогою і складною, а результат — непередбачуваним.", icon: "💸" },
                { title: "Складно знайти нормальних розробників", desc: "Хтось робить довго, хтось дорого, хтось взагалі зникає.", icon: "🔍" },
                { title: "Немає розуміння, що саме потрібно", desc: "ТЗ, дизайн, розробка, тестування, публікація — все виглядає складно.", icon: "🤯" }
              ].map((problem, i) => (
                <PremiumCard
                  key={i}
                  icon={<span className="text-4xl">{problem.icon}</span>}
                  title={problem.title}
                  description={problem.desc}
                  color="#EF4444"
                />
              ))}
            </div>
          </div>
        </section>

        {/* БЛОК 3. ЯК МИ РОБИМО ДОДАТКИ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12 max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Як ми робимо додатки, якими користуються</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Від ідеї до запуску в сторах.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { num: "1", title: "Розбираємо вашу ідею", desc: "Ми допомагаємо сформулювати, що саме має робити додаток і як це має виглядати.", color: "#FFD93D" },
                { num: "2", title: "Робимо дизайн і логіку", desc: "Створюємо зрозумілий інтерфейс, яким зручно користуватись.", color: "#00F0FF" },
                { num: "3", title: "Розробляємо додаток", desc: "Пишемо код, тестуємо, виправляємо помилки.", color: "#A855F7" },
                { num: "4", title: "Публікуємо в сторах", desc: "Ви отримуєте готовий додаток в App Store і Google Play.", color: "#10B981" }
              ].map((step, i) => (
                <Card key={i} className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-zinc-700 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${step.color}20` }}>
                      <span className="text-3xl font-black" style={{ color: step.color }}>{step.num}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    <p className="text-zinc-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* БЛОК 4. ЛІДГЕН — ПРОРАХУНОК */}
        <section id="calc-form" className="py-16 bg-gradient-to-br from-zinc-900 to-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Отримайте прорахунок додатку під ваш бізнес</h2>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-4" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Ми скажемо:</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { text: "що саме потрібно зробити", color: "#FFD93D" },
                  { text: "який функціонал буде в додатку", color: "#00F0FF" },
                  { text: "скільки це займе часу", color: "#A855F7" },
                  { text: "повну вартість без \"потім ще\"", color: "#10B981" }
                ].map((item, i) => (
                  <Card key={i} className="bg-zinc-800/50" style={{ borderColor: `${item.color}30` }}>
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-3 sm:mb-4" style={{ color: item.color }} />
                      <p className="text-white" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="bg-zinc-800/80 border-[#FFD93D]/50">
                <CardContent className="p-8">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8">
                    <p className="text-red-400 font-bold text-center" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                      ❗ Беремо обмежену кількість проєктів, щоб не розтягувати терміни.
                    </p>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Ім'я *</label>
                      <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ваше ім'я" className="bg-zinc-900 border-zinc-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
                      <Input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="+380..." className="bg-zinc-900 border-zinc-700 text-white" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Опишіть вашу ідею</label>
                      <Textarea value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="Розкажіть про ваш додаток..." className="bg-zinc-900 border-zinc-700 text-white min-h-[120px]" />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-lg" disabled={isSubmitting}>
                      {isSubmitting ? "Відправка..." : "🟢 Отримати прорахунок"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* БЛОК 5. ЩО ВХОДИТЬ У ДОДАТОК */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12 max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Що ви отримаєте в результаті</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Без технічної мови — тільки те, що реально важливо.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { icon: <Smartphone className="w-8 h-8" />, title: "Зрозумілий інтерфейс", desc: "Додаток зручний для користування — людина одразу розуміє, що робити.", color: "#FFD93D" },
                { icon: <Zap className="w-8 h-8" />, title: "Швидка робота", desc: "Додаток відкривається швидко і працює без зависань.", color: "#00F0FF" },
                { icon: <Shield className="w-8 h-8" />, title: "Безпека даних", desc: "Всі дані користувачів захищені.", color: "#A855F7" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Публікація в сторах", desc: "Додаток опублікований в App Store і Google Play.", color: "#10B981" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Адаптація під всі екрани", desc: "Додаток виглядає добре на всіх телефонах і планшетах.", color: "#F59E0B" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Технічна підтримка", desc: "Ми допомагаємо з питаннями після запуску.", color: "#EC4899" }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-zinc-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#00F0FF]" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                У підсумку: готовий додаток в сторах без доробок \"потім\".
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6. РЕЗУЛЬТАТ */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12 max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Що зазвичай змінюється після запуску додатку</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { title: "Люди користуються додатком", desc: "Він зручний і зрозумілий — не потрібно пояснювати, як ним користуватись." },
                { title: "Бізнес виглядає серйозніше", desc: "Наявність додатку додає статусу і довіри." },
                { title: "З'являється новий канал взаємодії", desc: "Клієнти можуть замовляти через додаток, а не тільки через сайт." },
                { title: "Зникає відчуття \"це складно\"", desc: "Ви просто користуєтесь додатком для свого бізнесу." }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-[#00F0FF]" />
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-zinc-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => setModalOpen(true)}>
                🟢 Показати приклади додатків
              </Button>
            </div>
          </div>
        </section>

        {/* БЛОК 6.5. КЕЙСИ - Dynamic from Database */}
        <CaseStudiesSection pageSlug="app-development" limit={4} />

        {/* БЛОК 7. FAQ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12 max-w-5xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', \'Eurostile Bold Extended\', sans-serif" }}>Питання та відповіді</h2>
            </div>

            <CollapsibleFAQ
              items={[
                {
                  question: "Скільки часу займає розробка?",
                  answer: "Зазвичай від 3 тижнів, залежно від функціоналу.",
                  color: "#FFD93D"
                },
                {
                  question: "Чи потрібно мені розбиратись у технічних деталях?",
                  answer: "Ні. Ми беремо всю технічну частину на себе.",
                  color: "#00F0FF"
                },
                {
                  question: "У мене тільки ідея — ви можете допомогти?",
                  answer: "Так. Ми допомагаємо сформулювати ідею і перетворити її на додаток.",
                  color: "#A855F7"
                },
                {
                  question: "Чи буде додаток в App Store і Google Play?",
                  answer: "Так. Ми публікуємо додаток в обох сторах.",
                  color: "#10B981"
                }
              ]}
            />
          </div>
        </section>

        {/* БЛОК 8. ФІНАЛЬНИЙ ЛІДГЕН */}
        <section className="py-16 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-10 max-w-5xl mx-auto">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Хочете створити мобільний додаток?</h2>
                <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Залиште заявку — ми подивимось вашу ідею і скажемо, що саме потрібно зробити і скільки це коштує.
                </p>
              </div>
              <Card className="bg-zinc-800/80 border-[#00F0FF]/50 shadow-2xl">
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-white font-semibold mb-2">Ім'я *</label>
                      <Input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ваше ім'я" className="bg-zinc-900 border-zinc-700 text-white text-lg p-6" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Телефон / месенджер *</label>
                      <Input type="text" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="+380..." className="bg-zinc-900 border-zinc-700 text-white text-lg p-6" required />
                    </div>
                    <div>
                      <label className="block text-white font-semibold mb-2">Опишіть вашу ідею *</label>
                      <Textarea value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="Розкажіть про ваш додаток..." className="bg-zinc-900 border-zinc-700 text-white text-lg min-h-[120px]" required />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-xl py-8" disabled={isSubmitting}>
                      {isSubmitting ? "Відправка..." : "🟢 Отримати прорахунок додатку"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <LeadCaptureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} source="App Development - Popup Modal" />
    </>
  );
}
