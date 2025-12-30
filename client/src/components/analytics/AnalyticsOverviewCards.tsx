import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Clock, Users, CheckCircle, XCircle } from "lucide-react";

interface AnalyticsOverviewCardsProps {
  completionRate: number;
  avgTimeSpent: number;
  totalSessions: number;
  totalCompletions: number;
  totalAbandoned: number;
  conversionRate: number;
  previousPeriodComparison?: {
    completionRate: number;
    avgTimeSpent: number;
    totalSessions: number;
    conversionRate: number;
  };
}

export function AnalyticsOverviewCards({
  completionRate,
  avgTimeSpent,
  totalSessions,
  totalCompletions,
  totalAbandoned,
  conversionRate,
  previousPeriodComparison,
}: AnalyticsOverviewCardsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTrendIcon = (current: number, previous?: number) => {
    if (!previous) return null;
    return current > previous ? (
      <TrendingUp className="h-4 w-4 text-green-500" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-500" />
    );
  };

  const getTrendText = (current: number, previous?: number) => {
    if (!previous) return null;
    const change = ((current - previous) / previous) * 100;
    const isPositive = change > 0;
    return (
      <span className={isPositive ? "text-green-500" : "text-red-500"}>
        {isPositive ? "+" : ""}
        {change.toFixed(1)}%
      </span>
    );
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Completion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Коефіцієнт завершення</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getTrendIcon(completionRate, previousPeriodComparison?.completionRate)}
            {getTrendText(completionRate, previousPeriodComparison?.completionRate)}
            <span>від попереднього періоду</span>
          </div>
        </CardContent>
      </Card>

      {/* Average Time */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Середній час</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(avgTimeSpent)}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getTrendIcon(avgTimeSpent, previousPeriodComparison?.avgTimeSpent)}
            {getTrendText(avgTimeSpent, previousPeriodComparison?.avgTimeSpent)}
            <span>від попереднього періоду</span>
          </div>
        </CardContent>
      </Card>

      {/* Total Sessions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всього спроб</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSessions.toLocaleString()}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getTrendIcon(totalSessions, previousPeriodComparison?.totalSessions)}
            {getTrendText(totalSessions, previousPeriodComparison?.totalSessions)}
            <span>від попереднього періоду</span>
          </div>
        </CardContent>
      </Card>

      {/* Completions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Завершено</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-500">{totalCompletions.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {totalSessions > 0 ? ((totalCompletions / totalSessions) * 100).toFixed(1) : 0}% від всіх спроб
          </p>
        </CardContent>
      </Card>

      {/* Abandoned */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Покинуто</CardTitle>
          <XCircle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-500">{totalAbandoned.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {totalSessions > 0 ? ((totalAbandoned / totalSessions) * 100).toFixed(1) : 0}% від всіх спроб
          </p>
        </CardContent>
      </Card>

      {/* Conversion Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Конверсія в ліди</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{conversionRate.toFixed(1)}%</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {getTrendIcon(conversionRate, previousPeriodComparison?.conversionRate)}
            {getTrendText(conversionRate, previousPeriodComparison?.conversionRate)}
            <span>від попереднього періоду</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
