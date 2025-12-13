import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone } from "lucide-react";
import { useState } from "react";

interface QuizDesignSettings {
  layoutType: "standard" | "background";
  backgroundImage?: string;
  backgroundVideo?: string;
  alignment?: "left" | "center" | "right";
  logoImage?: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  titleText?: string;
  subtitleText?: string;
  buttonText?: string;
}

interface QuizPreviewPanelProps {
  settings: QuizDesignSettings;
}

export function QuizPreviewPanel({ settings }: QuizPreviewPanelProps) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  // Alignment classes for content positioning
  const alignmentClasses = {
    left: "items-start text-left justify-start",
    center: "items-center text-center justify-center",
    right: "items-end text-right justify-end",
  };

  const alignment = settings.alignment || "center";
  const isBackgroundLayout = settings.layoutType === "background";

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Превью</h3>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={device === "desktop" ? "default" : "outline"}
            onClick={() => setDevice("desktop")}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant={device === "mobile" ? "default" : "outline"}
            onClick={() => setDevice("mobile")}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div
        className={`
          border-2 border-zinc-700 rounded-lg overflow-hidden
          ${device === "desktop" ? "aspect-video" : "aspect-[9/16] max-w-sm mx-auto"}
        `}
      >
        {/* Standard Layout - Centered content on colored background */}
        {settings.layoutType === "standard" && (
          <div
            className="relative w-full h-full flex flex-col justify-center p-8"
            style={{
              fontFamily: settings.fontFamily,
              backgroundColor: settings.primaryColor || "#18181b",
            }}
          >
            <div className={`flex flex-col gap-4 ${alignmentClasses[alignment]} z-10`}>
              {settings.logoImage && (
                <img src={settings.logoImage} alt="Logo" className="h-12 w-auto object-contain" />
              )}
              {settings.titleText && (
                <h1 className="text-3xl font-bold" style={{ color: "white" }}>
                  {settings.titleText}
                </h1>
              )}
              {settings.subtitleText && (
                <p className="text-lg opacity-90" style={{ color: "white" }}>
                  {settings.subtitleText}
                </p>
              )}
              <Button
                size="lg"
                className="mt-4"
                style={{ backgroundColor: settings.accentColor, color: "white" }}
              >
                {settings.buttonText || "Почати"}
              </Button>
            </div>
          </div>
        )}

        {/* Background Layout - Split screen: content left, background right */}
        {settings.layoutType === "background" && (
          <div className="relative w-full h-full flex">
            {/* Left: Content Area (50%) */}
            <div
              className={`w-1/2 flex flex-col justify-center p-8 ${device === "mobile" ? "w-full" : ""}`}
              style={{
                fontFamily: settings.fontFamily,
                backgroundColor: "#ffffff",
              }}
            >
              <div className={`flex flex-col gap-4 ${alignmentClasses[alignment]}`}>
                {settings.logoImage && (
                  <img src={settings.logoImage} alt="Logo" className="h-12 w-auto object-contain" />
                )}
                {settings.titleText && (
                  <h1 className="text-3xl font-bold" style={{ color: "#000000" }}>
                    {settings.titleText}
                  </h1>
                )}
                {settings.subtitleText && (
                  <p className="text-lg" style={{ color: "#666666" }}>
                    {settings.subtitleText}
                  </p>
                )}
                <Button
                  size="lg"
                  className="mt-4"
                  style={{ backgroundColor: settings.primaryColor, color: "white" }}
                >
                  {settings.buttonText || "Почати"}
                </Button>
              </div>
            </div>

            {/* Right: Background Image (50%) */}
            {device === "desktop" && (
              <div
                className="w-1/2 relative"
                style={{
                  backgroundImage: settings.backgroundImage
                    ? `url(${settings.backgroundImage})`
                    : undefined,
                  backgroundColor: settings.backgroundImage ? undefined : "#27272a",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {settings.backgroundVideo && (
                  <video
                    src={settings.backgroundVideo}
                    autoPlay
                    loop
                    muted
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-zinc-500 mt-2 text-center">
        Превью оновлюється автоматично при зміні налаштувань
      </p>
    </Card>
  );
}
