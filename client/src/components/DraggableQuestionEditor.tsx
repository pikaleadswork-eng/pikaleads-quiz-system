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
} from "@dnd-kit/sortable";
import { SortableQuestionItem } from "./SortableQuestionItem";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Save, Library } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  type?: "single" | "multiple" | "text";
  required?: boolean;
}

interface DraggableQuestionEditorProps {
  quizId: string;
  initialQuestions: QuizQuestion[];
  onSave: (questions: QuizQuestion[]) => void;
  onOpenTemplateLibrary?: () => void;
}

export default function DraggableQuestionEditor({
  quizId,
  initialQuestions,
  onSave,
  onOpenTemplateLibrary,
}: DraggableQuestionEditorProps) {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState<QuizQuestion[]>(initialQuestions);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set(questions.map((q) => q.id))
  );

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

        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        toast.success(
          language === "uk"
            ? "Порядок питань змінено"
            : "Question order updated"
        );
        
        return newOrder;
      });
    }
  };

  const handleAddQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: `question-${Date.now()}`,
      question: language === "uk" ? "Нове питання" : "New question",
      options: [
        language === "uk" ? "Варіант 1" : "Option 1",
        language === "uk" ? "Варіант 2" : "Option 2",
      ],
      type: "single",
      required: true,
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestions(new Set([...Array.from(expandedQuestions), newQuestion.id]));
    
    toast.success(
      language === "uk" ? "Питання додано" : "Question added"
    );
  };

  const handleDuplicateQuestion = (questionId: string) => {
    const questionToDuplicate = questions.find((q) => q.id === questionId);
    if (!questionToDuplicate) return;

    const duplicatedQuestion: QuizQuestion = {
      ...questionToDuplicate,
      id: `question-${Date.now()}`,
      question: `${questionToDuplicate.question} (${language === "uk" ? "копія" : "copy"})`,
    };

    const index = questions.findIndex((q) => q.id === questionId);
    const newQuestions = [
      ...questions.slice(0, index + 1),
      duplicatedQuestion,
      ...questions.slice(index + 1),
    ];
    
    setQuestions(newQuestions);
    setExpandedQuestions(new Set([...Array.from(expandedQuestions), duplicatedQuestion.id]));
    
    toast.success(
      language === "uk" ? "Питання продубльовано" : "Question duplicated"
    );
  };

  const handleDeleteQuestion = (questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      newSet.delete(questionId);
      return newSet;
    });
    
    toast.success(
      language === "uk" ? "Питання видалено" : "Question deleted"
    );
  };

  const handleUpdateQuestion = (questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    );
  };

  const toggleExpanded = (questionId: string) => {
    setExpandedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    onSave(questions);
    toast.success(
      language === "uk" ? "Зміни збережено!" : "Changes saved!"
    );
  };

  const toggleExpandAll = () => {
    if (expandedQuestions.size === questions.length) {
      setExpandedQuestions(new Set());
    } else {
      setExpandedQuestions(new Set(questions.map((q) => q.id)));
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {language === "uk" ? "Питання квізу" : "Quiz Questions"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {language === "uk"
              ? `Всього питань: ${questions.length}`
              : `Total questions: ${questions.length}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleExpandAll}
          >
            {expandedQuestions.size === questions.length
              ? (language === "uk" ? "Згорнути всі" : "Collapse all")
              : (language === "uk" ? "Розгорнути всі" : "Expand all")}
          </Button>
          {onOpenTemplateLibrary && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenTemplateLibrary}
            >
              <Library className="w-4 h-4 mr-2" />
              {language === "uk" ? "Шаблони" : "Templates"}
            </Button>
          )}
          <Button onClick={handleAddQuestion} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            {language === "uk" ? "Додати питання" : "Add Question"}
          </Button>
          <Button onClick={handleSave} size="sm" variant="default">
            <Save className="w-4 h-4 mr-2" />
            {language === "uk" ? "Зберегти" : "Save"}
          </Button>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">
            {language === "uk"
              ? "Ще немає питань. Додайте перше питання!"
              : "No questions yet. Add your first question!"}
          </p>
          <Button onClick={handleAddQuestion}>
            <Plus className="w-4 h-4 mr-2" />
            {language === "uk" ? "Додати питання" : "Add Question"}
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
            <div className="space-y-3">
              {questions.map((question, index) => (
                <SortableQuestionItem
                  key={question.id}
                  question={question}
                  index={index}
                  isExpanded={expandedQuestions.has(question.id)}
                  onToggleExpand={() => toggleExpanded(question.id)}
                  onDuplicate={() => handleDuplicateQuestion(question.id)}
                  onDelete={() => handleDeleteQuestion(question.id)}
                  onUpdate={(updates) => handleUpdateQuestion(question.id, updates)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
