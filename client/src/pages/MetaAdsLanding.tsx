import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Zap, Target, TrendingUp, Users, Shield, Clock, BarChart3, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import Footer from "@/components/Footer";
import LeadFormModal from "@/components/LeadFormModal";

export default function MetaAdsLanding() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });

  const createLeadMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      toast.success("Дякуємо! Ми зв'яжемося з вами найближчим часом");
      setFormData({ name: "", phone: "", email: "", message: "" });
    },
    onError: () => {
      toast.error("Помилка відправки. Спробуйте ще раз");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLeadMutation.mutate({
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      source: "META_ADS_LANDING",
      status: "new",
      comment: formData.message
    });
  };

  const handleCTAClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <CyberpunkNavigation currentPath="/services/meta-ads" />
      
      <div className="min-h-screen bg-black text-white">
        {/* Hero Section - 50/50 Split */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-20 lg:pt-0">
          {/* Background */}
          <div className="absolute inset-0 bg-black" />
          
          <div className="container relative z-10 px-4 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
              {/* LEFT SIDE - Text Content */}
              <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 backdrop-blur-sm">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-cyan-400 font-medium uppercase tracking-wider">META ADS ЕКСПЕРТИ</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  ТРАФІК З META ADS
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-red-500 to-orange-500">
                    З ГАРАНТІЄЮ
                    <br />
                    РЕЗУЛЬТАТУ
                  </span>
                </h1>

                {/* Subheadlines */}
                <div className="space-y-3 lg:space-y-4 text-base lg:text-lg text-gray-300">
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <span>Створимо ефективну стратегію під Ваш бізнес</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <span>Працюємо по договору, де прописані показники</span>
                  </p>
                  <p className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" />
                    <span>Несемо відповідальність за результат</span>
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 pt-4">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white px-8 py-6 text-lg font-bold"
                    onClick={handleCTAClick}
                  >
                    Отримати консультацію
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 px-8 py-6 text-lg font-bold"
                    onClick={() => document.getElementById('cases')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Переглянути кейси
                  </Button>
                </div>
              </div>

              {/* RIGHT SIDE - Pikachu Image */}
              <div className="relative h-[500px] sm:h-[600px] lg:h-[800px] order-1 lg:order-2">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-l from-pink-500/20 via-purple-500/20 to-transparent blur-3xl" />
                
                {/* Pikachu Character */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src="/pikachu-yellow-final.png"
                    alt="Pikachu Cyberpunk"
                    className="w-[120%] sm:w-[130%] lg:w-[140%] h-full object-contain drop-shadow-2xl scale-110 lg:scale-125"
                    style={{
                      filter: "drop-shadow(0 0 40px rgba(236, 72, 153, 0.5))"
                    }}
                  />
                </div>

                {/* Floating Stats Cards */}
                <div className="hidden lg:block absolute top-10 right-10 bg-gradient-to-br from-pink-900/80 to-red-900/80 backdrop-blur-md border border-pink-500/30 rounded-2xl p-6 shadow-2xl">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                    300%
                  </div>
                  <div className="text-sm text-gray-300 mt-1">Зростання продажів</div>
                </div>

                <div className="hidden lg:block absolute bottom-20 right-20 bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-md border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    97%
                  </div>
                  <div className="text-sm text-gray-300 mt-1">ROI</div>
                </div>

                <div className="hidden lg:block absolute bottom-32 left-10 bg-gradient-to-br from-orange-900/80 to-red-900/80 backdrop-blur-md border border-orange-500/30 rounded-2xl p-6 shadow-2xl">
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                    500+
                  </div>
                  <div className="text-sm text-gray-300 mt-1">Успішних кампаній</div>
                </div>
              </div>
            </div>

            {/* Stats Bar Below Hero */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6 mt-8 lg:mt-16">
              <Card className="bg-gradient-to-br from-pink-900/40 to-red-900/20 border-pink-500/30 backdrop-blur-sm p-6 text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-red-400">
                  8.45M$
                </div>
                <div className="text-gray-300 mt-2">Відкрученого бюджету</div>
              </Card>
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-purple-500/30 backdrop-blur-sm p-6 text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  4.69
                </div>
                <div className="text-gray-300 mt-2">Середній ROAS клієнтів</div>
              </Card>
              <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/20 border-orange-500/30 backdrop-blur-sm p-6 text-center">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                  8 років
                </div>
                <div className="text-gray-300 mt-2">Досвіду в трафіку</div>
              </Card>
            </div>
          </div>
        </section>

        {/* Client Pain Points Section */}
        <section className="py-20 relative">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Вирішуємо відразу <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">декілька проблем</span>
              </h2>
              <p className="text-xl text-gray-400">Типові болі клієнтів, які ми усуваємо</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Target,
                  title: "Трата бюджету",
                  description: "Таргет дозволяє відсіяти непідходящу аудиторію, а залишити лише цільову, з якою можна швидко здійснити продаж"
                },
                {
                  icon: Users,
                  title: "Низька якість лідів",
                  description: "Отримували багато заявок, які не купували? Завдяки стратегії та правильній комунікації, ми вирішуємо цю проблему на 90%"
                },
                {
                  icon: Shield,
                  title: "Хибні очікування",
                  description: "Не розповідаємо, як все буде класно. Наша робота полягає в тому, щоб дати результат на діях, не вводячи вас в оману"
                },
                {
                  icon: Clock,
                  title: "Затягнутий результат",
                  description: "Перші результати з реклами ви отримуєте через 24 години та ще протягом 72 годин покращення за рахунок швидких дій"
                }
              ].map((pain, index) => (
                <Card key={index} className="bg-gradient-to-br from-gray-900/80 to-black border-gray-800 p-6 hover:border-pink-500/50 transition-all">
                  <pain.icon className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="text-xl font-bold mb-3">{pain.title}</h3>
                  <p className="text-gray-400">{pain.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Our Solutions Section */}
        <section className="py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Наші <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">рішення</span>
              </h2>
              <p className="text-xl text-gray-400">Як ми досягаємо результатів</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  number: "01",
                  title: "Стратегія, яка працює",
                  description: "Протягом 7-ми днів наша команда вивчає аспекти вашого бізнесу, проводить SWOT-аналіз та складає стратегію трафіку"
                },
                {
                  number: "02",
                  title: "Окремі комунікації",
                  description: "Ми створюємо різні звернення до потенційних клієнтів, щоб зайти з різних сторін та досягти максимальної ефективності"
                },
                {
                  number: "03",
                  title: "Повний контроль",
                  description: "Наша команда чудово знає, як потрібно тримати руку на пульсі, щоб вчасно вносити зміни в рекламу для стабільної роботи"
                },
                {
                  number: "04",
                  title: "Прозорість роботи",
                  description: "Отримуйте зрозумілі звіти, які будуть не тільки показувати цифри, але й пояснювати, що саме було зроблено"
                }
              ].map((solution, index) => (
                <Card key={index} className="bg-gradient-to-br from-cyan-900/20 to-blue-900/10 border-cyan-500/30 p-8 relative overflow-hidden group hover:border-cyan-400 transition-all">
                  <div className="absolute top-4 right-4 text-7xl font-bold text-cyan-500/10 group-hover:text-cyan-500/20 transition-all">
                    {solution.number}
                  </div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold text-cyan-400 mb-2">{solution.number}</div>
                    <h3 className="text-2xl font-bold mb-4">{solution.title}</h3>
                    <p className="text-gray-400">{solution.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Target Audiences Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Для кого <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">підходить</span>
              </h2>
              <p className="text-xl text-gray-400">META ADS ефективні для різних бізнесів</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "E-commerce та Роздріб",
                  age: "25-40 років",
                  description: "Активні молоді сім'ї, які шукають якісні товари онлайн. Цінують зручність, швидку доставку та натуральність продуктів.",
                  interests: ["Здоровий спосіб життя", "Онлайн-шопінг", "Екологічність"]
                },
                {
                  title: "Послуги та B2B",
                  age: "25-40 років",
                  description: "Професіонали, які шукають спеціалізовані рішення для бізнесу або особистих потреб. Орієнтовані на якість та експертність.",
                  interests: ["Професійний розвиток", "Ефективність", "Якісний сервіс"]
                },
                {
                  title: "Преміум сегмент",
                  age: "30-50 років",
                  description: "Заможна аудиторія з високими вимогами. Готові платити за ексклюзивність, статус та найвищу якість продуктів чи послуг.",
                  interests: ["Преміум якість", "Статус", "Ексклюзивність"]
                }
              ].map((audience, index) => (
                <Card key={index} className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border-purple-500/30 p-8 hover:border-purple-400 transition-all">
                  <h3 className="text-2xl font-bold mb-3">{audience.title}</h3>
                  <div className="text-pink-400 font-semibold mb-4">{audience.age}</div>
                  <p className="text-gray-400 mb-6">{audience.description}</p>
                  <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-300 mb-2">Інтереси:</div>
                    {audience.interests.map((interest, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full" />
                        <span className="text-gray-400 text-sm">{interest}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Case Studies Preview Section */}
        <section id="cases" className="py-20 bg-gradient-to-b from-gray-900 to-black">
          <div className="container px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Наші <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">кейси</span>
              </h2>
              <p className="text-xl text-gray-400">Реальні результати наших клієнтів</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                {
                  title: "E-commerce: Світильники",
                  result: "4.8 ROAS",
                  budget: "250,000 грн",
                  description: "Збільшення продажів люстр та світильників через META ADS"
                },
                {
                  title: "Інфобізнес: Марафон",
                  result: "1500 лідів/день",
                  budget: "від 100 до 1500",
                  description: "Масштабування з 100 до 1500 заявок на день"
                },
                {
                  title: "B2B: Запчастини",
                  result: "1.8M$ бюджет",
                  budget: "Американський ринок",
                  description: "Carbon запчастини для суперкарів та гіперкарів"
                }
              ].map((caseStudy, index) => (
                <Card key={index} className="bg-gradient-to-br from-orange-900/20 to-red-900/10 border-orange-500/30 p-6 hover:border-orange-400 transition-all">
                  <h3 className="text-xl font-bold mb-3">{caseStudy.title}</h3>
                  <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400 mb-2">
                    {caseStudy.result}
                  </div>
                  <div className="text-sm text-gray-400 mb-4">{caseStudy.budget}</div>
                  <p className="text-gray-400 text-sm">{caseStudy.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-20">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Отримайте <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">безкоштовний аудит</span>
                </h2>
                <p className="text-xl text-gray-400">Залишайте заявку та отримуйте повний список необхідних змін для покращення результату</p>
              </div>

              <Card className="bg-gradient-to-br from-gray-900/80 to-black border-pink-500/30 p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Input
                      placeholder="Ваше ім'я"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="bg-black/50 border-gray-700 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="tel"
                      placeholder="Телефон"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="bg-black/50 border-gray-700 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="bg-black/50 border-gray-700 focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Розкажіть про ваш бізнес та цілі"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="bg-black/50 border-gray-700 focus:border-pink-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 text-white text-lg font-bold py-6"
                    disabled={createLeadMutation.isPending}
                  >
                    {createLeadMutation.isPending ? "Відправка..." : "Отримати консультацію"}
                  </Button>
                </form>

                <div className="mt-8 pt-8 border-t border-gray-800 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Phone className="w-4 h-4" />
                    <a href="tel:+380992377117" className="hover:text-pink-400 transition-colors">
                      +380 99 23 77 117
                    </a>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-gray-400">
                    <Mail className="w-4 h-4" />
                    <a href="mailto:info@pikaleads.com" className="hover:text-pink-400 transition-colors">
                      info@pikaleads.com
                    </a>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </div>

      <Footer />

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        formType="consultation"
      />
    </>
  );
}
