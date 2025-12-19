import { useState } from "react";
import { Menu, X, Phone, Send, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "wouter";

interface CyberpunkNavigationProps {
  currentPath?: string;
}

export default function CyberpunkNavigation({ currentPath = "/" }: CyberpunkNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Головна", href: "/" },
    { label: "Квізи", href: "/quizzes" },
    { label: "Контакти", href: "/contact" },
    { label: "Відгуки", href: "/reviews" },
    { label: "Про нас", href: "/about" },
  ];

  const socialLinks = [
    { name: "Instagram", icon: Instagram, href: "https://instagram.com/pikaleads" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com/pikaleads" },
    { name: "Telegram", icon: Send, href: "https://t.me/pikaleads" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com/@pikaleads" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b-2 border-[#5B2E90]" style={{
      boxShadow: '0 4px 20px rgba(91, 46, 144, 0.3)'
    }}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-3 group cursor-pointer">
              <img 
                src="/pikaleads-logo-dark.png" 
                alt="PIKALEADS" 
                className="h-12 w-auto transition-all group-hover:drop-shadow-[0_0_15px_rgba(255,217,61,0.6)]"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Menu Items */}
            <div className="flex items-center gap-6">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <span 
                    className={`text-sm font-bold uppercase tracking-wider transition-all hover:text-[#FFD93D] relative group cursor-pointer ${
                      currentPath === item.href ? 'text-[#FFD93D]' : 'text-gray-300'
                    }`}
                    style={{
                      textShadow: currentPath === item.href ? '0 0 10px rgba(255,217,61,0.6)' : 'none'
                    }}
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FFD93D] transition-all group-hover:w-full" style={{
                      boxShadow: '0 0 10px rgba(255,217,61,0.8)'
                    }} />
                  </span>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-[#5B2E90]" />

            {/* Contact Info */}
            <div className="flex items-center gap-4">
              {/* Compact Social Links */}
              <div className="flex items-center gap-2">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#5B2E90]/20 text-gray-300 hover:bg-[#5B2E90]/40 hover:text-[#FFD93D] transition-all"
                      title={social.name}
                    >
                      <IconComponent className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
              
              {/* Divider */}
              <div className="h-8 w-px bg-[#5B2E90]/30" />
              
              <a 
                href="tel:+380992377117" 
                className="flex items-center gap-2 text-gray-300 hover:text-[#FFD93D] transition-colors group"
              >
                <Phone className="w-4 h-4 group-hover:animate-pulse" />
                <span className="text-sm font-bold">+380 99 23 77 117</span>
              </a>
              
              <a 
                href="https://t.me/pikaleads" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#FF6B35] hover:bg-[#FF8C42] transition-all group"
                style={{
                  boxShadow: '0 0 15px rgba(255, 107, 53, 0.5)'
                }}
              >
                <Send className="w-5 h-5 text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#FFD93D] hover:bg-[#5B2E90]/20 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#5B2E90]/30">
            {/* Menu Items */}
            <div className="flex flex-col gap-3 mb-4">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                      currentPath === item.href
                        ? 'bg-[#5B2E90]/30 text-[#FFD93D]'
                        : 'text-gray-300 hover:bg-[#5B2E90]/10 hover:text-[#FFD93D]'
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#5B2E90]/30 my-4" />

            {/* Social Links */}
            <div className="flex items-center justify-center gap-6 mb-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-[#FF6B35] transition-colors"
                    title={social.name}
                  >
                    <IconComponent className="w-6 h-6" />
                  </a>
                );
              })}
            </div>

            {/* Divider */}
            <div className="h-px bg-[#5B2E90]/30 my-4" />

            {/* Contact Info */}
            <div className="flex flex-col gap-3">
              <a 
                href="tel:+380992377117" 
                className="flex items-center justify-center gap-2 px-4 py-3 text-gray-300 hover:text-[#FFD93D] hover:bg-[#5B2E90]/10 rounded-lg transition-all"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm font-bold">+380 99 23 77 117</span>
              </a>
              
              <a 
                href="https://t.me/pikaleads" 
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#FF6B35] hover:bg-[#FF8C42] text-white rounded-lg transition-all"
              >
                <Send className="w-5 h-5" />
                <span className="text-sm font-bold">Telegram</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
