import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { QuizQuestion, AnswerOption } from "./DraggableQuestionEditor";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { AnswerOptionRow } from "./AnswerOptionRow";

interface SortableQuestionItemProps {
  question: QuizQuestion;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<QuizQuestion>) => void;
}

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const [localQuestion, setLocalQuestion] = useState(question.question);
  const [localOptions, setLocalOptions] = useState(question.options);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSaveQuestion = () => {
    onUpdate({
      question: localQuestion,
      options: localOptions,
    });
    toast.success(
      language === "uk" ? "Питання оновлено" : "Question updated"
    );
  };

  const handleAddOption = () => {
    const newOptions: AnswerOption[] = [
      ...localOptions,
      { text: language === "uk" ? `Варіант ${localOptions.length + 1}` : `Option ${localOptions.length + 1}` },
    ];
    setLocalOptions(newOptions);
    onUpdate({ options: newOptions });
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
    onUpdate({ options: newOptions });
  };

  const handleUpdateOption = (optionIndex: number, value: string, imageUrl?: string) => {
    const newOptions = localOptions.map((opt, i) =>
      i === optionIndex ? { text: value, imageUrl: imageUrl || opt.imageUrl } : opt
    );
    setLocalOptions(newOptions);
  };

  const handleSaveTemplate = () => {
    // TODO: Implement save as template functionality
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

        {/* Question Title (Collapsed) */}
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{question.question}</p>
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
          {/* Question Text */}
          <div className="space-y-2">
            <Label>
              {language === "uk" ? "Текст питання" : "Question Text"}
            </Label>
            <Input
              value={localQuestion}
              onChange={(e) => setLocalQuestion(e.target.value)}
              placeholder={language === "uk" ? "Введіть питання..." : "Enter question..."}
            />
          </div>

          {/* Options */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>
                {language === "uk" ? "Варіанти відповідей" : "Answer Options"}
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
                <AnswerOptionRow
                  key={optionIndex}
                  option={option}
                  index={optionIndex}
                  onUpdate={(text, imageUrl) => handleUpdateOption(optionIndex, text, imageUrl)}
                  onRemove={() => handleRemoveOption(optionIndex)}
                  canRemove={localOptions.length > 2}
                  language={language}
                />
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
