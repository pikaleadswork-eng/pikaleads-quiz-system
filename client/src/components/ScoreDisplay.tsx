import { useTranslation } from "react-i18next";
import { Card } from "@/components/ui/card";
import { Trophy, Star, Award, Medal } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  maxScore: number;
  showBadge?: boolean;
}

export function ScoreDisplay({ score, maxScore, showBadge = true }: ScoreDisplayProps) {
  const { t } = useTranslation();
  const percentage = Math.round((score / maxScore) * 100);

  const getBadge = () => {
    if (percentage >= 90) return { icon: Trophy, color: "#FFD93D", label: "Відмінно!" };
    if (percentage >= 75) return { icon: Star, color: "#10B981", label: "Добре!" };
    if (percentage >= 60) return { icon: Award, color: "#3B82F6", label: "Непогано!" };
    return { icon: Medal, color: "#6B7280", label: "Можна краще" };
  };

  const badge = getBadge();
  const BadgeIcon = badge.icon;

  return (
    <Card className="p-6 text-center space-y-4">
      {/* Score circle */}
      <div className="relative w-32 h-32 mx-auto">
        {/* Background circle */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-zinc-800"
          />
          {/* Progress circle */}
          <circle
            cx="64"
            cy="64"
            r="56"
            stroke={badge.color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 56}`}
            strokeDashoffset={`${2 * Math.PI * 56 * (1 - percentage / 100)}`}
            className="transition-all duration-1000 ease-out"
            strokeLinecap="round"
          />
        </svg>

        {/* Score text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color: badge.color }}>
            {percentage}%
          </span>
          <span className="text-xs text-muted-foreground">
            {score}/{maxScore}
          </span>
        </div>
      </div>

      {/* Badge */}
      {showBadge && (
        <div className="space-y-2">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
            style={{ backgroundColor: `${badge.color}20` }}
          >
            <BadgeIcon className="w-8 h-8" style={{ color: badge.color }} />
          </div>
          <p className="text-lg font-semibold" style={{ color: badge.color }}>
            {badge.label}
          </p>
        </div>
      )}

      {/* Message */}
      <p className="text-sm text-muted-foreground">
        {t("scoreDisplay.message")}
      </p>
    </Card>
  );
}
