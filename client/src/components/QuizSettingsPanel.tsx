import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, X, Globe, Plus, Trash2, GripVertical, Circle, Square, RectangleHorizontal, Image, Video, Palette, AlignLeft, AlignCenter, AlignRight, Type, Bold } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  getTextForLanguage, 
  parseMultilingualText, 
  stringifyMultilingualText,
  type SupportedLanguage,
  type MultilingualText 
} from "@/lib/multilingualText";
import { BackgroundUploader } from "@/components/BackgroundUploader";
import BackgroundGalleryDialog from "@/components/BackgroundGallery";
import { toast } from "sonner";
import { SortableBulletItem } from "@/components/SortableBulletItem";

interface Bullet {
  id: string;
  text: string;
  icon: string;
}

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
    accentColor?: string;
    buttonRadius?: "none" | "sm" | "md" | "lg" | "full";
    buttonRadiusPx?: number;
    bullets?: Bullet[];
    backgroundImage?: string;
    backgroundVideo?: string;
    layoutType?: "standard" | "background";
    alignment?: "left" | "center" | "right";
    backgroundColor?: string;
    backgroundGradient?: string;
    fontFamily?: string;
    titleColor?: string;
    subtitleColor?: string;
    titleWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
    subtitleWeight?: "normal" | "medium" | "semibold" | "bold" | "extrabold";
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

const BULLET_ICONS = [
  { icon: "✓", label: "Галочка" },
  { icon: "⭐", label: "Зірка" },
  { icon: "🎯", label: "Ціль" },
  { icon: "💡", label: "Ідея" },
  { icon: "🚀", label: "Ракета" },
  { icon: "💰", label: "Гроші" },
  { icon: "📈", label: "Графік" },
  { icon: "🔥", label: "Вогонь" },
  { icon: "✨", label: "Блиск" },
  { icon: "👍", label: "Лайк" },
  { icon: "❤️", label: "Серце" },
  { icon: "🎁", label: "Подарунок" },
];

const BUTTON_RADIUS_OPTIONS = [
  { value: "none", label: "Прямі" },
  { value: "sm", label: "S" },
  { value: "md", label: "M" },
  { value: "lg", label: "L" },
  { value: "full", label: "Pill" },
];

const FONT_FAMILIES = [
  { value: "Inter", label: "Inter" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Poppins", label: "Poppins" },
  { value: "Raleway", label: "Raleway" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Oswald", label: "Oswald" },
  { value: "Nunito", label: "Nunito" },
  { value: "Lato", label: "Lato" },
  { value: "Ubuntu", label: "Ubuntu" },
  { value: "Rubik", label: "Rubik" },
  { value: "Work Sans", label: "Work Sans" },
  { value: "Fira Sans", label: "Fira Sans" },
  { value: "Manrope", label: "Manrope" },
  { value: "Space Grotesk", label: "Space Grotesk" },
  { value: "DM Sans", label: "DM Sans" },
  { value: "Outfit", label: "Outfit" },
];

const FONT_WEIGHTS = [
  { value: "normal", label: "Звичайний" },
  { value: "medium", label: "Середній" },
  { value: "semibold", label: "Напівжирний" },
  { value: "bold", label: "Жирний" },
  { value: "extrabold", label: "Дуже жирний" },
];

const COLOR_PRESETS = [
  "#FFFFFF", "#000000", "#FFD93D", "#FF6B6B", "#4ECDC4", 
  "#A855F7", "#3B82F6", "#10B981", "#F97316", "#EC4899",
];

const GRADIENT_PRESETS = [
  "linear-gradient(135deg, #FFD93D 0%, #FFA500 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
];

export default function QuizSettingsPanel({
  settings,
  onSettingsChange,
  quizId,
}: QuizSettingsPanelProps) {
  const { language } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState<SupportedLanguage>(language as SupportedLanguage || "uk");
  const [showBulletIcons, setShowBulletIcons] = useState<string | null>(null);
  const [showBackgroundUploader, setShowBackgroundUploader] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const uploadLogoMutation = trpc.quizDesign.uploadLogo.useMutation();

  // Parse multilingual fields
  const [titleTexts, setTitleTexts] = useState<MultilingualText>(parseMultilingualText(settings.title));
  const [subtitleTexts, setSubtitleTexts] = useState<MultilingualText>(parseMultilingualText(settings.subtitle));

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

    if (file.size > 5 * 1024 * 1024) {
      alert("Розмір файлу не повинен перевищувати 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Будь ласка, завантажте зображення");
      return;
    }

    setIsUploading(true);
    try {
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

  // Bullets management
  const addBullet = () => {
    const newBullet: Bullet = {
      id: `bullet-${Date.now()}`,
      text: "",
      icon: "✓",
    };
    const currentBullets = settings.bullets || [];
    onSettingsChange("bullets", [...currentBullets, newBullet]);
  };

  const updateBullet = (id: string, field: keyof Bullet, value: string) => {
    const currentBullets = settings.bullets || [];
    const updated = currentBullets.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    );
    onSettingsChange("bullets", updated);
  };

  const removeBullet = (id: string) => {
    const currentBullets = settings.bullets || [];
    onSettingsChange("bullets", currentBullets.filter(b => b.id !== id));
  };

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const currentBullets = settings.bullets || [];
      const oldIndex = currentBullets.findIndex(b => b.id === active.id);
      const newIndex = currentBullets.findIndex(b => b.id === over.id);
      const newBullets = arrayMove(currentBullets, oldIndex, newIndex);
      onSettingsChange("bullets", newBullets);
    }
  }, [settings.bullets, onSettingsChange]);

  const currentTitle = titleTexts[editingLanguage] || "";
  const currentSubtitle = subtitleTexts[editingLanguage] || "";

  return (
    <div className="w-full h-full bg-zinc-800 border-l border-zinc-700 overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold text-white">Налаштування</h2>
        </div>

        {/* ===== DESIGN SECTION ===== */}
        <div className="p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Дизайн</h3>
          
          {/* Layout Type */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Тип макету</Label>
            <Select
              value={settings.layoutType || "background"}
              onValueChange={(value) => onSettingsChange("layoutType", value)}
            >
              <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Стандартний (50/50)</SelectItem>
                <SelectItem value="background">Фонова картинка</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Alignment */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Вирівнювання</Label>
            <div className="flex gap-2">
              {[
                { value: "left", icon: AlignLeft, label: "Зліва" },
                { value: "center", icon: AlignCenter, label: "Центр" },
                { value: "right", icon: AlignRight, label: "Справа" },
              ].map(({ value, icon: Icon, label }) => (
                <Button
                  key={value}
                  variant={(settings.alignment || "left") === value ? "default" : "outline"}
                  size="icon"
                  onClick={() => onSettingsChange("alignment", value)}
                  title={label}
                  className="flex-1"
                >
                  <Icon className="w-4 h-4" />
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* ===== BACKGROUND SECTION ===== */}
        <div className="p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Фон</h3>
          
          {/* Background Type Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploadType("image");
                setShowBackgroundUploader(true);
              }}
              className="flex-1 gap-2"
            >
              <Image className="w-4 h-4" />
              Фото
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setUploadType("video");
                setShowBackgroundUploader(true);
              }}
              className="flex-1 gap-2"
            >
              <Video className="w-4 h-4" />
              Відео
            </Button>
          </div>

          {/* Background Gallery Button */}
          <BackgroundGalleryDialog
            currentBackground={settings.backgroundImage || settings.backgroundGradient}
            onSelect={(url) => {
              if (url.startsWith("linear-gradient")) {
                onSettingsChange("backgroundGradient", url);
                onSettingsChange("backgroundImage", "");
                onSettingsChange("backgroundColor", "");
              } else {
                onSettingsChange("backgroundImage", url);
                onSettingsChange("backgroundGradient", "");
                onSettingsChange("backgroundColor", "");
              }
            }}
            language={editingLanguage}
          />

          {/* Current Background Preview */}
          {settings.backgroundImage && (
            <div className="relative">
              <img src={settings.backgroundImage} alt="Background" className="w-full h-20 object-cover rounded-lg" />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => onSettingsChange("backgroundImage", "")}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          )}

          {/* Color Picker */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Колір фону</Label>
            <div className="grid grid-cols-5 gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    settings.backgroundColor === color
                      ? "border-white scale-110"
                      : "border-transparent hover:border-zinc-500"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    onSettingsChange("backgroundColor", color);
                    onSettingsChange("backgroundGradient", "");
                  }}
                />
              ))}
            </div>
            <input
              type="color"
              value={settings.backgroundColor || "#FFD93D"}
              onChange={(e) => {
                onSettingsChange("backgroundColor", e.target.value);
                onSettingsChange("backgroundGradient", "");
              }}
              className="w-full h-8 mt-2 rounded cursor-pointer"
            />
          </div>

          {/* Gradient Picker */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Градієнт</Label>
            <div className="grid grid-cols-4 gap-2">
              {GRADIENT_PRESETS.map((gradient, idx) => (
                <button
                  key={idx}
                  className={`w-full h-8 rounded-lg border-2 transition-all ${
                    settings.backgroundGradient === gradient
                      ? "border-white scale-105"
                      : "border-transparent hover:border-zinc-500"
                  }`}
                  style={{ background: gradient }}
                  onClick={() => {
                    onSettingsChange("backgroundGradient", gradient);
                    onSettingsChange("backgroundColor", "");
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* ===== TYPOGRAPHY SECTION ===== */}
        <div className="p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide flex items-center gap-2">
            <Type className="w-4 h-4" />
            Типографіка
          </h3>
          
          {/* Font Family */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Шрифт</Label>
            <Select
              value={settings.fontFamily || "Inter"}
              onValueChange={(value) => onSettingsChange("fontFamily", value)}
            >
              <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {FONT_FAMILIES.map((font) => (
                  <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title Styling */}
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Заголовок</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.titleColor || "#FFFFFF"}
                onChange={(e) => onSettingsChange("titleColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-2 border-zinc-600"
                title="Колір заголовку"
              />
              <Select
                value={settings.titleWeight || "bold"}
                onValueChange={(value) => onSettingsChange("titleWeight", value)}
              >
                <SelectTrigger className="flex-1 bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map((w) => (
                    <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subtitle Styling */}
          <div className="space-y-2">
            <Label className="text-zinc-400 text-xs">Підзаголовок</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={settings.subtitleColor || "#FFFFFF"}
                onChange={(e) => onSettingsChange("subtitleColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-2 border-zinc-600"
                title="Колір підзаголовку"
              />
              <Select
                value={settings.subtitleWeight || "normal"}
                onValueChange={(value) => onSettingsChange("subtitleWeight", value)}
              >
                <SelectTrigger className="flex-1 bg-zinc-700 border-zinc-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FONT_WEIGHTS.map((w) => (
                    <SelectItem key={w.value} value={w.value}>{w.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ===== CONTENT SECTION ===== */}
        <div className="p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Контент</h3>

          {/* Logo Upload */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Логотип</Label>
            <div className="flex items-center gap-3">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded border border-zinc-600" />
              ) : (
                <div className="w-12 h-12 bg-zinc-700 rounded border border-dashed border-zinc-500 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-zinc-500" />
                </div>
              )}
              <label htmlFor="logo-upload" className="flex-1">
                <Button variant="outline" size="sm" disabled={isUploading} asChild className="w-full">
                  <span className="cursor-pointer">
                    {isUploading ? "..." : "Завантажити"}
                  </span>
                </Button>
              </label>
              <input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <Label className="text-zinc-400 text-xs mb-1 block">Назва компанії</Label>
            <Input
              value={settings.companyName}
              onChange={(e) => onSettingsChange("companyName", e.target.value)}
              className="bg-zinc-700 border-zinc-600 text-white"
            />
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2 p-2 bg-zinc-700/50 rounded-lg">
            <Globe className="w-4 h-4 text-zinc-400" />
            <div className="flex gap-1 flex-wrap">
              {LANGUAGES.map(lang => (
                <Button
                  key={lang.code}
                  variant={editingLanguage === lang.code ? "default" : "ghost"}
                  size="sm"
                  className="h-6 px-2 text-xs"
                  onClick={() => setEditingLanguage(lang.code)}
                >
                  {lang.flag}
                </Button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label className="text-zinc-400 text-xs mb-1 block">Заголовок ({LANGUAGES.find(l => l.code === editingLanguage)?.flag})</Label>
            <Input
              value={currentTitle}
              onChange={(e) => handleTitleChange(editingLanguage, e.target.value)}
              className="bg-zinc-700 border-zinc-600 text-white"
            />
          </div>

          {/* Subtitle */}
          <div>
            <Label className="text-zinc-400 text-xs mb-1 block">Підзаголовок ({LANGUAGES.find(l => l.code === editingLanguage)?.flag})</Label>
            <Textarea
              value={currentSubtitle}
              onChange={(e) => handleSubtitleChange(editingLanguage, e.target.value)}
              className="bg-zinc-700 border-zinc-600 text-white"
              rows={2}
            />
          </div>

          {/* Phone */}
          <div>
            <Label className="text-zinc-400 text-xs mb-1 block">Телефон</Label>
            <Input
              value={settings.phoneNumber}
              onChange={(e) => onSettingsChange("phoneNumber", e.target.value)}
              className="bg-zinc-700 border-zinc-600 text-white"
            />
          </div>
        </div>

        {/* ===== BULLETS SECTION ===== */}
        <div className="p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Переваги</h3>
            <Button variant="outline" size="sm" onClick={addBullet} className="h-7 px-2">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {(!settings.bullets || settings.bullets.length === 0) && (
            <p className="text-xs text-zinc-500 text-center py-2">Додайте переваги</p>
          )}

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={(settings.bullets || []).map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {(settings.bullets || []).map((bullet) => (
                  <SortableBulletItem
                    key={bullet.id}
                    bullet={bullet}
                    showIcons={showBulletIcons === bullet.id}
                    onToggleIcons={() => setShowBulletIcons(showBulletIcons === bullet.id ? null : bullet.id)}
                    onUpdateBullet={updateBullet}
                    onRemoveBullet={removeBullet}
                    onSelectIcon={(icon) => {
                      updateBullet(bullet.id, "icon", icon);
                      setShowBulletIcons(null);
                    }}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* ===== BUTTON SECTION ===== */}
        <div className="p-4 bg-zinc-700/30 rounded-lg border border-zinc-600 space-y-4">
          <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wide">Кнопка</h3>
          
          {/* Button Text */}
          <div>
            <Label className="text-zinc-400 text-xs mb-1 block">Текст кнопки</Label>
            <Input
              value={settings.buttonText}
              onChange={(e) => onSettingsChange("buttonText", e.target.value)}
              className="bg-zinc-700 border-zinc-600 text-white"
            />
          </div>

          {/* Button Color */}
          <div>
            <Label className="text-zinc-400 text-xs mb-2 block">Колір кнопки</Label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.accentColor || "#A855F7"}
                onChange={(e) => onSettingsChange("accentColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-2 border-zinc-600"
              />
              <div 
                className="flex-1 py-2 px-4 rounded-lg text-white text-center font-medium text-sm"
                style={{ backgroundColor: settings.accentColor || "#A855F7" }}
              >
                {settings.buttonText || "Почати"}
              </div>
            </div>
          </div>

          {/* Button Radius Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-zinc-400 text-xs">Заокруглення</Label>
              <span className="text-xs text-zinc-500">{settings.buttonRadiusPx || 25}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={settings.buttonRadiusPx || 25}
              onChange={(e) => onSettingsChange("buttonRadiusPx", parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            />
            <div className="flex justify-between text-xs text-zinc-500 mt-1">
              <span>0</span>
              <span>25</span>
              <span>50</span>
            </div>
          </div>
        </div>

        {/* ===== BONUS SECTION ===== */}
        <div className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg border border-yellow-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <Label className="font-semibold text-white">Бонус</Label>
            </div>
            <Switch
              checked={settings.bonusEnabled}
              onCheckedChange={(checked) => onSettingsChange("bonusEnabled", checked)}
            />
          </div>
          {settings.bonusEnabled && (
            <Textarea
              value={settings.bonusText}
              onChange={(e) => onSettingsChange("bonusText", e.target.value)}
              placeholder="Наприклад: Безкоштовний аудит"
              className="bg-zinc-800 border-zinc-700 text-white"
              rows={2}
            />
          )}
        </div>

        {/* Save Button */}
        <SaveSettingsButton quizId={quizId} settings={settings} />
      </div>

      {/* Background Uploader Modal */}
      {showBackgroundUploader && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-zinc-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {uploadType === "image" ? "Завантажити зображення" : "Завантажити відео"}
              </h2>
              <Button variant="ghost" size="sm" onClick={() => setShowBackgroundUploader(false)}>
                ✕
              </Button>
            </div>
            <BackgroundUploader
              currentImage={uploadType === "image" ? settings.backgroundImage || null : null}
              currentVideo={uploadType === "video" ? settings.backgroundVideo || null : null}
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
    </div>
  );
}

function SaveSettingsButton({ quizId, settings }: { quizId: number; settings: any }) {
  const saveMutation = trpc.quizDesign.save.useMutation({
    onSuccess: () => {
      toast.success("Налаштування збережено!");
    },
    onError: (error) => {
      toast.error(`Помилка: ${error.message}`);
    },
  });

  // Validate translations
  const validateTranslations = () => {
    const warnings: string[] = [];
    const languages = ['uk', 'ru', 'en', 'pl', 'de'];
    
    // Check title translations
    if (settings.title) {
      try {
        const parsed = JSON.parse(settings.title);
        if (typeof parsed === 'object') {
          const missing = languages.filter(lang => !parsed[lang] || parsed[lang].trim() === '');
          if (missing.length > 0) {
            warnings.push(`Заголовок: відсутні переклади для ${missing.join(', ')}`);
          }
        }
      } catch {
        // Not JSON, single language only
      }
    }
    
    // Check subtitle translations
    if (settings.subtitle) {
      try {
        const parsed = JSON.parse(settings.subtitle);
        if (typeof parsed === 'object') {
          const missing = languages.filter(lang => !parsed[lang] || parsed[lang].trim() === '');
          if (missing.length > 0) {
            warnings.push(`Підзаголовок: відсутні переклади для ${missing.join(', ')}`);
          }
        }
      } catch {
        // Not JSON, single language only
      }
    }
    
    return warnings;
  };

  const handleSave = () => {
    if (!quizId) return;
    
    // Show validation warnings if any
    const warnings = validateTranslations();
    if (warnings.length > 0) {
      const proceed = window.confirm(
        `⚠️ Попередження про переклади:\n\n${warnings.join('\n')}\n\nПродовжити збереження?`
      );
      if (!proceed) return;
    }
    
    saveMutation.mutate({
      quizId,
      layoutType: settings.layoutType || "background",
      backgroundImage: settings.backgroundImage,
      backgroundVideo: settings.backgroundVideo,
      alignment: settings.alignment || "left",
      logoImage: settings.logoUrl,
      primaryColor: settings.backgroundColor || settings.primaryColor,
      accentColor: settings.accentColor,
      fontFamily: settings.fontFamily,
      titleText: settings.title,
      subtitleText: settings.subtitle,
      buttonText: settings.buttonText,
      bonusEnabled: settings.bonusEnabled,
      bonusText: settings.bonusText,
      companyName: settings.companyName,
      phoneNumber: settings.phoneNumber,
      contactFormTitle: settings.contactFormTitle,
      contactFormSubtitle: settings.contactFormSubtitle,
      contactFormFields: settings.contactFormFields,
      thankYouTitle: settings.thankYouTitle,
      thankYouSubtitle: settings.thankYouSubtitle,
      thankYouButtonText: settings.thankYouButtonText,
      thankYouButtonUrl: settings.thankYouButtonUrl,
    });
  };

  return (
    <Button
      onClick={handleSave}
      disabled={saveMutation.isPending || !quizId}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
    >
      {saveMutation.isPending ? "Збереження..." : "💾 Зберегти все"}
    </Button>
  );
}
