import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  GripVertical,
  Plus,
  Trash2,
  Eye,
  Save,
  X,
  Star,
  Calendar,
  Upload,
  Hash,
  Mail,
  Phone,
  Type,
  CheckSquare,
  Circle,
  Sliders,
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

export interface QuestionOption {
  id: string;
  text: string;
  score?: number;
}

export interface Question {
  id: string;
  questionText: string;
  questionType: QuestionType;
  isRequired: boolean;
  options?: QuestionOption[];
  config?: {
    min?: number;
    max?: number;
    step?: number;
    maxStars?: number;
    placeholder?: string;
    fileTypes?: string[];
  };
}

interface QuizEditorProps {
  quizId?: number;
  initialQuestions?: Question[];
  onSave: (questions: Question[]) => void;
}

const questionTypeIcons: Record<QuestionType, any> = {
  text: Type,
  number: Hash,
  email: Mail,
  phone: Phone,
  single_choice: Circle,
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
}: {
  question: Question;
  index: number;
  onUpdate: (question: Question) => void;
  onDelete: () => void;
}) {
  const { t } = useTranslation();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [isExpanded, setIsExpanded] = useState(true);

  const QuestionIcon = questionTypeIcons[question.questionType];

  const addOption = () => {
    const newOption: QuestionOption = {
      id: `opt-${Date.now()}`,
      text: "",
      score: 0,
    };
    onUpdate({
      ...question,
      options: [...(question.options || []), newOption],
    });
  };

  const updateOption = (optionId: string, updates: Partial<QuestionOption>) => {
    onUpdate({
      ...question,
      options: question.options?.map((opt) =>
        opt.id === optionId ? { ...opt, ...updates } : opt
      ),
    });
  };

  const deleteOption = (optionId: string) => {
    onUpdate({
      ...question,
      options: question.options?.filter((opt) => opt.id !== optionId),
    });
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4">
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>
            <QuestionIcon className="w-5 h-5 text-purple-400" />
            <CardTitle className="text-sm flex-1">
              {t("quizEditor.question")} {index + 1}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? <X className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={onDelete}>
              <Trash2 className="w-4 h-4 text-red-400" />
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-4">
            {/* Question Text */}
            <div>
              <Label>{t("quizEditor.questionText")}</Label>
              <Textarea
                value={question.questionText}
                onChange={(e) =>
                  onUpdate({ ...question, questionText: e.target.value })
                }
                placeholder={t("quizEditor.questionTextPlaceholder")}
                className="bg-zinc-800 border-zinc-700 mt-2"
              />
            </div>

            {/* Question Type */}
            <div>
              <Label>{t("quizEditor.questionType")}</Label>
              <Select
                value={question.questionType}
                onValueChange={(value: QuestionType) =>
                  onUpdate({ ...question, questionType: value })
                }
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">{t("quizEditor.types.text")}</SelectItem>
                  <SelectItem value="number">{t("quizEditor.types.number")}</SelectItem>
                  <SelectItem value="email">{t("quizEditor.types.email")}</SelectItem>
                  <SelectItem value="phone">{t("quizEditor.types.phone")}</SelectItem>
                  <SelectItem value="single_choice">
                    {t("quizEditor.types.singleChoice")}
                  </SelectItem>
                  <SelectItem value="multiple_choice">
                    {t("quizEditor.types.multipleChoice")}
                  </SelectItem>
                  <SelectItem value="slider">{t("quizEditor.types.slider")}</SelectItem>
                  <SelectItem value="date">{t("quizEditor.types.date")}</SelectItem>
                  <SelectItem value="file">{t("quizEditor.types.file")}</SelectItem>
                  <SelectItem value="rating">{t("quizEditor.types.rating")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Required Toggle */}
            <div className="flex items-center justify-between">
              <Label>{t("quizEditor.required")}</Label>
              <Switch
                checked={question.isRequired}
                onCheckedChange={(checked) =>
                  onUpdate({ ...question, isRequired: checked })
                }
              />
            </div>

            {/* Choice Options */}
            {(question.questionType === "single_choice" ||
              question.questionType === "multiple_choice") && (
              <div className="space-y-3">
                <Label>{t("quizEditor.options")}</Label>
                {question.options?.map((option, optIndex) => (
                  <div key={option.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500 w-6">{optIndex + 1}.</span>
                    <Input
                      value={option.text}
                      onChange={(e) =>
                        updateOption(option.id, { text: e.target.value })
                      }
                      placeholder={t("quizEditor.optionText")}
                      className="flex-1 bg-zinc-800 border-zinc-700"
                    />
                    <Input
                      type="number"
                      value={option.score || 0}
                      onChange={(e) =>
                        updateOption(option.id, { score: parseInt(e.target.value) })
                      }
                      placeholder={t("quizEditor.score")}
                      className="w-20 bg-zinc-800 border-zinc-700"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteOption(option.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addOption}>
                  <Plus className="w-4 h-4 mr-2" />
                  {t("quizEditor.addOption")}
                </Button>
              </div>
            )}

            {/* Slider Config */}
            {question.questionType === "slider" && (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>{t("quizEditor.min")}</Label>
                  <Input
                    type="number"
                    value={question.config?.min || 0}
                    onChange={(e) =>
                      onUpdate({
                        ...question,
                        config: { ...question.config, min: parseInt(e.target.value) },
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 mt-2"
                  />
                </div>
                <div>
                  <Label>{t("quizEditor.max")}</Label>
                  <Input
                    type="number"
                    value={question.config?.max || 100}
                    onChange={(e) =>
                      onUpdate({
                        ...question,
                        config: { ...question.config, max: parseInt(e.target.value) },
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 mt-2"
                  />
                </div>
                <div>
                  <Label>{t("quizEditor.step")}</Label>
                  <Input
                    type="number"
                    value={question.config?.step || 1}
                    onChange={(e) =>
                      onUpdate({
                        ...question,
                        config: { ...question.config, step: parseInt(e.target.value) },
                      })
                    }
                    className="bg-zinc-800 border-zinc-700 mt-2"
                  />
                </div>
              </div>
            )}

            {/* Rating Config */}
            {question.questionType === "rating" && (
              <div>
                <Label>{t("quizEditor.maxStars")}</Label>
                <Input
                  type="number"
                  value={question.config?.maxStars || 5}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      config: { ...question.config, maxStars: parseInt(e.target.value) },
                    })
                  }
                  className="bg-zinc-800 border-zinc-700 mt-2"
                  min={1}
                  max={10}
                />
              </div>
            )}

            {/* Placeholder for text inputs */}
            {(question.questionType === "text" ||
              question.questionType === "number" ||
              question.questionType === "email" ||
              question.questionType === "phone") && (
              <div>
                <Label>{t("quizEditor.placeholder")}</Label>
                <Input
                  value={question.config?.placeholder || ""}
                  onChange={(e) =>
                    onUpdate({
                      ...question,
                      config: { ...question.config, placeholder: e.target.value },
                    })
                  }
                  placeholder={t("quizEditor.placeholderHint")}
                  className="bg-zinc-800 border-zinc-700 mt-2"
                />
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
}

export default function QuizEditor({
  quizId,
  initialQuestions = [],
  onSave,
}: QuizEditorProps) {
  const { t } = useTranslation();
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [showPreview, setShowPreview] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      questionText: "",
      questionType: "text",
      isRequired: true,
      options: [],
      config: {},
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: string, updates: Question) => {
    setQuestions(questions.map((q) => (q.id === id ? updates : q)));
  };

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSave = () => {
    onSave(questions);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {t("quizEditor.title")}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {t("quizEditor.subtitle")}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? t("quizEditor.hidePreview") : t("quizEditor.showPreview")}
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            {t("quizEditor.saveQuiz")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {t("quizEditor.questions")} ({questions.length})
            </h3>
            <Button onClick={addQuestion} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              {t("quizEditor.addQuestion")}
            </Button>
          </div>

          {questions.length === 0 ? (
            <Card className="bg-zinc-900 border-zinc-800 p-12 text-center">
              <p className="text-muted-foreground mb-4">
                {t("quizEditor.noQuestions")}
              </p>
              <Button onClick={addQuestion}>
                <Plus className="w-4 h-4 mr-2" />
                {t("quizEditor.addFirstQuestion")}
              </Button>
            </Card>
          ) : (
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
                    onUpdate={(updated) => updateQuestion(question.id, updated)}
                    onDelete={() => deleteQuestion(question.id)}
                  />
                ))}
              </SortableContext>
            </DndContext>
          )}
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:sticky lg:top-4 lg:h-fit">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle>{t("quizEditor.preview")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {questions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t("quizEditor.noQuestionsPreview")}
                  </p>
                ) : (
                  questions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <Label className="text-base">
                        {index + 1}. {question.questionText || t("quizEditor.untitled")}
                        {question.isRequired && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </Label>

                      {/* Preview based on question type */}
                      {question.questionType === "text" && (
                        <Input
                          placeholder={question.config?.placeholder}
                          disabled
                          className="bg-zinc-800 border-zinc-700"
                        />
                      )}

                      {question.questionType === "number" && (
                        <Input
                          type="number"
                          placeholder={question.config?.placeholder}
                          disabled
                          className="bg-zinc-800 border-zinc-700"
                        />
                      )}

                      {question.questionType === "email" && (
                        <Input
                          type="email"
                          placeholder={question.config?.placeholder || "email@example.com"}
                          disabled
                          className="bg-zinc-800 border-zinc-700"
                        />
                      )}

                      {question.questionType === "phone" && (
                        <Input
                          type="tel"
                          placeholder={question.config?.placeholder || "+1234567890"}
                          disabled
                          className="bg-zinc-800 border-zinc-700"
                        />
                      )}

                      {question.questionType === "single_choice" && (
                        <div className="space-y-2">
                          {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <input type="radio" disabled />
                              <span className="text-sm">{option.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.questionType === "multiple_choice" && (
                        <div className="space-y-2">
                          {question.options?.map((option) => (
                            <div key={option.id} className="flex items-center gap-2">
                              <input type="checkbox" disabled />
                              <span className="text-sm">{option.text}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {question.questionType === "slider" && (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min={question.config?.min || 0}
                            max={question.config?.max || 100}
                            step={question.config?.step || 1}
                            disabled
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{question.config?.min || 0}</span>
                            <span>{question.config?.max || 100}</span>
                          </div>
                        </div>
                      )}

                      {question.questionType === "date" && (
                        <Input
                          type="date"
                          disabled
                          className="bg-zinc-800 border-zinc-700"
                        />
                      )}

                      {question.questionType === "file" && (
                        <div className="border-2 border-dashed border-zinc-700 rounded-lg p-4 text-center">
                          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            {t("quizEditor.uploadFile")}
                          </p>
                        </div>
                      )}

                      {question.questionType === "rating" && (
                        <div className="flex gap-1">
                          {Array.from({ length: question.config?.maxStars || 5 }).map(
                            (_, i) => (
                              <Star
                                key={i}
                                className="w-6 h-6 text-yellow-400 fill-transparent"
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
