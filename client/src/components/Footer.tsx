import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

export default function Footer() {
  const { language } = useLanguage();

  const content = {
    uk: {
      about: "Про нас",
      aboutText: "PIKA LEADS - професійне агентство цифрового маркетингу, спеціалізується на генерації лідів та перформанс-маркетингу.",
      services: "Послуги",
      metaAds: "Meta Ads",
      googleAds: "Google Ads",
      tiktokAds: "TikTok Ads",
      analytics: "Аналітика GA4",
      leadGen: "Генерація лідів",
      crmSystems: "CRM системи",
      legal: "Юридична інформація",
      privacy: "Політика конфіденційності",
      cookies: "Політика кукіс",
      terms: "Умови використання",
      contacts: "Контакти",
      phone: "Телефон:",
      email: "Email:",
      address: "Адреса:",
      addressText: "Рівненська обл., м.Рівне., вул. Млинівська 12",
      followUs: "Слідкуйте за нами",
      partners: "Сертифіковані партнери",
      rights: "© 2025 PIKA LEADS. Всі права захищені.",
      company: "ФОП \"Грибук Роман Миколайович\""
    },
    en: {
      about: "About Us",
      aboutText: "PIKA LEADS is a professional digital marketing agency specializing in lead generation and performance marketing.",
      services: "Services",
      metaAds: "Meta Ads",
      googleAds: "Google Ads",
      tiktokAds: "TikTok Ads",
      analytics: "GA4 Analytics",
      leadGen: "Lead Generation",
      crmSystems: "CRM Systems",
      legal: "Legal Information",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      terms: "Terms of Service",
      contacts: "Contacts",
      phone: "Phone:",
      email: "Email:",
      address: "Address:",
      addressText: "Rivne region, Rivne, Mlynivska St. 12",
      followUs: "Follow Us",
      partners: "Certified Partners",
      rights: "© 2025 PIKA LEADS. All rights reserved.",
      company: "FOP \"Hrybuk Roman Mykolaiovych\""
    },
    ru: {
      about: "О нас",
      aboutText: "PIKA LEADS - профессиональное агентство цифрового маркетинга, специализируется на генерации лидов и перформанс-маркетинге.",
      services: "Услуги",
      metaAds: "Meta Ads",
      googleAds: "Google Ads",
      tiktokAds: "TikTok Ads",
      analytics: "Аналитика GA4",
      leadGen: "Генерация лидов",
      crmSystems: "CRM системы",
      legal: "Юридическая информация",
      privacy: "Политика конфиденциальности",
      cookies: "Политика куки",
      terms: "Условия использования",
      contacts: "Контакты",
      phone: "Телефон:",
      email: "Email:",
      address: "Адрес:",
      addressText: "Ровенская обл., г.Ровно, ул. Млыновская 12",
      followUs: "Следите за нами",
      partners: "Сертифицированные партнеры",
      rights: "© 2025 PIKA LEADS. Все права защищены.",
      company: "ФОП \"Грибук Роман Николаевич\""
    }
  };

  const t = content[language as keyof typeof content] || content.uk;

  const socialLinks = [
    { name: "Instagram", icon: Instagram, url: "https://instagram.com/pikaleads", color: "hover:text-pink-500" },
    { name: "Facebook", icon: Facebook, url: "https://facebook.com/pikaleads", color: "hover:text-blue-500" },
    { name: "LinkedIn", icon: Linkedin, url: "https://linkedin.com/company/pikaleads", color: "hover:text-blue-600" },
    { name: "Twitter", icon: Twitter, url: "https://twitter.com/pikaleads", color: "hover:text-sky-500" },
    { name: "YouTube", icon: Youtube, url: "https://youtube.com/@pikaleads", color: "hover:text-red-500" }
  ];

  const partnerLogos = [
    { name: "Meta Business Partner", src: "/partners/meta-partner.png", alt: "Meta Business Partner" },
    { name: "Google Partner", src: "/partners/google-partner.png", alt: "Google Partner" },
    { name: "TikTok Marketing Partner", src: "/partners/tiktok-partner.jpg", alt: "TikTok Marketing Partner" },
    { name: "GA4 Certified", src: "/partners/ga4-certified.jpg", alt: "Google Analytics 4 Certified" },
    { name: "Meta Blueprint Certified", src: "/partners/meta-blueprint.png", alt: "Meta Blueprint Certified" }
  ];

  return (
    <footer className="bg-gradient-to-b from-zinc-950 to-black border-t border-yellow-500/20 mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <img 
                src="/pikaleads-logo-dark.png" 
                alt="PIKA LEADS" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t.aboutText}
            </p>
            
            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold text-sm text-zinc-300 mb-3">{t.followUs}</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-zinc-400 ${social.color} transition-colors`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-yellow-400">{t.services}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services/meta-ads" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.metaAds}
                </Link>
              </li>
              <li>
                <Link href="/services/google-ads" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.googleAds}
                </Link>
              </li>
              <li>
                <Link href="/services/tiktok-ads" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.tiktokAds}
                </Link>
              </li>
              <li>
                <Link href="/services/analytics" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.analytics}
                </Link>
              </li>
              <li>
                <Link href="/services/lead-generation" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.leadGen}
                </Link>
              </li>
              <li>
                <Link href="/services/crm" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.crmSystems}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-yellow-400">{t.legal}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.cookies}
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-zinc-400 hover:text-yellow-400 transition-colors text-sm block">
                  {t.terms}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-yellow-400">{t.contacts}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="text-zinc-500 text-xs">{t.phone}</div>
                  <a 
                    href="tel:+380992377117" 
                    className="text-zinc-300 hover:text-yellow-400 transition-colors text-sm"
                  >
                    +38 099 23 77 117
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="text-zinc-500 text-xs">{t.email}</div>
                  <a 
                    href="mailto:support@pika-leads.com" 
                    className="text-zinc-300 hover:text-yellow-400 transition-colors text-sm break-all"
                  >
                    support@pika-leads.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-yellow-400 flex-shrink-0" />
                <div>
                  <div className="text-zinc-500 text-xs">{t.address}</div>
                  <div className="text-zinc-300 text-sm">
                    {t.addressText}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Partners & Certifications - Compact */}
        <div className="border-t border-zinc-800 pt-6 pb-6">
          <div className="text-center mb-4">
            <h4 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{t.partners}</h4>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6">
            {partnerLogos.map((logo) => (
              <div 
                key={logo.name}
                className="grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100"
                title={logo.alt}
              >
                <img 
                  src={logo.src} 
                  alt={logo.alt}
                  className="h-10 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
            <div>{t.rights}</div>
            <div>{t.company}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
