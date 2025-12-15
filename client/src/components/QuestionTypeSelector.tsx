import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { stringifyMultilingualText } from "@/lib/multilingualText";
import type { QuizQuestion, AnswerOption } from "./DraggableQuestionEditor";

interface QuestionTypeSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelect: (question: QuizQuestion) => void;
}

interface QuestionTypeConfig {
  type: QuizQuestion["type"];
  icon: string;
  title: { uk: string; en: string };
  description: { uk: string; en: string };
  color: string;
  defaultOptions?: number;
}

const QUESTION_TYPES: QuestionTypeConfig[] = [
  {
    type: "single",
    icon: "⭕",
    title: { uk: "Один варіант", en: "Single Choice" },
    description: { uk: "Виберіть один варіант з кількох", en: "Select one option from multiple" },
    color: "from-blue-500 to-blue-600",
    defaultOptions: 4,
  },
  {
    type: "multiple",
    icon: "☑️",
    title: { uk: "Кілька варіантів", en: "Multiple Choice" },
    description: { uk: "Виберіть кілька варіантів", en: "Select multiple options" },
    color: "from-green-500 to-green-600",
    defaultOptions: 4,
  },
  {
    type: "text",
    icon: "📝",
    title: { uk: "Текстова відповідь", en: "Text Answer" },
    description: { uk: "Вільне текстове поле", en: "Free text input" },
    color: "from-purple-500 to-purple-600",
    defaultOptions: 0,
  },
  {
    type: "slider",
    icon: "🎚️",
    title: { uk: "Слайдер", en: "Slider" },
    description: { uk: "Вибір значення на шкалі", en: "Select value on scale" },
    color: "from-orange-500 to-orange-600",
    defaultOptions: 0,
  },
  {
    type: "rating",
    icon: "⭐",
    title: { uk: "Рейтинг", en: "Rating" },
    description: { uk: "Оцінка зірками", en: "Star rating" },
    color: "from-yellow-500 to-yellow-600",
    defaultOptions: 0,
  },
  {
    type: "date",
    icon: "📅",
    title: { uk: "Дата", en: "Date" },
    description: { uk: "Вибір дати з календаря", en: "Pick a date from calendar" },
    color: "from-teal-500 to-teal-600",
    defaultOptions: 0,
  },
  {
    type: "file",
    icon: "📎",
    title: { uk: "Завантаження файлу", en: "File Upload" },
    description: { uk: "Завантаження документів або зображень", en: "Upload documents or images" },
    color: "from-pink-500 to-pink-600",
    defaultOptions: 0,
  },
  {
    type: "emoji",
    icon: "😊",
    title: { uk: "Емоджі", en: "Emoji" },
    description: { uk: "Вибір емоції", en: "Select emotion" },
    color: "from-amber-500 to-amber-600",
    defaultOptions: 5,
  },
  {
    type: "dropdown",
    icon: "📋",
    title: { uk: "Випадаючий список", en: "Dropdown" },
    description: { uk: "Вибір з випадаючого списку", en: "Select from dropdown" },
    color: "from-indigo-500 to-indigo-600",
    defaultOptions: 4,
  },
  {
    type: "scale",
    icon: "📊",
    title: { uk: "Шкала 1-10", en: "Scale 1-10" },
    description: { uk: "Оцінка від 1 до 10", en: "Rate from 1 to 10" },
    color: "from-cyan-500 to-cyan-600",
    defaultOptions: 0,
  },
  {
    type: "matrix",
    icon: "📐",
    title: { uk: "Матриця", en: "Matrix" },
    description: { uk: "Таблиця з рядками та стовпцями", en: "Table with rows and columns" },
    color: "from-rose-500 to-rose-600",
    defaultOptions: 0,
  },
  {
    type: "ranking",
    icon: "🏆",
    title: { uk: "Ранжування", en: "Ranking" },
    description: { uk: "Упорядкування варіантів", en: "Order options by preference" },
    color: "from-violet-500 to-violet-600",
    defaultOptions: 4,
  },
];

export function QuestionTypeSelector({ open, onClose, onSelect }: QuestionTypeSelectorProps) {
  const { language } = useLanguage();
  const lang = language === "uk" ? "uk" : "en";

  const createQuestion = (config: QuestionTypeConfig): QuizQuestion => {
    const questionText = stringifyMultilingualText({
      uk: "Нове питання",
      ru: "Новый вопрос",
      en: "New question",
      pl: "Nowe pytanie",
      de: "Neue Frage",
    });

    const options: AnswerOption[] = [];
    if (config.defaultOptions && config.defaultOptions > 0) {
      for (let i = 1; i <= config.defaultOptions; i++) {
        options.push({
          text: stringifyMultilingualText({
            uk: `Варіант ${i}`,
            ru: `Вариант ${i}`,
            en: `Option ${i}`,
            pl: `Opcja ${i}`,
            de: `Option ${i}`,
          }),
        });
      }
    }

    // Special handling for emoji type
    if (config.type === "emoji") {
      return {
        id: `question-${Date.now()}`,
        question: questionText,
        options: [
          { text: "😊" },
          { text: "🙂" },
          { text: "😐" },
          { text: "🙁" },
          { text: "😢" },
        ],
        type: config.type,
        required: true,
      };
    }

    // Special handling for scale type
    if (config.type === "scale") {
      return {
        id: `question-${Date.now()}`,
        question: questionText,
        options: [],
        type: config.type,
        required: true,
        min: 1,
        max: 10,
      };
    }

    // Special handling for slider type
    if (config.type === "slider") {
      return {
        id: `question-${Date.now()}`,
        question: questionText,
        options: [],
        type: config.type,
        required: true,
        min: 0,
        max: 100,
        step: 1,
      };
    }

    // Special handling for matrix type
    if (config.type === "matrix") {
      return {
        id: `question-${Date.now()}`,
        question: questionText,
        options: [],
        type: config.type,
        required: true,
        rows: ["Рядок 1", "Рядок 2", "Рядок 3"],
        columns: ["Стовпець 1", "Стовпець 2", "Стовпець 3"],
      };
    }

    // Special handling for file type
    if (config.type === "file") {
      return {
        id: `question-${Date.now()}`,
        question: questionText,
        options: [],
        type: config.type,
        required: true,
        maxFiles: 3,
        allowedFileTypes: ["image/*", "application/pdf"],
      };
    }

    return {
      id: `question-${Date.now()}`,
      question: questionText,
      options,
      type: config.type,
      required: true,
    };
  };

  const handleSelect = (config: QuestionTypeConfig) => {
    const question = createQuestion(config);
    onSelect(question);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-zinc-900 border-zinc-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white">
            {lang === "uk" ? "Оберіть тип питання" : "Select Question Type"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
          {QUESTION_TYPES.map((config) => (
            <button
              key={config.type}
              onClick={() => handleSelect(config)}
              className={`
                relative p-4 rounded-xl border border-zinc-700 
                bg-gradient-to-br ${config.color} bg-opacity-10
                hover:scale-105 hover:shadow-lg hover:shadow-${config.color.split("-")[1]}-500/20
                transition-all duration-200 text-left group
              `}
            >
              <div className="text-3xl mb-2">{config.icon}</div>
              <h3 className="font-semibold text-white text-sm">
                {config.title[lang]}
              </h3>
              <p className="text-xs text-zinc-300 mt-1 opacity-80">
                {config.description[lang]}
              </p>
              <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default QuestionTypeSelector;
