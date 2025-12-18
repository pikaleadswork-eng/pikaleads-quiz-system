import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  Youtube,
  Mail,
  Phone
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { trpc } from "@/lib/trpc";

export default function Footer() {
  const { language } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  
  const contactMutation = trpc.contact.submit.useMutation({
    onSuccess: () => {
      toast.success(t.messageSent);
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () => {
      toast.error(t.messageError);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error("Please fill all fields");
      return;
    }
    contactMutation.mutate({ name, email, message });
  };

  const content = {
    uk: {
      services: "Послуги",
      about: "Про нас",
      blog: "Блог",
      news: "Новини",
      faq: "F.A.Q",
      portfolio: "Портфоліо",
      partners: "Партнери",
      legal: "Юридична інформація",
      privacy: "Політика конфіденційності",
      cookies: "Політика кукіс",
      disclaimer: "Дисклеймер",
      contacts: "Контакти",
      phone: "Тел.:",
      email: "Пошта:",
      company: "ФОП \"Грибук Роман Миколайович\"",
      followUs: "Слідкуйте за нами",
      comingSoon: "Незабаром",
      rights: "© 2025 PIKA LEADS. Всі права захищені.",
      contactForm: "Зв'яжіться з нами",
      name: "Ім'я",
      message: "Повідомлення",
      send: "Надіслати",
      sending: "Надсилання...",
      messageSent: "Повідомлення надіслано!",
      messageError: "Помилка надсилання"
    },
    en: {
      services: "Services",
      about: "About Us",
      blog: "Blog",
      news: "News",
      faq: "F.A.Q",
      portfolio: "Portfolio",
      partners: "Partners",
      legal: "Legal Information",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      disclaimer: "Disclaimer",
      contacts: "Contacts",
      phone: "Phone:",
      email: "Email:",
      company: "FOP \"Hrybuk Roman Mykolaiovych\"",
      followUs: "Follow Us",
      comingSoon: "Coming Soon",
      rights: "© 2025 PIKA LEADS. All rights reserved.",
      contactForm: "Contact Us",
      name: "Name",
      message: "Message",
      send: "Send",
      sending: "Sending...",
      messageSent: "Message sent!",
      messageError: "Error sending message"
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

  const handleComingSoon = (e: React.MouseEvent, section: string) => {
    e.preventDefault();
    toast.info(`${section} - ${t.comingSoon}`);
  };

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-12">
        {/* Contact Form Section */}
        <div className="mb-12 max-w-2xl mx-auto">
          <h3 className="font-semibold text-2xl text-foreground mb-6 text-center">{t.contactForm}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder={t.name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background"
              />
              <Input
                type="email"
                placeholder={t.email}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background"
              />
            </div>
            <Textarea
              placeholder={t.message}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-background min-h-[120px]"
            />
            <Button 
              type="submit" 
              className="w-full"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? t.sending : t.send}
            </Button>
          </form>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Column 1: Services & About */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">{t.services}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.services)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>
            
            <h3 className="font-semibold text-lg text-foreground mt-6">{t.about}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.about)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Blog & News */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">{t.blog}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.blog)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>
            
            <h3 className="font-semibold text-lg text-foreground mt-6">{t.news}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.news)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">{t.faq}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.faq)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>
            
            <h3 className="font-semibold text-lg text-foreground mt-6">{t.portfolio}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.portfolio)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>

            <h3 className="font-semibold text-lg text-foreground mt-6">{t.partners}</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={(e) => handleComingSoon(e, t.partners)}
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  {t.comingSoon}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">{t.legal}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                  {t.privacy}
                </Link>
              </li>
              <li>
                <Link href="/cookie-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                  {t.cookies}
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-muted-foreground hover:text-primary transition-colors text-sm block">
                  {t.disclaimer}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contacts */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg text-foreground">{t.contacts}</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a 
                  href="tel:+380992377117" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm"
                >
                  +38 099 23 77 117
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                <a 
                  href="mailto:support@pika-leads.com" 
                  className="text-muted-foreground hover:text-primary transition-colors text-sm break-all"
                >
                  support@pika-leads.com
                </a>
              </li>
              <li className="text-muted-foreground text-sm mt-4">
                {t.company}
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-6">
              <h4 className="font-semibold text-sm text-foreground mb-3">{t.followUs}</h4>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`text-muted-foreground ${social.color} transition-colors`}
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-8">
          <div className="text-center text-sm text-muted-foreground">
            {t.rights}
          </div>
        </div>
      </div>
    </footer>
  );
}
