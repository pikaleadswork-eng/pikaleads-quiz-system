import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image as ImageIcon, Video, X, Loader2, Sparkles, CheckCircle2, XCircle } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";

interface BackgroundUploaderProps {
  currentImage?: string | null;
  currentVideo?: string | null;
  quizNiche?: string; // For AI generation
  onImageUploaded: (url: string) => void;
  onVideoUploaded: (url: string) => void;
  onRemoveImage: () => void;
  onRemoveVideo: () => void;
}

interface FileUploadStatus {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
  error?: string;
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
  const [bulkUploads, setBulkUploads] = useState<FileUploadStatus[]>([]);
  const [isBulkMode, setIsBulkMode] = useState(false);

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

  const uploadFileMutation = trpc.quizDesign.uploadBackground.useMutation();

  const processFile = useCallback(async (file: File, type: "image" | "video", index?: number) => {
    // Validate file type
    if (type === "image" && !file.type.startsWith("image/")) {
      if (index !== undefined) {
        setBulkUploads(prev => prev.map((item, i) => 
          i === index ? { ...item, status: 'error' as const, error: 'Невірний тип файлу' } : item
        ));
      } else {
        toast.error("Будь ласка, оберіть файл зображення (JPG, PNG, WebP)");
      }
      return;
    }

    if (type === "video" && !file.type.startsWith("video/")) {
      if (index !== undefined) {
        setBulkUploads(prev => prev.map((item, i) => 
          i === index ? { ...item, status: 'error' as const, error: 'Невірний тип файлу' } : item
        ));
      } else {
        toast.error("Будь ласка, оберіть відео файл (MP4, WebM)");
      }
      return;
    }

    // Validate file size (max 10MB for images, 50MB for videos)
    const maxSize = type === "image" ? 10 * 1024 * 1024 : 50 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = `Файл занадто великий. Максимум ${type === "image" ? "10MB" : "50MB"}`;
      if (index !== undefined) {
        setBulkUploads(prev => prev.map((item, i) => 
          i === index ? { ...item, status: 'error' as const, error: errorMsg } : item
        ));
      } else {
        toast.error(errorMsg);
      }
      return;
    }

    if (index !== undefined) {
      setBulkUploads(prev => prev.map((item, i) => 
        i === index ? { ...item, status: 'uploading' as const, progress: 10 } : item
      ));
    } else {
      setUploading(true);
      setUploadProgress(10);
    }

    // Convert file to base64
    const reader = new FileReader();
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 50) + 10;
        if (index !== undefined) {
          setBulkUploads(prev => prev.map((item, i) => 
            i === index ? { ...item, progress } : item
          ));
        } else {
          setUploadProgress(progress);
        }
      }
    };
    reader.onload = async () => {
      try {
        if (index !== undefined) {
          setBulkUploads(prev => prev.map((item, i) => 
            i === index ? { ...item, progress: 70 } : item
          ));
        } else {
          setUploadProgress(70);
        }
        
        const base64 = reader.result as string;
        const result = await uploadFileMutation.mutateAsync({
          fileData: base64,
          fileName: file.name,
          mimeType: file.type,
        });

        if (index !== undefined) {
          setBulkUploads(prev => prev.map((item, i) => 
            i === index ? { ...item, status: 'success' as const, progress: 100, url: result.url } : item
          ));
          // Auto-select first uploaded image
          if (index === 0 && type === "image") {
            onImageUploaded(result.url);
          }
        } else {
          if (type === "image") {
            onImageUploaded(result.url);
            toast.success("Зображення завантажено");
          } else {
            onVideoUploaded(result.url);
            toast.success("Відео завантажено");
          }
          setUploading(false);
          setUploadProgress(0);
        }
      } catch (error: any) {
        const errorMsg = error.message || "Помилка завантаження";
        if (index !== undefined) {
          setBulkUploads(prev => prev.map((item, i) => 
            i === index ? { ...item, status: 'error' as const, error: errorMsg } : item
          ));
        } else {
          toast.error(errorMsg);
          setUploading(false);
          setUploadProgress(0);
        }
      }
    };
    reader.onerror = () => {
      const errorMsg = "Помилка читання файлу";
      if (index !== undefined) {
        setBulkUploads(prev => prev.map((item, i) => 
          i === index ? { ...item, status: 'error' as const, error: errorMsg } : item
        ));
      } else {
        toast.error(errorMsg);
        setUploading(false);
        setUploadProgress(0);
      }
    };
    reader.readAsDataURL(file);
  }, [uploadFileMutation, onImageUploaded, onVideoUploaded]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (files.length === 1) {
      // Single file upload
      setIsBulkMode(false);
      await processFile(files[0], uploadType);
    } else {
      // Bulk upload
      setIsBulkMode(true);
      const fileStatuses: FileUploadStatus[] = Array.from(files).map(file => ({
        file,
        status: 'pending' as const,
        progress: 0,
      }));
      setBulkUploads(fileStatuses);

      // Upload files sequentially to avoid overwhelming the server
      for (let i = 0; i < fileStatuses.length; i++) {
        await processFile(files[i], uploadType, i);
        // Small delay between uploads
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
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

    if (files.length === 1) {
      // Single file upload
      setIsBulkMode(false);
      await processFile(files[0], type);
    } else {
      // Bulk upload
      setIsBulkMode(true);
      const fileStatuses: FileUploadStatus[] = Array.from(files).map(file => ({
        file,
        status: 'pending' as const,
        progress: 0,
      }));
      setBulkUploads(fileStatuses);

      // Upload files sequentially
      for (let i = 0; i < fileStatuses.length; i++) {
        await processFile(files[i], type, i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
  }, [processFile]);

  const clearBulkUploads = () => {
    setBulkUploads([]);
    setIsBulkMode(false);
  };

  const successCount = bulkUploads.filter(f => f.status === 'success').length;
  const errorCount = bulkUploads.filter(f => f.status === 'error').length;

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

          {/* Bulk Upload Status */}
          {isBulkMode && bulkUploads.length > 0 && (
            <Card className="p-4 bg-zinc-800/50 border-zinc-700">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white">
                  Завантаження {bulkUploads.length} файлів
                </h4>
                <div className="flex items-center gap-3 text-xs">
                  <span className="text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {successCount}
                  </span>
                  {errorCount > 0 && (
                    <span className="text-red-400 flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      {errorCount}
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {bulkUploads.map((upload, index) => (
                  <div key={index} className="bg-zinc-900 p-3 rounded">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-zinc-300 truncate flex-1">
                        {upload.file.name}
                      </span>
                      {upload.status === 'success' && (
                        <CheckCircle2 className="w-4 h-4 text-green-400 ml-2" />
                      )}
                      {upload.status === 'error' && (
                        <XCircle className="w-4 h-4 text-red-400 ml-2" />
                      )}
                      {upload.status === 'uploading' && (
                        <Loader2 className="w-4 h-4 text-purple-400 animate-spin ml-2" />
                      )}
                    </div>
                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="h-1" />
                    )}
                    {upload.status === 'error' && (
                      <p className="text-xs text-red-400 mt-1">{upload.error}</p>
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={clearBulkUploads}
                variant="outline"
                size="sm"
                className="w-full mt-3"
              >
                Закрити
              </Button>
            </Card>
          )}

          {currentImage && !isBulkMode ? (
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
          ) : !isBulkMode && (
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
                      <span className="text-purple-400 font-medium">Відпустіть файли для завантаження</span>
                    ) : (
                      <>Перетягніть одне або кілька зображень сюди</>
                    )}
                  </p>
                  <p className="text-xs text-zinc-500 mb-4">
                    JPG, PNG, WebP • Максимум 10MB кожне • Підтримка множинного вибору
                  </p>
                  <label htmlFor="image-upload">
                    <Button asChild disabled={uploading}>
                      <span className="cursor-pointer">
                        <Upload className="w-4 h-4 mr-2" />
                        Обрати файли
                      </span>
                    </Button>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
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
