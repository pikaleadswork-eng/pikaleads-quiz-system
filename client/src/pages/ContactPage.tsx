import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MapPin, Send } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ContactPage() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success(t.successMessage);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    },
    onError: () => {
      toast.error(t.errorMessage);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error(t.fillAllFields);
      return;
    }
    contactMutation.mutate({ name, email, phone: phone || undefined, message })
  };

  const content = {
    uk: {
      title: "Контакти",
      subtitle: "Зв'яжіться з нами будь-яким зручним способом",
      formTitle: "Форма зворотного зв'язку",
      formSubtitle: "Заповніть форму, і ми зв'яжемося з вами найближчим часом",
      name: "Ім'я",
      namePlaceholder: "Ваше ім'я",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Телефон",
      phonePlaceholder: "+38 099 23 77 117",
      message: "Повідомлення",
      messagePlaceholder: "Розкажіть про ваш проєкт або запитання...",
      send: "Надіслати",
      sending: "Надсилання...",
      successMessage: "Повідомлення надіслано! Ми зв'яжемося з вами найближчим часом.",
      errorMessage: "Помилка надсилання. Спробуйте ще раз.",
      fillAllFields: "Будь ласка, заповніть всі обов'язкові поля",
      contactInfo: "Контактна інформація",
      phoneLabel: "Телефон:",
      emailLabel: "Email:",
      addressLabel: "Адреса:",
      addressValue: "Україна, Київ",
      workingHours: "Години роботи:",
      workingHoursValue: "Пн-Пт: 9:00 - 18:00",
      company: "ФОП 'Грибук Роман Миколайович'"
    },
    en: {
      title: "Contact Us",
      subtitle: "Get in touch with us in any convenient way",
      formTitle: "Contact Form",
      formSubtitle: "Fill out the form and we'll get back to you soon",
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Phone",
      phonePlaceholder: "+38 099 23 77 117",
      message: "Message",
      messagePlaceholder: "Tell us about your project or question...",
      send: "Send",
      sending: "Sending...",
      successMessage: "Message sent! We'll get back to you soon.",
      errorMessage: "Error sending. Please try again.",
      fillAllFields: "Please fill all required fields",
      contactInfo: "Contact Information",
      phoneLabel: "Phone:",
      emailLabel: "Email:",
      addressLabel: "Address:",
      addressValue: "Ukraine, Kyiv",
      workingHours: "Working Hours:",
      workingHoursValue: "Mon-Fri: 9:00 AM - 6:00 PM",
      company: "FOP 'Hrybuk Roman Mykolaiovych'"
    },
    ru: {
      title: "Контакты",
      subtitle: "Свяжитесь с нами любым удобным способом",
      formTitle: "Форма обратной связи",
      formSubtitle: "Заполните форму, и мы свяжемся с вами в ближайшее время",
      name: "Имя",
      namePlaceholder: "Ваше имя",
      email: "Email",
      emailPlaceholder: "your@email.com",
      phone: "Телефон",
      phonePlaceholder: "+38 099 23 77 117",
      message: "Сообщение",
      messagePlaceholder: "Расскажите о вашем проекте или вопросе...",
      send: "Отправить",
      sending: "Отправка...",
      successMessage: "Сообщение отправлено! Мы свяжемся с вами в ближайшее время.",
      errorMessage: "Ошибка отправки. Попробуйте еще раз.",
      fillAllFields: "Пожалуйста, заполните все обязательные поля",
      contactInfo: "Контактная информация",
      phoneLabel: "Телефон:",
      emailLabel: "Email:",
      addressLabel: "Адрес:",
      addressValue: "Украина, Киев",
      workingHours: "Часы работы:",
      workingHoursValue: "Пн-Пт: 9:00 - 18:00",
      company: "ФОП 'Грибук Роман Николаевич'"
    }
  };

  const t = content[language as keyof typeof content] || content.uk;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <CyberpunkNavigation />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-yellow-400 mb-4">
              {t.title}
            </h1>
            <p className="text-xl text-zinc-400">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="bg-zinc-900 border border-yellow-500/20 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-yellow-400 mb-2">
                {t.formTitle}
              </h2>
              <p className="text-zinc-400 mb-6">
                {t.formSubtitle}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t.name} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    placeholder={t.namePlaceholder}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t.email} <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="email"
                    placeholder={t.emailPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t.phone}
                  </label>
                  <Input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    {t.message} <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    placeholder={t.messagePlaceholder}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white min-h-[150px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                  disabled={contactMutation.isPending}
                >
                  {contactMutation.isPending ? (
                    t.sending
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      {t.send}
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-zinc-900 border border-yellow-500/20 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">
                  {t.contactInfo}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-400/10 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">{t.phoneLabel}</div>
                      <a 
                        href="tel:+380992377117" 
                        className="text-lg text-white hover:text-yellow-400 transition-colors"
                      >
                        +38 099 23 77 117
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-400/10 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">{t.emailLabel}</div>
                      <a 
                        href="mailto:support@pika-leads.com" 
                        className="text-lg text-white hover:text-yellow-400 transition-colors break-all"
                      >
                        support@pika-leads.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-yellow-400/10 p-3 rounded-lg">
                      <MapPin className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="text-sm text-zinc-500 mb-1">{t.addressLabel}</div>
                      <div className="text-lg text-white">
                        {t.addressValue}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-900 border border-yellow-500/20 rounded-lg p-8">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">
                  {t.workingHours}
                </h3>
                <p className="text-lg text-white mb-4">
                  {t.workingHoursValue}
                </p>
                <p className="text-sm text-zinc-500">
                  {t.company}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
