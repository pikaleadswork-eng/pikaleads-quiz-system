import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import type { AnswerOption } from "./DraggableQuestionEditor";

interface AnswerOptionRowProps {
  option: AnswerOption;
  index: number;
  onUpdate: (text: string, imageUrl?: string) => void;
  onRemove: () => void;
  canRemove: boolean;
  language: string;
}

export function AnswerOptionRow({
  option,
  index,
  onUpdate,
  onRemove,
  canRemove,
  language,
}: AnswerOptionRowProps) {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const uploadMutation = trpc.quizDesign.uploadImage.useMutation({
    onSuccess: (data: { url: string }) => {
      onUpdate(option.text, data.url);
      toast.success(language === "uk" ? "Зображення завантажено" : "Image uploaded");
      setUploading(false);
    },
    onError: (error: any) => {
      toast.error(`${language === "uk" ? "Помилка" : "Error"}: ${error.message}`);
      setUploading(false);
    },
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error(language === "uk" ? "Оберіть файл зображення" : "Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(language === "uk" ? "Файл занадто великий (макс 5MB)" : "File too large (max 5MB)");
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      uploadMutation.mutate({
        quizId: 0,
        imageType: "background",
        imageData: base64,
        mimeType: file.type,
      });
    };
    reader.onerror = () => {
      toast.error(language === "uk" ? "Помилка читання файлу" : "Error reading file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFile(file);
  };

  return (
    <div 
      className={`space-y-2 relative ${
        isDragging ? "ring-2 ring-primary ring-offset-2 rounded-lg" : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 bg-primary/10 rounded-lg flex items-center justify-center z-10 pointer-events-none">
          <p className="text-sm font-medium text-primary">
            {language === "uk" ? "Відпустіть, щоб завантажити" : "Drop to upload"}
          </p>
        </div>
      )}
      <div className="flex items-center gap-2">
        <span className="flex-shrink-0 w-6 text-sm text-muted-foreground">
          {index + 1}.
        </span>
        <Input
          value={option.text}
          onChange={(e) => onUpdate(e.target.value, option.imageUrl)}
          placeholder={`${language === "uk" ? "Варіант" : "Option"} ${index + 1}`}
          className="flex-1"
        />
        <label htmlFor={`image-upload-${index}`}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={uploading}
            asChild
          >
            <span className="cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <ImagePlus className="w-4 h-4" />
              )}
            </span>
          </Button>
        </label>
        <input
          id={`image-upload-${index}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
          disabled={uploading}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          disabled={!canRemove}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {option.imageUrl && (
        <div className="ml-8 relative inline-block">
          <img
            src={option.imageUrl}
            alt={option.text}
            className="h-20 w-20 object-cover rounded border border-zinc-700"
          />
          <Button
            size="sm"
            variant="destructive"
            className="absolute -top-2 -right-2 h-6 w-6 p-0"
            onClick={() => onUpdate(option.text, undefined)}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
