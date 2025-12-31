import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  compareWithPrevious?: boolean;
  currentValue?: number | string;
  previousValue?: number | string;
  suffix?: string;
}

export function MetricCard({
  title,
  value,
  icon: Icon,
  compareWithPrevious,
  currentValue,
  previousValue,
  suffix = "%",
}: MetricCardProps) {
  const calculateChange = (current: number | string, previous: number | string) => {
    const curr = typeof current === "string" ? parseFloat(current) : current;
    const prev = typeof previous === "string" ? parseFloat(previous) : previous;
    if (prev === 0) return curr > 0 ? 100 : 0;
    return ((curr - prev) / prev) * 100;
  };

  const change =
    compareWithPrevious && currentValue !== undefined && previousValue !== undefined
      ? calculateChange(currentValue, previousValue)
      : null;

  const isPositive = change !== null && change >= 0;

  return (
    <Card className="bg-zinc-900 border-zinc-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
          <Icon className="w-4 h-4 mr-2" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold text-white">{value}</div>
          {change !== null && (
            <div className="flex items-center gap-1 text-sm">
              {isPositive ? (
                <ArrowUp className="w-3 h-3 text-green-500" />
              ) : (
                <ArrowDown className="w-3 h-3 text-red-500" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(change).toFixed(1)}{suffix}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
