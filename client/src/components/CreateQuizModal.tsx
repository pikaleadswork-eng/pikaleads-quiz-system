import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface CreateQuizModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onQuizCreated: (quizId: number) => void;
}

const PLATFORMS = [
  { value: "meta_ads", label: { uk: "Meta Ads", ru: "Meta Ads", en: "Meta Ads" } },
  { value: "google_ads", label: { uk: "Google Ads", ru: "Google Ads", en: "Google Ads" } },
  { value: "telegram", label: { uk: "Telegram", ru: "Telegram", en: "Telegram" } },
];

const NICHES = [
  { value: "furniture", label: { uk: "Меблі", ru: "Мебель", en: "Furniture" } },
  { value: "renovation", label: { uk: "Ремонт", ru: "Ремонт", en: "Renovation" } },
  { value: "ecommerce", label: { uk: "E-commerce", ru: "E-commerce", en: "E-commerce" } },
  { value: "services", label: { uk: "Послуги", ru: "Услуги", en: "Services" } },
  { value: "realestate", label: { uk: "Нерухомість", ru: "Недвижимость", en: "Real Estate" } },
  { value: "other", label: { uk: "Інше", ru: "Другое", en: "Other" } },
];

export default function CreateQuizModal({ open, onOpenChange, onQuizCreated }: CreateQuizModalProps) {
  const { t, i18n } = useTranslation();
  const [quizName, setQuizName] = useState("");
  const [platform, setPlatform] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");

  const createQuizMutation = trpc.quizzes.create.useMutation({
    onSuccess: (data) => {
      toast.success(i18n.language === "uk" ? "Квіз успішно створено!" : "Quiz created successfully!");
      onQuizCreated(data.id);
      onOpenChange(false);
      setQuizName("");
      setPlatform("");
      setNiche("");
      setDescription("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleCreate = () => {
    if (!quizName.trim()) {
      toast.error(i18n.language === "uk" ? "Введіть назву квізу" : "Enter quiz name");
      return;
    }
    if (!platform) {
      toast.error(i18n.language === "uk" ? "Оберіть платформу" : "Select platform");
      return;
    }
    if (!niche) {
      toast.error(i18n.language === "uk" ? "Оберіть нішу" : "Select niche");
      return;
    }

    createQuizMutation.mutate({
      name: quizName,
      slug: `${platform}-${niche}`.toLowerCase().replace(/\s+/g, '-'),
      description,
      quizType: "lead_generation",
      platform: platform as "google_ads" | "meta_ads" | "telegram",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            {i18n.language === "uk" ? "Створити новий квіз" : "Create New Quiz"}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {i18n.language === "uk" 
              ? "Заповніть основну інформацію про квіз. Ви зможете додати питання пізніше."
              : "Fill in basic quiz information. You can add questions later."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="platform" className="text-white">
              {i18n.language === "uk" ? "Платформа" : "Platform"}
            </Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder={i18n.language === "uk" ? "Оберіть платформу" : "Select platform"} />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {PLATFORMS.map((p) => (
                  <SelectItem key={p.value} value={p.value} className="text-white hover:bg-zinc-700">
                    {p.label[i18n.language as keyof typeof p.label] || p.label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quiz-name" className="text-white">
              {i18n.language === "uk" ? "Назва квізу" : "Quiz Name"}
            </Label>
            <Input
              id="quiz-name"
              placeholder={i18n.language === "uk" ? "Наприклад: Підбір меблів для вітальні" : "E.g.: Furniture Selection for Living Room"}
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="niche" className="text-white">
              {i18n.language === "uk" ? "Ніша" : "Niche"}
            </Label>
            <Select value={niche} onValueChange={setNiche}>
              <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                <SelectValue placeholder={i18n.language === "uk" ? "Оберіть нішу" : "Select niche"} />
              </SelectTrigger>
              <SelectContent className="bg-zinc-800 border-zinc-700">
                {NICHES.map((n) => (
                  <SelectItem key={n.value} value={n.value} className="text-white hover:bg-zinc-700">
                    {n.label[i18n.language as keyof typeof n.label] || n.label.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              {i18n.language === "uk" ? "Опис (необов'язково)" : "Description (optional)"}
            </Label>
            <Input
              id="description"
              placeholder={i18n.language === "uk" ? "Короткий опис квізу" : "Short quiz description"}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
          >
            {i18n.language === "uk" ? "Скасувати" : "Cancel"}
          </Button>
          <Button
            onClick={handleCreate}
            disabled={createQuizMutation.isPending}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {createQuizMutation.isPending 
              ? (i18n.language === "uk" ? "Створення..." : "Creating...")
              : (i18n.language === "uk" ? "Створити квіз" : "Create Quiz")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
