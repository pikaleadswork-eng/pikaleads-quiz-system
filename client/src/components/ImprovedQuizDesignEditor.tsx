import { useState, useRef } from "react";
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
import { Slider } from "@/components/ui/slider";
import { Upload, Image as ImageIcon, Type, Palette, Layout, Loader2, Monitor, Smartphone, Save } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { BackgroundUploader } from "@/components/BackgroundUploader";
import { DesignLayoutSelector } from "@/components/DesignLayoutSelector";
import { QuizPreviewPanel } from "@/components/QuizPreviewPanel";
import QRCodePreview from "@/components/QRCodePreview";

interface QuizDesignSettings {
  layoutType: "standard" | "background";
  backgroundImage?: string;
  backgroundVideo?: string;
  alignment?: "left" | "center" | "right";
  logoImage?: string;
  primaryColor: string;
  accentColor: string;
  fontFamily: string;
  titleText: string;
  subtitleText: string;
  buttonText: string;
  bonusText: string;
  // Button styling
  buttonSize: "sm" | "md" | "lg";
  buttonRadius: number;
  buttonShadow: boolean;
  buttonGlow: boolean;
  // Font styling
  titleFontSize: number;
  titleFontWeight: number;
  subtitleFontSize: number;
  subtitleFontWeight: number;
}

interface ImprovedQuizDesignEditorProps {
  quizId: number | string;
  initialSettings?: Partial<QuizDesignSettings>;
  onSave: (settings: QuizDesignSettings) => void;
}

export default function ImprovedQuizDesignEditor({ quizId, initialSettings, onSave }: ImprovedQuizDesignEditorProps) {
  const { language } = useLanguage();
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  
  const saveMutation = trpc.quizDesign.save.useMutation();
  const uploadMutation = trpc.quizDesign.uploadImage.useMutation();
  
  const [settings, setSettings] = useState<QuizDesignSettings>({
    layoutType: initialSettings?.layoutType || "standard",
    backgroundImage: initialSettings?.backgroundImage || "",
    backgroundVideo: initialSettings?.backgroundVideo || "",
    alignment: initialSettings?.alignment || "center",
    logoImage: initialSettings?.logoImage || "",
    primaryColor: initialSettings?.primaryColor || "#FACC15",
    accentColor: initialSettings?.accentColor || "#A855F7",
    fontFamily: initialSettings?.fontFamily || "Inter",
    titleText: initialSettings?.titleText || "",
    subtitleText: initialSettings?.subtitleText || "",
    buttonText: initialSettings?.buttonText || (language === "uk" ? "Почати" : "Start"),
    bonusText: initialSettings?.bonusText || "",
    buttonSize: initialSettings?.buttonSize || "md",
    buttonRadius: initialSettings?.buttonRadius || 24,
    buttonShadow: initialSettings?.buttonShadow ?? true,
    buttonGlow: initialSettings?.buttonGlow ?? false,
    titleFontSize: initialSettings?.titleFontSize || 48,
    titleFontWeight: initialSettings?.titleFontWeight || 700,
    subtitleFontSize: initialSettings?.subtitleFontSize || 18,
    subtitleFontWeight: initialSettings?.subtitleFontWeight || 400,
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
        quizId: typeof quizId === 'string' ? parseInt(quizId) : quizId,
        ...settings,
      });
      toast.success(
        language === "uk" ? "Дизайн успішно збережено" : "Design saved successfully"
      );
      onSave(settings);
    } catch (error) {
      console.error("Save error:", error);
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
          quizId: typeof quizId === 'string' ? parseInt(quizId) : quizId,
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
      console.error("Upload error:", error);
      toast.error(
        language === "uk" ? "Не вдалося завантажити зображення. Перевірте підключення." : "Failed to upload image. Check your connection."
      );
    }
  };

  const getButtonSizeClass = () => {
    switch (settings.buttonSize) {
      case "sm": return "px-6 py-2 text-sm";
      case "lg": return "px-10 py-4 text-lg";
      default: return "px-8 py-3 text-base";
    }
  };

  const getButtonStyle = () => {
    return {
      backgroundColor: settings.primaryColor,
      borderRadius: `${settings.buttonRadius}px`,
      boxShadow: settings.buttonShadow ? "0 4px 14px 0 rgba(0,0,0,0.25)" : "none",
      filter: settings.buttonGlow ? `drop-shadow(0 0 20px ${settings.primaryColor}80)` : "none",
    };
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Side - Editor Controls */}
        <div className="space-y-6">
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Layout className="w-6 h-6" />
                {language === "uk" ? "Редактор дизайну" : "Design Editor"}
              </h2>
              <Button onClick={handleSave} disabled={saveMutation.isPending}>
                {saveMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {language === "uk" ? "Зберегти" : "Save"}
              </Button>
            </div>

            <Tabs defaultValue="layout" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
                <TabsTrigger value="layout" className="data-[state=active]:bg-zinc-700">
                  <Layout className="w-4 h-4 mr-2" />
                  {language === "uk" ? "Макет" : "Layout"}
                </TabsTrigger>
                <TabsTrigger value="images" className="data-[state=active]:bg-zinc-700">
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {language === "uk" ? "Фото" : "Images"}
                </TabsTrigger>
                <TabsTrigger value="text" className="data-[state=active]:bg-zinc-700">
                  <Type className="w-4 h-4 mr-2" />
                  {language === "uk" ? "Текст" : "Text"}
                </TabsTrigger>
                <TabsTrigger value="colors" className="data-[state=active]:bg-zinc-700">
                  <Palette className="w-4 h-4 mr-2" />
                  {language === "uk" ? "Кольори" : "Colors"}
                </TabsTrigger>
              </TabsList>

              {/* Layout Tab */}
              <TabsContent value="layout" className="space-y-6 mt-6">
                <DesignLayoutSelector
                  layoutType={settings.layoutType}
                  alignment={settings.alignment || "center"}
                  onLayoutChange={(layout) => updateSetting("layoutType", layout)}
                  onAlignmentChange={(alignment) => updateSetting("alignment", alignment)}
                />
                {/* Keep existing layout settings below */}


                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Шрифт" : "Font Family"}</Label>
                  <Select value={settings.fontFamily} onValueChange={(value) => updateSetting("fontFamily", value)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-800 border-zinc-700 max-h-80 overflow-y-auto">
                      <SelectItem value="Inter" className="text-white" style={{fontFamily: 'Inter'}}>Inter</SelectItem>
                      <SelectItem value="Montserrat" className="text-white" style={{fontFamily: 'Montserrat'}}>Montserrat</SelectItem>
                      <SelectItem value="Roboto" className="text-white" style={{fontFamily: 'Roboto'}}>Roboto</SelectItem>
                      <SelectItem value="Open Sans" className="text-white" style={{fontFamily: 'Open Sans'}}>Open Sans</SelectItem>
                      <SelectItem value="Poppins" className="text-white" style={{fontFamily: 'Poppins'}}>Poppins</SelectItem>
                      <SelectItem value="Raleway" className="text-white" style={{fontFamily: 'Raleway'}}>Raleway</SelectItem>
                      <SelectItem value="Playfair Display" className="text-white" style={{fontFamily: 'Playfair Display'}}>Playfair Display</SelectItem>
                      <SelectItem value="Oswald" className="text-white" style={{fontFamily: 'Oswald'}}>Oswald</SelectItem>
                      <SelectItem value="Nunito" className="text-white" style={{fontFamily: 'Nunito'}}>Nunito</SelectItem>
                      <SelectItem value="Lato" className="text-white" style={{fontFamily: 'Lato'}}>Lato</SelectItem>
                      <SelectItem value="Ubuntu" className="text-white" style={{fontFamily: 'Ubuntu'}}>Ubuntu</SelectItem>
                      <SelectItem value="Rubik" className="text-white" style={{fontFamily: 'Rubik'}}>Rubik</SelectItem>
                      <SelectItem value="Work Sans" className="text-white" style={{fontFamily: 'Work Sans'}}>Work Sans</SelectItem>
                      <SelectItem value="Fira Sans" className="text-white" style={{fontFamily: 'Fira Sans'}}>Fira Sans</SelectItem>
                      <SelectItem value="Manrope" className="text-white" style={{fontFamily: 'Manrope'}}>Manrope</SelectItem>
                      <SelectItem value="Space Grotesk" className="text-white" style={{fontFamily: 'Space Grotesk'}}>Space Grotesk</SelectItem>
                      <SelectItem value="DM Sans" className="text-white" style={{fontFamily: 'DM Sans'}}>DM Sans</SelectItem>
                      <SelectItem value="Outfit" className="text-white" style={{fontFamily: 'Outfit'}}>Outfit</SelectItem>
                      <SelectItem value="Orbitron" className="text-white" style={{fontFamily: 'Orbitron'}}>Orbitron</SelectItem>
                      <SelectItem value="Rajdhani" className="text-white" style={{fontFamily: 'Rajdhani'}}>Rajdhani</SelectItem>
                      <SelectItem value="Space Mono" className="text-white" style={{fontFamily: 'Space Mono'}}>Space Mono</SelectItem>
                      <SelectItem value="Bungee" className="text-white" style={{fontFamily: 'Bungee'}}>Bungee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Button Styling */}
                <div className="space-y-4 pt-4 border-t border-zinc-700">
                  <h4 className="font-semibold text-white">
                    {language === "uk" ? "Стилізація кнопки" : "Button Styling"}
                  </h4>
                  
                  <div className="space-y-3">
                    <Label className="text-white">{language === "uk" ? "Розмір кнопки" : "Button Size"}</Label>
                    <Select value={settings.buttonSize} onValueChange={(value: any) => updateSetting("buttonSize", value)}>
                      <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-800 border-zinc-700">
                        <SelectItem value="sm" className="text-white">{language === "uk" ? "Маленька" : "Small"}</SelectItem>
                        <SelectItem value="md" className="text-white">{language === "uk" ? "Середня" : "Medium"}</SelectItem>
                        <SelectItem value="lg" className="text-white">{language === "uk" ? "Велика" : "Large"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white">
                      {language === "uk" ? "Скруглення кутів" : "Border Radius"}: {settings.buttonRadius}px
                    </Label>
                    <Slider
                      value={[settings.buttonRadius]}
                      onValueChange={([value]) => updateSetting("buttonRadius", value)}
                      min={0}
                      max={50}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.buttonShadow}
                        onChange={(e) => updateSetting("buttonShadow", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-white text-sm">{language === "uk" ? "Тінь" : "Shadow"}</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.buttonGlow}
                        onChange={(e) => updateSetting("buttonGlow", e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-white text-sm">{language === "uk" ? "Підсвітка" : "Glow"}</span>
                    </label>
                  </div>
                </div>
              </TabsContent>

              {/* Images Tab */}
              <TabsContent value="images" className="space-y-6 mt-6">
                <BackgroundUploader
                  currentImage={settings.backgroundImage}
                  currentVideo={settings.backgroundVideo}
                  onImageUploaded={(url) => updateSetting("backgroundImage", url)}
                  onVideoUploaded={(url) => updateSetting("backgroundVideo", url)}
                  onRemoveImage={() => updateSetting("backgroundImage", "")}
                  onRemoveVideo={() => updateSetting("backgroundVideo", "")}
                />
                {/* Keep existing logo upload below */}
                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Фонове зображення" : "Background Image"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="https://..."
                      value={settings.backgroundImage}
                      onChange={(e) => updateSetting("backgroundImage", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
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
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    >
                      {uploadMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {settings.backgroundImage && (
                    <img
                      src={settings.backgroundImage}
                      alt="Background preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg border border-zinc-700"
                    />
                  )}
                </div>

                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Логотип" : "Logo"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="https://..."
                      value={settings.logoImage}
                      onChange={(e) => updateSetting("logoImage", e.target.value)}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
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
                      className="bg-zinc-800 border-zinc-700 hover:bg-zinc-700"
                    >
                      {uploadMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                  {settings.logoImage && (
                    <img
                      src={settings.logoImage}
                      alt="Logo preview"
                      className="mt-2 h-16 object-contain rounded-lg border border-zinc-700 bg-white p-2"
                    />
                  )}
                </div>
              </TabsContent>

              {/* Text Tab */}
              <TabsContent value="text" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Заголовок" : "Title"}</Label>
                  <Input
                    value={settings.titleText}
                    onChange={(e) => updateSetting("titleText", e.target.value)}
                    placeholder={language === "uk" ? "Введіть заголовок" : "Enter title"}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">
                    {language === "uk" ? "Розмір заголовка" : "Title Font Size"}: {settings.titleFontSize}px
                  </Label>
                  <Slider
                    value={[settings.titleFontSize]}
                    onValueChange={([value]) => updateSetting("titleFontSize", value)}
                    min={24}
                    max={72}
                    step={2}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">
                    {language === "uk" ? "Жирність заголовка" : "Title Font Weight"}: {settings.titleFontWeight}
                  </Label>
                  <Slider
                    value={[settings.titleFontWeight]}
                    onValueChange={([value]) => updateSetting("titleFontWeight", value)}
                    min={300}
                    max={900}
                    step={100}
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-700">
                  <Label className="text-white">{language === "uk" ? "Підзаголовок" : "Subtitle"}</Label>
                  <Textarea
                    value={settings.subtitleText}
                    onChange={(e) => updateSetting("subtitleText", e.target.value)}
                    placeholder={language === "uk" ? "Введіть підзаголовок" : "Enter subtitle"}
                    rows={3}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">
                    {language === "uk" ? "Розмір підзаголовка" : "Subtitle Font Size"}: {settings.subtitleFontSize}px
                  </Label>
                  <Slider
                    value={[settings.subtitleFontSize]}
                    onValueChange={([value]) => updateSetting("subtitleFontSize", value)}
                    min={12}
                    max={32}
                    step={1}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Текст кнопки" : "Button Text"}</Label>
                  <Input
                    value={settings.buttonText}
                    onChange={(e) => updateSetting("buttonText", e.target.value)}
                    placeholder={language === "uk" ? "Почати" : "Start"}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Текст бонусу" : "Bonus Text"}</Label>
                  <Textarea
                    value={settings.bonusText}
                    onChange={(e) => updateSetting("bonusText", e.target.value)}
                    placeholder={language === "uk" ? "Отримайте знижку 30%" : "Get 30% discount"}
                    rows={2}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                  />
                </div>
              </TabsContent>

              {/* Colors Tab */}
              <TabsContent value="colors" className="space-y-6 mt-6">
                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Основний колір (кнопка)" : "Primary Color (Button)"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting("primaryColor", e.target.value)}
                      className="w-20 h-12 p-1 bg-zinc-800 border-zinc-700"
                    />
                    <Input
                      type="text"
                      value={settings.primaryColor}
                      onChange={(e) => updateSetting("primaryColor", e.target.value)}
                      className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-white">{language === "uk" ? "Акцентний колір" : "Accent Color"}</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={settings.accentColor}
                      onChange={(e) => updateSetting("accentColor", e.target.value)}
                      className="w-20 h-12 p-1 bg-zinc-800 border-zinc-700"
                    />
                    <Input
                      type="text"
                      value={settings.accentColor}
                      onChange={(e) => updateSetting("accentColor", e.target.value)}
                      className="flex-1 bg-zinc-800 border-zinc-700 text-white"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>
        </div>

        {/* Right Side - Live Preview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Live Preview</h3>
            <QRCodePreview 
              quizUrl={`${window.location.origin}/quiz/${quizId}`}
              quizName={`Quiz ${quizId}`}
            />
          </div>
          <QuizPreviewPanel settings={settings} />
          <Card className="p-6 bg-zinc-900 border-zinc-800">
            <div 
              className={`mx-auto transition-all duration-300 ${
                previewDevice === "mobile" ? "max-w-[375px]" : "w-full"
              }`}
              style={{
                fontFamily: settings.fontFamily,
              }}
            >
              {/* Preview content based on layout type */}
              {settings.layoutType === "standard" && (
                <div className="grid md:grid-cols-2 gap-8 min-h-[500px]">
                  {/* Left: Text */}
                  <div className="flex flex-col justify-center space-y-6 p-8 bg-zinc-800 rounded-lg">
                    {settings.logoImage && (
                      <img src={settings.logoImage} alt="Logo" className="h-12 object-contain" />
                    )}
                    <h1 
                      className="text-white leading-tight"
                      style={{
                        fontSize: `${settings.titleFontSize}px`,
                        fontWeight: settings.titleFontWeight,
                      }}
                    >
                      {settings.titleText || (language === "uk" ? "Заголовок квізу" : "Quiz Title")}
                    </h1>
                    <p 
                      className="text-zinc-300"
                      style={{
                        fontSize: `${settings.subtitleFontSize}px`,
                        fontWeight: settings.subtitleFontWeight,
                      }}
                    >
                      {settings.subtitleText || (language === "uk" ? "Опис квізу" : "Quiz description")}
                    </p>
                    <button
                      className={`${getButtonSizeClass()} font-semibold text-black transition-transform hover:scale-105`}
                      style={getButtonStyle()}
                    >
                      {settings.buttonText}
                    </button>
                    {settings.bonusText && (
                      <div className="text-sm text-zinc-400 border border-zinc-700 rounded-lg p-4">
                        🎁 {settings.bonusText}
                      </div>
                    )}
                  </div>
                  {/* Right: Image */}
                  <div className="relative rounded-lg overflow-hidden bg-zinc-700">
                    {settings.backgroundImage ? (
                      <img 
                        src={settings.backgroundImage} 
                        alt="Background" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500">
                        <ImageIcon className="w-24 h-24" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Removed old center layout - now using standard */}
              {false && (
                <div className="text-center space-y-6 p-8 bg-zinc-800 rounded-lg">
                  {settings.logoImage && (
                    <img src={settings.logoImage} alt="Logo" className="h-12 object-contain mx-auto" />
                  )}
                  {settings.backgroundImage && (
                    <img 
                      src={settings.backgroundImage} 
                      alt="Background" 
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  )}
                  <h1 
                    className="text-white leading-tight"
                    style={{
                      fontSize: `${settings.titleFontSize}px`,
                      fontWeight: settings.titleFontWeight,
                    }}
                  >
                    {settings.titleText || (language === "uk" ? "Заголовок квізу" : "Quiz Title")}
                  </h1>
                  <p 
                    className="text-zinc-300"
                    style={{
                      fontSize: `${settings.subtitleFontSize}px`,
                      fontWeight: settings.subtitleFontWeight,
                    }}
                  >
                    {settings.subtitleText || (language === "uk" ? "Опис квізу" : "Quiz description")}
                  </p>
                  <button
                    className={`${getButtonSizeClass()} font-semibold text-black transition-transform hover:scale-105`}
                    style={getButtonStyle()}
                  >
                    {settings.buttonText}
                  </button>
                  {settings.bonusText && (
                    <div className="text-sm text-zinc-400 border border-zinc-700 rounded-lg p-4 inline-block">
                      🎁 {settings.bonusText}
                    </div>
                  )}
                </div>
              )}

              {settings.layoutType === "background" && (
                <div 
                  className="relative min-h-[600px] rounded-lg overflow-hidden flex items-center justify-center"
                  style={{
                    backgroundImage: settings.backgroundImage ? `url(${settings.backgroundImage})` : "none",
                    backgroundColor: settings.backgroundImage ? "transparent" : "#27272a",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="relative z-10 text-center space-y-6 p-8 max-w-2xl">
                    {settings.logoImage && (
                      <img src={settings.logoImage} alt="Logo" className="h-12 object-contain mx-auto" />
                    )}
                    <h1 
                      className="text-white leading-tight drop-shadow-lg"
                      style={{
                        fontSize: `${settings.titleFontSize}px`,
                        fontWeight: settings.titleFontWeight,
                      }}
                    >
                      {settings.titleText || (language === "uk" ? "Заголовок квізу" : "Quiz Title")}
                    </h1>
                    <p 
                      className="text-white/90 drop-shadow-md"
                      style={{
                        fontSize: `${settings.subtitleFontSize}px`,
                        fontWeight: settings.subtitleFontWeight,
                      }}
                    >
                      {settings.subtitleText || (language === "uk" ? "Опис квізу" : "Quiz description")}
                    </p>
                    <button
                      className={`${getButtonSizeClass()} font-semibold text-black transition-transform hover:scale-105`}
                      style={getButtonStyle()}
                    >
                      {settings.buttonText}
                    </button>
                    {settings.bonusText && (
                      <div className="text-sm text-white border border-white/30 rounded-lg p-4 inline-block backdrop-blur-sm bg-white/10">
                        🎁 {settings.bonusText}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
