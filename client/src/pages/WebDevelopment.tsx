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

export default function WebDevelopmentPage() {
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
      source: "Web Development - Прорахунок сайту",
      notes: formData.website ? `Опис: ${formData.website}` : ""
    });
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/web-development" />
      <div className="min-h-screen bg-black text-white">
        {/* БЛОК 1. HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 py-12 sm:py-20">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />
          <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="space-y-6 sm:space-y-8">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight" style={{ fontFamily: "\'Bungee\', \'Eurostile Bold Extended\', sans-serif" }}>
                  <span className="text-white">Створюємо сайти, в яких </span>
                  <span className="text-[#FFD93D]">хочеться залишати заявки</span>
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 leading-relaxed" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>
                  Під ключ
                </p>
                <ul className="space-y-3 text-base sm:text-lg text-zinc-400">
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Від 10 днів — і ваш сайт готовий</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Професійні тексти</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-[#00F0FF] flex-shrink-0" />
                    <span>Дизайн, який допомагає залишити заявку</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4">
                  <Button size="lg" className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => document.getElementById('calc-form')?.scrollIntoView({ behavior: 'smooth' })}>
                    Отримати прорахунок сайту <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                  <Button size="lg" className="bg-[#FFD93D] text-black hover:bg-[#FFD93D]/90 font-bold w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-4" onClick={() => setModalOpen(true)}>
                    Показати приклади робіт
                  </Button>
                </div>
              </div>
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD93D]/20 to-[#00F0FF]/20 blur-3xl" />
                <div className="relative z-10 w-full max-w-2xl mx-auto">
                  <img src="/web-dev-hero.png" alt="Web Development" className="w-full h-auto object-contain drop-shadow-2xl" style={{ maxHeight: "850px", minHeight: "500px" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 2. ВАМ ЦЕ ЗНАЙОМО? */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Вам це знайомо, коли мова заходить про сайт?</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { title: "Сайт є, але з нього майже не пишуть", desc: "Люди заходять, дивляться сторінку і просто йдуть. Немає відчуття, що сайт \"пояснює\" і веде до заявки.", icon: "📉" },
                { title: "Ви не розумієте, що саме в ньому не так", desc: "Дизайн ніби нормальний, тексти є, кнопки є, але результату немає — і ніхто не може пояснити чому.", icon: "❓" },
                { title: "Все виглядає складно і незрозуміло", desc: "ТЗ, структура, тексти, дизайн, правки — здається, що без повного занурення нічого не вийде.", icon: "🤯" },
                { title: "Є страх знову витратити гроші дарма", desc: "Бо сайт уже робили, а заявок так і не з'явилось.", icon: "💸" }
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

        {/* БЛОК 3. ЯК МИ РОБИМО САЙТ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Як ми робимо сайт, в якому хочеться залишити заявку</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Неважливо, є у вас сайт чи його немає взагалі.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { num: "1", title: "Якщо сайту немає", desc: "Ми починаємо з нуля: допомагаємо сформулювати пропозицію, логіку сторінки і структуру.", color: "#FFD93D" },
                { num: "2", title: "Якщо сайт уже є", desc: "Ми дивимось, що заважає людям залишати заявки, і переробляємо подачу без зайвих елементів.", color: "#00F0FF" },
                { num: "3", title: "Робимо зрозумілу сторінку", desc: "З першого екрану людині зрозуміло: що ви пропонуєте і як замовити.", color: "#A855F7" },
                { num: "4", title: "Запускаємо готовий сайт", desc: "Ви отримуєте сайт, який можна одразу використовувати без доробок.", color: "#10B981" }
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
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Отримайте прорахунок сайту під ваш бізнес</h2>
                <p className="text-base sm:text-lg md:text-xl text-zinc-300 mb-4" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Ми скажемо:</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {[
                  { text: "який формат сайту вам потрібен", color: "#FFD93D" },
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

        {/* БЛОК 5. ЩО ВХОДИТЬ У САЙТ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Що ви отримаєте в результаті</h2>
              <p className="text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto" style={{ fontFamily: "\'Eurostile Bold Extended\', sans-serif" }}>Без технічної мови і зайвих слів — тільки те, що реально впливає на заявки.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                { icon: <FileText className="w-8 h-8" />, title: "Логічна структура сторінки", desc: "Сайт побудований так, щоб людині не потрібно було думати, куди дивитись і що робити далі. З першого екрану зрозуміло, що ви пропонуєте і як залишити заявку.", color: "#FFD93D" },
                { icon: <FileText className="w-8 h-8" />, title: "Тексти, які читають", desc: "Тексти написані простою мовою, без \"ми команда професіоналів\". Вони відповідають на питання клієнта і знімають сумніви.", color: "#00F0FF" },
                { icon: <Shield className="w-8 h-8" />, title: "Дизайн, який викликає довіру", desc: "Сайт виглядає охайно і сучасно. Нічого не відволікає від головного — залишити заявку.", color: "#A855F7" },
                { icon: <Zap className="w-8 h-8" />, title: "Адаптація під телефони", desc: "Сайт зручний для перегляду з телефону: все читається, кнопки легко натискаються, форма проста.", color: "#10B981" },
                { icon: <Clock className="w-8 h-8" />, title: "Швидке завантаження", desc: "Сайт відкривається швидко, щоб люди не закривали сторінку через очікування.", color: "#F59E0B" },
                { icon: <CheckCircle2 className="w-8 h-8" />, title: "Форма заявки, яку реально заповнюють", desc: "Мінімум полів, зрозумілий крок, без зайвих дій і плутанини.", color: "#EC4899" }
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
                У підсумку: сайт готовий для реклами або органічного трафіку без доробок \"потім\".
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6. РЕЗУЛЬТАТ */}
        <section className="py-12 sm:py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Що зазвичай змінюється після запуску нового сайту</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                { title: "Люди частіше залишають заявки", desc: "З того ж трафіку приходить більше звернень, бо сайт зрозумілий і не відштовхує." },
                { title: "Сайт виглядає дорожче і зрозуміліше", desc: "Навіть без зміни бізнесу з'являється відчуття нормальної, надійної компанії." },
                { title: "Реклама починає працювати краще", desc: "Трафік не зливається, результат стає стабільнішим." },
                { title: "Зникає відчуття \"з сайтом щось не так\"", desc: "Ви просто користуєтесь сайтом, а не думаєте, що в ньому переробити." }
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
                🟢 Показати приклади сайтів
              </Button>
            </div>
          </div>
        </section>

        {/* БЛОК 6.5. КЕЙСИ - Dynamic from Database */}
        <CaseStudiesSection pageSlug="web-development" limit={4} />

        {/* БЛОК 7. FAQ */}
        <section className="py-12 sm:py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "'Bungee', sans-serif" }}>Питання та відповіді</h2>
            </div>

            <CollapsibleFAQ
              items={[
                {
                  question: "Скільки часу займає розробка?",
                  answer: "Зазвичай від 10 днів, залежно від обсягу.",
                  color: "#FFD93D"
                },
                {
                  question: "Мені потрібні тексти — ви їх робите?",
                  answer: "Так. Тексти входять у розробку.",
                  color: "#00F0FF"
                },
                {
                  question: "У мене взагалі немає сайту — ви працюєте з такими?",
                  answer: "Так. Більшість сайтів ми робимо з нуля.",
                  color: "#A855F7"
                },
                {
                  question: "Чи підійде сайт під рекламу?",
                  answer: "Так. Ми одразу робимо сайт під заявки.",
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
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 sm:mb-6" style={{ fontFamily: "\'Bungee\', sans-serif" }}>Хочете сайт, в якому хочеться залишати заявки?</h2>
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
                      {isSubmitting ? "Відправка..." : "🟢 Отримати прорахунок сайту"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </div>
      <Footer />
      <LeadCaptureModal isOpen={modalOpen} onClose={() => setModalOpen(false)} source="Web Development - Popup Modal" />
    </>
  );
}
