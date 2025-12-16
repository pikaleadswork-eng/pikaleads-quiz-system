import { useState, useCallback } from "react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

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
      setUploadProgress(0);
    },
    onError: (error: any) => {
      toast.error(`Помилка завантаження: ${error.message}`);
      setUploading(false);
      setUploadProgress(0);
    },
  });

  const processFile = useCallback(async (file: File, type: "image" | "video") => {
    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      toast.error("Будь ласка, оберіть файл зображення (JPG, PNG, WebP)");
      return;
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      toast.error("Будь ласка, оберіть відео файл (MP4, WebM)");
      return;
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = type === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(`Файл занадто великий. Максимум ${type === "image" ? "10MB" : "50MB"}`);
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    // Convert file to base64
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 50) + 10;
        setUploadProgress(progress);
      }
    };
    reader.onload = async () => {
      setUploadProgress(70);
      const base64 = reader.result as string;
      setUploadType(type);
      uploadFileMutation.mutate({
        fileData: base64,
        fileName: file.name,
        mimeType: file.type,
      });
      setUploadProgress(90);
    };
    reader.onerror = () => {
      toast.error("Помилка читання файлу");
      setUploading(false);
      setUploadProgress(0);
    };
    reader.readAsDataURL(file);
  }, [uploadFileMutation]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await processFile(file, uploadType);
  };

  // Drag and drop handlers
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set isDragging to false if we're leaving the drop zone entirely
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent, type: "image" | "video") => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;

    const file = files[0];
    await processFile(file, type);
  }, [processFile]);

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
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragging
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-zinc-700 hover:border-zinc-500"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "image")}
            >
              {uploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto text-purple-500 animate-spin" />
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-zinc-400">Завантаження... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <ImageIcon className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-purple-400" : "text-zinc-500"}`} />
                  <p className="text-sm text-zinc-400 mb-2">
                    {isDragging ? (
                      <span className="text-purple-400 font-medium">Відпустіть файл для завантаження</span>
                    ) : (
                      <>Перетягніть зображення сюди</>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    JPG, PNG, WebP • Максимум 10MB
                  </p>
                  <label htmlFor="image-upload">
                    <Button asChild disabled={uploading}>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Або оберіть файл
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
                </>
              )}
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
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
                isDragging
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-zinc-700 hover:border-zinc-500"
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, "video")}
            >
              {uploading ? (
                <div className="space-y-4">
                  <Loader2 className="w-12 h-12 mx-auto text-purple-500 animate-spin" />
                  <div className="w-full bg-zinc-700 rounded-full h-2">
                    <div
                      className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-zinc-400">Завантаження... {uploadProgress}%</p>
                </div>
              ) : (
                <>
                  <Video className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-purple-400" : "text-zinc-500"}`} />
                  <p className="text-sm text-zinc-400 mb-2">
                    {isDragging ? (
                      <span className="text-purple-400 font-medium">Відпустіть файл для завантаження</span>
                    ) : (
                      <>Перетягніть відео сюди</>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    MP4, WebM • Максимум 50MB
                  </p>
                  <label htmlFor="video-upload">
                    <Button asChild disabled={uploading}>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Або оберіть файл
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
                </>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
