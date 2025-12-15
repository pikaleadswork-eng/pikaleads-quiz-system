import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { toast } from "sonner";
import QuizSettingsPanel from "@/components/QuizSettingsPanel";
import BottomDesignPanel from "@/components/BottomDesignPanel";
import DraggableQuestionEditor from "@/components/DraggableQuestionEditor";
import { trpc } from "@/lib/trpc";
import type { QuizQuestion } from "@/components/DraggableQuestionEditor";

export default function QuizDesignPage() {
  const { quizId: quizIdParam } = useParams<{ quizId: string }>();
  const quizId = quizIdParam ? parseInt(quizIdParam, 10) : 0;

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
    { id: "results" as const, label: "Результати", icon: "📊" },
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
                      {settings.title}
                    </h1>
                    <p className="text-xl text-white/90 mb-6 max-w-2xl drop-shadow-md">
                      {settings.subtitle}
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
                      {settings.title}
                    </h1>
                    <p className="text-lg text-zinc-600 mb-6">
                      {settings.subtitle}
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
            <div className="bg-zinc-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Форма контактів</h2>
              <p className="text-zinc-400">Тут буде редактор форми збору контактів</p>
            </div>
          )}

          {activeTab === "results" && (
            <div className="bg-zinc-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Сторінка результатів</h2>
              <p className="text-zinc-400">Тут буде редактор сторінки з результатами</p>
            </div>
          )}

          {activeTab === "thanks" && (
            <div className="bg-zinc-800 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Подяка</h2>
              <p className="text-zinc-400">Тут буде редактор сторінки подяки</p>
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
