import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Type,
  Hash,
  Mail,
  Phone,
  CheckCircle,
  CheckSquare,
  Sliders,
  Calendar,
  Upload,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";

export type QuestionType =
  | "text"
  | "number"
  | "email"
  | "phone"
  | "single_choice"
  | "multiple_choice"
  | "slider"
  | "date"
  | "file"
  | "rating";

export interface QuizQuestion {
  id: string;
  text: string;
  type: QuestionType;
  required: boolean;
  placeholder?: string;
  options?: string[];
  min?: number;
  max?: number;
  step?: number;
}

interface ImprovedQuizEditorProps {
  questions: QuizQuestion[];
  onChange: (questions: QuizQuestion[]) => void;
}

const questionTypeIcons: Record<QuestionType, React.ComponentType<{ className?: string }>> = {
  text: Type,
  number: Hash,
  email: Mail,
  phone: Phone,
  single_choice: CheckCircle,
  multiple_choice: CheckSquare,
  slider: Sliders,
  date: Calendar,
  file: Upload,
  rating: Star,
};

function SortableQuestion({
  question,
  index,
  onUpdate,
  onDelete,
  onDuplicate,
}: {
  question: QuizQuestion;
  index: number;
  onUpdate: (q: QuizQuestion) => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(true);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = questionTypeIcons[question.type];

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="p-4 border-2 hover:border-primary/50 transition-colors">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </div>

          {/* Question number & type icon */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Icon className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-foreground">
              {t("quizEditor.question")} {index + 1}
            </span>
          </div>

          {/* Expand/collapse */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-auto"
          >
            {isExpanded ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>

          {/* Actions */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDuplicate}
            title={t("quizEditor.duplicate")}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive"
            title={t("quizEditor.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {/* Question content */}
        {isExpanded && (
          <div className="space-y-4 pl-11">
            {/* Question text */}
            <div>
              <Label>{t("quizEditor.questionText")}</Label>
              <Textarea
                value={question.text}
                onChange={(e) => onUpdate({ ...question, text: e.target.value })}
                placeholder={t("quizEditor.questionTextPlaceholder")}
                className="mt-1 bg-zinc-800"
              />
            </div>

            {/* Question type */}
            <div>
              <Label>{t("quizEditor.questionType")}</Label>
              <Select
                value={question.type}
                onValueChange={(value) =>
                  onUpdate({ ...question, type: value as QuestionType })
                }
              >
                <SelectTrigger className="mt-1 bg-zinc-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(questionTypeIcons).map(([type, Icon]) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {t(`quizEditor.questionTypes.${type}`)}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Options for choice questions */}
            {(question.type === "single_choice" || question.type === "multiple_choice") && (
              <div>
                <Label>{t("quizEditor.options")}</Label>
                <div className="space-y-2 mt-1">
                  {(question.options || []).map((option, idx) => (
                    <div key={idx} className="flex gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])];
                          newOptions[idx] = e.target.value;
                          onUpdate({ ...question, options: newOptions });
                        }}
                        placeholder={`${t("quizEditor.option")} ${idx + 1}`}
                        className="bg-zinc-800"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newOptions = (question.options || []).filter(
                            (_, i) => i !== idx
                          );
                          onUpdate({ ...question, options: newOptions });
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onUpdate({
                        ...question,
                        options: [...(question.options || []), ""],
                      });
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("quizEditor.addOption")}
                  </Button>
                </div>
              </div>
            )}

            {/* Slider settings */}
            {question.type === "slider" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>{t("quizEditor.min")}</Label>
                  <Input
                    type="number"
                    value={question.min || 0}
                    onChange={(e) =>
                      onUpdate({ ...question, min: parseInt(e.target.value) })
                    }
                    className="mt-1 bg-zinc-800"
                  />
                </div>
                <div>
                  <Label>{t("quizEditor.max")}</Label>
                  <Input
                    type="number"
                    value={question.max || 100}
                    onChange={(e) =>
                      onUpdate({ ...question, max: parseInt(e.target.value) })
                    }
                    className="mt-1 bg-zinc-800"
                  />
                </div>
                <div>
                  <Label>{t("quizEditor.step")}</Label>
                  <Input
                    type="number"
                    value={question.step || 1}
                    onChange={(e) =>
                      onUpdate({ ...question, step: parseInt(e.target.value) })
                    }
                    className="mt-1 bg-zinc-800"
                  />
                </div>
              </div>
            )}

            {/* Placeholder */}
            <div>
              <Label>{t("quizEditor.placeholder")}</Label>
              <Input
                value={question.placeholder || ""}
                onChange={(e) =>
                  onUpdate({ ...question, placeholder: e.target.value })
                }
                placeholder={t("quizEditor.placeholderPlaceholder")}
                className="mt-1 bg-zinc-800"
              />
            </div>

            {/* Required toggle */}
            <div className="flex items-center justify-between">
              <Label>{t("quizEditor.required")}</Label>
              <Switch
                checked={question.required}
                onCheckedChange={(checked) =>
                  onUpdate({ ...question, required: checked })
                }
              />
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export function ImprovedQuizEditor({ questions, onChange }: ImprovedQuizEditorProps) {
  const { t } = useTranslation();
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((q) => q.id === active.id);
      const newIndex = questions.findIndex((q) => q.id === over.id);
      onChange(arrayMove(questions, oldIndex, newIndex));
    }
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `q-${Date.now()}`,
      text: "",
      type: "text",
      required: false,
    };
    onChange([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updated: QuizQuestion) => {
    const newQuestions = [...questions];
    newQuestions[index] = updated;
    onChange(newQuestions);
  };

  const deleteQuestion = (index: number) => {
    onChange(questions.filter((_, i) => i !== index));
  };

  const duplicateQuestion = (index: number) => {
    const question = questions[index];
    const duplicated: QuizQuestion = {
      ...question,
      id: `q-${Date.now()}`,
      text: `${question.text} (${t("quizEditor.copy")})`,
    };
    const newQuestions = [...questions];
    newQuestions.splice(index + 1, 0, duplicated);
    onChange(newQuestions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground">
            {t("quizEditor.title")}
          </h3>
          <p className="text-muted-foreground">
            {t("quizEditor.subtitle")}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {t("quizEditor.questionsCount", { count: questions.length })}
        </div>
      </div>

      {/* Questions list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map((q) => q.id)}
          strategy={verticalListSortingStrategy}
        >
          {questions.map((question, index) => (
            <SortableQuestion
              key={question.id}
              question={question}
              index={index}
              onUpdate={(q) => updateQuestion(index, q)}
              onDelete={() => deleteQuestion(index)}
              onDuplicate={() => duplicateQuestion(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {/* Add question button */}
      <Button onClick={addQuestion} size="lg" className="w-full gap-2">
        <Plus className="w-5 h-5" />
        {t("quizEditor.addQuestion")}
      </Button>

      {/* Empty state */}
      {questions.length === 0 && (
        <Card className="p-12 text-center border-dashed">
          <div className="max-w-md mx-auto space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Plus className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground">
              {t("quizEditor.noQuestions")}
            </h3>
            <p className="text-muted-foreground">
              {t("quizEditor.noQuestionsDescription")}
            </p>
            <Button onClick={addQuestion} size="lg" className="gap-2">
              <Plus className="w-5 h-5" />
              {t("quizEditor.addFirstQuestion")}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
