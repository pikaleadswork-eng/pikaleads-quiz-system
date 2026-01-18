import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";
import LeadFormModal from "@/components/LeadFormModal";

import { CountdownTimer } from "@/components/CountdownTimer";
import { toast } from "sonner";
import GoogleReviews from "@/components/GoogleReviews";
import NichesSection from "@/components/agency/NichesSection";
import ClientsCarousel from "@/components/agency/ClientsCarousel";
import WorkProcessSection from "@/components/agency/WorkProcessSection";
import BlogSection from "@/components/agency/BlogSection";
import { AboutUsSection } from "@/components/agency/AboutUsSection";
import GuaranteesSection from "@/components/agency/GuaranteesSection";

import CaseStudiesSection from "@/components/CaseStudiesSection";
import FAQSection from "@/components/agency/FAQSection";
import Footer from "@/components/Footer";

export default function AgencyHome() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [strategyModalOpen, setStrategyModalOpen] = useState(false);
  const [serviceModalOpen, setServiceModalOpen] = useState(false);

  const [leadFormData, setLeadFormData] = useState({
    name: "",
    phone: "",
    email: "",
    telegram: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use tRPC mutation for lead submission
  const submitLeadMutation = trpc.leads.submit.useMutation({
    onSuccess: (result) => {
      toast.success(result.message || "Дякуємо! Ми зв'яжемося з вами найближчим часом.");
      setLeadFormData({ name: "", phone: "", email: "", telegram: "" });
      setIsSubmitting(false);
    },
    onError: (error: any) => {
      toast.error(error?.message || "Помилка. Спробуйте ще раз.");
      setIsSubmitting(false);
    }
  });



  return (
    <>
      {/* Navigation */}
      <CyberpunkNavigation currentPath="/" />
      
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section - AI Neural Network Style */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left - Text Content */}
            <div className="space-y-6 sm:space-y-8 text-center lg:text-left" style={{ animation: "fadeInUp 0.8s ease-out" }}>
              {/* Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00F0FF]/30 bg-black/50 backdrop-blur-sm" style={{ animation: "fadeIn 0.6s ease-out" }}>
                <div className="w-2 h-2 bg-[#00F0FF] rounded-full animate-pulse" />
                <span className="text-[#FFD93D] text-sm font-mono tracking-wider">
                  SYSTEM: LEAD ENGINE ACTIVE
                </span>
              </div>

              {/* Main Heading */}
                    <h1 
                className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black mb-4 sm:mb-6 leading-tight"
                style={{
                  fontFamily: "'Eurostile Bold Extended', 'Nasalization', 'Rajdhani', sans-serif",
                  letterSpacing: "0.05em",
                  fontWeight: 700
                }}
              >
                <span 
                  className="text-white inline-block"
                  style={{
                    textShadow: "0 0 30px rgba(255, 217, 61, 0.3)"
                  }}
                >
                  ОБИРАЙ НЕ АГЕНСТВО.
                </span>
                <br />
                <span 
                  className="text-[#FFD93D] inline-block"
                  style={{
                    textShadow: "0 0 40px rgba(255, 217, 61, 0.6), 0 0 80px rgba(255, 217, 61, 0.3)"
                  }}
                >
                  ОБИРАЙ РЕЗУЛЬТАТ.
                </span>
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-400 max-w-xl mx-auto lg:mx-0">
                <span className="text-[#FFD93D] font-semibold">PikaLeads</span> – твій партнер з performance-маркетингу. Коли кожен лід має значення.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center lg:items-start justify-center lg:justify-start">
                <button 
                  onClick={() => setConsultationModalOpen(true)}
                  className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-[#FFD93D] hover:bg-[#FFD93D]/90 text-black font-bold rounded-xl transition-all duration-300 shadow-lg shadow-[#FFD93D]/30 text-sm sm:text-base"
                >
                  Отримати консультацію
                </button>
                <button 
                  onClick={() => setStrategyModalOpen(true)}
                  className="w-full sm:w-auto px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 border-2 border-[#FFD93D] text-[#FFD93D] hover:bg-[#FFD93D]/10 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  Отримати стратегію
                </button>
              </div>
            </div>

            {/* Right - Pikachu Hero Visual */}
            <div className="relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] xl:h-[800px] flex items-center justify-center">
              
              {/* Pikachu Character - Center */}
              <div className="relative z-0" style={{ animation: "fadeInScale 1s ease-out" }}>
                <img 
                  src="/pikachu-transparent-user.png" 
                  alt="Pikachu Lead Generator"
                  loading="lazy"
                  className="w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[750px] max-w-none"
                  style={{
                    filter: "drop-shadow(0 0 60px rgba(168, 85, 247, 0.4)) drop-shadow(0 0 30px rgba(255, 217, 61, 0.3))",
                    animation: "floatPikachu 6s ease-in-out infinite"
                  }}
                />
              </div>

              {/* Floating Cards Around Pikachu */}
              <div className="absolute inset-0 pointer-events-none z-20 hidden md:block">
                
                {/* Card 1: 300% - Top Left */}
                <div 
                  className="absolute top-[1%] left-[5%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 5s ease-in-out infinite"
                  }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    300%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-wider">
                    Зростання продажів
                  </div>
                </div>

                {/* Card 2: 97% ROI - Top Right */}
                <div 
                  className="absolute top-[15%] right-[5%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 5.5s ease-in-out infinite",
                    animationDelay: "0.5s"
                  }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    97%
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-wider">
                    ROI
                  </div>
                </div>

                {/* Card 3: 500+ - Bottom Right */}
                <div 
                  className="absolute bottom-[10%] right-[8%] bg-gradient-to-br from-black/90 to-black/70 backdrop-blur-xl border border-[#FFD93D]/20 rounded-xl md:rounded-2xl p-4 md:p-6 shadow-2xl"
                  style={{
                    boxShadow: "0 0 40px rgba(255, 217, 61, 0.15)",
                    animation: "floatCard 6s ease-in-out infinite",
                    animationDelay: "1s"
                  }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-black text-[#FFD93D]" style={{ fontFamily: "Orbitron, sans-serif" }}>
                    500+
                  </div>
                  <div className="text-xs md:text-sm text-gray-400 mt-1 md:mt-2 font-mono uppercase tracking-wider">
                    Успішних кампаній
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Why Us Section - Cyberpunk Style */}
      <section className="relative py-8 sm:py-12 bg-black overflow-hidden" id="why-us">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 217, 61, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 217, 61, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-6 sm:mb-8" style={{ animation: "fadeInUp 0.8s ease-out" }}>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3 sm:mb-4"
              style={{
                fontFamily: "'Eurostile Bold Extended', 'Nasalization', sans-serif",
                letterSpacing: "0.05em"
              }}
            >
              ЧОМУ МИ?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Ми не просто генеруємо ліди. Ми створюємо систему, яка працює на ваш бізнес 24/7.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 items-stretch">
            
            {/* Feature 1 - Performance Marketing */}
            <div className="group relative h-full" style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#FFD93D]/20 rounded-2xl p-6 sm:p-8 hover:border-[#FFD93D]/40 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#FFD93D]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  PERFORMANCE
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Платиш тільки за результат. Кожна гривня працює на твій прибуток.
                </p>
              </div>
            </div>

            {/* Feature 2 - AI Technology */}
            <div className="group relative h-full" style={{ animation: "fadeInUp 0.8s ease-out 0.4s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#00F0FF]/20 rounded-2xl p-6 sm:p-8 hover:border-[#00F0FF]/40 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#00F0FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  AI-TECH
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Штучний інтелект аналізує поведінку та підбирає найкращі рішення для кожного ліда.
                </p>
              </div>
            </div>

            {/* Feature 3 - Full Analytics */}
            <div className="group relative h-full" style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 sm:p-8 hover:border-purple-500/40 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  АНАЛІТИКА
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Бачиш кожен крок клієнта: від кліку до покупки. Прозорість на 100%.
                </p>
              </div>
            </div>

            {/* Feature 4 - Expert Team */}
            <div className="group relative h-full" style={{ animation: "fadeInUp 0.8s ease-out 0.8s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#FFD93D]/20 rounded-2xl p-6 sm:p-8 hover:border-[#FFD93D]/40 transition-all duration-300 h-full flex flex-col">
                {/* Icon */}
                <div className="w-16 h-16 bg-[#FFD93D]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                
                <h3 className="text-sm font-bold text-white mb-4" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  ЕКСПЕРТИ
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Досвід у нішах: e-commerce, фінанси, освіта, нерухомість. Знаємо, що працює.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section - Cyberpunk Style */}
      <section className="relative py-8 sm:py-12 bg-gradient-to-b from-black via-zinc-950 to-black overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px"
            }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-8 sm:mb-12 md:mb-16" style={{ animation: "fadeInUp 0.8s ease-out" }}>
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-6"
              style={{
                fontFamily: "'Eurostile Bold Extended', 'Nasalization', sans-serif",
                letterSpacing: "0.05em"
              }}
            >
              НАШІ ПОСЛУГИ
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto px-4">
              Повний спектр digital-маркетингу та розробки для вашого бізнесу
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Service 1 - Meta Ads */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.1s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  META ADS
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Facebook та Instagram реклама з точним таргетингом. Охоплення 2+ млрд користувачів.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 2 - Google Ads */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.2s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-red-500/20 rounded-2xl p-6 hover:border-red-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  GOOGLE ADS
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Контекстна реклама в пошуку, YouTube та партнерських сайтах. Максимальна точність.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 3 - TikTok Ads */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.3s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-pink-500/20 rounded-2xl p-6 hover:border-pink-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-pink-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-pink-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  TIKTOK ADS
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Вірусна реклама для молодої аудиторії. Максимальне охоплення за мінімальну ціну.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 hover:border-pink-500/50 text-pink-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 4 - X (Twitter) Ads */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.4s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-gray-400/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-gray-500/20 rounded-2xl p-6 hover:border-gray-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-gray-400/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  X (TWITTER) ADS
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Реклама в X (колишній Twitter). Ідеально для B2B, новин та tech-аудиторії.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-gray-500/10 hover:bg-gray-500/20 border border-gray-500/30 hover:border-gray-500/50 text-gray-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 5 - Telegram Ads */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.5s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#00F0FF]/20 rounded-2xl p-6 hover:border-[#00F0FF]/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#00F0FF]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-[#00F0FF]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  TELEGRAM ADS
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Найефективніший канал для українського ринку. Охоплення мільйонів активних користувачів.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 6 - Website Development */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.6s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-[#FFD93D]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-[#FFD93D]/20 rounded-2xl p-6 hover:border-[#FFD93D]/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-[#FFD93D]/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-[#FFD93D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  РОЗРОБКА САЙТІВ
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Лендінги, корпоративні сайти, інтернет-магазини. Швидко, красиво, конверсійно.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-[#FFD93D]/10 hover:bg-[#FFD93D]/20 border border-[#FFD93D]/30 hover:border-[#FFD93D]/50 text-[#FFD93D] font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 7 - App Development */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.7s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  РОЗРОБКА ЗАСТОСУНКІВ
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Мобільні додатки (iOS/Android) та веб-програми. Від ідеї до App Store.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 hover:border-purple-500/50 text-purple-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

            {/* Service 8 - Design Development */}
            <div className="group relative" style={{ animation: "fadeInUp 0.8s ease-out 0.8s both" }}>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
              <div className="relative bg-zinc-900/50 backdrop-blur-sm border border-emerald-500/20 rounded-2xl p-6 hover:border-emerald-500/40 transition-all duration-300 h-full flex flex-col">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "'Eurostile Bold Extended', sans-serif" }}>
                  РОЗРОБКА ДИЗАЙНУ
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  UI/UX дизайн, брендинг, логотипи, банери. Створюємо візуал, що продає.
                </p>
                <button
                  onClick={() => setServiceModalOpen(true)}
                  className="w-full mt-auto px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 font-bold rounded-lg transition-all duration-300 text-sm"
                >
                  Дізнатись більше →
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Lead Magnet Section - Free Audit Offer */}
      <section className="py-8 sm:py-10 md:py-12 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-zinc-900/90 to-zinc-950/90 backdrop-blur-sm border border-yellow-400/20 rounded-xl sm:rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 overflow-hidden">
            {/* Background effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 via-transparent to-purple-500/5 rounded-3xl" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl" />
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
              {/* Left Side - Compelling Text */}
              <div className="space-y-4 sm:space-y-6 md:space-y-8">
                {/* Main Headline */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight">
                    <span className="block text-white" style={{
                      fontFamily: "'Eurostile Bold Extended', 'Rajdhani', sans-serif",
                      letterSpacing: "-0.02em"
                    }}>
                      ВІДЧУВАЄТЕ
                    </span>
                    <span className="block text-white" style={{
                      fontFamily: "'Eurostile Bold Extended', 'Rajdhani', sans-serif",
                      letterSpacing: "-0.02em"
                    }}>
                      ЩО ВАША
                    </span>
                    <span className="block text-[#FFD93D]" style={{
                      fontFamily: "'Eurostile Bold Extended', 'Rajdhani', sans-serif",
                      textShadow: "0 0 30px rgba(255, 217, 61, 0.5)",
                      letterSpacing: "-0.02em"
                    }}>
                      РЕКЛАМА
                    </span>
                    <span className="block text-white" style={{
                      fontFamily: "'Eurostile Bold Extended', 'Rajdhani', sans-serif",
                      letterSpacing: "-0.02em"
                    }}>
                      ПРАЦЮЄ СЛАБО?
                    </span>
                  </h2>
                  
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 leading-relaxed" style={{
                    fontFamily: "'Inter', sans-serif"
                  }}>
                    Або не приносить <span className="text-white font-semibold">очікуваний результат?</span>
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <p className="text-base sm:text-lg font-bold text-white" style={{
                    fontFamily: "'Rajdhani', sans-serif"
                  }}>
                    Залишайте заявку та отримайте:
                  </p>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm sm:text-base md:text-lg text-gray-300">Безкоштовний <span className="text-white font-semibold">аудит вашої реклами</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-lg text-gray-300">Гарантований <span className="text-white font-semibold">пошук проблеми</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-lg text-gray-300">Конкретні <span className="text-white font-semibold">поради на її виправлення</span></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Form & Timer */}
              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Countdown Timer */}
                <div className="space-y-2 sm:space-y-3 md:space-y-4">
                  <p className="text-center text-xs sm:text-sm text-gray-400 uppercase tracking-widest" style={{
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: '0.15em'
                  }}>
                    ПРОПОЗИЦІЯ ДІЄ ЩЕ:
                  </p>
                  <CountdownTimer />
                </div>

                {/* Lead Form */}
                <div className="bg-zinc-900/50 border border-yellow-400/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                  <form 
                    className="space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!leadFormData.name || !leadFormData.phone) {
                        toast.error("Будь ласка, заповніть обов'язкові поля.");
                        return;
                      }
                      setIsSubmitting(true);
                      submitLeadMutation.mutate({
                        name: leadFormData.name,
                        phone: leadFormData.phone,
                        email: leadFormData.email || undefined,
                        telegram: leadFormData.telegram || undefined,
                        source: "homepage",
                        language: "uk"
                      });
                    }}
                  >
                    <input
                      type="text"
                      placeholder="Ім'я"
                      value={leadFormData.name}
                      onChange={(e) => setLeadFormData({ ...leadFormData, name: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <input
                      type="tel"
                      placeholder="Телефон"
                      value={leadFormData.phone}
                      onChange={(e) => setLeadFormData({ ...leadFormData, phone: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <input
                      type="email"
                      placeholder="Пошта"
                      value={leadFormData.email}
                      onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })}
                      required
                      className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <input
                      type="text"
                      placeholder="Телеграм (опціонально)"
                      value={leadFormData.telegram}
                      onChange={(e) => setLeadFormData({ ...leadFormData, telegram: e.target.value })}
                      className="w-full px-5 py-4 bg-zinc-800/50 border border-zinc-700/50 rounded-xl text-white placeholder-gray-500 focus:border-yellow-400/50 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full px-6 py-5 bg-[#FFD93D] text-black font-black rounded-xl hover:bg-[#FFD93D]/90 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg uppercase tracking-wide"
                      style={{
                        boxShadow: '0 0 40px rgba(255, 217, 61, 0.3)',
                        fontFamily: "'Rajdhani', sans-serif"
                      }}
                    >
                      {isSubmitting ? "ВІДПРАВКА..." : "ОТРИМАТИ АУДИТ"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Reviews Section */}
      <GoogleReviews />



      {/* Niches Section */}
      <NichesSection />

      {/* About Us Section */}
      <AboutUsSection />

      {/* Guarantees Section - After About Us */}
      <GuaranteesSection />

      {/* Clients Carousel Section */}
      <ClientsCarousel />

      {/* Work Process Section */}
      <WorkProcessSection />

      {/* Case Studies Section */}
      <CaseStudiesSection pageSlug="home" limit={3} />

      {/* Blog Section */}
      <BlogSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>

      {/* Lead Form Modals */}
      <LeadFormModal 
        isOpen={consultationModalOpen}
        onClose={() => setConsultationModalOpen(false)}
        formType="consultation"
      />
      <LeadFormModal 
        isOpen={strategyModalOpen}
        onClose={() => setStrategyModalOpen(false)}
        formType="strategy"
      />
      <LeadFormModal 
        isOpen={serviceModalOpen}
        onClose={() => setServiceModalOpen(false)}
        formType="discuss_project"
      />


    </>
  );
}
