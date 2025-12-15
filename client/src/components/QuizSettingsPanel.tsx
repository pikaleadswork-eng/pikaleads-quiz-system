import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Upload, X, Globe } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  getTextForLanguage, 
  parseMultilingualText, 
  stringifyMultilingualText,
  type SupportedLanguage,
  type MultilingualText 
} from "@/lib/multilingualText";

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

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "uk", label: "UA", flag: "🇺🇦" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "pl", label: "PL", flag: "🇵🇱" },
  { code: "de", label: "DE", flag: "🇩🇪" },
];

export default function QuizSettingsPanel({
  settings,
  onSettingsChange,
  quizId,
}: QuizSettingsPanelProps) {
  const { language } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<SupportedLanguage>(language as SupportedLanguage || "uk");
  const uploadLogoMutation = trpc.quizDesign.uploadLogo.useMutation();

  // Parse multilingual fields
  const [titleTexts, setTitleTexts] = useState<MultilingualText>(parseMultilingualText(settings.title));
  const [subtitleTexts, setSubtitleTexts] = useState<MultilingualText>(parseMultilingualText(settings.subtitle));

  // Update local state when settings change
  useEffect(() => {
    setTitleTexts(parseMultilingualText(settings.title));
    setSubtitleTexts(parseMultilingualText(settings.subtitle));
  }, [settings.title, settings.subtitle]);

  const handleTitleChange = (lang: SupportedLanguage, value: string) => {
    const newTitles = { ...titleTexts, [lang]: value };
    setTitleTexts(newTitles);
    onSettingsChange("title", stringifyMultilingualText(newTitles));
  };

  const handleSubtitleChange = (lang: SupportedLanguage, value: string) => {
    const newSubtitles = { ...subtitleTexts, [lang]: value };
    setSubtitleTexts(newSubtitles);
    onSettingsChange("subtitle", stringifyMultilingualText(newSubtitles));
  };

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

  // Get display text for current editing language
  const currentTitle = titleTexts[editingLanguage] || "";
  const currentSubtitle = subtitleTexts[editingLanguage] || "";

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
          className="mt-2 bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      {/* Language Selector for Title/Subtitle */}
      <div className="mb-4 p-3 bg-zinc-700/50 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm text-zinc-400">Мова редагування:</span>
        </div>
        <div className="flex gap-1 flex-wrap">
          {LANGUAGES.map(lang => (
            <Button
              key={lang.code}
              variant={editingLanguage === lang.code ? "default" : "outline"}
              size="sm"
              className="h-7 px-2"
              onClick={() => setEditingLanguage(lang.code)}
            >
              {lang.flag} {lang.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="mb-6">
        <Label htmlFor="title">
          Заголовок ({LANGUAGES.find(l => l.code === editingLanguage)?.flag})
        </Label>
        <Input
          id="title"
          value={currentTitle}
          onChange={(e) => handleTitleChange(editingLanguage, e.target.value)}
          placeholder="Введіть заголовок сторінки"
          className="mt-2 bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      {/* Subtitle */}
      <div className="mb-6">
        <Label htmlFor="subtitle">
          Підзаголовок ({LANGUAGES.find(l => l.code === editingLanguage)?.flag})
        </Label>
        <Textarea
          id="subtitle"
          value={currentSubtitle}
          onChange={(e) => handleSubtitleChange(editingLanguage, e.target.value)}
          placeholder="Додатковий текст-опис"
          className="mt-2 bg-zinc-800 border-zinc-700 text-white"
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
          className="mt-2 bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      {/* Bonus Section */}
      <div className="mb-6 p-4 bg-zinc-800 rounded-lg border border-zinc-700">
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
            className="mt-2 bg-zinc-700 border-zinc-600 text-white"
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
          className="mt-2 bg-zinc-800 border-zinc-700 text-white"
        />
      </div>

      {/* Save Button */}
      <SaveSettingsButton quizId={quizId} settings={settings} />
    </div>
  );
}

function SaveSettingsButton({ quizId, settings }: { quizId: number; settings: any }) {
  const saveMutation = trpc.quizDesign.save.useMutation({
    onSuccess: () => {
      // Toast is shown by parent
    },
  });

  const handleSave = () => {
    if (!quizId) return;
    
    saveMutation.mutate({
      quizId,
      layoutType: settings.layoutType || "background",
      backgroundImage: settings.backgroundImage,
      backgroundVideo: settings.backgroundVideo,
      alignment: settings.alignment || "center",
      logoImage: settings.logoUrl,
      primaryColor: settings.primaryColor,
      accentColor: settings.accentColor,
      fontFamily: settings.fontFamily,
      titleText: settings.title,
      subtitleText: settings.subtitle,
      buttonText: settings.buttonText,
      bonusEnabled: settings.bonusEnabled,
      bonusText: settings.bonusText,
      companyName: settings.companyName,
      phoneNumber: settings.phoneNumber,
    });
  };

  return (
    <Button
      onClick={handleSave}
      disabled={saveMutation.isPending || !quizId}
      className="w-full bg-pink-500 hover:bg-pink-600"
    >
      {saveMutation.isPending ? "Збереження..." : "Зберегти"}
    </Button>
  );
}
