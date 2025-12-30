import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Plus, Trash2, TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface QuestionTemplateLibraryProps {
  onUseTemplate?: (template: any) => void;
}

export default function QuestionTemplateLibrary({
  onUseTemplate,
}: QuestionTemplateLibraryProps) {
  const { language } = useLanguage();
  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);

  // Form state for saving new template
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    category: "General",
    questionText: "",
    questionType: "single" as "single" | "multiple" | "text",
    options: ["", ""],
    isRequired: true,
  });

  const { data: templates, refetch } = trpc.questionTemplates.getAll.useQuery({
    category: category === "all" ? undefined : category,
    search: searchQuery || undefined,
  });

  const useTemplateMutation = trpc.questionTemplates.use.useMutation({
    onSuccess: (data) => {
      toast.success(
        language === "uk"
          ? "Шаблон додано до квізу"
          : "Template added to quiz"
      );
      if (onUseTemplate) {
        onUseTemplate(data);
      }
    },
  });

  const saveTemplateMutation = trpc.questionTemplates.save.useMutation({
    onSuccess: () => {
      toast.success(
        language === "uk"
          ? "Шаблон збережено!"
          : "Template saved!"
      );
      setSaveDialogOpen(false);
      setNewTemplate({
        title: "",
        category: "General",
        questionText: "",
        questionType: "single",
        options: ["", ""],
        isRequired: true,
      });
      refetch();
    },
  });

  const deleteTemplateMutation = trpc.questionTemplates.delete.useMutation({
    onSuccess: () => {
      toast.success(
        language === "uk"
          ? "Шаблон видалено"
          : "Template deleted"
      );
      refetch();
    },
  });

  const handleUseTemplate = (templateId: number) => {
    useTemplateMutation.mutate({ templateId });
  };

  const handleDeleteTemplate = (templateId: number) => {
    if (confirm(language === "uk" ? "Видалити цей шаблон?" : "Delete this template?")) {
      deleteTemplateMutation.mutate({ templateId });
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.title || !newTemplate.questionText) {
      toast.error(
        language === "uk"
          ? "Заповніть всі обов'язкові поля"
          : "Fill in all required fields"
      );
      return;
    }

    const validOptions = newTemplate.options.filter(opt => opt.trim() !== "");
    if (validOptions.length < 2 && newTemplate.questionType !== "text") {
      toast.error(
        language === "uk"
          ? "Додайте мінімум 2 варіанти відповіді"
          : "Add at least 2 answer options"
      );
      return;
    }

    saveTemplateMutation.mutate({
      ...newTemplate,
      options: validOptions,
    });
  };

  const categories = [
    { value: "all", label: language === "uk" ? "Всі категорії" : "All Categories" },
    { value: "General", label: language === "uk" ? "Загальні" : "General" },
    { value: "Furniture", label: language === "uk" ? "Меблі" : "Furniture" },
    { value: "Renovation", label: language === "uk" ? "Ремонт" : "Renovation" },
    { value: "E-commerce", label: language === "uk" ? "E-commerce" : "E-commerce" },
    { value: "Services", label: language === "uk" ? "Послуги" : "Services" },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {language === "uk" ? "Бібліотека шаблонів питань" : "Question Template Library"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "uk"
              ? "Зберігайте та використовуйте часто вживані питання"
              : "Save and reuse frequently used questions"}
          </p>
        </div>
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {language === "uk" ? "Створити шаблон" : "Create Template"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {language === "uk" ? "Новий шаблон питання" : "New Question Template"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>{language === "uk" ? "Назва шаблону" : "Template Title"}</Label>
                <Input
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder={language === "uk" ? "Наприклад: Бюджет проекту" : "e.g., Project Budget"}
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "uk" ? "Категорія" : "Category"}</Label>
                <Select
                  value={newTemplate.category}
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.slice(1).map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>{language === "uk" ? "Текст питання" : "Question Text"}</Label>
                <Input
                  value={newTemplate.questionText}
                  onChange={(e) => setNewTemplate({ ...newTemplate, questionText: e.target.value })}
                  placeholder={language === "uk" ? "Введіть питання..." : "Enter question..."}
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "uk" ? "Варіанти відповідей" : "Answer Options"}</Label>
                {newTemplate.options.map((option, index) => (
                  <Input
                    key={index}
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...newTemplate.options];
                      newOptions[index] = e.target.value;
                      setNewTemplate({ ...newTemplate, options: newOptions });
                    }}
                    placeholder={`${language === "uk" ? "Варіант" : "Option"} ${index + 1}`}
                  />
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setNewTemplate({
                    ...newTemplate,
                    options: [...newTemplate.options, ""]
                  })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {language === "uk" ? "Додати варіант" : "Add Option"}
                </Button>
              </div>

              <Button onClick={handleSaveTemplate} className="w-full">
                {language === "uk" ? "Зберегти шаблон" : "Save Template"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "uk" ? "Пошук шаблонів..." : "Search templates..."}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Templates Grid */}
      {!templates || templates.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            {language === "uk"
              ? "Шаблони не знайдено. Створіть перший шаблон!"
              : "No templates found. Create your first template!"}
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template: any) => (
            <Card key={template.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold">{template.title}</h4>
                  <p className="text-sm text-muted-foreground">{template.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTemplate(template.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <p className="text-sm">{template.questionText}</p>

              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <TrendingUp className="w-3 h-3" />
                {language === "uk" ? "Використано" : "Used"}: {template.usageCount} {language === "uk" ? "разів" : "times"}
              </div>

              <Button
                size="sm"
                className="w-full"
                onClick={() => handleUseTemplate(template.id)}
              >
                {language === "uk" ? "Використати" : "Use Template"}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
