import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: string;
  options: string[];
  onSelect: (answer: string) => void;
  selectedAnswer?: string;
}

export default function QuizQuestion({
  question,
  options,
  onSelect,
  selectedAnswer,
}: QuizQuestionProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
        {question}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => (
          <Button
            key={index}
            onClick={() => onSelect(option)}
            variant={selectedAnswer === option ? "default" : "outline"}
            className={`
              h-auto py-6 px-6 text-lg font-semibold
              transition-all duration-300
              shadow-lg hover:shadow-xl hover:scale-105
              ${
                selectedAnswer === option
                  ? "bg-primary text-primary-foreground border-2 border-accent"
                  : "bg-card text-card-foreground border-2 border-border hover:border-primary"
              }
            `}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
