import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface VariantPreviewModalProps {
  open: boolean;
  onClose: () => void;
  variant: {
    id: number;
    variantName: string;
    title: string | null;
    subtitle: string | null;
    trafficPercentage: number;
  };
  quizName: string;
  quizDescription: string | null;
  backgroundImage?: string | null;
}

export function VariantPreviewModal({
  open,
  onClose,
  variant,
  quizName,
  quizDescription,
  backgroundImage,
}: VariantPreviewModalProps) {
  // Parse JSON title/subtitle if needed
  const parseText = (text: string | null): string => {
    if (!text) return "";
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed.uk || parsed.ru || parsed.en || text;
      }
      return text;
    } catch {
      return text;
    }
  };

  const displayTitle = variant.title ? parseText(variant.title) : quizName;
  const displaySubtitle = variant.subtitle ? parseText(variant.subtitle) : (quizDescription || "");
  const bgImage = backgroundImage || "/quiz-images/general-bg.png";

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 bg-transparent border-none overflow-hidden">
        <div className="relative">
          {/* Close button */}
          <Button
            onClick={onClose}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full w-10 h-10 p-0"
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Preview badge */}
          <div className="absolute top-4 left-4 z-50 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Preview: {variant.variantName}
          </div>

          {/* Quiz start page preview */}
          <div
            className="relative min-h-[600px] flex items-center justify-center bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${bgImage})`,
            }}
          >
            <div className="max-w-2xl mx-auto px-6 py-12 text-center">
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {displayTitle}
              </h1>

              {/* Subtitle */}
              {displaySubtitle && (
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  {displaySubtitle}
                </p>
              )}

              {/* CTA Button */}
              <Button
                size="lg"
                className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg px-8 py-6 rounded-full shadow-lg transform hover:scale-105 transition-all duration-200"
                disabled
              >
                Почати квіз
              </Button>

              {/* Variant info */}
              <div className="mt-12 bg-black/60 backdrop-blur-sm rounded-lg p-4 text-left">
                <h3 className="text-white font-semibold mb-2">Інформація про варіант:</h3>
                <div className="space-y-1 text-sm text-gray-300">
                  <p><span className="text-gray-400">Назва:</span> {variant.variantName}</p>
                  <p><span className="text-gray-400">Трафік:</span> {variant.trafficPercentage}%</p>
                  {variant.title && (
                    <p><span className="text-gray-400">Заголовок:</span> {displayTitle}</p>
                  )}
                  {variant.subtitle && (
                    <p><span className="text-gray-400">Підзаголовок:</span> {displaySubtitle}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
