import { useState } from "react";
import { useParams } from "wouter";
import { trpc } from "@/lib/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AnalyticsOverviewCards } from "@/components/analytics/AnalyticsOverviewCards";
import { CompletionFunnel } from "@/components/analytics/CompletionFunnel";
import { TimeAnalysis } from "@/components/analytics/TimeAnalysis";
import { QuestionPerformanceTable } from "@/components/analytics/QuestionPerformanceTable";
import { ArrowLeft, Calendar, Download } from "lucide-react";
import { Link } from "wouter";

export default function QuizAnalytics() {
  const params = useParams();
  const quizId = params.id; // Can be slug or numeric ID

  const [timeRange, setTimeRange] = useState<"all" | "24h" | "7d" | "30d" | "90d">("7d");

  // Fetch analytics data
  const { data: analyticsData, isLoading } = trpc.analytics.getQuizAnalytics.useQuery(
    { quizId: quizId as string, timeRange },
    { enabled: !!quizId }
  );

  if (!quizId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <p className="text-red-500">Quiz ID не знайдено</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-zinc-400">Завантаження аналітики...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <p className="text-zinc-400">Немає даних для відображення</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/quizzes">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Назад до квізів
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Аналітика квізу</h1>
                <p className="text-sm text-zinc-400">{analyticsData.quizName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time range selector */}
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-zinc-400" />
                <Select value={timeRange} onValueChange={(value) => setTimeRange(value as "all" | "24h" | "7d" | "30d" | "90d")}>
                  <SelectTrigger className="w-[180px] bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Останні 24 години</SelectItem>
                    <SelectItem value="7d">Останні 7 днів</SelectItem>
                    <SelectItem value="30d">Останні 30 днів</SelectItem>
                    <SelectItem value="90d">Останні 90 днів</SelectItem>
                    <SelectItem value="all">Весь час</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Export button */}
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Експорт
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Overview Cards */}
        <AnalyticsOverviewCards
          completionRate={analyticsData.overview.completionRate}
          avgTimeSpent={analyticsData.overview.avgTimeSpent}
          totalSessions={analyticsData.overview.totalSessions}
          totalCompletions={analyticsData.overview.totalCompletions}
          totalAbandoned={analyticsData.overview.totalAbandoned}
          conversionRate={analyticsData.overview.conversionRate}
          previousPeriodComparison={analyticsData.overview.previousPeriodComparison}
        />

        {/* Completion Funnel */}
        <CompletionFunnel steps={analyticsData.funnelSteps} />

        {/* Time Analysis */}
        <TimeAnalysis data={analyticsData.timeAnalysis} />

        {/* Question Performance Table */}
        <QuestionPerformanceTable data={analyticsData.questionPerformance} />
      </div>
    </div>
  );
}
