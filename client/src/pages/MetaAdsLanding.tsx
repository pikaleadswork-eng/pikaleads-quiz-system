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
import { Link } from "wouter";
import CaseStudiesSection from "@/components/CaseStudiesSection";

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
        <section className="relative min-h-screen flex items-center overflow-hidden pt-16 pb-8 lg:pt-0 lg:pb-0">
          {/* Background */}
          <div className="absolute inset-0 bg-black" />
          
          <div className="container relative z-10 px-4 py-12 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[70vh] lg:min-h-[80vh]">
              {/* LEFT SIDE - Text Content */}
              <div className="space-y-4 lg:space-y-8 order-1 lg:order-1">
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
              <div className="relative h-[400px] lg:h-[800px] order-2 lg:order-2">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-l from-pink-500/20 via-purple-500/20 to-transparent blur-3xl" />
                
                {/* Pikachu Character */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <img 
                    src="/pikachu-yellow-final.png"
                    alt="Pikachu Cyberpunk"
                    className="w-[350px] md:w-[450px] lg:w-[550px] xl:w-[650px] h-auto object-contain drop-shadow-2xl animate-float"
                    style={{
                      filter: "drop-shadow(0 0 40px rgba(236, 72, 153, 0.5))"
                    }}
                    loading="lazy"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:gap-6 mt-6 lg:mt-16">
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
                  9 років
                </div>
                <div className="text-gray-300 mt-2">Досвіду в трафіку</div>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12 lg:py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4">
            <div className="text-center mb-16 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Вирішуйте відразу <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">декілька проблем</span> одночасно:
              </h2>
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
                    <p className="text-gray-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{solution.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Client Pain Points Section - "А також, ми розуміємо, що можливо, ви стикались" */}
        <section className="py-12 lg:py-20 relative">
          <div className="container px-4">
            <div className="text-center mb-16 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                А також, Ми розуміємо, що, можливо, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">Ви стикались:</span>
              </h2>
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
                  <p className="text-gray-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{pain.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-12 lg:py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4">
            <div className="text-center mb-16 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Відгуки від <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">наших клієнтів</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                {
                  name: "Tagran",
                  rating: 5,
                  time: "2 тижні тому",
                  text: "Роботаємо вже більше року, настроїв таргета на очень високому рівні. Робить завжди все на якість, результати дуже хороші. KPI перевищив 700%!!!",
                  tags: ["Якість", "Професіоналізм", "Ціна/Якість"]
                },
                {
                  name: "Артем Біночур",
                  rating: 5,
                  time: "2 тижні тому",
                  text: "Роботаємо з хлопцями по рекламі доставки води, скажу так... Було 20 замовлень, стало 150, зростання сильне! Подобається підхід, терміни, і зустрічі які тільки по справі.",
                  tags: ["Якість", "Відношення до клієнтів", "Професіоналізм"]
                },
                {
                  name: "Інна Морозова",
                  rating: 5,
                  time: "тиждень тому",
                  text: "Роботаємо більше 3 років! Чітко розуміє, що потрібно, хорошо розуміє сенси. Глибоко розбирається в таргетингу і трафіку. Рекомендую і планую працювати разом далі!",
                  tags: ["Якість", "Професіоналізм", "Експертність"]
                },
                {
                  name: "SH SH",
                  rating: 5,
                  time: "2 тижні тому",
                  text: "Працюємо з командою вже пів року. Результати перевершили очікування - CPL знизився на 40%, а кількість якісних лідів зросла вдвічі. Професійний підхід!",
                  tags: ["Результативність", "Якість", "Професіоналізм"]
                },
                {
                  name: "Олексій Гріцай",
                  rating: 5,
                  time: "2 тижні тому",
                  text: "Відмінна робота! Налаштували рекламу для нашого інтернет-магазину. ROAS виріс з 2.5 до 6.8 за перший місяць. Рекомендую всім, хто шукає справжніх експертів.",
                  tags: ["ROAS", "E-commerce", "Експертність"]
                },
                {
                  name: "Олександр Більськой",
                  rating: 4,
                  time: "2 тижні тому",
                  text: "Хороша команда, швидко розібралися з нашою нішею. Є невеликі зауваження по комунікації, але результат того вартий. Продовжуємо співпрацю.",
                  tags: ["Результат", "Швидкість", "Якість"]
                },
                {
                  name: "Alla Dresses",
                  rating: 5,
                  time: "2 тижні тому",
                  text: "Працюємо з PikaLeads 4 місяці. Продажі виросли на 180%! Особливо подобається аналітика та щотижневі звіти. Дякую за професійний підхід!",
                  tags: ["Продажі", "Аналітика", "Професіоналізм"]
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-gradient-to-br from-purple-900/20 to-pink-900/10 border-purple-500/30 p-6 hover:border-purple-400 transition-all">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{testimonial.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex gap-0.5">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <span key={i} className="text-yellow-400">★</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-400">{testimonial.time}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 mb-4 text-sm leading-relaxed" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>{testimonial.text}</p>
                  <div className="flex flex-wrap gap-2">
                    {testimonial.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-full bg-purple-500/20 text-purple-300">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <a 
                href="https://g.page/r/CRxqX5vZ0ZOXEAI/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
              >
                <span>Більше відгуків в Google</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Case Studies Section - Dynamic from Database */}
        <CaseStudiesSection />

        {/* Client Logos Section - Auto-Rotating Carousel */}
        <section className="py-12 lg:py-20 overflow-hidden">
          <div className="container px-4">
            <div className="text-center mb-12 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Наші <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">клієнти</span>
              </h2>
            </div>

            {/* Infinite Carousel */}
            <div className="relative overflow-hidden">
              {/* Scrolling container */}
              <div className="flex gap-3 lg:gap-4 animate-scroll hover:pause">
                {/* First set of logos */}
                {[
                  { name: "Maria Caruso", logo: "/clients/carusoshoes-enhanced.png", color: "cyan" },
                  { name: "Ovita", logo: "/clients/optmaster-enhanced.png", color: "blue" },
                  { name: "ParkSide", logo: "/clients/parkside-enhanced.png", color: "purple" },
                  { name: "Nasledniki", logo: "/clients/nasledniki-enhanced.png", color: "pink" },
                  { name: "EMMI", logo: "/clients/emmi-enhanced.png", color: "yellow" },
                  { name: "Client", logo: "/clients/client6-enhanced.png", color: "green" },
                  { name: "Coral Travel", logo: "/clients/coraltravel-enhanced.png", color: "orange" },
                  { name: "Flower Shop", logo: "/clients/flower-enhanced.png", color: "rose" },
                  { name: "Karpachoff", logo: "/clients/karpachoff-enhanced.png", color: "indigo" }
                ].map((client, index) => (
                  <div 
                    key={`first-${index}`} 
                    className="flex-shrink-0 w-48 h-32 flex items-center justify-center"
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="text-${client.color}-400 text-sm font-bold">${client.name}</div>`;
                      }}
                    />
                  </div>
                ))}
                
                {/* Duplicate set for seamless loop */}
                {[
                  { name: "Maria Caruso", logo: "/clients/carusoshoes-enhanced.png", color: "cyan" },
                  { name: "Ovita", logo: "/clients/optmaster-enhanced.png", color: "blue" },
                  { name: "ParkSide", logo: "/clients/parkside-enhanced.png", color: "purple" },
                  { name: "Nasledniki", logo: "/clients/nasledniki-enhanced.png", color: "pink" },
                  { name: "EMMI", logo: "/clients/emmi-enhanced.png", color: "yellow" },
                  { name: "Client", logo: "/clients/client6-enhanced.png", color: "green" },
                  { name: "Coral Travel", logo: "/clients/coraltravel-enhanced.png", color: "orange" },
                  { name: "Flower Shop", logo: "/clients/flower-enhanced.png", color: "rose" },
                  { name: "Karpachoff", logo: "/clients/karpachoff-enhanced.png", color: "indigo" }
                ].map((client, index) => (
                  <div 
                    key={`second-${index}`} 
                    className="flex-shrink-0 w-48 h-32 flex items-center justify-center"
                  >
                    <img 
                      src={client.logo} 
                      alt={client.name}
                      className="max-w-full max-h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<div class="text-${client.color}-400 text-sm font-bold">${client.name}</div>`;
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Video Cases Section */}
        <section className="py-12 lg:py-20 bg-gradient-to-b from-black to-gray-900">
          <div className="container px-4">
            <div className="text-center mb-12 max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Відео<span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">кейси</span>
              </h2>
              <p className="text-xl text-gray-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>Кейси, які інколи виходять за рамки пристойності</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Як набирати від 500 підписників в день на тематичний паблік",
                  videoId: "huMHPOGE21Y"
                },
                {
                  title: "E-com в Україні в ніші 'Продаж люстр та світильників'",
                  videoId: "huMHPOGE21Y"
                },
                {
                  title: "Як салону краси отримувати від 100 звернень на день?",
                  videoId: "huMHPOGE21Y"
                },
                {
                  title: "Налаштування реклами у ніші меблі",
                  videoId: "huMHPOGE21Y"
                }
              ].map((video, index) => (
                <Card key={index} className="bg-gradient-to-br from-red-900/20 to-pink-900/10 border-red-500/30 overflow-hidden hover:border-red-400 transition-all">
                  <div className="aspect-video relative">
                    <iframe
                      src={`https://www.youtube.com/embed/${video.videoId}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg">{video.title}</h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section id="contact-form" className="py-12 lg:py-20">
          <div className="container px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-12 max-w-5xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  Отримайте <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">безкоштовний аудит</span>
                </h2>
                <p className="text-xl text-gray-400" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>Залишайте заявку та отримуйте повний список необхідних змін для покращення результату</p>
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
