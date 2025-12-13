import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";
import BottomDesignPanel from "@/components/BottomDesignPanel";

export default function QuizDesignPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const [settings, setSettings] = useState({
    backgroundImage: "",
    backgroundVideo: "",
    layoutType: "standard" as "standard" | "background",
    alignment: "center" as "left" | "center" | "right",
    primaryColor: "#8B5CF6",
    accentColor: "#FFD93D",
    fontFamily: "Inter",
    logoUrl: "",
    companyName: "",
    title: "Введите заголовок страницы",
    subtitle: "Дополнительный текст-описание",
    buttonText: "Начать",
  });

  // Load existing design settings
  const { data: designData, isLoading } = trpc.quizDesign.getByQuizId.useQuery(
    { quizId: parseInt(quizId!) },
    { enabled: !!quizId }
  );

  useEffect(() => {
    if (designData) {
      setSettings({
        backgroundImage: designData.backgroundImage || "",
        backgroundVideo: designData.backgroundVideo || "",
        layoutType: (designData.layoutType as "standard" | "background") || "standard",
        alignment: (designData.alignment as "left" | "center" | "right") || "center",
        primaryColor: designData.primaryColor || "#8B5CF6",
        accentColor: designData.accentColor || "#FFD93D",
        fontFamily: designData.fontFamily || "Inter",
        logoUrl: designData.logoImage || "",
        companyName: "", // Not in schema
        title: designData.titleText || "Введите заголовок страницы",
        subtitle: designData.subtitleText || "Дополнительный текст-описание",
        buttonText: designData.buttonText || "Начать",
      });
    }
  }, [designData]);

  const handleSettingsChange = (newSettings: Partial<typeof settings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  // Alignment classes
  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right",
  };

  // Render actual quiz start page
  return (
    <div className="relative min-h-screen bg-zinc-900 overflow-hidden">
      {/* Quiz Start Page Preview */}
      {settings.layoutType === "standard" ? (
        // Standard layout: centered content with colored background
        <div
          className="min-h-screen flex flex-col justify-center px-8"
          style={{
            backgroundColor: settings.primaryColor,
            fontFamily: settings.fontFamily,
          }}
        >
          <div className={`flex flex-col gap-6 max-w-2xl mx-auto w-full ${alignmentClasses[settings.alignment]}`}>
            {/* Logo */}
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Logo"
                className="w-16 h-16 object-contain"
              />
            )}

            {/* Company Name */}
            {settings.companyName && (
              <p className="text-white/80 text-sm">{settings.companyName}</p>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              {settings.title}
            </h1>

            {/* Subtitle */}
            {settings.subtitle && (
              <p className="text-xl text-white/90">{settings.subtitle}</p>
            )}

            {/* Button */}
            <button
              className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
              style={{
                backgroundColor: settings.accentColor,
                color: "#000",
              }}
            >
              {settings.buttonText}
            </button>
          </div>
        </div>
      ) : (
        // Background layout: split screen (content left, image right)
        <div className="min-h-screen flex flex-col md:flex-row">
          {/* Left side: Content */}
          <div
            className="flex-1 flex flex-col justify-center px-8 md:px-16 bg-white"
            style={{ fontFamily: settings.fontFamily }}
          >
            <div className={`flex flex-col gap-6 max-w-xl ${alignmentClasses[settings.alignment]}`}>
              {/* Logo */}
              {settings.logoUrl && (
                <img
                  src={settings.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 object-contain"
                />
              )}

              {/* Company Name */}
              {settings.companyName && (
                <p className="text-gray-600 text-sm">{settings.companyName}</p>
              )}

              {/* Title */}
              <h1
                className="text-4xl md:text-5xl font-bold"
                style={{ color: settings.primaryColor }}
              >
                {settings.title}
              </h1>

              {/* Subtitle */}
              {settings.subtitle && (
                <p className="text-xl text-gray-700">{settings.subtitle}</p>
              )}

              {/* Button */}
              <button
                className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:scale-105 transition-transform"
                style={{
                  backgroundColor: settings.accentColor,
                  color: "#000",
                }}
              >
                {settings.buttonText}
              </button>
            </div>
          </div>

          {/* Right side: Background Image/Video */}
          <div className="flex-1 relative overflow-hidden">
            {settings.backgroundVideo ? (
              <video
                src={settings.backgroundVideo}
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : settings.backgroundImage ? (
              <img
                src={settings.backgroundImage}
                alt="Background"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600" />
            )}
          </div>
        </div>
      )}

      {/* Bottom Design Panel */}
      <BottomDesignPanel
        settings={settings}
        onSettingsChange={handleSettingsChange}
        quizId={parseInt(quizId!)}
      />
    </div>
  );
}
