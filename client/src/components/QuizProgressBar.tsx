import { useTranslation } from "react-i18next";

interface QuizProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  color?: string;
}

export function QuizProgressBar({
  current,
  total,
  showPercentage = true,
  color = "#FFD93D",
}: QuizProgressBarProps) {
  const { t } = useTranslation();
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-2">
      {/* Progress bar */}
      <div className="relative h-3 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-500 ease-out rounded-full"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>

      {/* Progress text */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {t("quizProgress.question")} {current} {t("quizProgress.of")} {total}
        </span>
        {showPercentage && (
          <span className="font-semibold" style={{ color }}>
            {percentage}%
          </span>
        )}
      </div>
    </div>
  );
}
