import { Button } from "@/components/ui/button";
import QuizLayout from "@/components/QuizLayout";
import { CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  uk: {
    title: "Дякуємо! Заявку отримано!",
    description: "Наш спеціаліст зв'яжеться з вами протягом",
    timeframe: "10-15 хвилин",
    description2: "та надасть персоналізований план запуску.",
    analyzing: "Ми вже аналізуємо вашу нішу та готуємо прогноз результатів.",
    telegramButton: "Перейти в Telegram →",
    exploreMore: "Хочете дізнатись більше?",
    returnLink: "Повернутись до вибору квізу"
  },
  ru: {
    title: "Спасибо! Заявка получена!",
    description: "Наш специалист свяжется с вами в течение",
    timeframe: "10-15 минут",
    description2: "и предоставит персонализированный план запуска.",
    analyzing: "Мы уже анализируем вашу нишу и готовим прогноз результатов.",
    telegramButton: "Перейти в Telegram →",
    exploreMore: "Хотите узнать больше?",
    returnLink: "Вернуться к выбору квиза"
  },
  en: {
    title: "Thank You! Application Received!",
    description: "Our specialist will contact you within",
    timeframe: "10-15 minutes",
    description2: "and provide a personalized launch plan.",
    analyzing: "We are already analyzing your niche and preparing a results forecast.",
    telegramButton: "Go to Telegram →",
    exploreMore: "Want to explore more?",
    returnLink: "Return to quiz selection"
  },
  pl: {
    title: "Dziękujemy! Zgłoszenie otrzymane!",
    description: "Nasz specjalista skontaktuje się z Tobą w ciągu",
    timeframe: "10-15 minut",
    description2: "i przedstawi spersonalizowany plan uruchomienia.",
    analyzing: "Już analizujemy Twoją niszę i przygotowujemy prognozę wyników.",
    telegramButton: "Przejdź do Telegram →",
    exploreMore: "Chcesz dowiedzieć się więcej?",
    returnLink: "Powrót do wyboru quizu"
  },
  de: {
    title: "Vielen Dank! Antrag erhalten!",
    description: "Unser Spezialist wird Sie innerhalb von",
    timeframe: "10-15 Minuten",
    description2: "kontaktieren und einen personalisierten Startplan bereitstellen.",
    analyzing: "Wir analysieren bereits Ihre Nische und bereiten eine Ergebnisprognose vor.",
    telegramButton: "Zu Telegram gehen →",
    exploreMore: "Möchten Sie mehr erfahren?",
    returnLink: "Zurück zur Quiz-Auswahl"
  }
};

export default function ThankYou() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const handleTelegramRedirect = () => {
    // Replace with your actual Telegram link
    window.open("https://t.me/pikaleads", "_blank");
  };

  return (
    <QuizLayout>
      <div className="max-w-3xl mx-auto text-center py-12">
        <div className="mb-8 flex justify-center">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center animate-bounce-in">
            <CheckCircle2 className="w-16 h-16 text-accent-foreground" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-foreground mb-6">
          {t.title}
        </h1>

        <div className="bg-card border-2 border-border rounded-xl p-8 mb-8 shadow-2xl">
          <p className="text-xl text-card-foreground mb-6 leading-relaxed">
            {t.description} <span className="text-accent font-bold">{t.timeframe}</span> {t.description2}
          </p>
          <p className="text-lg text-muted-foreground">
            {t.analyzing}
          </p>
        </div>

        <Button
          onClick={handleTelegramRedirect}
          size="lg"
          className="h-16 px-12 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          {t.telegramButton}
        </Button>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t.exploreMore} <a href="/" className="text-accent hover:underline font-semibold">{t.returnLink}</a>
          </p>
        </div>
      </div>
    </QuizLayout>
  );
}
