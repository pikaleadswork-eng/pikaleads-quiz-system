import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as ImageIcon, Type, Palette, Layout, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useRef } from "react";

interface QuizDesignSettings {
  layoutType: "center" | "split" | "background";
  backgroundImage?: string;
  logoImage?: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  titleText: string;
  subtitleText: string;
  buttonText: string;
  bonusText: string;
}

interface QuizDesignEditorProps {
  quizId: number;
  initialSettings?: Partial<QuizDesignSettings>;
  onSave: (settings: QuizDesignSettings) => void;
}

export default function QuizDesignEditor({ quizId, initialSettings, onSave }: QuizDesignEditorProps) {
  const { language } = useLanguage();
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const saveMutation = trpc.quizDesign.save.useMutation();
  const uploadMutation = trpc.quizDesign.uploadImage.useMutation();
  
  const [settings, setSettings] = useState<QuizDesignSettings>({
    layoutType: initialSettings?.layoutType || "split",
    backgroundImage: initialSettings?.backgroundImage || "",
    logoImage: initialSettings?.logoImage || "",
    primaryColor: initialSettings?.primaryColor || "#FACC15",
    accentColor: initialSettings?.accentColor || "#A855F7",
    fontFamily: initialSettings?.fontFamily || "Inter",
    titleText: initialSettings?.titleText || "",
    subtitleText: initialSettings?.subtitleText || "",
    buttonText: initialSettings?.buttonText || (language === "uk" ? "Почати" : "Start"),
    bonusText: initialSettings?.bonusText || "",
  });

  const updateSetting = <K extends keyof QuizDesignSettings>(
    key: K,
    value: QuizDesignSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({
        quizId,
        ...settings,
      });
      toast.success(
        language === "uk" ? "Дизайн успішно збережено" : "Design saved successfully"
      );
      onSave(settings);
    } catch (error) {
      toast.error(
        language === "uk" ? "Не вдалося зберегти дизайн" : "Failed to save design"
      );
    }
  };

  const handleImageUpload = async (file: File, imageType: "background" | "logo") => {
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64 = e.target?.result as string;
        const result = await uploadMutation.mutateAsync({
          quizId,
          imageType,
          imageData: base64,
          mimeType: file.type,
        });
        
        if (imageType === "background") {
          updateSetting("backgroundImage", result.url);
        } else {
          updateSetting("logoImage", result.url);
        }
        
        toast.success(
        language === "uk" ? "Зображення успішно завантажено" : "Image uploaded successfully"
      );
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(
        language === "uk" ? "Не вдалося завантажити зображення" : "Failed to upload image"
      );
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Left Side - Editor Controls */}
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Layout className="w-6 h-6" />
            {language === "uk" ? "Редактор дизайну" : "Design Editor"}
          </h2>

          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="layout">
                <Layout className="w-4 h-4 mr-2" />
                {language === "uk" ? "Макет" : "Layout"}
              </TabsTrigger>
              <TabsTrigger value="images">
                <ImageIcon className="w-4 h-4 mr-2" />
                {language === "uk" ? "Фото" : "Images"}
              </TabsTrigger>
              <TabsTrigger value="text">
                <Type className="w-4 h-4 mr-2" />
                {language === "uk" ? "Текст" : "Text"}
              </TabsTrigger>
              <TabsTrigger value="colors">
                <Palette className="w-4 h-4 mr-2" />
                {language === "uk" ? "Кольори" : "Colors"}
              </TabsTrigger>
            </TabsList>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4 mt-4">
              <div>
                <Label>{language === "uk" ? "Тип розміщення" : "Layout Type"}</Label>
                <Select value={settings.layoutType} onValueChange={(value: any) => updateSetting("layoutType", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="center">
                      {language === "uk" ? "По центру" : "Center"} - {language === "uk" ? "зображення вгорі, текст по центру" : "image top, text center"}
                    </SelectItem>
                    <SelectItem value="split">
                      {language === "uk" ? "Стандартна" : "Split"} - {language === "uk" ? "текст зліва, зображення справа" : "text left, image right"}
                    </SelectItem>
                    <SelectItem value="background">
                      {language === "uk" ? "Фонова картинка" : "Background"} - {language === "uk" ? "повноекранне фото з текстом поверх" : "fullscreen image with text overlay"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>{language === "uk" ? "Шрифт" : "Font Family"}</Label>
                <Select value={settings.fontFamily} onValueChange={(value) => updateSetting("fontFamily", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Montserrat">Montserrat</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="space-y-4 mt-4">
              <div>
                <Label>{language === "uk" ? "Фонове зображення" : "Background Image"}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="https://..."
                    value={settings.backgroundImage}
                    onChange={(e) => updateSetting("backgroundImage", e.target.value)}
                  />
                  <input
                    ref={backgroundInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "background");
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => backgroundInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
                {settings.backgroundImage && (
                  <img
                    src={settings.backgroundImage}
                    alt="Background preview"
                    className="mt-2 w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div>
                <Label>{language === "uk" ? "Логотип" : "Logo"}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="text"
                    placeholder="https://..."
                    value={settings.logoImage}
                    onChange={(e) => updateSetting("logoImage", e.target.value)}
                  />
                  <input
                    ref={logoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file, "logo");
                    }}
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={uploadMutation.isPending}
                  >
                    {uploadMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  </Button>
                </div>
                {settings.logoImage && (
                  <img
                    src={settings.logoImage}
                    alt="Logo preview"
                    className="mt-2 h-16 object-contain"
                  />
                )}
              </div>
            </TabsContent>

            {/* Text Tab */}
            <TabsContent value="text" className="space-y-4 mt-4">
              <div>
                <Label>{language === "uk" ? "Заголовок" : "Title"}</Label>
                <Input
                  type="text"
                  value={settings.titleText}
                  onChange={(e) => updateSetting("titleText", e.target.value)}
                  placeholder={language === "uk" ? "Введіть заголовок..." : "Enter title..."}
                />
              </div>

              <div>
                <Label>{language === "uk" ? "Підзаголовок" : "Subtitle"}</Label>
                <Textarea
                  value={settings.subtitleText}
                  onChange={(e) => updateSetting("subtitleText", e.target.value)}
                  placeholder={language === "uk" ? "Введіть підзаголовок..." : "Enter subtitle..."}
                  rows={3}
                />
              </div>

              <div>
                <Label>{language === "uk" ? "Текст кнопки" : "Button Text"}</Label>
                <Input
                  type="text"
                  value={settings.buttonText}
                  onChange={(e) => updateSetting("buttonText", e.target.value)}
                  placeholder={language === "uk" ? "Почати" : "Start"}
                />
              </div>

              <div>
                <Label>{language === "uk" ? "Текст бонусу" : "Bonus Text"}</Label>
                <Textarea
                  value={settings.bonusText}
                  onChange={(e) => updateSetting("bonusText", e.target.value)}
                  placeholder={language === "uk" ? "Опишіть бонус..." : "Describe bonus..."}
                  rows={2}
                />
              </div>
            </TabsContent>

            {/* Colors Tab */}
            <TabsContent value="colors" className="space-y-4 mt-4">
              <div>
                <Label>{language === "uk" ? "Основний колір (кнопка)" : "Primary Color (Button)"}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting("primaryColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={settings.primaryColor}
                    onChange={(e) => updateSetting("primaryColor", e.target.value)}
                    placeholder="#FACC15"
                  />
                </div>
              </div>

              <div>
                <Label>{language === "uk" ? "Акцентний колір (іконки)" : "Accent Color (Icons)"}</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    type="color"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting("accentColor", e.target.value)}
                    className="w-20 h-10"
                  />
                  <Input
                    type="text"
                    value={settings.accentColor}
                    onChange={(e) => updateSetting("accentColor", e.target.value)}
                    placeholder="#A855F7"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t">
            <Button onClick={handleSave} className="w-full" size="lg" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {language === "uk" ? "Збереження..." : "Saving..."}
                </>
              ) : (
                language === "uk" ? "Зберегти дизайн" : "Save Design"
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Side - Live Preview */}
      <div className="lg:sticky lg:top-6 h-fit">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">{language === "uk" ? "Попередній перегляд" : "Live Preview"}</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">📱</Button>
              <Button variant="outline" size="sm">💻</Button>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden bg-zinc-900" style={{ aspectRatio: "16/9" }}>
            {/* Preview based on layout type */}
            {settings.layoutType === "center" && (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                {settings.backgroundImage && (
                  <img src={settings.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                )}
                <div className="relative z-10">
                  {settings.logoImage && <img src={settings.logoImage} alt="Logo" className="h-8 mb-4 mx-auto" />}
                  <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: settings.fontFamily }}>
                    {settings.titleText || (language === "uk" ? "Заголовок" : "Title")}
                  </h1>
                  <p className="text-sm text-gray-300 mb-4" style={{ fontFamily: settings.fontFamily }}>
                    {settings.subtitleText || (language === "uk" ? "Підзаголовок" : "Subtitle")}
                  </p>
                  <button 
                    className="px-6 py-2 rounded-full text-sm font-bold"
                    style={{ backgroundColor: settings.primaryColor, color: "#000" }}
                  >
                    {settings.buttonText}
                  </button>
                </div>
              </div>
            )}

            {settings.layoutType === "split" && (
              <div className="h-full grid grid-cols-2">
                <div className="flex flex-col justify-center p-6 bg-zinc-900">
                  {settings.logoImage && <img src={settings.logoImage} alt="Logo" className="h-6 mb-3" />}
                  <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: settings.fontFamily }}>
                    {settings.titleText || (language === "uk" ? "Заголовок" : "Title")}
                  </h1>
                  <p className="text-xs text-gray-300 mb-3" style={{ fontFamily: settings.fontFamily }}>
                    {settings.subtitleText || (language === "uk" ? "Підзаголовок" : "Subtitle")}
                  </p>
                  <button 
                    className="px-4 py-2 rounded-full text-xs font-bold w-fit"
                    style={{ backgroundColor: settings.primaryColor, color: "#000" }}
                  >
                    {settings.buttonText}
                  </button>
                </div>
                <div className="relative">
                  {settings.backgroundImage ? (
                    <img src={settings.backgroundImage} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-700" />
                  )}
                </div>
              </div>
            )}

            {settings.layoutType === "background" && (
              <div className="h-full relative">
                {settings.backgroundImage && (
                  <img src={settings.backgroundImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/90 to-transparent" />
                <div className="relative z-10 h-full flex flex-col justify-center p-6">
                  {settings.logoImage && <img src={settings.logoImage} alt="Logo" className="h-6 mb-3" />}
                  <h1 className="text-xl font-bold text-white mb-2" style={{ fontFamily: settings.fontFamily }}>
                    {settings.titleText || (language === "uk" ? "Заголовок" : "Title")}
                  </h1>
                  <p className="text-xs text-gray-300 mb-3" style={{ fontFamily: settings.fontFamily }}>
                    {settings.subtitleText || (language === "uk" ? "Підзаголовок" : "Subtitle")}
                  </p>
                  <button 
                    className="px-4 py-2 rounded-full text-xs font-bold w-fit"
                    style={{ backgroundColor: settings.primaryColor, color: "#000" }}
                  >
                    {settings.buttonText}
                  </button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
