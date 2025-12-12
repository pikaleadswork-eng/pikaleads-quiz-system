import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Calendar as CalendarIcon, TrendingUp, DollarSign, Users, Clock, RefreshCw, Pause, Play } from "lucide-react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type DateRange = "today" | "yesterday" | "last7Days" | "last30Days" | "thisMonth" | "lastMonth" | "custom";

export default function AdminAnalytics() {
  const { t } = useTranslation();
  
  // Filters state
  const [dateRange, setDateRange] = useState<DateRange>("last30Days");
  const [customStartDate, setCustomStartDate] = useState<Date>();
  const [customEndDate, setCustomEndDate] = useState<Date>();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isAutoRefreshPaused, setIsAutoRefreshPaused] = useState(false);

  // Fetch analytics data
  const { data: analyticsData, isLoading, refetch } = trpc.admin.getAnalyticsData.useQuery({
    dateRange: dateRange,
    startDate: customStartDate?.toISOString(),
    endDate: customEndDate?.toISOString(),
    quizName: selectedQuiz !== "all" ? selectedQuiz : undefined,
    source: selectedSource !== "all" ? selectedSource : undefined,
    campaign: selectedCampaign !== "all" ? selectedCampaign : undefined,
  });

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (isAutoRefreshPaused) return;

    const interval = setInterval(() => {
      refetch();
      setLastUpdate(new Date());
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [refetch, isAutoRefreshPaused]);

  // Fetch leads for filter options
  const { data: allLeads } = trpc.admin.getLeads.useQuery();

  // Get unique values for filters
  const uniqueQuizzes = allLeads ? Array.from(new Set(allLeads.map(l => l.quizName))) : [];
  const uniqueSources = allLeads ? Array.from(new Set(allLeads.map(l => l.source).filter(Boolean))) : [];
  const uniqueCampaigns = allLeads ? Array.from(new Set(allLeads.map(l => l.utmCampaign).filter(Boolean))) : [];

  const clearFilters = () => {
    setDateRange("last30Days");
    setSelectedQuiz("all");
    setSelectedSource("all");
    setSelectedCampaign("all");
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
  };

  // Chart data for Leads by Source
  const leadsBySourceData = analyticsData?.leadsBySource
    ? {
        labels: Object.keys(analyticsData.leadsBySource),
        datasets: [
          {
            label: t("analytics.charts.leadsBySource"),
            data: Object.values(analyticsData.leadsBySource),
            backgroundColor: "rgba(139, 92, 246, 0.8)",
            borderColor: "rgba(139, 92, 246, 1)",
            borderWidth: 1,
          },
        ],
      }
    : null;

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#a1a1aa",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#a1a1aa",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  const lineChartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: "#a1a1aa",
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#a1a1aa",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      x: {
        ticks: {
          color: "#a1a1aa",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-zinc-400">{t("common.loading")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{t("analytics.title")}</h1>
            <p className="text-zinc-400">{t("analytics.description")}</p>
            <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
              <RefreshCw className="w-3 h-3" />
              <span>
                {t("analytics.lastUpdate")}: {lastUpdate.toLocaleTimeString()}
              </span>
            </div>
          </div>
          
          <div className="flex gap-2">
            {/* Auto-refresh toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAutoRefreshPaused(!isAutoRefreshPaused)}
              className="bg-zinc-800 border-zinc-700"
            >
              {isAutoRefreshPaused ? (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {t("analytics.resume")}
                </>
              ) : (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  {t("analytics.pause")}
                </>
              )}
            </Button>
            
            {/* Filters Button */}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="bg-zinc-800 border-zinc-700">
                <Filter className="w-4 h-4 mr-2" />
                {t("analytics.filters")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-zinc-900 border-zinc-800 p-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">{t("analytics.dateRange")}</label>
                  <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="today">{t("analytics.today")}</SelectItem>
                      <SelectItem value="yesterday">{t("analytics.yesterday")}</SelectItem>
                      <SelectItem value="last7Days">{t("analytics.last7Days")}</SelectItem>
                      <SelectItem value="last30Days">{t("analytics.last30Days")}</SelectItem>
                      <SelectItem value="thisMonth">{t("analytics.thisMonth")}</SelectItem>
                      <SelectItem value="lastMonth">{t("analytics.lastMonth")}</SelectItem>
                      <SelectItem value="custom">{t("analytics.custom")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {dateRange === "custom" && (
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">{t("analytics.from")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full bg-zinc-800 border-zinc-700 justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {customStartDate ? customStartDate.toLocaleDateString() : t("analytics.from")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                          <Calendar
                            mode="single"
                            selected={customStartDate}
                            onSelect={setCustomStartDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <label className="text-sm text-zinc-400 mb-2 block">{t("analytics.to")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full bg-zinc-800 border-zinc-700 justify-start">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {customEndDate ? customEndDate.toLocaleDateString() : t("analytics.to")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-zinc-900 border-zinc-800">
                          <Calendar
                            mode="single"
                            selected={customEndDate}
                            onSelect={setCustomEndDate}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">{t("common.quiz")}</label>
                  <Select value={selectedQuiz} onValueChange={setSelectedQuiz}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="all">{t("analytics.allQuizzes")}</SelectItem>
                      {uniqueQuizzes.map((quiz) => (
                        <SelectItem key={quiz} value={quiz}>{quiz}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">{t("common.source")}</label>
                  <Select value={selectedSource} onValueChange={setSelectedSource}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="all">{t("analytics.allSources")}</SelectItem>
                      {uniqueSources.map((source) => (
                        <SelectItem key={source} value={source!}>{source}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-zinc-400 mb-2 block">{t("common.campaign")}</label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
                    <SelectTrigger className="bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800">
                      <SelectItem value="all">{t("analytics.allCampaigns")}</SelectItem>
                      {uniqueCampaigns.map((campaign) => (
                        <SelectItem key={campaign} value={campaign!}>{campaign}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={clearFilters} variant="outline" className="w-full bg-zinc-800 border-zinc-700">
                  {t("analytics.clearFilters")}
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.totalLeads")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData?.summary.totalLeads || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.conversionRate")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData?.summary.conversionRate || 0}%</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.romi")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData?.summary.romi || 0}%</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.roas")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{analyticsData?.summary.roas || 0}x</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.avgTimeOnSite")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{Math.floor((analyticsData?.summary.avgTimeOnSite || 0) / 60)}m {(analyticsData?.summary.avgTimeOnSite || 0) % 60}s</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.totalSpent")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${analyticsData?.summary.totalSpent?.toFixed(2) || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.totalRevenue")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${analyticsData?.summary.totalRevenue?.toFixed(2) || 0}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.costPerLead")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${analyticsData?.summary.costPerLead || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">{t("analytics.charts.leadsBySource")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {leadsBySourceData && <Bar data={leadsBySourceData} options={chartOptions} />}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader>
              <CardTitle className="text-white">{t("analytics.charts.revenueTrends")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                {analyticsData?.topCampaigns && (
                  <Line
                    data={{
                      labels: analyticsData.topCampaigns.slice(0, 5).map(c => c.campaign),
                      datasets: [
                        {
                          label: t("analytics.tables.revenue"),
                          data: analyticsData.topCampaigns.slice(0, 5).map(c => c.revenue),
                          borderColor: "rgba(255, 211, 61, 1)",
                          backgroundColor: "rgba(255, 211, 61, 0.2)",
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={lineChartOptions}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Campaigns Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">{t("analytics.tables.topCampaigns")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400">{t("analytics.tables.campaign")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.leads")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.conversions")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.spent")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.revenue")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.romi")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.roas")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData?.topCampaigns.length ? (
                  analyticsData.topCampaigns.map((campaign, idx) => (
                    <TableRow key={idx} className="border-zinc-800">
                      <TableCell className="text-white">{campaign.campaign}</TableCell>
                      <TableCell className="text-white">{campaign.leads}</TableCell>
                      <TableCell className="text-white">{campaign.conversions}</TableCell>
                      <TableCell className="text-white">${campaign.spent.toFixed(2)}</TableCell>
                      <TableCell className="text-white">${campaign.revenue.toFixed(2)}</TableCell>
                      <TableCell className="text-white">{campaign.romi}%</TableCell>
                      <TableCell className="text-white">{campaign.roas}x</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-zinc-400">
                      {t("analytics.tables.noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Ads Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">{t("analytics.tables.topAds")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400">{t("analytics.tables.ad")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.leads")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.conversions")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.ctr")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData?.topAds.length ? (
                  analyticsData.topAds.map((ad, idx) => (
                    <TableRow key={idx} className="border-zinc-800">
                      <TableCell className="text-white">{ad.ad}</TableCell>
                      <TableCell className="text-white">{ad.leads}</TableCell>
                      <TableCell className="text-white">{ad.conversions}</TableCell>
                      <TableCell className="text-white">{ad.ctr}%</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-400">
                      {t("analytics.tables.noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Keywords Table */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">{t("analytics.tables.topKeywords")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead className="text-zinc-400">{t("analytics.tables.keyword")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.leads")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.clicks")}</TableHead>
                  <TableHead className="text-zinc-400">{t("analytics.tables.impressions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analyticsData?.topKeywords.length ? (
                  analyticsData.topKeywords.map((keyword, idx) => (
                    <TableRow key={idx} className="border-zinc-800">
                      <TableCell className="text-white">{keyword.keyword}</TableCell>
                      <TableCell className="text-white">{keyword.leads}</TableCell>
                      <TableCell className="text-white">{keyword.clicks}</TableCell>
                      <TableCell className="text-white">{keyword.impressions}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-zinc-400">
                      {t("analytics.tables.noData")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
