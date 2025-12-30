import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export function PipelineDashboard() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  const { data: metrics, isLoading } = trpc.analytics.getPipelineMetrics.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">Немає даних для відображення</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Sales Pipeline Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Візуалізація воронки продажів та ключові метрики
          </p>
        </div>
        
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              setDateRange({
                startDate: last7Days.toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
              });
            }}
          >
            7 днів
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
              setDateRange({
                startDate: last30Days.toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
              });
            }}
          >
            30 днів
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const last90Days = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
              setDateRange({
                startDate: last90Days.toISOString().split('T')[0],
                endDate: new Date().toISOString().split('T')[0],
              });
            }}
          >
            90 днів
          </Button>
        </div>
      </div>

      {/* Funnel Visualization */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-6">Воронка продажів</h2>
        <div className="space-y-4">
          {/* Stage 1: Leads */}
          <div className="relative">
            <div 
              className="h-20 bg-blue-500 rounded-lg flex items-center justify-between px-6 text-white"
              style={{ width: '100%' }}
            >
              <div>
                <div className="text-sm font-medium">Ліди</div>
                <div className="text-2xl font-bold">{metrics.totalLeads}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">CPL</div>
                <div className="text-lg font-semibold">{metrics.cpl.toFixed(2)} грн</div>
              </div>
            </div>
          </div>

          {/* Conversion Rate 1 */}
          <div className="flex items-center justify-center">
            <div className="text-center py-2">
              <div className="text-2xl font-bold text-blue-600">
                {metrics.leadToCallRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Lead-to-Call Rate
                {metrics.leadToCallRate >= 30 && metrics.leadToCallRate <= 50 ? (
                  <span className="ml-2 text-green-600">✓ Норма</span>
                ) : metrics.leadToCallRate < 30 ? (
                  <span className="ml-2 text-red-600">↓ Нижче норми</span>
                ) : (
                  <span className="ml-2 text-orange-600">↑ Вище норми</span>
                )}
              </div>
            </div>
          </div>

          {/* Stage 2: Calls Scheduled */}
          <div className="relative">
            <div 
              className="h-20 bg-orange-500 rounded-lg flex items-center justify-between px-6 text-white"
              style={{ width: `${metrics.totalLeads > 0 ? (metrics.callsScheduled / metrics.totalLeads) * 100 : 0}%`, minWidth: '30%' }}
            >
              <div>
                <div className="text-sm font-medium">Дзвінки заплановані</div>
                <div className="text-2xl font-bold">{metrics.callsScheduled}</div>
              </div>
            </div>
          </div>

          {/* Conversion Rate 2 */}
          <div className="flex items-center justify-center">
            <div className="text-center py-2">
              <div className="text-2xl font-bold text-orange-600">
                {metrics.callToSaleRate}%
              </div>
              <div className="text-sm text-muted-foreground">
                Call-to-Sale Rate
                {metrics.callToSaleRate >= 10 && metrics.callToSaleRate <= 20 ? (
                  <span className="ml-2 text-green-600">✓ Норма</span>
                ) : metrics.callToSaleRate < 10 ? (
                  <span className="ml-2 text-red-600">↓ Нижче норми</span>
                ) : (
                  <span className="ml-2 text-orange-600">↑ Вище норми</span>
                )}
              </div>
            </div>
          </div>

          {/* Stage 3: Sales Closed */}
          <div className="relative">
            <div 
              className="h-20 bg-green-500 rounded-lg flex items-center justify-between px-6 text-white"
              style={{ width: `${metrics.totalLeads > 0 ? (metrics.salesClosed / metrics.totalLeads) * 100 : 0}%`, minWidth: '20%' }}
            >
              <div>
                <div className="text-sm font-medium">Продажі</div>
                <div className="text-2xl font-bold">{metrics.salesClosed}</div>
              </div>
              <div className="text-right">
                <div className="text-sm">CPA</div>
                <div className="text-lg font-semibold">{metrics.cpa.toFixed(2)} грн</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Загальний дохід</p>
              <p className="text-2xl font-bold mt-1">
                {metrics.totalRevenue.toLocaleString('uk-UA')} грн
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
          </div>
        </Card>

        {/* Average Check */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Середній чек</p>
              <p className="text-2xl font-bold mt-1">
                {metrics.averageCheck.toLocaleString('uk-UA')} грн
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl">🧾</span>
            </div>
          </div>
        </Card>

        {/* ROAS */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">ROAS</p>
              <p className="text-2xl font-bold mt-1">
                {metrics.roas.toFixed(2)}x
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metrics.roas >= 3 ? '✓ Відмінно' : metrics.roas >= 2 ? '✓ Добре' : '⚠ Потребує оптимізації'}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
          </div>
        </Card>

        {/* Total Spend */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Витрачено на рекламу</p>
              <p className="text-2xl font-bold mt-1">
                {metrics.totalSpend.toLocaleString('uk-UA')} грн
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <span className="text-2xl">💸</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Conversion Rates */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Конверсії</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Lead → Call</span>
              <span className="text-lg font-bold">{metrics.leadToCallRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(metrics.leadToCallRate, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Норма: 30-50%
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Call → Sale</span>
              <span className="text-lg font-bold">{metrics.callToSaleRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(metrics.callToSaleRate * 5, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Норма: 10-20%
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Lead → Sale</span>
              <span className="text-lg font-bold">{metrics.leadToSaleRate}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(metrics.leadToSaleRate * 10, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Загальна конверсія
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
