import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  uk: {
    title: "Отримайте безкоштовний аналіз",
    subtitle: "Наш спеціаліст зв'яжеться з вами протягом 10-15 хвилин",
    nameLabel: "Ваше ім'я *",
    namePlaceholder: "Іван Петренко",
    phoneLabel: "Номер телефону *",
    phonePlaceholder: "+380 (99) 123-4567",
    emailLabel: "Email (необов'язково)",
    emailPlaceholder: "your@email.com",
    telegramLabel: "Telegram (необов'язково)",
    telegramPlaceholder: "@username",
    submitButton: "Отримати безкоштовний аналіз →",
    submitting: "Відправка..."
  },
  ru: {
    title: "Получите бесплатный анализ",
    subtitle: "Наш специалист свяжется с вами в течение 10-15 минут",
    nameLabel: "Ваше имя *",
    namePlaceholder: "Иван Петренко",
    phoneLabel: "Номер телефона *",
    phonePlaceholder: "+380 (99) 123-4567",
    emailLabel: "Email (необязательно)",
    emailPlaceholder: "your@email.com",
    telegramLabel: "Telegram (необязательно)",
    telegramPlaceholder: "@username",
    submitButton: "Получить бесплатный анализ →",
    submitting: "Отправка..."
  },
  en: {
    title: "Get Your Free Analysis",
    subtitle: "Our specialist will contact you within 10-15 minutes",
    nameLabel: "Your Name *",
    namePlaceholder: "John Doe",
    phoneLabel: "Phone Number *",
    phonePlaceholder: "+1 (555) 123-4567",
    emailLabel: "Email (Optional)",
    emailPlaceholder: "your@email.com",
    telegramLabel: "Telegram Username (Optional)",
    telegramPlaceholder: "@username",
    submitButton: "Get My Free Analysis →",
    submitting: "Submitting..."
  },
  pl: {
    title: "Otrzymaj darmową analizę",
    subtitle: "Nasz specjalista skontaktuje się z Tobą w ciągu 10-15 minut",
    nameLabel: "Twoje imię *",
    namePlaceholder: "Jan Kowalski",
    phoneLabel: "Numer telefonu *",
    phonePlaceholder: "+48 (99) 123-4567",
    emailLabel: "Email (opcjonalnie)",
    emailPlaceholder: "your@email.com",
    telegramLabel: "Telegram (opcjonalnie)",
    telegramPlaceholder: "@username",
    submitButton: "Otrzymaj darmową analizę →",
    submitting: "Wysyłanie..."
  },
  de: {
    title: "Erhalten Sie Ihre kostenlose Analyse",
    subtitle: "Unser Spezialist wird Sie innerhalb von 10-15 Minuten kontaktieren",
    nameLabel: "Ihr Name *",
    namePlaceholder: "Max Mustermann",
    phoneLabel: "Telefonnummer *",
    phonePlaceholder: "+49 (99) 123-4567",
    emailLabel: "Email (optional)",
    emailPlaceholder: "your@email.com",
    telegramLabel: "Telegram (optional)",
    telegramPlaceholder: "@username",
    submitButton: "Kostenlose Analyse erhalten →",
    submitting: "Wird gesendet..."
  }
};

interface LeadFormProps {
  onSubmit: (data: { name: string; phone: string; telegram: string; email: string }) => void;
  isLoading?: boolean;
}

export default function LeadForm({ onSubmit, isLoading }: LeadFormProps) {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && phone) {
      onSubmit({ name, phone, telegram, email });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-card border-2 border-border rounded-xl p-8 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2 text-foreground">
          {t.title}
        </h2>
        <p className="text-center text-muted-foreground mb-8">
          {t.subtitle}
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground font-semibold mb-2 block">
              {t.nameLabel}
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder={t.namePlaceholder}
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="phone" className="text-foreground font-semibold mb-2 block">
              {t.phoneLabel}
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              placeholder={t.phonePlaceholder}
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-foreground font-semibold mb-2 block">
              {t.emailLabel}
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <div>
            <Label htmlFor="telegram" className="text-foreground font-semibold mb-2 block">
              {t.telegramLabel}
            </Label>
            <Input
              id="telegram"
              type="text"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              placeholder={t.telegramPlaceholder}
              className="h-14 text-lg bg-input border-2 border-border focus:border-primary text-foreground"
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !name || !phone}
            className="w-full h-16 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
          >
            {isLoading ? t.submitting : t.submitButton}
          </Button>
        </form>
      </div>
    </div>
  );
}
