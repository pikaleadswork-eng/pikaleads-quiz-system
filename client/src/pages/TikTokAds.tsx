import { useState } from "react";
import { useTranslation } from "react-i18next";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import Footer from "@/components/Footer";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function TikTokAdsPage() {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);
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
      source: formType === "audit" ? "TikTok Ads - Безкоштовний аудит" : "TikTok Ads - План запуску",
      notes: formData.website ? `Сайт/ніша: ${formData.website}` : ""
    });
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/tiktok-ads" />
      
      <div className="min-h-screen bg-black text-white">
        {/* БЛОК 1. HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
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
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="text-white">Стабільні заявки з TikTok Ads — </span>
                  <span className="text-[#FFD93D]">без хаосу і ручного контролю</span>
                </h1>
                
                <p className="text-xl text-zinc-300 leading-relaxed">
                  Ми беремо на себе всю рекламу в TikTok, щоб ви отримували заявки з нового каналу і могли масштабуватися.
                </p>

                <p className="text-lg text-zinc-400">
                  Запуск, тестування та ведення TikTok Ads — під ключ, без вашого залучення.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    size="lg" 
                    className="bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 font-bold"
                    onClick={() => document.getElementById('audit-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Отримати безкоштовний аудит <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-[#FFD93D] text-[#FFD93D] hover:bg-[#FFD93D]/10"
                    onClick={() => setModalOpen(true)}
                  >
                    Залишити заявку
                  </Button>
                </div>

                <p className="text-sm text-zinc-500">
                  Скажемо прямо, чи підходить TikTok для вашого бізнесу.
                </p>
              </div>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD93D]/20 to-[#00F0FF]/20 blur-3xl" />
                <div className="relative z-10 w-full aspect-square max-w-md mx-auto">
                  <img src="/tiktok-ads-hero.png" alt="TikTok Ads" className="w-full h-full object-contain drop-shadow-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* БЛОК 2. ВАМ ЦЕ ЗНАЙОМО? */}
        <section className="py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Вам це знайомо?</h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                TikTok виглядає перспективно, але результату або немає, або він нестабільний.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-10">
              {[
                "заявки можуть бути, але їх складно повторити",
                "креативи \"вигорають\" за кілька днів",
                "складно зрозуміти, що саме спрацювало",
                "бюджет витрачається швидко, а впевненості немає"
              ].map((problem, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700 hover:border-red-500/50 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center text-red-400">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white">{problem}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center space-y-4">
              <p className="text-xl text-zinc-300">
                У результаті TikTok сприймається як експеримент, а не як повноцінний канал залучення клієнтів.
              </p>
              <p className="text-2xl font-bold text-[#FFD93D]">
                Саме тут потрібна система, а не випадкові тести.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 3. РІШЕННЯ — СИСТЕМА 1–2–3–4 */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Як ми будуємо результат у TikTok Ads
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Ми забираємо всі незрозумілі задачі і перетворюємо TikTok на керований рекламний канал.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { num: "1", title: "Позиціонування і сценарії", desc: "Формуємо правильну подачу продукту під TikTok: хуки, сценарії, формати, які реально дивляться.", color: "#FFD93D" },
                { num: "2", title: "Запуск і тестування", desc: "Запускаємо кілька креативних гіпотез, швидко відсіюємо слабке і залишаємо те, що працює.", color: "#00F0FF" },
                { num: "3", title: "Оптимізація під заявки", desc: "Фокус не на переглядах, а на реальних зверненнях, які можна масштабувати.", color: "#A855F7" },
                { num: "4", title: "Масштабування", desc: "Коли є стабільна логіка, ми збільшуємо бюджети без хаотичних зливів.", color: "#10B981" }
              ].map((step, i) => (
                <Card key={i} className="bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 border-zinc-700 hover:border-[${step.color}] transition-all">
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

            <div className="text-center">
              <p className="text-2xl font-bold text-[#00F0FF]">
                Результат: TikTok Ads перестає бути експериментом і починає приносити заявки.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 4. ЛІДГЕН З ОБМЕЖЕННЯМ */}
        <section id="audit-form" className="py-16 bg-gradient-to-br from-zinc-900 to-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Безкоштовний аудит TikTok Ads
                </h2>
                <p className="text-xl text-zinc-300 mb-4">
                  Ми подивимось ваш бізнес і скажемо:
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-10">
                {[
                  { text: "чи підходить TikTok під вашу нішу", color: "#FFD93D" },
                  { text: "який формат реклами спрацює", color: "#00F0FF" },
                  { text: "на що реально можна розраховувати", color: "#A855F7" }
                ].map((item, i) => (
                  <Card key={i} className="bg-zinc-800/50" style={{ borderColor: `${item.color}30` }}>
                    <CardContent className="p-6 text-center">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-4" style={{ color: item.color }} />
                      <p className="text-white">{item.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="bg-zinc-800/80 border-[#FFD93D]/50">
                <CardContent className="p-8">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8">
                    <p className="text-red-400 font-bold text-center">
                      ❗ Обмеження: Ми беремо обмежену кількість проєктів у роботу, щоб зберігати якість запусків.
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
                      {isSubmitting ? "Відправка..." : "Отримати безкоштовний аудит"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* БЛОК 5. ЯК МИ ПРАЦЮЄМО */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Як виглядає робота з нами
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                Ми ведемо TikTok Ads під ключ і беремо на себе весь процес.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { text: "аналіз продукту і аудиторії", color: "#FFD93D" },
                { text: "формування креативної логіки", color: "#00F0FF" },
                { text: "запуск і щоденне ведення реклами", color: "#A855F7" },
                { text: "оптимізація під заявки, а не перегляди", color: "#10B981" }
              ].map((item, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700 hover:border-[${item.color}]/50 transition-all">
                  <CardContent className="p-6 text-center space-y-4">
                    <CheckCircle2 className="w-12 h-12 mx-auto" style={{ color: item.color }} />
                    <p className="text-white font-semibold">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-[#FFD93D]">
                Ви не знімаєте з себе бізнес — ви просто отримуєте новий потік заявок.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 6. КЕЙСИ / РЕЗУЛЬТАТИ */}
        <section className="py-16 bg-zinc-900/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                До яких результатів ми приходимо в TikTok Ads
              </h2>
              <p className="text-xl text-zinc-400 max-w-3xl mx-auto mb-8">
                TikTok — це швидкий канал, але без системи він нестабільний. Ми будуємо повторюваний результат.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                { emoji: "📈", text: "поява стабільних заявок уже в перші тижні" },
                { emoji: "💡", text: "зрозуміла логіка, які креативи працюють" },
                { emoji: "🚀", text: "можливість масштабуватися без вигорання акаунтів" },
                { emoji: "✅", text: "TikTok стає окремим каналом продажів" }
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
              <p className="text-xl text-zinc-300">
                Кожен проєкт починається з оцінки потенціалу.
              </p>
            </div>
          </div>
        </section>

        {/* БЛОК 7. FAQ */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Питання та відповіді
              </h2>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {[
                { q: "Чи підходить TikTok для мого бізнесу?", a: "Не для всіх. Саме тому ми починаємо з аудиту.", color: "#FFD93D" },
                { q: "Чи потрібно мені знімати відео?", a: "Залежить від формату. Ми підкажемо оптимальний варіант.", color: "#00F0FF" },
                { q: "Коли з'являються перші заявки?", a: "Після запуску і первинної оптимізації.", color: "#A855F7" },
                { q: "Чи можна масштабувати TikTok Ads?", a: "Так, якщо є правильна креативна і рекламна логіка.", color: "#10B981" }
              ].map((faq, i) => (
                <Card key={i} className="bg-zinc-800/50 border-zinc-700">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-4" style={{ color: faq.color }}>
                      {faq.q}
                    </h3>
                    <p className="text-zinc-300 text-lg">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* БЛОК 8. ФІНАЛЬНИЙ ЛІДГЕН */}
        <section id="final-form" className="py-16 bg-gradient-to-br from-zinc-900 via-black to-zinc-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                  Готові запустити TikTok як канал заявок?
                </h2>
                <p className="text-xl text-zinc-300">
                  Залиште заявку — ми подивимось ваш бізнес і запропонуємо чіткий план запуску TikTok Ads.
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
      <LeadCaptureModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        source="TikTok Ads - Popup Modal"
      />
    </>
  );
}
