import { useState } from "react";
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

export default function WebDesignPage() {
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
      source: "Web Design - Прорахунок дизайну",
      notes: formData.website ? `Опис: ${formData.website}` : ""
    });
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/web-design" />
      <div className="min-h-screen bg-black text-white">
        {/* БЛОК 1. HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 py-12 sm:py-20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "\'Bungee\', \'Eurostile Bold Extended\', sans-serif" }}>
                  <span className="text-white">Дизайн сайту, який </span>
                  <span className="text-[#FFD93D]">допомагає продавати</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Без зайвих елементів і складних рішень
                </p>
                <ul className="space-y-3 text-base sm:text-lg text-zinc-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Дизайн, який веде до заявки</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Зрозуміла структура сторінки</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Адаптація під телефони</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button size="lg" className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => document.getElementById('calc-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    Отримати прорахунок дизайну <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button size="lg" className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => setModalOpen(true)}>
                    Показати приклади
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD93D]/20 to-[#00F0FF]/20 blur-3xl" />
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  <img src="/web-design-hero.png" alt="Web Design" className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxHeight: "850px", minHeight: "500px" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 2. ВАМ ЦЕ ЗНАЙОМО? */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Вам це знайомо, коли мова заходить про дизайн?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { title: "Дизайн є, але він не допомагає", desc: "Сайт виглядає ніби нормально, але люди не залишають заявки — і незрозуміло чому.", icon: "🚫" },
                { title: "Все виглядає складно і перевантажено", desc: "Багато елементів, кольорів, блоків — але немає відчуття, що це працює на результат.", icon: "🤯" },
                { title: "Дизайн не відповідає продукту", desc: "Він або занадто простий, або занадто \"креативний\", але не відображає суть бізнесу.", icon: "🎨" },
                { title: "Страх витратити гроші дарма", desc: "Бо дизайн уже робили, а заявок так і не з'явилось.", icon: "💸" }
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

        {/* БЛОК 3. ЯК МИ РОБИМО ДИЗАЙН */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Як ми робимо дизайн, який допомагає продавати</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Без зайвих елементів і складних рішень.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { num: "1", title: "Розуміємо логіку сторінки", desc: "Перш ніж малювати, ми дивимось, як має бути побудована сторінка, щоб людина залишила заявку.", color: "#FFD93D" },
                { num: "2", title: "Робимо дизайн під цю логіку", desc: "Дизайн не заради краси, а щоб підкреслити важливі блоки і привести до форми.", color: "#00F0FF" },
                { num: "3", title: "Прибираємо все зайве", desc: "Залишаємо тільки те, що реально впливає на рішення клієнта.", color: "#A855F7" },
                { num: "4", title: "Адаптуємо під телефони", desc: "Дизайн виглядає добре і працює на всіх пристроях.", color: "#10B981" }
              ].map((step, i) => (
                <Card key={i} className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-zinc-700 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `${step.color}20` }}>
                      <span className="text-3xl font-black" style={{ color: step.color }}>{step.num}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                    <p className="text-zinc-400">{step.desc}</p>
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
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Отримайте прорахунок дизайну під ваш бізнес</h2>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-4" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Ми скажемо:</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { text: "який стиль дизайну підійде", color: "#FFD93D" },
                  { text: "що саме ми зробимо", color: "#00F0FF" },
                  { text: "скільки це займе часу", color: "#A855F7" },
                  { text: "повну вартість без \"потім ще\"", color: "#10B981" }
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
                      <label className="block text-white font-semibold mb-2">Опишіть вашу задачу</label>
                      <Textarea value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="Розкажіть про ваш бізнес та що потрібно..." className="bg-zinc-900 border-zinc-700 text-white min-h-[120px]" />
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

        {/* БЛОК 5. ЩО ВХОДИТЬ У ДИЗАЙН */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Що ви отримаєте в результаті</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Без зайвих елементів — тільки те, що реально впливає на заявки.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { icon: <Palette className="w-8 h-8" />, title: "Чітка візуальна ієрархія", desc: "Людина одразу бачить, що важливо: заголовок, пропозиція, кнопка заявки.", color: "#FFD93D" },
                { icon: <Eye className="w-8 h-8" />, title: "Дизайн, який викликає довіру", desc: "Сайт виглядає охайно, сучасно і професійно — без перевантаження.", color: "#00F0FF" },
                { icon: <Smartphone className="w-8 h-8" />, title: "Адаптація під телефони", desc: "Дизайн зручний для перегляду з будь-якого пристрою.", color: "#A855F7" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Зрозумілі кнопки і форми", desc: "Людина одразу розуміє, куди натискати і що робити далі.", color: "#10B981" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Логічна структура блоків", desc: "Сторінка побудована так, щоб вести до заявки, а не відволікати.", color: "#F59E0B" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Готові макети під розробку", desc: "Дизайн готовий до передачі розробнику без доробок.", color: "#EC4899" }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-zinc-400">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-[#00F0FF]">
                У підсумку: дизайн готовий для розробки і реклами без доробок \"потім\".
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6. РЕЗУЛЬТАТ */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Що зазвичай змінюється після нового дизайну</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { title: "Люди частіше залишають заявки", desc: "Дизайн не відштовхує, а веде до форми." },
                { title: "Сайт виглядає дорожче", desc: "Навіть без зміни бізнесу з'являється відчуття надійної компанії." },
                { title: "Реклама працює краще", desc: "Трафік не зливається, результат стає стабільнішим." },
                { title: "Зникає відчуття \"щось не так\"", desc: "Ви просто користуєтесь сайтом, а не думаєте, що в ньому переробити." }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-6 space-y-4">
                    <CheckCircle2 className="w-12 h-12 text-[#00F0FF]" />
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <p className="text-zinc-400">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button size="lg" className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => setModalOpen(true)}>
                🟢 Показати приклади дизайнів
              </Button>
            </div>
          </div>
        </section>

        {/* БЛОК 6.5. КЕЙСИ - Dynamic from Database */}
        <CaseStudiesSection pageSlug="web-design" limit={4} />

        {/* БЛОК 7. FAQ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "'Bungee', sans-serif" }}>Питання та відповіді</h2>
            </div>

            <CollapsibleFAQ
              items={[
                {
                  question: "Скільки часу займає дизайн?",
                  answer: "Зазвичай від 7 днів, залежно від обсягу.",
                  color: "#FFD93D"
                },
                {
                  question: "Чи підійде дизайн під розробку?",
                  answer: "Так. Ми робимо макети готові до передачі розробнику.",
                  color: "#00F0FF"
                },
                {
                  question: "У мене вже є сайт — ви можете переробити дизайн?",
                  answer: "Так. Ми дивимось, що заважає заявкам, і переробляємо.",
                  color: "#A855F7"
                },
                {
                  question: "Чи підійде дизайн під рекламу?",
                  answer: "Так. Ми одразу робимо дизайн під заявки.",
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
              <div className="text-center mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Хочете дизайн, який допомагає продавати?</h2>
                <p className="text-xl text-zinc-300" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Залиште заявку — ми подивимось вашу задачу і скажемо, що саме потрібно зробити і скільки це коштує.
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
                      <label className="block text-white font-semibold mb-2">Опишіть вашу задачу *</label>
                      <Textarea value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="Розкажіть про ваш бізнес..." className="bg-zinc-900 border-zinc-700 text-white text-lg min-h-[120px]" required />
                    </div>
                    <Button type="submit" size="lg" className="w-full bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold text-xl py-8" disabled={isSubmitting}>
                      {isSubmitting ? "Відправка..." : "🟢 Отримати прорахунок дизайну"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <LeadCaptureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} source="Web Design - Popup Modal" />
    </>
  );
}
