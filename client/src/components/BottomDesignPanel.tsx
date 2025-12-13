import { useState } from "react";
import { Image, Video, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  };
  onSettingsChange: (newSettings: Partial<BottomDesignPanelProps["settings"]>) => void;
  quizId: number;
}

export default function BottomDesignPanel({
  settings,
  onSettingsChange,
  quizId,
}: BottomDesignPanelProps) {
  const [showBackgroundUploader, setShowBackgroundUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");

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
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      fontFamily: settings.fontFamily,
      titleText: settings.title,
      subtitleText: settings.subtitle,
      buttonText: settings.buttonText,
      bonusText: undefined,
    });
  };

  return (
    <>
      {/* Bottom Fixed Panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-zinc-800 border-t border-zinc-700 px-6 py-4 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
          {/* Фон Section */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Фон</span>
            <div className="flex gap-2">
              <Button
                variant={uploadType === "image" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setUploadType("image");
                  setShowBackgroundUploader(true);
                }}
                className="gap-2"
              >
                <Image className="w-4 h-4" />
                Изображение
              </Button>
              <Button
                variant={uploadType === "video" ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setUploadType("video");
                  setShowBackgroundUploader(true);
                }}
                className="gap-2"
              >
                <Video className="w-4 h-4" />
                Видео
              </Button>
            </div>
          </div>

          {/* Дизайн Section */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Дизайн</span>
            <Select
              value={settings.layoutType}
              onValueChange={(value) =>
                onSettingsChange({ layoutType: value as "standard" | "background" })
              }
            >
              <SelectTrigger className="w-[200px] bg-zinc-700 border-zinc-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Стандартная</SelectItem>
                <SelectItem value="background">Фоновая картинка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Выравнивание Section */}
          <div className="flex flex-col gap-2">
            <span className="text-white text-sm font-medium">Выравнивание</span>
            <div className="flex gap-2">
              <Button
                variant={settings.alignment === "left" ? "default" : "outline"}
                size="icon"
                onClick={() => onSettingsChange({ alignment: "left" })}
              >
                <AlignLeft className="w-4 h-4" />
              </Button>
              <Button
                variant={settings.alignment === "center" ? "default" : "outline"}
                size="icon"
                onClick={() => onSettingsChange({ alignment: "center" })}
              >
                <AlignCenter className="w-4 h-4" />
              </Button>
              <Button
                variant={settings.alignment === "right" ? "default" : "outline"}
                size="icon"
                onClick={() => onSettingsChange({ alignment: "right" })}
              >
                <AlignRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="ml-auto"
          >
            {saveMutation.isPending ? "Сохранение..." : "Сохранить"}
          </Button>
        </div>
      </div>

      {/* Background Uploader Modal */}
      {showBackgroundUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {uploadType === "image" ? "Загрузить изображение" : "Загрузить видео"}
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
                onSettingsChange({ backgroundImage: url, backgroundVideo: "" });
                setShowBackgroundUploader(false);
              }}
              onVideoUploaded={(url: string) => {
                onSettingsChange({ backgroundVideo: url, backgroundImage: "" });
                setShowBackgroundUploader(false);
              }}
              onRemoveImage={() => onSettingsChange({ backgroundImage: "" })}
              onRemoveVideo={() => onSettingsChange({ backgroundVideo: "" })}
            />
          </div>
        </div>
      )}
    </>
  );
}
