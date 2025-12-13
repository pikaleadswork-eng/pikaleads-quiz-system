import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as ImageIcon, Video, X, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { BackgroundGallery } from "@/components/BackgroundGallery";

interface BackgroundUploaderProps {
  currentImage?: string | null;
  currentVideo?: string | null;
  quizNiche?: string; // For AI generation
  onImageUploaded: (url: string) => void;
  onVideoUploaded: (url: string) => void;
  onRemoveImage: () => void;
  onRemoveVideo: () => void;
}

export function BackgroundUploader({
  currentImage,
  currentVideo,
  quizNiche,
  onImageUploaded,
  onVideoUploaded,
  onRemoveImage,
  onRemoveVideo,
}: BackgroundUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [uploadType, setUploadType] = useState<"image" | "video">("image");
  const [aiStyle, setAiStyle] = useState<"modern" | "minimalist" | "professional" | "vibrant">("professional");

  const generateMutation = trpc.quizDesign.generateBackground.useMutation({
    onSuccess: (data: { url: string; fileKey: string }) => {
      onImageUploaded(data.url);
      toast.success("AI зображення згенеровано");
      setGenerating(false);
    },
    onError: (error: any) => {
      toast.error(`Помилка генерації: ${error.message}`);
      setGenerating(false);
    },
  });

  const uploadFileMutation = trpc.quizDesign.uploadBackground.useMutation({
    onSuccess: (data: { url: string; fileKey: string }) => {
      if (uploadType === "image") {
        onImageUploaded(data.url);
        toast.success("Зображення завантажено");
      } else {
        onVideoUploaded(data.url);
        toast.success("Відео завантажено");
      }
      setUploading(false);
    },
    onError: (error: any) => {
      toast.error(`Помилка завантаження: ${error.message}`);
      setUploading(false);
    },
  });

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (uploadType === "image" && !file.type.startsWith("image/")) {
      toast.error("Будь ласка, оберіть файл зображення");
      return;
    }

    if (uploadType === "video" && !file.type.startsWith("video/")) {
      toast.error("Будь ласка, оберіть відео файл");
      return;
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = uploadType === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Файл занадто великий. Максимум ${uploadType === "image" ? "10MB" : "50MB"}`);
      return;
    }

    setUploading(true);

    // Convert file to base64
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      uploadFileMutation.mutate({
        fileData: base64,
        fileName: file.name,
        mimeType: file.type,
      });
    };
    reader.onerror = () => {
      toast.error("Помилка читання файлу");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <Card className="p-6 bg-zinc-900 border-zinc-800">
      <h3 className="text-lg font-semibold text-white mb-4">Фон</h3>

      <Tabs defaultValue="image" onValueChange={(v) => setUploadType(v as "image" | "video")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="image" className="gap-2">
            <ImageIcon className="w-4 h-4" />
            Зображення
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-2">
            <Video className="w-4 h-4" />
            Відео
          </TabsTrigger>
        </TabsList>

        <TabsContent value="image" className="space-y-4">
          {/* Background Gallery */}
          <BackgroundGallery
            currentBackground={currentImage}
            onSelect={(url) => onImageUploaded(url)}
          />
          
          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-zinc-900 px-2 text-zinc-500">АБО</span>
            </div>
          </div>

          {/* AI Generation Section */}
          {quizNiche && (
            <Card className="p-4 bg-zinc-800/50 border-zinc-700">
              <div className="space-y-3">
                <Label className="text-sm text-zinc-300">Згенерувати AI фон</Label>
                <Select value={aiStyle} onValueChange={(v) => setAiStyle(v as any)}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Професійний</SelectItem>
                    <SelectItem value="modern">Сучасний</SelectItem>
                    <SelectItem value="minimalist">Мінімалістичний</SelectItem>
                    <SelectItem value="vibrant">Яскравий</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => {
                    setGenerating(true);
                    generateMutation.mutate({ niche: quizNiche, style: aiStyle });
                  }}
                  disabled={generating}
                  className="w-full bg-purple-600 hover:bg-purple-700"
                >
                  {generating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Генерація...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Згенерувати AI фон
                    </>
                  )}
                </Button>
              </div>
            </Card>
          )}

          {currentImage ? (
            <div className="relative">
              <img
                src={currentImage}
                alt="Background"
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={onRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
              <ImageIcon className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
              <p className="text-sm text-zinc-400 mb-4">
                Завантажте фонове зображення (JPG, PNG, max 10MB)
              </p>
              <label htmlFor="image-upload">
                <Button asChild disabled={uploading}>
                  <span className="cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Завантаження...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Обрати файл
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="video" className="space-y-4">
          {currentVideo ? (
            <div className="relative">
              <video
                src={currentVideo}
                className="w-full h-48 object-cover rounded-lg"
                controls
              />
              <Button
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={onRemoveVideo}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-zinc-700 rounded-lg p-8 text-center">
              <Video className="w-12 h-12 mx-auto mb-4 text-zinc-500" />
              <p className="text-sm text-zinc-400 mb-4">
                Завантажте фонове відео (MP4, WebM, max 50MB)
              </p>
              <label htmlFor="video-upload">
                <Button asChild disabled={uploading}>
                  <span className="cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Завантаження...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Обрати файл
                      </>
                    )}
                  </span>
                </Button>
              </label>
              <input
                id="video-upload"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={handleFileSelect}
                disabled={uploading}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
