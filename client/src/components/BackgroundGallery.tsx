import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check } from "lucide-react";

interface BackgroundGalleryProps {
  currentBackground?: string | null;
  onSelect: (url: string) => void;
}

const GALLERY_BACKGROUNDS = {
  furniture: [
    { url: "/backgrounds/furniture-1.jpg", title: "Modern Showroom" },
    { url: "/backgrounds/furniture-2.jpg", title: "Elegant Interior" },
    { url: "/backgrounds/furniture-3.jpg", title: "Premium Furniture" },
  ],
  renovation: [
    { url: "/backgrounds/renovation-1.jpg", title: "Luxury Renovation" },
    { url: "/backgrounds/renovation-2.jpg", title: "Modern Architecture" },
    { url: "/backgrounds/renovation-3.jpg", title: "Professional Design" },
  ],
  ecommerce: [
    { url: "/backgrounds/ecommerce-1.jpg", title: "Online Store" },
    { url: "/backgrounds/ecommerce-2.jpg", title: "E-commerce Platform" },
  ],
  services: [
    { url: "/backgrounds/services-1.jpg", title: "Professional Office" },
    { url: "/backgrounds/services-2.jpg", title: "Business Consulting" },
    { url: "/backgrounds/services-3.jpg", title: "Corporate Services" },
  ],
  realestate: [
    { url: "/backgrounds/realestate-1.jpg", title: "Modern Property" },
    { url: "/backgrounds/realestate-2.jpg", title: "Luxury Architecture" },
    { url: "/backgrounds/realestate-3.jpg", title: "Premium Home" },
  ],
};

export function BackgroundGallery({ currentBackground, onSelect }: BackgroundGalleryProps) {
  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">Background Gallery</h3>

      <Tabs defaultValue="furniture">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="furniture" className="text-xs">Furniture</TabsTrigger>
          <TabsTrigger value="renovation" className="text-xs">Renovation</TabsTrigger>
          <TabsTrigger value="ecommerce" className="text-xs">E-commerce</TabsTrigger>
          <TabsTrigger value="services" className="text-xs">Services</TabsTrigger>
          <TabsTrigger value="realestate" className="text-xs">Real Estate</TabsTrigger>
        </TabsList>

        {Object.entries(GALLERY_BACKGROUNDS).map(([niche, backgrounds]) => (
          <TabsContent key={niche} value={niche} className="space-y-3">
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
                  <img
                    src={bg.url}
                    alt={bg.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                    <span className="text-white text-xs font-medium">{bg.title}</span>
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
