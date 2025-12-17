import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function AttributionReport() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [groupBy, setGroupBy] = useState<"source" | "campaign" | "medium">("source");

  const { data: attribution, isLoading } = trpc.analytics.getSourceAttribution.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    groupBy,
  });

  const { data: topCampaigns } = trpc.analytics.getTopCampaigns.useQuery({
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    limit: 5,
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  // Calculate totals
  const totals = attribution?.reduce(
    (acc, row) => ({
      leadCount: acc.leadCount + row.leadCount,
      salesCount: acc.salesCount + row.salesCount,
      totalSpend: acc.totalSpend + row.totalSpend,
      totalRevenue: acc.totalRevenue + row.totalRevenue,
    }),
    { leadCount: 0, salesCount: 0, totalSpend: 0, totalRevenue: 0 }
  );

  const overallRoas = totals && totals.totalSpend > 0 ? totals.totalRevenue / totals.totalSpend : 0;
  const overallConversionRate = totals && totals.leadCount > 0 ? (totals.salesCount / totals.leadCount) * 100 : 0;

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lead Source Attribution</h1>
          <p className="text-muted-foreground mt-1">
            Розбивка лідів по джерелах з ROAS та конверсією
          </p>
        </div>
        
        {/* Controls */}
        <div className="flex items-center gap-4">
          {/* Group By Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Групувати за:</span>
            <Select value={groupBy} onValueChange={(value: any) => setGroupBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="source">Джерело</SelectItem>
                <SelectItem value="campaign">Кампанія</SelectItem>
                <SelectItem value="medium">Медіум</SelectItem>
              </SelectContent>
            </Select>
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
      </div>

      {/* Summary Cards */}
      {totals && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Всього лідів</p>
            <p className="text-2xl font-bold mt-1">{totals.leadCount}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Всього продажів</p>
            <p className="text-2xl font-bold mt-1">{totals.salesCount}</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Загальний ROAS</p>
            <p className="text-2xl font-bold mt-1">{overallRoas.toFixed(2)}x</p>
          </Card>
          <Card className="p-6">
            <p className="text-sm text-muted-foreground">Конверсія</p>
            <p className="text-2xl font-bold mt-1">{overallConversionRate.toFixed(1)}%</p>
          </Card>
        </div>
      )}

      {/* Top Campaigns */}
      {topCampaigns && topCampaigns.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Топ-5 кампаній за доходом</h2>
          <div className="space-y-3">
            {topCampaigns.map((campaign, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{campaign.campaign}</p>
                    <p className="text-sm text-muted-foreground">{campaign.source}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{campaign.totalRevenue.toLocaleString('uk-UA')} грн</p>
                  <p className="text-sm text-muted-foreground">
                    ROAS: {campaign.roas.toFixed(2)}x | {campaign.leadCount} лідів | {campaign.salesCount} продажів
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Attribution Table */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">
          Детальна розбивка по {groupBy === "source" ? "джерелах" : groupBy === "campaign" ? "кампаніях" : "медіумах"}
        </h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  {groupBy === "source" ? "Джерело" : groupBy === "campaign" ? "Кампанія" : "Медіум"}
                </TableHead>
                <TableHead className="text-right">Ліди</TableHead>
                <TableHead className="text-right">Продажі</TableHead>
                <TableHead className="text-right">Конверсія</TableHead>
                <TableHead className="text-right">Витрачено</TableHead>
                <TableHead className="text-right">Дохід</TableHead>
                <TableHead className="text-right">ROAS</TableHead>
                <TableHead className="text-right">CPL</TableHead>
                <TableHead className="text-right">CPA</TableHead>
                <TableHead className="text-right">Середній чек</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attribution && attribution.length > 0 ? (
                attribution.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.source}</TableCell>
                    <TableCell className="text-right">{row.leadCount}</TableCell>
                    <TableCell className="text-right">{row.salesCount}</TableCell>
                    <TableCell className="text-right">
                      <span className={
                        row.conversionRate >= 10 ? "text-green-600 font-semibold" :
                        row.conversionRate >= 5 ? "text-yellow-600" :
                        "text-red-600"
                      }>
                        {row.conversionRate}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{row.totalSpend.toLocaleString('uk-UA')} грн</TableCell>
                    <TableCell className="text-right">{row.totalRevenue.toLocaleString('uk-UA')} грн</TableCell>
                    <TableCell className="text-right">
                      <span className={
                        row.roas >= 3 ? "text-green-600 font-semibold" :
                        row.roas >= 2 ? "text-yellow-600" :
                        "text-red-600"
                      }>
                        {row.roas.toFixed(2)}x
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{row.cpl.toFixed(2)} грн</TableCell>
                    <TableCell className="text-right">{row.cpa.toFixed(2)} грн</TableCell>
                    <TableCell className="text-right">{row.averageCheck.toLocaleString('uk-UA')} грн</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                    Немає даних для відображення
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Insights */}
      {attribution && attribution.length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <span className="text-xl">💡</span>
            Рекомендації
          </h3>
          <ul className="space-y-2 text-sm">
            {attribution.some(r => r.roas >= 3) && (
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <span>
                  <strong>Масштабуйте успішні канали:</strong> {attribution.filter(r => r.roas >= 3).map(r => r.source).join(', ')} показують відмінний ROAS (≥3x)
                </span>
              </li>
            )}
            {attribution.some(r => r.roas < 1) && (
              <li className="flex items-start gap-2">
                <span className="text-red-600">⚠</span>
                <span>
                  <strong>Оптимізуйте або зупиніть:</strong> {attribution.filter(r => r.roas < 1).map(r => r.source).join(', ')} не окупаються (ROAS &lt;1x)
                </span>
              </li>
            )}
            {attribution.some(r => r.conversionRate < 5) && (
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">⚠</span>
                <span>
                  <strong>Покращте якість лідів:</strong> {attribution.filter(r => r.conversionRate < 5).map(r => r.source).join(', ')} мають низьку конверсію (&lt;5%)
                </span>
              </li>
            )}
          </ul>
        </Card>
      )}
    </div>
  );
}
