import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

interface QuizSettingsPanelProps {
  settings: {
    logoUrl: string;
    companyName: string;
    title: string;
    subtitle: string;
    buttonText: string;
    bonusEnabled: boolean;
    bonusText: string;
    phoneNumber: string;
  };
  onSettingsChange: (key: string, value: any) => void;
  quizId: number;
}

export default function QuizSettingsPanel({
  settings,
  onSettingsChange,
  quizId,
}: QuizSettingsPanelProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadLogoMutation = trpc.quizDesign.uploadLogo.useMutation();

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір файлу не повинен перевищувати 5MB");
      return;
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    setIsUploading(true);
    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const result = await uploadLogoMutation.mutateAsync({
          fileData: base64,
          fileName: file.name,
          mimeType: file.type,
        });
        onSettingsChange("logoUrl", result.url);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Logo upload failed:", error);
      alert("Помилка завантаження логотипу");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full bg-zinc-800 border-l border-zinc-700 p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-white">Налаштування</h2>
      </div>

      {/* Logo Upload */}
      <div className="mb-6">
        <Label>Логотип</Label>
        <div className="mt-2 flex items-center gap-4">
          {settings.logoUrl ? (
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="w-16 h-16 object-contain rounded border"
            />
          ) : (
            <div className="w-16 h-16 bg-zinc-100 rounded border border-dashed border-zinc-300 flex items-center justify-center">
              <Upload className="w-6 h-6 text-zinc-400" />
            </div>
          )}
          <label htmlFor="logo-upload">
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              asChild
            >
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? "Завантаження..." : "Завантажити"}
              </span>
            </Button>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleLogoUpload}
          />
        </div>
      </div>

      {/* Company Name */}
      <div className="mb-6">
        <Label htmlFor="companyName">Назва компанії</Label>
        <Input
          id="companyName"
          value={settings.companyName}
          onChange={(e) => onSettingsChange("companyName", e.target.value)}
          placeholder="Введіть назву компанії"
          className="mt-2"
        />
      </div>

      {/* Title */}
      <div className="mb-6">
        <Label htmlFor="title">Заголовок</Label>
        <Input
          id="title"
          value={settings.title}
          onChange={(e) => onSettingsChange("title", e.target.value)}
          placeholder="Введіть заголовок сторінки"
          className="mt-2"
        />
      </div>

      {/* Subtitle */}
      <div className="mb-6">
        <Label htmlFor="subtitle">Підзаголовок</Label>
        <Textarea
          id="subtitle"
          value={settings.subtitle}
          onChange={(e) => onSettingsChange("subtitle", e.target.value)}
          placeholder="Додатковий текст-опис"
          className="mt-2"
          rows={3}
        />
      </div>

      {/* Button Text */}
      <div className="mb-6">
        <Label htmlFor="buttonText">Текст кнопки</Label>
        <Input
          id="buttonText"
          value={settings.buttonText}
          onChange={(e) => onSettingsChange("buttonText", e.target.value)}
          placeholder="Почати"
          className="mt-2"
        />
      </div>

      {/* Bonus Section */}
      <div className="mb-6 p-4 bg-zinc-50 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <Label htmlFor="bonusEnabled" className="font-semibold">
            Бонус
          </Label>
          <Switch
            id="bonusEnabled"
            checked={settings.bonusEnabled}
            onCheckedChange={(checked) =>
              onSettingsChange("bonusEnabled", checked)
            }
          />
        </div>
        {settings.bonusEnabled && (
          <Textarea
            value={settings.bonusText}
            onChange={(e) => onSettingsChange("bonusText", e.target.value)}
            placeholder="Введіть текст бонусу"
            className="mt-2"
            rows={2}
          />
        )}
      </div>

      {/* Phone Number */}
      <div className="mb-6">
        <Label htmlFor="phoneNumber">Телефон</Label>
        <Input
          id="phoneNumber"
          value={settings.phoneNumber}
          onChange={(e) => onSettingsChange("phoneNumber", e.target.value)}
          placeholder="+380..."
          className="mt-2"
        />
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-zinc-200 text-sm text-zinc-600">
        <p className="mb-1">
          <strong>Телефон:</strong> {settings.phoneNumber || "Не вказано"}
        </p>
        <p>
          <strong>Компанія:</strong> {settings.companyName || "Не вказано"}
        </p>
      </div>
    </div>
  );
}
