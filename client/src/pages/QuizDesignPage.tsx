import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { toast } from "sonner";
import QuizSettingsPanel from "@/components/QuizSettingsPanel";
// BottomDesignPanel merged into QuizSettingsPanel
import DraggableQuestionEditor from "@/components/DraggableQuestionEditor";
import { trpc } from "@/lib/trpc";
import type { QuizQuestion } from "@/components/DraggableQuestionEditor";
import { useLanguage } from "@/contexts/LanguageContext";
import { getTextForLanguage, type SupportedLanguage } from "@/lib/multilingualText";

export default function QuizDesignPage() {
  const { quizId: quizIdParam } = useParams<{ quizId: string }>();
  const quizId = quizIdParam ? parseInt(quizIdParam, 10) : 0;
  const { language } = useLanguage();

  const [showSettings, setShowSettings] = useState(true);
  const [activeTab, setActiveTab] = useState<"start" | "questions" | "contacts" | "results" | "thanks">("start");
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [quizName, setQuizName] = useState("");
  const [quizDescription, setQuizDescription] = useState("");

  // Load questions from database
  const { data: loadedQuestions } = trpc.quizDesign.getQuestions.useQuery(
    { quizId: quizId || 0 },
    { enabled: !!quizId }
  );

  // Update local state when questions are loaded
  useEffect(() => {
    if (loadedQuestions) {
      setQuestions(loadedQuestions as QuizQuestion[]);
    }
  }, [loadedQuestions]);

  // Save questions mutation
  const saveQuestionsMutation = trpc.quizDesign.saveQuestions.useMutation({
    onSuccess: () => {
      toast.success("Питання збережено!");
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
    },
  });

  // Update quiz mutation
  const updateQuizMutation = trpc.quizzes.update.useMutation({
    onSuccess: () => {
      toast.success("Дані квізу оновлено!");
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
    },
  });

  // Load quiz data (name, description)
  const { data: quizData } = trpc.quizzes.getById.useQuery(
    { id: quizId || 0 },
    { enabled: !!quizId }
  );

  // Update quiz name and description when loaded
  useEffect(() => {
    if (quizData) {
      setQuizName(quizData.name || "");
      setQuizDescription(quizData.description || "");
    }
  }, [quizData]);

  // Load design settings from database
  const { data: savedSettings } = trpc.quizDesign.getByQuizId.useQuery(
    { quizId: quizId || 0 },
    { enabled: !!quizId }
  );

  const [settings, setSettings] = useState({
    logoUrl: "",
    companyName: "PikaLeads",
    title: "Введіть заголовок сторінки",
    subtitle: "Додатковий текст-опис",
    buttonText: "Почати",
    bonusEnabled: false,
    bonusText: "",
    phoneNumber: "+380992377117",
    backgroundImage: "",
    backgroundVideo: "",
    layoutType: "background" as "background" | "standard",
    alignment: "left" as "left" | "center" | "right",
    backgroundColor: "#FFD93D",
    backgroundGradient: "",
    primaryColor: "#FFD93D",
    accentColor: "#A855F7",
    buttonRadius: "full" as "none" | "sm" | "md" | "lg" | "full",
    buttonRadiusPx: 25,
    bullets: [] as Array<{ id: string; text: string; icon: string }>,
    fontFamily: "Inter",
    titleColor: "#FFFFFF",
    subtitleColor: "#FFFFFF",
    titleWeight: "bold" as "normal" | "medium" | "semibold" | "bold" | "extrabold",
    subtitleWeight: "normal" as "normal" | "medium" | "semibold" | "bold" | "extrabold",
    // Contact form settings
    contactFormTitle: '{"uk":"Залиште свої контакти","ru":"Оставьте свои контакты","en":"Leave your contacts","pl":"Zostaw swoje kontakty","de":"Hinterlassen Sie Ihre Kontakte"}',
    contactFormSubtitle: '{"uk":"Ми зв\'яжемося з вами найближчим часом","ru":"Мы свяжемся с вами в ближайшее время","en":"We will contact you shortly","pl":"Skontaktujemy się z Tobą wkrótce","de":"Wir werden uns in Kürze bei Ihnen melden"}',
    contactFormFields: '["name", "phone", "email"]',
    // Thank you page settings
    thankYouTitle: '{"uk":"Дякуємо за вашу заявку!","ru":"Спасибо за вашу заявку!","en":"Thank you for your application!","pl":"Dziękujemy za zgłoszenie!","de":"Vielen Dank für Ihre Bewerbung!"}',
    thankYouSubtitle: '{"uk":"Наш менеджер зв\'яжеться з вами найближчим часом","ru":"Наш менеджер свяжется с вами в ближайшее время","en":"Our manager will contact you shortly","pl":"Nasz menedżer skontaktuje się z Tobą wkrótce","de":"Unser Manager wird sich in Kürze bei Ihnen melden"}',
    thankYouButtonText: '{"uk":"На головну","ru":"На главную","en":"To main page","pl":"Na stronę główną","de":"Zur Hauptseite"}',
    thankYouButtonUrl: '/',
  });

  // Load saved settings when available
  useEffect(() => {
    if (savedSettings) {
      setSettings(prev => ({
        ...prev,
        logoUrl: savedSettings.logoImage || "",
        companyName: savedSettings.companyName || "PikaLeads",
        title: savedSettings.titleText || "Введіть заголовок сторінки",
        subtitle: savedSettings.subtitleText || "Додатковий текст-опис",
        buttonText: savedSettings.buttonText || "Почати",
        bonusEnabled: savedSettings.bonusEnabled || false,
        bonusText: savedSettings.bonusText || "",
        phoneNumber: savedSettings.phoneNumber || "+380992377117",
        backgroundImage: savedSettings.backgroundImage || "",
        backgroundVideo: savedSettings.backgroundVideo || "",
        layoutType: (savedSettings.layoutType as "background" | "standard") || "background",
        alignment: (savedSettings.alignment as "left" | "center" | "right") || "left",
        backgroundColor: savedSettings.primaryColor || "#FFD93D",
        backgroundGradient: "",
        primaryColor: savedSettings.primaryColor || "#FFD93D",
        accentColor: savedSettings.accentColor || "#A855F7",
        fontFamily: savedSettings.fontFamily || "Inter",
        titleColor: savedSettings.titleColor || "#FFFFFF",
        subtitleColor: savedSettings.subtitleColor || "#FFFFFF",
        titleWeight: (savedSettings.titleWeight as "normal" | "medium" | "semibold" | "bold" | "extrabold") || "bold",
        subtitleWeight: (savedSettings.subtitleWeight as "normal" | "medium" | "semibold" | "bold" | "extrabold") || "normal",
        // Contact form settings
        contactFormTitle: savedSettings.contactFormTitle || settings.contactFormTitle,
        contactFormSubtitle: savedSettings.contactFormSubtitle || settings.contactFormSubtitle,
        contactFormFields: savedSettings.contactFormFields || settings.contactFormFields,
        // Thank you page settings
        thankYouTitle: savedSettings.thankYouTitle || settings.thankYouTitle,
        thankYouSubtitle: savedSettings.thankYouSubtitle || settings.thankYouSubtitle,
        thankYouButtonText: savedSettings.thankYouButtonText || settings.thankYouButtonText,
        thankYouButtonUrl: savedSettings.thankYouButtonUrl || settings.thankYouButtonUrl,
      }));
    }
  }, [savedSettings]);

  const handleSettingsChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "start" as const, label: "Стартова", icon: "🏠" },
    { id: "questions" as const, label: "Питання", icon: "❓" },
    { id: "contacts" as const, label: "Контакти", icon: "📞" },
    { id: "thanks" as const, label: "Спасибо", icon: "🎉" },
  ];

  return (
    <div className="h-screen bg-zinc-900 flex flex-col overflow-hidden">
      {/* Top Tabs */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-3 flex items-center gap-4">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-pink-500 text-white"
                : "bg-zinc-700 text-zinc-300 hover:bg-zinc-600"
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
        
        {/* Mobile Preview Toggle */}
        <button
          onClick={() => setIsMobilePreview(!isMobilePreview)}
          className={`ml-auto px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
            isMobilePreview 
              ? "bg-purple-600 text-white" 
              : "bg-zinc-700 text-white hover:bg-zinc-600"
          }`}
        >
          <span>📱</span>
          Мобільний
        </button>
        
        {/* Settings Toggle Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 flex items-center gap-2"
        >
          <span>⚙️</span>
          Налаштування
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Panel (Left - 70%) - Fixed, no scroll */}
        <div className="flex-1 p-6 flex items-center justify-center bg-zinc-900/50 overflow-hidden">
          {/* Mobile Preview Wrapper */}
          <div 
            className={`transition-all duration-300 ${
              isMobilePreview 
                ? "w-[375px] h-[667px] max-h-[667px] rounded-[40px] border-8 border-zinc-700 shadow-2xl overflow-y-auto bg-white flex-shrink-0" 
                : "w-full h-full max-h-full overflow-hidden"
            }`}
          >
          {activeTab === "start" && (
            <div className="w-full h-full">
              {/* BACKGROUND LAYOUT - Fullscreen image with text overlay */}
              {settings.layoutType === "background" && (
                <div 
                  className="relative w-full h-full overflow-hidden"
                  style={{
                    backgroundImage: settings.backgroundImage 
                      ? `url(${settings.backgroundImage})` 
                      : settings.backgroundGradient 
                        ? settings.backgroundGradient 
                        : "none",
                    backgroundColor: !settings.backgroundImage && !settings.backgroundGradient 
                      ? (settings.backgroundColor || "#FFD93D") 
                      : "transparent",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Logo */}
                  {settings.logoUrl && (
                    <div className="absolute top-8 left-8">
                      <img src={settings.logoUrl} alt="Logo" className="h-12 w-auto" />
                    </div>
                  )}
                  
                  {/* Company Name */}
                  {settings.companyName && (
                    <div className="absolute top-8 right-8">
                      <p className="text-lg font-semibold text-zinc-800">{settings.companyName}</p>
                    </div>
                  )}

                  {/* Content Overlay */}
                  <div 
                    className={`absolute inset-0 flex flex-col justify-center px-16 ${
                      settings.alignment === "left" ? "items-start text-left" :
                      settings.alignment === "right" ? "items-end text-right" :
                      "items-center text-center"
                    }`}
                  >
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                      {getTextForLanguage(settings.title, language as SupportedLanguage || "uk")}
                    </h1>
                    <p className="text-xl text-white/90 mb-6 max-w-2xl drop-shadow-md">
                      {getTextForLanguage(settings.subtitle, language as SupportedLanguage || "uk")}
                    </p>
                    
                    {/* Bonus - styled like Marquiz */}
                    {settings.bonusEnabled && settings.bonusText && (
                      <div className="flex items-center gap-3 bg-gradient-to-r from-yellow-400/90 to-orange-400/90 px-6 py-4 rounded-xl mb-6 shadow-lg">
                        <span className="text-2xl">🎁</span>
                        <p className="text-white font-bold text-lg">{settings.bonusText}</p>
                      </div>
                    )}

                    {/* Bullets/Features */}
                    {settings.bullets && settings.bullets.length > 0 && (
                      <div className="flex flex-col gap-3 mb-6">
                        {settings.bullets.map((bullet) => (
                          <div key={bullet.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-3 rounded-lg">
                            <span className="text-xl">{bullet.icon || '✓'}</span>
                            <span className="text-white font-medium">{bullet.text}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Button with customizable radius */}
                    <button 
                      className="px-12 py-4 font-semibold text-lg shadow-xl transition-transform hover:scale-105"
                      style={{ 
                        borderRadius: `${settings.buttonRadiusPx || 25}px`,
                        backgroundColor: settings.accentColor, 
                        color: "white" 
                      }}
                    >
                      {settings.buttonText}
                    </button>
                  </div>

                  {/* Footer */}
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center text-white/80">
                    <p className="text-sm">{settings.phoneNumber}</p>
                    <p className="text-sm uppercase font-semibold">{settings.companyName}</p>
                  </div>
                </div>
              )}

              {/* STANDARD LAYOUT - 50/50 split on desktop, vertical stack on mobile */}
              {settings.layoutType === "standard" && (
                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex flex-col lg:flex-row">
                  {/* Swap order based on alignment: right = image first, left/center = text first */}
                  {settings.alignment === "right" && (
                    <>
                      {/* Image on TOP for mobile, LEFT for desktop when alignment is RIGHT */}
                      <div className="flex flex-1 relative overflow-hidden order-1 lg:order-1 h-64 lg:h-auto">
                        <img 
                          src={settings.backgroundImage || "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Cpath fill=%22%23a0aec0%22 d=%22M0 0h200v200H0z%22/%3E%3Cpath fill=%22%23cbd5e0%22 d=%22M50 50l50 30 50-30v70l-50 30-50-30z%22/%3E%3C/svg%3E')"}
                          alt="Quiz illustration"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      {/* Text on BOTTOM for mobile, RIGHT for desktop */}
                      <div className="flex-1 flex items-center justify-center lg:justify-end p-6 lg:p-16 order-2 lg:order-2">
                        <div className="max-w-xl text-center lg:text-right">
                      <h1 
                        className="text-2xl md:text-4xl lg:text-6xl mb-4 lg:mb-6 leading-tight"
                        style={{ 
                          fontFamily: settings.fontFamily || 'Inter',
                          color: settings.titleColor || '#FFFFFF',
                          fontWeight: settings.titleWeight === 'normal' ? 400 :
                                     settings.titleWeight === 'medium' ? 500 :
                                     settings.titleWeight === 'semibold' ? 600 :
                                     settings.titleWeight === 'bold' ? 700 :
                                     settings.titleWeight === 'extrabold' ? 800 : 700
                        }}
                      >
                        {getTextForLanguage(settings.title, language as SupportedLanguage || "uk")}
                      </h1>
                      <p 
                        className="text-base md:text-xl lg:text-2xl mb-6 lg:mb-10 leading-relaxed"
                        style={{ 
                          fontFamily: settings.fontFamily || 'Inter',
                          color: settings.subtitleColor || '#FFFFFF',
                          fontWeight: settings.subtitleWeight === 'normal' ? 400 :
                                     settings.subtitleWeight === 'medium' ? 500 :
                                     settings.subtitleWeight === 'semibold' ? 600 :
                                     settings.subtitleWeight === 'bold' ? 700 :
                                     settings.subtitleWeight === 'extrabold' ? 800 : 400
                        }}
                      >
                        {getTextForLanguage(settings.subtitle, language as SupportedLanguage || "uk")}
                      </p>

                      {/* Bonus */}
                      {settings.bonusEnabled && settings.bonusText && (
                        <div className="flex items-center justify-center lg:justify-end gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 lg:px-5 py-2 lg:py-3 rounded-xl mb-4 lg:mb-6 shadow-md">
                          <span className="text-xl">🎁</span>
                          <p className="text-white font-bold">{settings.bonusText}</p>
                        </div>
                      )}

                      {/* Bullets */}
                      {settings.bullets && settings.bullets.length > 0 && (
                        <div className="flex flex-col gap-2 mb-6 items-end">
                          {settings.bullets.map((bullet) => (
                            <div key={bullet.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                              <span className="text-lg">{bullet.icon || '✓'}</span>
                              <span className="text-white font-medium">{bullet.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      <button 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-xl shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300"
                        style={{
                          borderRadius: `${settings.buttonRadiusPx || 25}px`
                        }}
                      >
                        {settings.buttonText}
                      </button>
                    </div>
                  </div>
                    </>
                  )}
                  
                  {/* Normal order for left/center alignment */}
                  {(settings.alignment === "left" || settings.alignment === "center") && (
                    <>
                      {/* Text on TOP for mobile, LEFT for desktop */}
                      <div className={`flex-1 flex items-center p-6 lg:p-16 order-2 lg:order-1 ${
                        settings.alignment === "left" ? "justify-start" : "justify-center"
                      }`}>
                        <div className={`max-w-xl ${
                          settings.alignment === "left" ? "text-left" : "text-center"
                        }`}>
                          <h1 
                            className="text-2xl md:text-4xl lg:text-6xl mb-4 lg:mb-6 leading-tight"
                            style={{ 
                              fontFamily: settings.fontFamily || 'Inter',
                              color: settings.titleColor || '#FFFFFF',
                              fontWeight: settings.titleWeight === 'normal' ? 400 :
                                         settings.titleWeight === 'medium' ? 500 :
                                         settings.titleWeight === 'semibold' ? 600 :
                                         settings.titleWeight === 'bold' ? 700 :
                                         settings.titleWeight === 'extrabold' ? 800 : 700
                            }}
                          >
                            {getTextForLanguage(settings.title, language as SupportedLanguage || "uk")}
                          </h1>
                          <p 
                            className="text-base md:text-xl lg:text-2xl mb-6 lg:mb-10 leading-relaxed"
                            style={{ 
                              fontFamily: settings.fontFamily || 'Inter',
                              color: settings.subtitleColor || '#FFFFFF',
                              fontWeight: settings.subtitleWeight === 'normal' ? 400 :
                                         settings.subtitleWeight === 'medium' ? 500 :
                                         settings.subtitleWeight === 'semibold' ? 600 :
                                         settings.subtitleWeight === 'bold' ? 700 :
                                         settings.subtitleWeight === 'extrabold' ? 800 : 400
                            }}
                          >
                            {getTextForLanguage(settings.subtitle, language as SupportedLanguage || "uk")}
                          </p>

                          {/* Bonus */}
                          {settings.bonusEnabled && settings.bonusText && (
                            <div className={`flex items-center gap-3 bg-gradient-to-r from-yellow-400 to-orange-400 px-5 py-3 rounded-xl mb-6 shadow-md ${
                              settings.alignment === "center" ? "justify-center" : ""
                            }`}>
                              <span className="text-xl">🎁</span>
                              <p className="text-white font-bold">{settings.bonusText}</p>
                            </div>
                          )}

                          {/* Bullets */}
                          {settings.bullets && settings.bullets.length > 0 && (
                            <div className={`flex flex-col gap-2 mb-6 ${
                              settings.alignment === "center" ? "items-center" :
                              settings.alignment === "left" ? "items-start" : "items-start"
                            }`}>
                              {settings.bullets.map((bullet) => (
                                <div key={bullet.id} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                                  <span className="text-lg">{bullet.icon || '✓'}</span>
                                  <span className="text-white font-medium">{bullet.text}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          <button 
                            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold px-8 lg:px-12 py-4 lg:py-6 text-base lg:text-xl shadow-lg shadow-yellow-500/30 transform hover:scale-105 transition-all duration-300"
                            style={{
                              borderRadius: `${settings.buttonRadiusPx || 25}px`
                            }}
                          >
                            {settings.buttonText}
                          </button>
                        </div>
                      </div>
                      
                      {/* Image on TOP for mobile, RIGHT for desktop - fills entire right half */}
                      <div className="flex flex-1 relative overflow-hidden order-1 lg:order-2 h-64 lg:h-auto">
                        <img 
                          src={settings.backgroundImage}
                          alt="Quiz illustration"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "questions" && (
            <div className="bg-zinc-800 rounded-lg p-6 overflow-y-auto max-h-full">
              <DraggableQuestionEditor
                quizId={String(quizId)}
                initialQuestions={questions}
                onSave={(updatedQuestions) => {
                  setQuestions(updatedQuestions);
                  if (!quizId) {
                    toast.error("Квіз не знайдено в базі даних. Створіть квіз спочатку.");
                    return;
                  }
                  saveQuestionsMutation.mutate({
                    quizId,
                    questions: updatedQuestions,
                  });
                }}
                onOpenTemplateLibrary={() => {
                  // TODO: Open template library modal
                }}
              />
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="flex gap-8 h-full">
              {/* Preview (Left) */}
              <div className="flex-1 bg-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center">
                <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold text-zinc-800 mb-2 text-center">
                    {getTextForLanguage(settings.contactFormTitle, language as SupportedLanguage || "uk")}
                  </h2>
                  <p className="text-zinc-500 mb-6 text-center">
                    {getTextForLanguage(settings.contactFormSubtitle, language as SupportedLanguage || "uk")}
                  </p>
                  
                  <div className="space-y-4">
                    {(() => {
                      const fields = JSON.parse(settings.contactFormFields || '[]');
                      return (
                        <>
                          {fields.includes('name') && (
                            <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Ім'я</label>
                              <input type="text" placeholder="Ваше ім'я" className="w-full px-4 py-3 border border-zinc-300 rounded-lg" disabled />
                            </div>
                          )}
                          {fields.includes('phone') && (
                            <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Телефон</label>
                              <input type="tel" placeholder="+380..." className="w-full px-4 py-3 border border-zinc-300 rounded-lg" disabled />
                            </div>
                          )}
                          {fields.includes('email') && (
                            <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Email</label>
                              <input type="email" placeholder="email@example.com" className="w-full px-4 py-3 border border-zinc-300 rounded-lg" disabled />
                            </div>
                          )}
                          {fields.includes('telegram') && (
                            <div>
                              <label className="block text-sm font-medium text-zinc-700 mb-1">Telegram</label>
                              <input type="text" placeholder="@username" className="w-full px-4 py-3 border border-zinc-300 rounded-lg" disabled />
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  
                  <button 
                    className="w-full mt-6 py-3 rounded-lg font-semibold text-white"
                    style={{ backgroundColor: settings.accentColor }}
                    disabled
                  >
                    Надіслати
                  </button>
                </div>
              </div>
              
              {/* Editor (Right) */}
              <div className="w-80 bg-zinc-900 rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">Налаштування форми</h3>
                
                {/* Language selector */}
                <div className="flex gap-1">
                  {['uk', 'ru', 'en', 'pl', 'de'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleSettingsChange('editLanguage', lang)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        (settings as any).editLanguage === lang || (!((settings as any).editLanguage) && lang === 'uk')
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={getTextForLanguage(settings.contactFormTitle, ((settings as any).editLanguage || 'uk') as SupportedLanguage)}
                    onChange={(e) => {
                      const lang = (settings as any).editLanguage || 'uk';
                      const current = JSON.parse(settings.contactFormTitle || '{}');
                      current[lang] = e.target.value;
                      handleSettingsChange('contactFormTitle', JSON.stringify(current));
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Підзаголовок</label>
                  <textarea
                    value={getTextForLanguage(settings.contactFormSubtitle, ((settings as any).editLanguage || 'uk') as SupportedLanguage)}
                    onChange={(e) => {
                      const lang = (settings as any).editLanguage || 'uk';
                      const current = JSON.parse(settings.contactFormSubtitle || '{}');
                      current[lang] = e.target.value;
                      handleSettingsChange('contactFormSubtitle', JSON.stringify(current));
                    }}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-2">Поля форми</label>
                  <div className="space-y-2">
                    {[{id: 'name', label: "Ім'я"}, {id: 'phone', label: 'Телефон'}, {id: 'email', label: 'Email'}, {id: 'telegram', label: 'Telegram'}].map((field) => {
                      const fields = JSON.parse(settings.contactFormFields || '[]');
                      const isEnabled = fields.includes(field.id);
                      return (
                        <label key={field.id} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isEnabled}
                            onChange={(e) => {
                              let newFields = [...fields];
                              if (e.target.checked) {
                                newFields.push(field.id);
                              } else {
                                newFields = newFields.filter(f => f !== field.id);
                              }
                              handleSettingsChange('contactFormFields', JSON.stringify(newFields));
                            }}
                            className="w-4 h-4 rounded border-zinc-600 bg-zinc-800 text-yellow-500 focus:ring-yellow-500"
                          />
                          <span className="text-zinc-300">{field.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "thanks" && (
            <div className="flex gap-8 h-full min-h-[500px]">
              {/* Preview (Left) - Marquiz Style */}
              <div className="flex-1 rounded-lg overflow-hidden relative min-h-[500px]" style={{ background: settings.backgroundGradient || settings.backgroundColor || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                {/* Background Image Overlay */}
                {settings.backgroundImage && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url(${settings.backgroundImage})` }}
                  />
                )}
                
                {/* Content */}
                <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center">
                  {/* Animated Confetti Effect */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-3 h-3 rounded-full animate-pulse"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                          backgroundColor: ['#FFD93D', '#FF6B6B', '#4ECDC4', '#A855F7', '#3B82F6'][i % 5],
                          opacity: 0.6,
                          animationDelay: `${i * 0.1}s`,
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Success Icon - Marquiz Style */}
                  <div className="relative mb-8">
                    <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/30">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    {/* Glow Effect */}
                    <div className="absolute inset-0 w-28 h-28 rounded-full bg-green-400/30 blur-xl" />
                  </div>
                  
                  {/* Title */}
                  <h2 
                    className="text-4xl font-bold mb-4 drop-shadow-lg"
                    style={{ 
                      color: settings.titleColor || '#FFFFFF',
                      fontFamily: settings.fontFamily || 'Inter',
                      fontWeight: settings.titleWeight === 'extrabold' ? 800 : settings.titleWeight === 'bold' ? 700 : settings.titleWeight === 'semibold' ? 600 : settings.titleWeight === 'medium' ? 500 : 400
                    }}
                  >
                    {getTextForLanguage(settings.thankYouTitle, language as SupportedLanguage || "uk")}
                  </h2>
                  
                  {/* Subtitle */}
                  <p 
                    className="text-xl mb-8 max-w-md opacity-90"
                    style={{ 
                      color: settings.subtitleColor || '#FFFFFF',
                      fontFamily: settings.fontFamily || 'Inter'
                    }}
                  >
                    {getTextForLanguage(settings.thankYouSubtitle, language as SupportedLanguage || "uk")}
                  </p>
                  
                  {/* Bonus Badge */}
                  {settings.bonusEnabled && settings.bonusText && (
                    <div className="mb-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg shadow-orange-500/30">
                      <span className="text-black font-bold flex items-center gap-2">
                        <span className="text-xl">🎁</span>
                        {settings.bonusText}
                      </span>
                    </div>
                  )}
                  
                  {/* CTA Button */}
                  {settings.thankYouButtonUrl && (
                    <button 
                      className="px-10 py-4 font-bold text-lg shadow-xl transition-transform hover:scale-105"
                      style={{ 
                        backgroundColor: settings.accentColor || '#A855F7',
                        borderRadius: settings.buttonRadius === 'none' ? '0' : settings.buttonRadius === 'sm' ? '4px' : settings.buttonRadius === 'md' ? '8px' : settings.buttonRadius === 'lg' ? '16px' : '9999px',
                        color: '#FFFFFF'
                      }}
                      disabled
                    >
                      {getTextForLanguage(settings.thankYouButtonText, language as SupportedLanguage || "uk")}
                    </button>
                  )}
                  
                  {/* Social Proof */}
                  <div className="mt-8 flex items-center gap-3 text-white/70">
                    <div className="flex -space-x-2">
                      {['😊', '🎉', '✨'].map((emoji, i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                          {emoji}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm">Дякуємо за довіру!</span>
                  </div>
                </div>
              </div>
              
              {/* Editor (Right) */}
              <div className="w-80 bg-zinc-900 rounded-lg p-6 space-y-6">
                <h3 className="text-lg font-semibold text-white">Налаштування подяки</h3>
                
                {/* Language selector */}
                <div className="flex gap-1">
                  {['uk', 'ru', 'en', 'pl', 'de'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => handleSettingsChange('editLanguage', lang)}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        (settings as any).editLanguage === lang || (!((settings as any).editLanguage) && lang === 'uk')
                          ? 'bg-yellow-500 text-black' 
                          : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Заголовок</label>
                  <input
                    type="text"
                    value={getTextForLanguage(settings.thankYouTitle, ((settings as any).editLanguage || 'uk') as SupportedLanguage)}
                    onChange={(e) => {
                      const lang = (settings as any).editLanguage || 'uk';
                      const current = JSON.parse(settings.thankYouTitle || '{}');
                      current[lang] = e.target.value;
                      handleSettingsChange('thankYouTitle', JSON.stringify(current));
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Підзаголовок</label>
                  <textarea
                    value={getTextForLanguage(settings.thankYouSubtitle, ((settings as any).editLanguage || 'uk') as SupportedLanguage)}
                    onChange={(e) => {
                      const lang = (settings as any).editLanguage || 'uk';
                      const current = JSON.parse(settings.thankYouSubtitle || '{}');
                      current[lang] = e.target.value;
                      handleSettingsChange('thankYouSubtitle', JSON.stringify(current));
                    }}
                    rows={2}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Текст кнопки</label>
                  <input
                    type="text"
                    value={getTextForLanguage(settings.thankYouButtonText, ((settings as any).editLanguage || 'uk') as SupportedLanguage)}
                    onChange={(e) => {
                      const lang = (settings as any).editLanguage || 'uk';
                      const current = JSON.parse(settings.thankYouButtonText || '{}');
                      current[lang] = e.target.value;
                      handleSettingsChange('thankYouButtonText', JSON.stringify(current));
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-zinc-400 mb-1">Посилання кнопки</label>
                  <input
                    type="text"
                    value={settings.thankYouButtonUrl || ''}
                    onChange={(e) => handleSettingsChange('thankYouButtonUrl', e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white"
                  />
                </div>
              </div>
            </div>
          )}
          </div>{/* End Mobile Preview Wrapper */}
        </div>

        {/* Settings Panel (Right - 30%) - Scrollable */}
        {showSettings && (
          <div className="w-[30%] border-l border-zinc-700 overflow-y-auto h-full">
            <QuizSettingsPanel
              quizName={quizName}
              quizDescription={quizDescription}
              onQuizNameChange={setQuizName}
              onQuizDescriptionChange={setQuizDescription}
              settings={settings}
              onSettingsChange={handleSettingsChange}
              quizId={quizId || 0}
            />
          </div>
        )}
      </div>

      {/* Bottom panel removed - all controls now in sidebar */}
    </div>
  );
}
