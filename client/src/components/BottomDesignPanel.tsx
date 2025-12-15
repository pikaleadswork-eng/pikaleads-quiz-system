import { useState } from "react";
import { Image, Video, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BackgroundUploader } from "@/components/BackgroundUploader";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface BottomDesignPanelProps {
  settings: {
    backgroundImage: string;
    backgroundVideo: string;
    layoutType: "standard" | "background";
    alignment: "left" | "center" | "right";
    primaryColor: string;
    accentColor: string;
    fontFamily: string;
    logoUrl: string;
    companyName: string;
    title: string;
    subtitle: string;
    buttonText: string;
    bonusEnabled: boolean;
    bonusText: string;
    phoneNumber: string;
    backgroundColor?: string;
    backgroundGradient?: string;
  };
  onSettingsChange: (key: string, value: any) => void;
  quizId: number;
}

// Predefined color options
const colorPresets = [
  "#FFD93D", // Yellow
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#A855F7", // Purple
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F97316", // Orange
  "#EC4899", // Pink
  "#1F2937", // Dark
  "#FFFFFF", // White
];

// Predefined gradient options
const gradientPresets = [
  "linear-gradient(135deg, #FFD93D 0%, #FFA500 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
];

export default function BottomDesignPanel({
  settings,
  onSettingsChange,
  quizId,
}: BottomDesignPanelProps) {
  const [showBackgroundUploader, setShowBackgroundUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [backgroundType, setBackgroundType] = useState<"image" | "video" | "color" | "gradient">("image");

  const saveMutation = trpc.quizDesign.save.useMutation({
    onSuccess: () => {
      toast.success("Дизайн збережено");
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      quizId,
      layoutType: settings.layoutType,
      backgroundImage: settings.backgroundImage || undefined,
      backgroundVideo: settings.backgroundVideo || undefined,
      alignment: settings.alignment,
      logoImage: settings.logoUrl || undefined,
      primaryColor: settings.backgroundColor || settings.primaryColor,
      accentColor: settings.accentColor,
      fontFamily: settings.fontFamily,
      titleText: settings.title,
      subtitleText: settings.subtitle,
      buttonText: settings.buttonText,
      bonusText: settings.bonusText || undefined,
      bonusEnabled: settings.bonusEnabled,
      companyName: settings.companyName || undefined,
      phoneNumber: settings.phoneNumber || undefined,
    });
  };

  return (
    <>
      {/* Bottom Fixed Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 px-6 py-4 z-[9999]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Фон Section */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Фон</span>
            <div className="flex gap-2">
              <Button
                variant={backgroundType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setBackgroundType("image");
                  setUploadType("image");
                  setShowBackgroundUploader(true);
                }}
                className="gap-2"
              >
                <Image className="w-4 h-4" />
                Зображення
              </Button>
              <Button
                variant={uploadType === "video" && backgroundType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setBackgroundType("image");
                  setUploadType("video");
                  setShowBackgroundUploader(true);
                }}
                className="gap-2"
              >
                <Video className="w-4 h-4" />
                Відео
              </Button>
              
              {/* Color Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={backgroundType === "color" ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                  >
                    <Palette className="w-4 h-4" />
                    Колір
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-4 bg-zinc-800 border-zinc-700" align="start">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">Однотонний колір</p>
                      <div className="grid grid-cols-5 gap-2">
                        {colorPresets.map((color) => (
                          <button
                            key={color}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              settings.backgroundColor === color
                                ? "border-white scale-110"
                                : "border-transparent hover:border-zinc-500"
                            }`}
                            style={{ backgroundColor: color }}
                            onClick={() => {
                              setBackgroundType("color");
                              onSettingsChange("backgroundColor", color);
                              onSettingsChange("backgroundGradient", "");
                              onSettingsChange("backgroundImage", "");
                            }}
                          />
                        ))}
                      </div>
                      <div className="mt-2">
                        <input
                          type="color"
                          value={settings.backgroundColor || "#FFD93D"}
                          onChange={(e) => {
                            setBackgroundType("color");
                            onSettingsChange("backgroundColor", e.target.value);
                            onSettingsChange("backgroundGradient", "");
                            onSettingsChange("backgroundImage", "");
                          }}
                          className="w-full h-8 rounded cursor-pointer"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-zinc-400 mb-2">Градієнт</p>
                      <div className="grid grid-cols-4 gap-2">
                        {gradientPresets.map((gradient, idx) => (
                          <button
                            key={idx}
                            className={`w-8 h-8 rounded-lg border-2 transition-all ${
                              settings.backgroundGradient === gradient
                                ? "border-white scale-110"
                                : "border-transparent hover:border-zinc-500"
                            }`}
                            style={{ background: gradient }}
                            onClick={() => {
                              setBackgroundType("gradient");
                              onSettingsChange("backgroundGradient", gradient);
                              onSettingsChange("backgroundColor", "");
                              onSettingsChange("backgroundImage", "");
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Дизайн Section */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Дизайн</span>
            <Select
              value={settings.layoutType}
              onValueChange={(value) =>
                onSettingsChange("layoutType", value as "standard" | "background")
              }
            >
              <SelectTrigger className="w-[180px] bg-zinc-700 border-zinc-600 text-white">
                <SelectValue placeholder="Оберіть дизайн" />
              </SelectTrigger>
              <SelectContent className="z-[10000]">
                <SelectItem value="standard">Стандартний</SelectItem>
                <SelectItem value="background">Фонова картинка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Выравнивание Section */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Вирівнювання</span>
            <div className="flex gap-2">
              <Button
                variant={settings.alignment === "left" ? "default" : "outline"}
                size="icon"
                onClick={() => onSettingsChange("alignment", "left")}
                title="Зліва"
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={settings.alignment === "center" ? "default" : "outline"}
                size="icon"
                onClick={() => onSettingsChange("alignment", "center")}
                title="По центру"
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={settings.alignment === "right" ? "default" : "outline"}
                size="icon"
                onClick={() => onSettingsChange("alignment", "right")}
                title="Справа"
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Колір кнопки</span>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={settings.accentColor || "#A855F7"}
                onChange={(e) => onSettingsChange("accentColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-2 border-zinc-600"
              />
              <div 
                className="px-4 py-2 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: settings.accentColor }}
              >
                Кнопка
              </div>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="ml-auto bg-green-600 hover:bg-green-700"
          >
            {saveMutation.isPending ? "Збереження..." : "Зберегти"}
          </Button>
        </div>
      </div>

      {/* Background Uploader Modal */}
      {showBackgroundUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {uploadType === "image" ? "Завантажити зображення" : "Завантажити відео"}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBackgroundUploader(false)}
              >
                ✕
              </Button>
            </div>
            <BackgroundUploader
              currentImage={uploadType === "image" ? settings.backgroundImage : null}
              currentVideo={uploadType === "video" ? settings.backgroundVideo : null}
              quizNiche="furniture"
              onImageUploaded={(url: string) => {
                onSettingsChange("backgroundImage", url);
                onSettingsChange("backgroundVideo", "");
                onSettingsChange("backgroundColor", "");
                onSettingsChange("backgroundGradient", "");
                setShowBackgroundUploader(false);
              }}
              onVideoUploaded={(url: string) => {
                onSettingsChange("backgroundVideo", url);
                onSettingsChange("backgroundImage", "");
                onSettingsChange("backgroundColor", "");
                onSettingsChange("backgroundGradient", "");
                setShowBackgroundUploader(false);
              }}
              onRemoveImage={() => onSettingsChange("backgroundImage", "")}
              onRemoveVideo={() => onSettingsChange("backgroundVideo", "")}
            />
          </div>
        </div>
      )}
    </>
  );
}
