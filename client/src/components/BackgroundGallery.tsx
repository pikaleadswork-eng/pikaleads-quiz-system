import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Image, Sparkles, Mountain, Briefcase, Palette, Check } from "lucide-react";

interface BackgroundGalleryProps {
  currentBackground?: string | null;
  onSelect: (url: string) => void;
  language?: string;
  variant?: "dialog" | "inline";
}

// Preset background images organized by category
const backgroundImages = {
  gradients: [
    { url: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", name: "Purple Dream", isGradient: true },
    { url: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", name: "Pink Sunset", isGradient: true },
    { url: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", name: "Ocean Blue", isGradient: true },
    { url: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", name: "Fresh Green", isGradient: true },
    { url: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", name: "Warm Glow", isGradient: true },
    { url: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)", name: "Soft Pastel", isGradient: true },
    { url: "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)", name: "Rainbow", isGradient: true },
    { url: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)", name: "Dark Night", isGradient: true },
    { url: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)", name: "Soft Pink", isGradient: true },
    { url: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)", name: "Lavender", isGradient: true },
    { url: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", name: "Peach", isGradient: true },
    { url: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", name: "Mint", isGradient: true },
  ],
  business: [
    { url: "/quiz-images/ecommerce-bg.png", name: "E-commerce" },
    { url: "/quiz-images/renovation-bg.png", name: "Renovation" },
    { url: "/quiz-images/furniture-bg.png", name: "Furniture" },
    { url: "/quiz-images/construction-bg.png", name: "Construction" },
    { url: "/quiz-images/b2b-bg.png", name: "B2B" },
    { url: "/quiz-images/delivery-bg.png", name: "Delivery" },
    { url: "/quiz-images/telegram-bg.png", name: "Telegram" },
    { url: "/quiz-images/general-bg.png", name: "General" },
  ],
  abstract: [
    { url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200", name: "Purple Abstract" },
    { url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200", name: "Gradient Mesh" },
    { url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1200", name: "Colorful Waves" },
    { url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200", name: "Blue Gradient" },
    { url: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1200", name: "Neon Lights" },
    { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200", name: "3D Shapes" },
  ],
  nature: [
    { url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200", name: "Mountains" },
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", name: "Beach" },
    { url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200", name: "Forest" },
    { url: "https://images.unsplash.com/photo-1518173946687-a4c036bc7b1b?w=1200", name: "Sunset" },
    { url: "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200", name: "Sky" },
    { url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200", name: "Fog" },
  ],
};

const categoryLabels = {
  uk: { business: "Бізнес", gradients: "Градієнти", abstract: "Абстракція", nature: "Природа" },
  ru: { business: "Бизнес", gradients: "Градиенты", abstract: "Абстракция", nature: "Природа" },
  en: { business: "Business", gradients: "Gradients", abstract: "Abstract", nature: "Nature" },
};

// Dialog variant for quick selection
function BackgroundGalleryDialog({ currentBackground, onSelect, language = "uk" }: BackgroundGalleryProps) {
  const [open, setOpen] = useState(false);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  
  const labels = categoryLabels[language as keyof typeof categoryLabels] || categoryLabels.uk;
  const buttonText = language === "uk" ? "Галерея фонів" : language === "ru" ? "Галерея фонов" : "Background Gallery";

  const handleSelect = (url: string) => {
    onSelect(url);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
          <Image className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            {buttonText}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="gradients" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-zinc-800">
            <TabsTrigger value="gradients" className="data-[state=active]:bg-purple-600">
              <Palette className="w-4 h-4 mr-2" />
              {labels.gradients}
            </TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-purple-600">
              <Briefcase className="w-4 h-4 mr-2" />
              {labels.business}
            </TabsTrigger>
            <TabsTrigger value="abstract" className="data-[state=active]:bg-purple-600">
              <Sparkles className="w-4 h-4 mr-2" />
              {labels.abstract}
            </TabsTrigger>
            <TabsTrigger value="nature" className="data-[state=active]:bg-purple-600">
              <Mountain className="w-4 h-4 mr-2" />
              {labels.nature}
            </TabsTrigger>
          </TabsList>
          
          {Object.entries(backgroundImages).map(([category, images]) => (
            <TabsContent key={category} value={category} className="mt-4 max-h-[50vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {images.map((image, idx) => (
                  <div
                    key={idx}
                    className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                      hoveredImage === image.url || currentBackground === image.url 
                        ? "border-purple-500 scale-105" 
                        : "border-transparent"
                    }`}
                    onMouseEnter={() => setHoveredImage(image.url)}
                    onMouseLeave={() => setHoveredImage(null)}
                    onClick={() => handleSelect(image.url)}
                  >
                    {(image as any).isGradient ? (
                      <div 
                        className="w-full h-full"
                        style={{ background: image.url }}
                      />
                    ) : (
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-medium text-sm bg-black/50 px-3 py-1 rounded-full">
                        {image.name}
                      </span>
                    </div>
                    {currentBackground === image.url && (
                      <div className="absolute top-2 right-2 bg-purple-500 rounded-full p-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Inline variant for embedded display
function BackgroundGalleryInline({ currentBackground, onSelect }: BackgroundGalleryProps) {
  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">Background Gallery</h3>

      <Tabs defaultValue="gradients">
        <TabsList className="grid w-full grid-cols-4 mb-4">
          <TabsTrigger value="gradients" className="text-xs">Gradients</TabsTrigger>
          <TabsTrigger value="business" className="text-xs">Business</TabsTrigger>
          <TabsTrigger value="abstract" className="text-xs">Abstract</TabsTrigger>
          <TabsTrigger value="nature" className="text-xs">Nature</TabsTrigger>
        </TabsList>

        {Object.entries(backgroundImages).map(([category, backgrounds]) => (
          <TabsContent key={category} value={category} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {backgrounds.map((bg) => (
                <button
                  key={bg.url}
                  onClick={() => onSelect(bg.url)}
                  className={`relative group rounded-lg overflow-hidden border-2 transition-all ${
                    currentBackground === bg.url
                      ? "border-yellow-500 ring-2 ring-yellow-500/50"
                      : "border-zinc-700 hover:border-zinc-600"
                  }`}
                >
                  {(bg as any).isGradient ? (
                    <div 
                      className="w-full h-32"
                      style={{ background: bg.url }}
                    />
                  ) : (
                    <img
                      src={bg.url}
                      alt={bg.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-medium">{bg.name}</span>
                  </div>
                  {currentBackground === bg.url && (
                    <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
}

// Main export with variant support
export function BackgroundGallery({ variant = "inline", ...props }: BackgroundGalleryProps) {
  if (variant === "dialog") {
    return <BackgroundGalleryDialog {...props} />;
  }
  return <BackgroundGalleryInline {...props} />;
}

// Named export for dialog variant
export default BackgroundGalleryDialog;
