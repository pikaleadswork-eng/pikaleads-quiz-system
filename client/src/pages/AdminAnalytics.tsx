import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter, Calendar as CalendarIcon, TrendingUp, DollarSign, Users, Clock, RefreshCw, Pause, Play, ArrowUp, ArrowDown, Mail, FileDown, FileSpreadsheet } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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
  const [compareWithPrevious, setCompareWithPrevious] = useState(false);
  
  // Send report mutation
  const sendReportMutation = trpc.admin.sendAnalyticsReport.useMutation({
    onSuccess: (data) => {
      if (data.success) {
        alert(t("analytics.reportSent"));
      } else {
        alert(t("analytics.reportFailed"));
      }
    },
    onError: () => {
      alert(t("analytics.reportFailed"));
    },
  });
  
  const handleSendReport = () => {
    sendReportMutation.mutate({
      dateRange: dateRange,
      startDate: customStartDate?.toISOString(),
      endDate: customEndDate?.toISOString(),
      quizName: selectedQuiz !== "all" ? selectedQuiz : undefined,
      source: selectedSource !== "all" ? selectedSource : undefined,
      campaign: selectedCampaign !== "all" ? selectedCampaign : undefined,
    });
  };
  
  // Export to Excel
  const handleExportExcel = () => {
    if (!analyticsData) return;
    const data = analyticsData;
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    
    // Summary sheet
    const summaryData = [
      ["Metric", "Value"],
      ["Total Leads", data.summary.totalLeads],
      ["Conversion Rate", `${data.summary.conversionRate}%`],
      ["ROMI", `${data.summary.romi}%`],
      ["ROAS", `${data.summary.roas}x`],
      ["Avg Time on Site", `${Math.floor(data.summary.avgTimeOnSite / 60)}m ${data.summary.avgTimeOnSite % 60}s`],
      ["Total Spent", `$${data.summary.totalSpent}`],
      ["Total Revenue", `$${data.summary.totalRevenue}`],
      ["Cost Per Lead", `$${data.summary.costPerLead}`],
    ];
    const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, "Summary");
    
    // Top Campaigns sheet
    const campaignsData = [
      ["Campaign", "Leads", "Revenue", "Spent", "ROMI", "ROAS"],
      ...data.topCampaigns.map(c => [
        c.campaign,
        c.leads,
        `$${c.revenue}`,
        `$${c.spent}`,
        `${c.romi}%`,
        `${c.roas}x`
      ])
    ];
    const wsCampaigns = XLSX.utils.aoa_to_sheet(campaignsData);
    XLSX.utils.book_append_sheet(wb, wsCampaigns, "Top Campaigns");
    
    // Top Ads sheet
    const adsData = [
      ["Ad", "Leads", "Conversions", "CTR"],
      ...data.topAds.map((a: any) => [
        a.ad,
        a.leads,
        a.conversions,
        `${a.ctr}%`
      ])
    ];
    const wsAds = XLSX.utils.aoa_to_sheet(adsData);
    XLSX.utils.book_append_sheet(wb, wsAds, "Top Ads");
    
    // Top Keywords sheet
    const keywordsData = [
      ["Keyword", "Impressions", "Leads", "Clicks"],
      ...data.topKeywords.map((k: any) => [
        k.keyword,
        k.impressions,
        k.leads,
        k.clicks
      ])
    ];
    const wsKeywords = XLSX.utils.aoa_to_sheet(keywordsData);
    XLSX.utils.book_append_sheet(wb, wsKeywords, "Top Keywords");
    
    // Download
    XLSX.writeFile(wb, `analytics_${new Date().toISOString().split('T')[0]}.xlsx`);
  };
  
  // Export to PDF
  const handleExportPDF = () => {
    if (!analyticsData) return;
    const data = analyticsData;
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text("PIKALEADS Analytics Report", 14, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
    
    // Summary metrics
    doc.setFontSize(14);
    doc.text("Summary Metrics", 14, 40);
    
    autoTable(doc, {
      startY: 45,
      head: [["Metric", "Value"]],
      body: [
        ["Total Leads", data.summary.totalLeads.toString()],
        ["Conversion Rate", `${data.summary.conversionRate}%`],
        ["ROMI", `${data.summary.romi}%`],
        ["ROAS", `${data.summary.roas}x`],
        ["Avg Time on Site", `${Math.floor(data.summary.avgTimeOnSite / 60)}m ${data.summary.avgTimeOnSite % 60}s`],
        ["Total Spent", `$${data.summary.totalSpent}`],
        ["Total Revenue", `$${data.summary.totalRevenue}`],
        ["Cost Per Lead", `$${data.summary.costPerLead}`],
      ],
    });
    
    // Top Campaigns
    doc.addPage();
    doc.setFontSize(14);
    doc.text("Top Campaigns", 14, 20);
    
    autoTable(doc, {
      startY: 25,
      head: [["Campaign", "Leads", "Revenue", "Spent", "ROMI", "ROAS"]],
      body: data.topCampaigns.map(c => [
        c.campaign,
        c.leads.toString(),
        `$${c.revenue}`,
        `$${c.spent}`,
        `${c.romi}%`,
        `${c.roas}x`
      ]),
    });
    
    // Top Ads
    const finalY1 = (doc as any).lastAutoTable.finalY || 25;
    doc.setFontSize(14);
    doc.text("Top Ads", 14, finalY1 + 15);
    
    autoTable(doc, {
      startY: finalY1 + 20,
      head: [["Ad", "Leads", "Conversions", "CTR"]],
      body: data.topAds.map((a: any) => [
        a.ad,
        a.leads.toString(),
        a.conversions.toString(),
        `${a.ctr}%`
      ]),
    });
    
    // Top Keywords
    const finalY2 = (doc as any).lastAutoTable.finalY || 25;
    doc.setFontSize(14);
    doc.text("Top Keywords", 14, finalY2 + 15);
    
    autoTable(doc, {
      startY: finalY2 + 20,
      head: [["Keyword", "Impressions", "Leads", "Clicks"]],
      body: data.topKeywords.map((k: any) => [
        k.keyword,
        k.impressions.toString(),
        k.leads.toString(),
        k.clicks.toString()
      ]),
    });
    
    // Save
    doc.save(`analytics_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Calculate previous period dates
  const getPreviousPeriodDates = () => {
    const now = new Date();
    let prevStart: Date | undefined;
    let prevEnd: Date | undefined;

    switch (dateRange) {
      case "today":
        prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
        prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 23, 59, 59);
        break;
      case "yesterday":
        prevStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2);
        prevEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2, 23, 59, 59);
        break;
      case "last7Days":
        prevStart = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
        prevEnd = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "last30Days":
        prevStart = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        prevEnd = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "thisMonth":
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        prevStart = lastMonth;
        prevEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
        break;
      case "lastMonth":
        const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        prevStart = twoMonthsAgo;
        prevEnd = new Date(now.getFullYear(), now.getMonth() - 1, 0, 23, 59, 59);
        break;
      case "custom":
        if (customStartDate && customEndDate) {
          const duration = customEndDate.getTime() - customStartDate.getTime();
          prevStart = new Date(customStartDate.getTime() - duration);
          prevEnd = new Date(customStartDate.getTime() - 1);
        }
        break;
    }

    return { prevStart, prevEnd };
  };

  // Fetch analytics data
  const { data: analyticsData, isLoading, refetch } = trpc.admin.getAnalyticsData.useQuery({
    dateRange: dateRange,
    startDate: customStartDate?.toISOString(),
    endDate: customEndDate?.toISOString(),
    quizName: selectedQuiz !== "all" ? selectedQuiz : undefined,
    source: selectedSource !== "all" ? selectedSource : undefined,
    campaign: selectedCampaign !== "all" ? selectedCampaign : undefined,
  });

  // Fetch previous period data for comparison
  const { prevStart, prevEnd } = getPreviousPeriodDates();
  const { data: previousData } = trpc.admin.getAnalyticsData.useQuery(
    {
      dateRange: "custom",
      startDate: prevStart?.toISOString(),
      endDate: prevEnd?.toISOString(),
      quizName: selectedQuiz !== "all" ? selectedQuiz : undefined,
      source: selectedSource !== "all" ? selectedSource : undefined,
      campaign: selectedCampaign !== "all" ? selectedCampaign : undefined,
    },
    {
      enabled: compareWithPrevious && !!prevStart && !!prevEnd,
    }
  );

  // Calculate percentage changes
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

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
    <DashboardLayout>
      <div className="space-y-6">
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
            
            {/* Export Excel Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              disabled={!analyticsData}
              className="bg-green-600 border-green-500 hover:bg-green-700"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {t("analytics.exportExcel")}
            </Button>
            
            {/* Export PDF Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportPDF}
              disabled={!analyticsData}
              className="bg-red-600 border-red-500 hover:bg-red-700"
            >
              <FileDown className="w-4 h-4 mr-2" />
              {t("analytics.exportPDF")}
            </Button>
            
            {/* Send Report Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleSendReport}
              disabled={sendReportMutation.isPending}
              className="bg-purple-600 border-purple-500 hover:bg-purple-700"
            >
              <Mail className="w-4 h-4 mr-2" />
              {sendReportMutation.isPending ? t("analytics.sending") : t("analytics.sendReport")}
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

                {/* Comparison Toggle */}
                <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                  <label className="text-sm text-zinc-300">{t("analytics.compareWithPrevious")}</label>
                  <button
                    onClick={() => setCompareWithPrevious(!compareWithPrevious)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      compareWithPrevious ? "bg-purple-600" : "bg-zinc-700"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        compareWithPrevious ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
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
          <MetricCard
            title={t("analytics.summaryCards.totalLeads")}
            value={analyticsData?.summary.totalLeads || 0}
            icon={Users}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.totalLeads}
            previousValue={previousData?.summary.totalLeads}
          />

          <MetricCard
            title={t("analytics.summaryCards.conversionRate")}
            value={`${analyticsData?.summary.conversionRate || 0}%`}
            icon={TrendingUp}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.conversionRate}
            previousValue={previousData?.summary.conversionRate}
          />

          <MetricCard
            title={t("analytics.summaryCards.romi")}
            value={`${analyticsData?.summary.romi || 0}%`}
            icon={DollarSign}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.romi}
            previousValue={previousData?.summary.romi}
          />

          <MetricCard
            title={t("analytics.summaryCards.roas")}
            value={`${analyticsData?.summary.roas || 0}x`}
            icon={DollarSign}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.roas}
            previousValue={previousData?.summary.roas}
            suffix="x"
          />

          <MetricCard
            title={t("analytics.summaryCards.avgTimeOnSite")}
            value={`${Math.floor((analyticsData?.summary.avgTimeOnSite || 0) / 60)}m ${(analyticsData?.summary.avgTimeOnSite || 0) % 60}s`}
            icon={Clock}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.avgTimeOnSite}
            previousValue={previousData?.summary.avgTimeOnSite}
            suffix="s"
          />

          <MetricCard
            title={t("analytics.summaryCards.totalSpent")}
            value={`$${analyticsData?.summary.totalSpent?.toFixed(2) || 0}`}
            icon={DollarSign}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.totalSpent}
            previousValue={previousData?.summary.totalSpent}
          />

          <MetricCard
            title={t("analytics.summaryCards.totalRevenue")}
            value={`$${analyticsData?.summary.totalRevenue?.toFixed(2) || 0}`}
            icon={DollarSign}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.totalRevenue}
            previousValue={previousData?.summary.totalRevenue}
          />

          <MetricCard
            title={t("analytics.summaryCards.costPerLead")}
            value={`$${analyticsData?.summary.costPerLead || 0}`}
            icon={DollarSign}
            compareWithPrevious={compareWithPrevious}
            currentValue={analyticsData?.summary.costPerLead}
            previousValue={previousData?.summary.costPerLead}
          />
        </div>

        {/* OLD CARDS - TO BE REMOVED */}
        <div className="hidden">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {t("analytics.summaryCards.totalLeads")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-white">{analyticsData?.summary.totalLeads || 0}</div>
                {compareWithPrevious && previousData && (
                  <div className="flex items-center gap-1 text-sm">
                    {(() => {
                      const change = calculateChange(
                        analyticsData?.summary.totalLeads || 0,
                        previousData.summary.totalLeads || 0
                      );
                      const isPositive = change >= 0;
                      return (
                        <>
                          {isPositive ? (
                            <ArrowUp className="w-3 h-3 text-green-500" />
                          ) : (
                            <ArrowDown className="w-3 h-3 text-red-500" />
                          )}
                          <span className={isPositive ? "text-green-500" : "text-red-500"}>
                            {Math.abs(change).toFixed(1)}%
                          </span>
                        </>
                      );
                    })()}
                  </div>
                )}
              </div>
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
    </DashboardLayout>
  );
}
