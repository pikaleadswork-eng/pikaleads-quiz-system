import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  ShoppingCart, 
  Calculator, 
  ClipboardCheck, 
  FileText, 
  Video,
  ArrowRight,
  Check
} from "lucide-react";

export type QuizType = 
  | "lead_generation" 
  | "ecommerce" 
  | "calculator" 
  | "test" 
  | "form" 
  | "video_consultant";

interface QuizTypeOption {
  type: QuizType;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  gradient: string;
}

interface QuizTypeSelectorProps {
  onSelect: (type: QuizType) => void;
  selectedType?: QuizType;
}

export function QuizTypeSelector({ onSelect, selectedType }: QuizTypeSelectorProps) {
  const { t } = useTranslation();
  const [hoveredType, setHoveredType] = useState<QuizType | null>(null);

  const quizTypes: QuizTypeOption[] = [
    {
      type: "lead_generation",
      icon: Zap,
      color: "#FFD93D",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      type: "ecommerce",
      icon: ShoppingCart,
      color: "#5B2E90",
      gradient: "from-purple-600 to-pink-600",
    },
    {
      type: "calculator",
      icon: Calculator,
      color: "#3B82F6",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      type: "test",
      icon: ClipboardCheck,
      color: "#10B981",
      gradient: "from-green-500 to-emerald-600",
    },
    {
      type: "form",
      icon: FileText,
      color: "#8B5CF6",
      gradient: "from-violet-500 to-purple-600",
    },
    {
      type: "video_consultant",
      icon: Video,
      color: "#EF4444",
      gradient: "from-red-500 to-rose-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          {t("quizTypeSelector.title")}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t("quizTypeSelector.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quizTypes.map(({ type, icon: Icon, color, gradient }) => {
          const isSelected = selectedType === type;
          const isHovered = hoveredType === type;

          return (
            <Card
              key={type}
              className={`
                relative p-6 cursor-pointer transition-all duration-300 border-2
                ${isSelected 
                  ? "border-primary shadow-lg scale-105" 
                  : "border-border hover:border-primary/50 hover:shadow-md"
                }
                ${isHovered ? "scale-102" : ""}
              `}
              onMouseEnter={() => setHoveredType(type)}
              onMouseLeave={() => setHoveredType(null)}
              onClick={() => onSelect(type)}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}

              {/* Icon with gradient background */}
              <div className={`
                w-16 h-16 rounded-lg bg-gradient-to-br ${gradient} 
                flex items-center justify-center mb-4
                ${isHovered ? "scale-110" : ""}
                transition-transform duration-300
              `}>
                <Icon className="w-8 h-8 text-white" />
              </div>

              {/* Type name */}
              <h3 className="text-xl font-bold text-foreground mb-2">
                {t(`quizTypeSelector.types.${type}.name`)}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground mb-4 min-h-[60px]">
                {t(`quizTypeSelector.types.${type}.description`)}
              </p>

              {/* Features list */}
              <ul className="space-y-1 mb-4">
                {(t(`quizTypeSelector.types.${type}.features`, { returnObjects: true }) as string[]).map((feature, idx) => (
                  <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                    <span className="text-primary mt-0.5">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Use case badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium px-2 py-1 rounded" style={{ 
                  backgroundColor: `${color}20`,
                  color: color 
                }}>
                  {t(`quizTypeSelector.types.${type}.useCase`)}
                </span>
                
                {isSelected && (
                  <ArrowRight className="w-5 h-5 text-primary animate-pulse" />
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {selectedType && (
        <div className="flex justify-center pt-4">
          <Button 
            size="lg" 
            onClick={() => onSelect(selectedType)}
            className="gap-2"
          >
            {t("quizTypeSelector.continue")}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
