import { useState } from "react";
import { useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import QuizSettingsPanel from "@/components/QuizSettingsPanel";
import BottomDesignPanel from "@/components/BottomDesignPanel";

export default function QuizDesignPage() {
  const { quizId } = useParams<{ quizId: string }>();

  const [showSettings, setShowSettings] = useState(true);
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
    layoutType: "standard" as "standard" | "background",
    alignment: "center" as "left" | "center" | "right",
    primaryColor: "#FACC15",
    accentColor: "#A855F7",
    fontFamily: "Inter",
  });

  const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-900">
      {/* Top Progress Tabs */}
      <div className="bg-zinc-800 border-b border-zinc-700 px-6 py-3">
        <div className="flex items-center gap-4">
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg font-medium">
            Стартова
          </button>
          <button className="px-4 py-2 text-zinc-400 hover:text-white font-medium">
            Питання
          </button>
          <button className="px-4 py-2 text-zinc-400 hover:text-white font-medium">
            Контакти
          </button>
          <button className="px-4 py-2 text-zinc-400 hover:text-white font-medium">
            Результати
          </button>
          <button className="px-4 py-2 text-zinc-400 hover:text-white font-medium">
            Спасибо
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview Panel (Left) */}
        <div
          className={`${
            showSettings ? "w-[70%]" : "w-full"
          } bg-zinc-900 p-8 overflow-y-auto transition-all duration-300`}
        >
          {/* Settings Toggle Button */}
          <div className="flex justify-end mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700"
            >
              <Settings className="w-4 h-4 mr-2" />
              Налаштування
            </Button>
          </div>

          {/* Quiz Preview */}
          <div className="max-w-4xl mx-auto">
            {settings.layoutType === "standard" ? (
              // Standard Layout
              <div
                className="min-h-[600px] rounded-lg p-12 flex flex-col justify-center"
                style={{
                  backgroundColor: settings.primaryColor,
                  textAlign: settings.alignment,
                }}
              >
                {/* Logo */}
                {settings.logoUrl && (
                  <div className="mb-4">
                    <img
                      src={settings.logoUrl}
                      alt="Logo"
                      className="h-12 object-contain"
                      style={{
                        marginLeft:
                          settings.alignment === "left"
                            ? "0"
                            : settings.alignment === "right"
                            ? "auto"
                            : "auto",
                        marginRight:
                          settings.alignment === "right"
                            ? "0"
                            : settings.alignment === "left"
                            ? "auto"
                            : "auto",
                      }}
                    />
                  </div>
                )}

                {/* Company Name */}
                {settings.companyName && (
                  <p className="text-sm text-zinc-700 mb-8">
                    {settings.companyName}
                  </p>
                )}

                {/* Title */}
                <h1
                  className="text-4xl font-bold mb-4"
                  style={{ fontFamily: settings.fontFamily }}
                >
                  {settings.title}
                </h1>

                {/* Subtitle */}
                <p className="text-lg text-zinc-700 mb-6">{settings.subtitle}</p>

                {/* Bonus */}
                {settings.bonusEnabled && settings.bonusText && (
                  <div className="mb-6 p-4 bg-white/20 rounded-lg backdrop-blur-sm">
                    <p className="text-sm font-medium">{settings.bonusText}</p>
                  </div>
                )}

                {/* Button */}
                <button
                  className="px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-transform"
                  style={{
                    backgroundColor: settings.accentColor,
                    marginLeft:
                      settings.alignment === "left"
                        ? "0"
                        : settings.alignment === "right"
                        ? "auto"
                        : "auto",
                    marginRight:
                      settings.alignment === "right"
                        ? "0"
                        : settings.alignment === "left"
                        ? "auto"
                        : "auto",
                  }}
                >
                  {settings.buttonText}
                </button>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-700/20">
                  <p className="text-sm text-zinc-700">{settings.phoneNumber}</p>
                  <p className="text-xs text-zinc-600 mt-1 uppercase">
                    {settings.companyName}
                  </p>
                </div>
              </div>
            ) : (
              // Background Layout
              <div
                className="min-h-[600px] rounded-lg flex"
                style={{
                  backgroundImage: settings.backgroundImage
                    ? `url(${settings.backgroundImage})`
                    : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Left: Background Image */}
                <div className="w-1/2 flex items-center justify-center">
                  {!settings.backgroundImage && (
                    <div className="text-zinc-400 text-center">
                      <p>Завантажте фонове зображення</p>
                    </div>
                  )}
                </div>

                {/* Right: Content */}
                <div
                  className="w-1/2 bg-white p-12 flex flex-col justify-center"
                  style={{ textAlign: settings.alignment }}
                >
                  {/* Logo */}
                  {settings.logoUrl && (
                    <div className="mb-4">
                      <img
                        src={settings.logoUrl}
                        alt="Logo"
                        className="h-12 object-contain"
                        style={{
                          marginLeft:
                            settings.alignment === "left"
                              ? "0"
                              : settings.alignment === "right"
                              ? "auto"
                              : "auto",
                          marginRight:
                            settings.alignment === "right"
                              ? "0"
                              : settings.alignment === "left"
                              ? "auto"
                              : "auto",
                        }}
                      />
                    </div>
                  )}

                  {/* Company Name */}
                  {settings.companyName && (
                    <p className="text-sm text-zinc-600 mb-8">
                      {settings.companyName}
                    </p>
                  )}

                  {/* Title */}
                  <h1
                    className="text-3xl font-bold mb-4 text-zinc-900"
                    style={{ fontFamily: settings.fontFamily }}
                  >
                    {settings.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-base text-zinc-600 mb-6">
                    {settings.subtitle}
                  </p>

                  {/* Bonus */}
                  {settings.bonusEnabled && settings.bonusText && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm font-medium text-zinc-900">
                        {settings.bonusText}
                      </p>
                    </div>
                  )}

                  {/* Button */}
                  <button
                    className="px-8 py-4 rounded-full font-semibold text-white shadow-lg hover:scale-105 transition-transform"
                    style={{
                      backgroundColor: settings.accentColor,
                      marginLeft:
                        settings.alignment === "left"
                          ? "0"
                          : settings.alignment === "right"
                          ? "auto"
                          : "auto",
                      marginRight:
                        settings.alignment === "right"
                          ? "0"
                          : settings.alignment === "left"
                          ? "auto"
                          : "auto",
                    }}
                  >
                    {settings.buttonText}
                  </button>

                  {/* Footer */}
                  <div className="mt-12 pt-8 border-t border-zinc-200">
                    <p className="text-sm text-zinc-700">
                      {settings.phoneNumber}
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 uppercase">
                      {settings.companyName}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Settings Panel (Right) */}
        <QuizSettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>

      {/* Bottom Design Panel */}
      <BottomDesignPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
        quizId={parseInt(quizId!)}
      />
    </div>
  );
}
