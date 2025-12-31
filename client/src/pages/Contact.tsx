import { useLanguage } from "@/contexts/LanguageContext";
import QuizLayout from "@/components/QuizLayout";
import { Link } from "wouter";
import { Phone, Mail, MapPin } from "lucide-react";

const contactTranslations = {
  uk: {
    title: "Контакти",
    subtitle: "Зв'яжіться з нами будь-яким зручним способом",
    companyName: "ФОП 'Грибук Роман Миколайович'",
    phone: "Телефон",
    email: "Електронна пошта",
    address: "Адреса",
    addressValue: "вул. Незалежності 44а., м.Ківерці, Волинська обл., Україна",
    workingHours: "Години роботи",
    workingHoursValue: "Пн-Пт: 9:00 - 18:00",
    callUs: "Зателефонуйте нам",
    emailUs: "Напишіть нам",
    visitUs: "Відвідайте нас",
    backToHome: "Повернутися на головну",
  },
  ru: {
    title: "Контакты",
    subtitle: "Свяжитесь с нами любым удобным способом",
    companyName: "ФОП 'Грибук Роман Николаевич'",
    phone: "Телефон",
    email: "Электронная почта",
    address: "Адрес",
    addressValue: "ул. Независимости 44а., г.Киверцы, Волынская обл., Украина",
    workingHours: "Часы работы",
    workingHoursValue: "Пн-Пт: 9:00 - 18:00",
    callUs: "Позвоните нам",
    emailUs: "Напишите нам",
    visitUs: "Посетите нас",
    backToHome: "Вернуться на главную",
  },
  en: {
    title: "Contact Us",
    subtitle: "Get in touch with us in any convenient way",
    companyName: "FOP 'Hrybuk Roman Mykolayovych'",
    phone: "Phone",
    email: "Email",
    address: "Address",
    addressValue: "44a Nezalezhnosti St., Kivertsi, Volyn Oblast, Ukraine",
    workingHours: "Working Hours",
    workingHoursValue: "Mon-Fri: 9:00 AM - 6:00 PM",
    callUs: "Call Us",
    emailUs: "Email Us",
    visitUs: "Visit Us",
    backToHome: "Return to Home",
  },
  pl: {
    title: "Kontakt",
    subtitle: "Skontaktuj się z nami w dowolny wygodny sposób",
    companyName: "FOP 'Hrybuk Roman Mykolayovych'",
    phone: "Telefon",
    email: "Email",
    address: "Adres",
    addressValue: "ul. Niezależności 44a., Kiwercy, obwód wołyński, Ukraina",
    workingHours: "Godziny pracy",
    workingHoursValue: "Pon-Pt: 9:00 - 18:00",
    callUs: "Zadzwoń do nas",
    emailUs: "Napisz do nas",
    visitUs: "Odwiedź nas",
    backToHome: "Powrót do strony głównej",
  },
  de: {
    title: "Kontakt",
    subtitle: "Kontaktieren Sie uns auf bequeme Weise",
    companyName: "FOP 'Hrybuk Roman Mykolayovych'",
    phone: "Telefon",
    email: "E-Mail",
    address: "Adresse",
    addressValue: "Nezalezhnosti Str. 44a., Kivertsi, Oblast Wolhynien, Ukraine",
    workingHours: "Arbeitszeiten",
    workingHoursValue: "Mo-Fr: 9:00 - 18:00",
    callUs: "Rufen Sie uns an",
    emailUs: "Schreiben Sie uns",
    visitUs: "Besuchen Sie uns",
    backToHome: "Zurück zur Startseite",
  },
};

export default function Contact() {
  const { language } = useLanguage();
  const t = contactTranslations[language];

  return (
    <QuizLayout>
      <div className="min-h-screen bg-black text-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 mb-6 inline-block">
            ← {t.backToHome}
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-gray-400 mb-12">{t.subtitle}</p>

          <div className="bg-gray-900 p-8 rounded-lg border border-purple-500/30 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">{t.companyName}</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <Phone className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t.callUs}</h3>
                  <p className="text-gray-400 mb-1">{t.phone}:</p>
                  <a 
                    href="tel:+380992377117" 
                    className="text-yellow-400 hover:text-yellow-300 text-lg font-medium"
                  >
                    +380 99 237 71 17
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <Mail className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t.emailUs}</h3>
                  <p className="text-gray-400 mb-1">{t.email}:</p>
                  <a 
                    href="mailto:info@pika-leads.com" 
                    className="text-yellow-400 hover:text-yellow-300 text-lg font-medium"
                  >
                    info@pika-leads.com
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <MapPin className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t.visitUs}</h3>
                  <p className="text-gray-400 mb-1">{t.address}:</p>
                  <p className="text-gray-300">
                    {t.addressValue}
                  </p>
                </div>
              </div>

              {/* Working Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t.workingHours}</h3>
                  <p className="text-gray-300">
                    {t.workingHoursValue}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Map or additional info can be added here */}
        </div>
      </div>
    </QuizLayout>
  );
}
