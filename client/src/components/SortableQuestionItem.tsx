import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Plus,
  X,
  Save,
  ImagePlus,
  Loader2,
  Globe,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { QuizQuestion, AnswerOption } from "./DraggableQuestionEditor";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AnswerOptionRow } from "./AnswerOptionRow";
import { 
  getTextForLanguage, 
  parseMultilingualText, 
  updateLanguageText,
  stringifyMultilingualText,
  type SupportedLanguage,
  type MultilingualText 
} from "@/lib/multilingualText";

interface SortableQuestionItemProps {
  question: QuizQuestion;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<QuizQuestion>) => void;
}

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "uk", label: "UA", flag: "🇺🇦" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "pl", label: "PL", flag: "🇵🇱" },
  { code: "de", label: "DE", flag: "🇩🇪" },
];

export function SortableQuestionItem({
  question,
  index,
  isExpanded,
  onToggleExpand,
  onDuplicate,
  onDelete,
  onUpdate,
}: SortableQuestionItemProps) {
  const { language } = useLanguage();
  const [editingLanguage, setEditingLanguage] = useState<SupportedLanguage>(language as SupportedLanguage || "uk");
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  // Parse multilingual question text
  const questionTextObj = parseMultilingualText(question.question);
  const [localQuestionTexts, setLocalQuestionTexts] = useState<MultilingualText>(questionTextObj);
  
  // Parse multilingual options
  const [localOptions, setLocalOptions] = useState<Array<{ text: MultilingualText; imageUrl?: string }>>(
    question.options.map(opt => ({
      text: parseMultilingualText(opt.text),
      imageUrl: opt.imageUrl,
    }))
  );

  // Update local state when question changes
  useEffect(() => {
    setLocalQuestionTexts(parseMultilingualText(question.question));
    setLocalOptions(question.options.map(opt => ({
      text: parseMultilingualText(opt.text),
      imageUrl: opt.imageUrl,
    })));
  }, [question.id]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get display text for current UI language
  const displayQuestionText = getTextForLanguage(question.question, language as SupportedLanguage || "uk");

  const handleSaveQuestion = () => {
    // Convert back to storage format
    const questionText = stringifyMultilingualText(localQuestionTexts);
    const options = localOptions.map(opt => ({
      text: stringifyMultilingualText(opt.text),
      imageUrl: opt.imageUrl,
    }));
    
    onUpdate({
      question: questionText,
      options: options as AnswerOption[],
    });
    toast.success(
      language === "uk" ? "Питання оновлено" : "Question updated"
    );
  };

  const handleAddOption = () => {
    const newOption: { text: MultilingualText; imageUrl?: string } = {
      text: {
        uk: `Варіант ${localOptions.length + 1}`,
        ru: `Вариант ${localOptions.length + 1}`,
        en: `Option ${localOptions.length + 1}`,
        pl: `Opcja ${localOptions.length + 1}`,
        de: `Option ${localOptions.length + 1}`,
      },
    };
    setLocalOptions([...localOptions, newOption]);
  };

  const handleRemoveOption = (optionIndex: number) => {
    if (localOptions.length <= 2) {
      toast.error(
        language === "uk"
          ? "Повинно бути мінімум 2 варіанти"
          : "Must have at least 2 options"
      );
      return;
    }
    const newOptions = localOptions.filter((_, i) => i !== optionIndex);
    setLocalOptions(newOptions);
  };

  const handleUpdateOptionText = (optionIndex: number, lang: SupportedLanguage, value: string) => {
    const newOptions = localOptions.map((opt, i) =>
      i === optionIndex 
        ? { ...opt, text: { ...opt.text, [lang]: value } }
        : opt
    );
    setLocalOptions(newOptions);
  };

  const handleUpdateQuestionText = (lang: SupportedLanguage, value: string) => {
    setLocalQuestionTexts(prev => ({ ...prev, [lang]: value }));
  };

  const handleSaveTemplate = () => {
    toast.success(
      language === "uk"
        ? "Питання збережено як шаблон"
        : "Question saved as template"
    );
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`overflow-hidden transition-all ${
        isDragging ? "shadow-lg ring-2 ring-primary" : ""
      }`}
    >
      {/* Question Header */}
      <div className="flex items-center gap-2 p-4 bg-muted/50">
        {/* Drag Handle */}
        <button
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Question Number */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
          {index + 1}
        </div>

        {/* Question Title (Collapsed) - Show current language text */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{displayQuestionText || "(Без тексту)"}</p>
          <p className="text-xs text-muted-foreground">
            {question.options.length} {language === "uk" ? "варіантів" : "options"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            title={language === "uk" ? "Дублювати" : "Duplicate"}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            title={language === "uk" ? "Видалити" : "Delete"}
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpand}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Question Details (Expanded) */}
      {isExpanded && (
        <div className="p-4 space-y-4 border-t">
          {/* Language Selector */}
          <div className="flex items-center gap-2 pb-2 border-b">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {language === "uk" ? "Мова редагування:" : "Edit language:"}
            </span>
            <div className="flex gap-1">
              {LANGUAGES.map(lang => (
                <Button
                  key={lang.code}
                  variant={editingLanguage === lang.code ? "default" : "outline"}
                  size="sm"
                  className="h-7 px-2"
                  onClick={() => setEditingLanguage(lang.code)}
                >
                  {lang.flag} {lang.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <Label>
              {language === "uk" ? "Текст питання" : "Question Text"} ({LANGUAGES.find(l => l.code === editingLanguage)?.flag})
            </Label>
            <Input
              value={localQuestionTexts[editingLanguage] || ""}
              onChange={(e) => handleUpdateQuestionText(editingLanguage, e.target.value)}
              placeholder={language === "uk" ? "Введіть питання..." : "Enter question..."}
              className="bg-zinc-800 border-zinc-700"
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                {language === "uk" ? "Варіанти відповідей" : "Answer Options"} ({LANGUAGES.find(l => l.code === editingLanguage)?.flag})
              </Label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddOption}
              >
                <Plus className="w-4 h-4 mr-1" />
                {language === "uk" ? "Додати варіант" : "Add Option"}
              </Button>
            </div>
            <div className="space-y-3">
              {localOptions.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground w-6">{optionIndex + 1}.</span>
                  <Input
                    value={option.text[editingLanguage] || ""}
                    onChange={(e) => handleUpdateOptionText(optionIndex, editingLanguage, e.target.value)}
                    placeholder={`${language === "uk" ? "Варіант" : "Option"} ${optionIndex + 1}`}
                    className="flex-1 bg-zinc-800 border-zinc-700"
                  />
                  {localOptions.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveOption(optionIndex)}
                    >
                      <X className="w-4 h-4 text-destructive" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveTemplate}
            >
              <Save className="w-4 h-4 mr-2" />
              {language === "uk" ? "Зберегти як шаблон" : "Save as Template"}
            </Button>
            <Button
              size="sm"
              onClick={handleSaveQuestion}
            >
              <Save className="w-4 h-4 mr-2" />
              {language === "uk" ? "Зберегти зміни" : "Save Changes"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
