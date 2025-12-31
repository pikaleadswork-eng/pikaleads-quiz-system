import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "wouter";

const cookieConsentTranslations = {
  uk: {
    message: "Ми використовуємо файли cookie для покращення вашого досвіду. Продовжуючи використовувати сайт, ви погоджуєтесь з нашою",
    privacyPolicy: "Політикою конфіденційності",
    accept: "Прийняти",
    decline: "Відхилити",
  },
  ru: {
    message: "Мы используем файлы cookie для улучшения вашего опыта. Продолжая использовать сайт, вы соглашаетесь с нашей",
    privacyPolicy: "Политикой конфиденциальности",
    accept: "Принять",
    decline: "Отклонить",
  },
  en: {
    message: "We use cookies to improve your experience. By continuing to use the site, you agree to our",
    privacyPolicy: "Privacy Policy",
    accept: "Accept",
    decline: "Decline",
  },
  pl: {
    message: "Używamy plików cookie, aby poprawić Twoje doświadczenie. Kontynuując korzystanie ze strony, zgadzasz się z naszą",
    privacyPolicy: "Polityką prywatności",
    accept: "Akceptuj",
    decline: "Odrzuć",
  },
  de: {
    message: "Wir verwenden Cookies, um Ihre Erfahrung zu verbessern. Durch die weitere Nutzung der Website stimmen Sie unserer",
    privacyPolicy: "Datenschutzerklärung",
    accept: "Akzeptieren",
    decline: "Ablehnen",
  },
};

export function CookieConsent() {
  const { language } = useLanguage();
  const [show, setShow] = useState(false);
  const t = cookieConsentTranslations[language];

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/95 border-t border-purple-500/30 p-4 md:p-6 z-50 backdrop-blur-sm">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-300 text-center md:text-left">
          {t.message}{" "}
          <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">
            {t.privacyPolicy}
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <Button
            onClick={handleDecline}
            variant="outline"
            className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            {t.decline}
          </Button>
          <Button
            onClick={handleAccept}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {t.accept}
          </Button>
        </div>
      </div>
    </div>
  );
}
