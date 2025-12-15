import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { toast } from "sonner";
import QuizSettingsPanel from "@/components/QuizSettingsPanel";
import BottomDesignPanel from "@/components/BottomDesignPanel";
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
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

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
    alignment: "center" as "left" | "center" | "right",
    primaryColor: "#FFD93D",
    accentColor: "#A855F7",
    fontFamily: "Inter",
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
        alignment: (savedSettings.alignment as "left" | "center" | "right") || "center",
        primaryColor: savedSettings.primaryColor || "#FFD93D",
        accentColor: savedSettings.accentColor || "#A855F7",
        fontFamily: savedSettings.fontFamily || "Inter",
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
    <div className="min-h-screen bg-zinc-900 flex flex-col">
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
        
        {/* Settings Toggle Button */}
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="ml-auto px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 flex items-center gap-2"
        >
          <span>⚙️</span>
          Налаштування
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Panel (Left - 70%) */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === "start" && (
            <div className="w-full h-full">
              {/* BACKGROUND LAYOUT - Fullscreen image with text overlay */}
              {settings.layoutType === "background" && (
                <div 
                  className="relative w-full h-full rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : "linear-gradient(135deg, #FFD93D 0%, #FFA500 100%)",
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
                    
                    {/* Bonus */}
                    {settings.bonusEnabled && settings.bonusText && (
                      <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg mb-6">
                        <p className="text-white font-medium">{settings.bonusText}</p>
                      </div>
                    )}

                    {/* Button */}
                    <button 
                      className="px-12 py-4 rounded-full font-semibold text-lg shadow-xl transition-transform hover:scale-105"
                      style={{ backgroundColor: settings.accentColor, color: "white" }}
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

              {/* STANDARD LAYOUT - 50/50 split */}
              {settings.layoutType === "standard" && (
                <div className={`flex h-full rounded-lg overflow-hidden ${
                  settings.alignment === "right" ? "flex-row-reverse" : ""
                }`}>
                  {/* Image Side (50%) */}
                  <div 
                    className="w-1/2 bg-cover bg-center"
                    style={{
                      backgroundImage: settings.backgroundImage 
                        ? `url(${settings.backgroundImage})` 
                        : "url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 200 200%22%3E%3Cpath fill=%22%23a0aec0%22 d=%22M0 0h200v200H0z%22/%3E%3Cpath fill=%22%23cbd5e0%22 d=%22M50 50l50 30 50-30v70l-50 30-50-30z%22/%3E%3C/svg%3E')",
                    }}
                  />

                  {/* Text Side (50%) */}
                  <div className="w-1/2 bg-white flex flex-col justify-center px-12">
                    {/* Logo */}
                    {settings.logoUrl && (
                      <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto mb-6" />
                    )}

                    <h1 className="text-4xl font-bold text-zinc-800 mb-4">
                      {getTextForLanguage(settings.title, language as SupportedLanguage || "uk")}
                    </h1>
                    <p className="text-lg text-zinc-600 mb-6">
                      {getTextForLanguage(settings.subtitle, language as SupportedLanguage || "uk")}
                    </p>

                    {/* Bonus */}
                    {settings.bonusEnabled && settings.bonusText && (
                      <div className="bg-yellow-100 border-l-4 border-yellow-500 px-4 py-3 mb-6">
                        <p className="text-yellow-800 font-medium">{settings.bonusText}</p>
                      </div>
                    )}

                    {/* Button */}
                    <button 
                      className="px-10 py-3 rounded-full font-semibold shadow-lg transition-transform hover:scale-105 self-start"
                      style={{ backgroundColor: settings.accentColor, color: "white" }}
                    >
                      {settings.buttonText}
                    </button>

                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-zinc-200">
                      <p className="text-sm text-zinc-500">{settings.phoneNumber}</p>
                      <p className="text-sm text-zinc-400 uppercase font-semibold">{settings.companyName}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "questions" && (
            <div className="bg-zinc-800 rounded-lg p-6">
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
            <div className="flex gap-8 h-full">
              {/* Preview (Left) */}
              <div className="flex-1 bg-zinc-800 rounded-lg p-8 flex flex-col items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">
                    {getTextForLanguage(settings.thankYouTitle, language as SupportedLanguage || "uk")}
                  </h2>
                  <p className="text-xl text-zinc-400 mb-8">
                    {getTextForLanguage(settings.thankYouSubtitle, language as SupportedLanguage || "uk")}
                  </p>
                  {settings.thankYouButtonUrl && (
                    <button 
                      className="px-8 py-3 rounded-lg font-semibold text-white"
                      style={{ backgroundColor: settings.accentColor }}
                      disabled
                    >
                      {getTextForLanguage(settings.thankYouButtonText, language as SupportedLanguage || "uk")}
                    </button>
                  )}
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
        </div>

        {/* Settings Panel (Right - 30%) */}
        {showSettings && (
          <div className="w-[30%] border-l border-zinc-700">
            <QuizSettingsPanel
              settings={settings}
              onSettingsChange={handleSettingsChange}
              quizId={quizId || 0}
            />
          </div>
        )}
      </div>

      {/* Bottom Design Panel */}
      <BottomDesignPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
        quizId={quizId || 0}
      />
    </div>
  );
}
