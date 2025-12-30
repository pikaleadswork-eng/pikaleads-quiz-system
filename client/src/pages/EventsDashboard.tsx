import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, CheckCircle2, XCircle, Clock, RefreshCw, TrendingUp, Zap } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const translations = {
  uk: {
    title: "Моніторинг Подій",
    subtitle: "Real-time відстеження аналітичних подій",
    stats: "Статистика",
    totalEvents: "Всього подій",
    successRate: "Успішність",
    failedEvents: "Помилки",
    avgResponseTime: "Серед. час відповіді",
    recentEvents: "Останні події",
    filters: "Фільтри",
    platform: "Платформа",
    status: "Статус",
    allPlatforms: "Всі платформи",
    allStatuses: "Всі статуси",
    success: "Успішно",
    fail: "Помилка",
    pending: "В очікуванні",
    refresh: "Оновити",
    autoRefresh: "Авто-оновлення",
    eventType: "Тип події",
    timestamp: "Час",
    responseTime: "Час відповіді",
    noEvents: "Немає подій",
    loading: "Завантаження...",
    timeRange: "Період",
    "1h": "1 година",
    "24h": "24 години",
    "7d": "7 днів",
    "30d": "30 днів",
    topEvents: "Топ подій",
    platformDistribution: "Розподіл по платформах",
    recording: "Запис",
    viewRecording: "Переглянути запис",
    onlyWithRecordings: "Тільки з записами",
    sessionReplay: "Відтворення сесії",
    closeModal: "Закрити",
  },
  ru: {
    title: "Мониторинг Событий",
    subtitle: "Real-time отслеживание аналитических событий",
    stats: "Статистика",
    totalEvents: "Всего событий",
    successRate: "Успешность",
    failedEvents: "Ошибки",
    avgResponseTime: "Сред. время ответа",
    recentEvents: "Последние события",
    filters: "Фильтры",
    platform: "Платформа",
    status: "Статус",
    allPlatforms: "Все платформы",
    allStatuses: "Все статусы",
    success: "Успешно",
    fail: "Ошибка",
    pending: "В ожидании",
    refresh: "Обновить",
    autoRefresh: "Авто-обновление",
    eventType: "Тип события",
    timestamp: "Время",
    responseTime: "Время ответа",
    noEvents: "Нет событий",
    loading: "Загрузка...",
    timeRange: "Период",
    "1h": "1 час",
    "24h": "24 часа",
    "7d": "7 дней",
    "30d": "30 дней",
    topEvents: "Топ событий",
    platformDistribution: "Распределение по платформам",
    recording: "Запись",
    viewRecording: "Просмотреть запись",
    onlyWithRecordings: "Только с записями",
    sessionReplay: "Воспроизведение сессии",
    closeModal: "Закрыть",
  },
  en: {
    title: "Events Monitoring",
    subtitle: "Real-time analytics events tracking",
    stats: "Statistics",
    totalEvents: "Total Events",
    successRate: "Success Rate",
    failedEvents: "Failed Events",
    avgResponseTime: "Avg Response Time",
    recentEvents: "Recent Events",
    filters: "Filters",
    platform: "Platform",
    status: "Status",
    allPlatforms: "All Platforms",
    allStatuses: "All Statuses",
    success: "Success",
    fail: "Failed",
    pending: "Pending",
    refresh: "Refresh",
    autoRefresh: "Auto-refresh",
    eventType: "Event Type",
    timestamp: "Timestamp",
    responseTime: "Response Time",
    noEvents: "No events",
    loading: "Loading...",
    timeRange: "Time Range",
    "1h": "1 hour",
    "24h": "24 hours",
    "7d": "7 days",
    "30d": "30 days",
    topEvents: "Top Events",
    platformDistribution: "Platform Distribution",
    recording: "Recording",
    viewRecording: "View Recording",
    onlyWithRecordings: "Only with recordings",
    sessionReplay: "Session Replay",
    closeModal: "Close",
  },
};

export default function EventsDashboard() {
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations] || translations.en;

  const [platform, setPlatform] = useState<"ga4" | "meta_pixel" | "gtm" | "clarity" | "all">("all");
  const [status, setStatus] = useState<"success" | "fail" | "pending" | "all">("all");
  const [timeRange, setTimeRange] = useState<"1h" | "24h" | "7d" | "30d">("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [onlyWithRecordings, setOnlyWithRecordings] = useState(false);
  const [selectedSessionUrl, setSelectedSessionUrl] = useState<string | null>(null);

  // Fetch events
  const { data: allEvents = [], refetch: refetchEvents, isLoading: eventsLoading } = trpc.eventsLog.getRecentEvents.useQuery({
    limit: 100,
    platform,
    status,
  });

  // Filter events based on recordings checkbox
  const events = onlyWithRecordings
    ? allEvents.filter(e => e.clarityUserId && e.claritySessionId && e.clarityProjectId)
    : allEvents;

  // Fetch stats
  const { data: stats, refetch: refetchStats, isLoading: statsLoading } = trpc.eventsLog.getEventStats.useQuery({
    timeRange,
  });

  // Auto-refresh every 10 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refetchEvents();
      refetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh, refetchEvents, refetchStats]);

  const handleRefresh = () => {
    refetchEvents();
    refetchStats();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "fail":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: "default" as const,
      fail: "destructive" as const,
      pending: "secondary" as const,
    };
    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {t[status as keyof typeof t] || status}
      </Badge>
    );
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    return date.toLocaleString(language === "uk" ? "uk-UA" : language === "ru" ? "ru-RU" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.title}</h1>
          <p className="text-muted-foreground mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm cursor-pointer bg-card px-3 py-2 rounded-md border">
            <input
              type="checkbox"
              checked={onlyWithRecordings}
              onChange={(e) => setOnlyWithRecordings(e.target.checked)}
              className="rounded border-gray-300"
            />
            {t.onlyWithRecordings}
          </label>
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            {t.autoRefresh}
          </Button>
          <Button variant="outline" size="sm" onClick={handleRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            {t.refresh}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.totalEvents}</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : stats?.totalEvents.toLocaleString() || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t[timeRange as keyof typeof t]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.successRate}</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {statsLoading ? "..." : `${stats?.successRate || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {statsLoading ? "..." : `${stats?.successEvents || 0} ${t.success.toLowerCase()}`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.failedEvents}</CardTitle>
            <XCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {statsLoading ? "..." : stats?.failedEvents || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t[timeRange as keyof typeof t]}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t.avgResponseTime}</CardTitle>
            <Zap className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : `${stats?.avgResponseTime || 0}ms`}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t[timeRange as keyof typeof t]}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>{t.filters}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">{t.timeRange}</label>
              <Select value={timeRange} onValueChange={(v: any) => setTimeRange(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">{t["1h"]}</SelectItem>
                  <SelectItem value="24h">{t["24h"]}</SelectItem>
                  <SelectItem value="7d">{t["7d"]}</SelectItem>
                  <SelectItem value="30d">{t["30d"]}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">{t.platform}</label>
              <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPlatforms}</SelectItem>
                  <SelectItem value="ga4">Google Analytics 4</SelectItem>
                  <SelectItem value="meta_pixel">Meta Pixel</SelectItem>
                  <SelectItem value="gtm">Google Tag Manager</SelectItem>
                  <SelectItem value="clarity">Microsoft Clarity</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 min-w-[200px]">
              <label className="text-sm font-medium mb-2 block">{t.status}</label>
              <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  <SelectItem value="success">{t.success}</SelectItem>
                  <SelectItem value="fail">{t.fail}</SelectItem>
                  <SelectItem value="pending">{t.pending}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t.recentEvents}</CardTitle>
          <CardDescription>
            {eventsLoading ? t.loading : `${events.length} ${t.recentEvents.toLowerCase()}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t.status}</th>
                  <th className="text-left py-3 px-4 font-medium">{t.platform}</th>
                  <th className="text-left py-3 px-4 font-medium">{t.eventType}</th>
                  <th className="text-left py-3 px-4 font-medium">{t.timestamp}</th>
                  <th className="text-left py-3 px-4 font-medium">{t.responseTime}</th>
                  <th className="text-left py-3 px-4 font-medium">{t.recording || "Recording"}</th>
                </tr>
              </thead>
              <tbody>
                {eventsLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t.loading}
                  </td>
                </tr>
                ) : events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-muted-foreground">
                    {t.noEvents}
                  </td>
                </tr>
                ) : (
                  events.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(event.status)}
                          {getStatusBadge(event.status)}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{event.platform}</Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{event.eventType}</td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {formatTimestamp(event.timestamp)}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {event.responseTime ? `${event.responseTime}ms` : "-"}
                      </td>
                      <td className="py-3 px-4">
                        {event.platform === "clarity" && event.clarityUserId && event.claritySessionId && event.clarityProjectId ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const url = `https://clarity.microsoft.com/player/${event.clarityProjectId}/${event.clarityUserId}/${event.claritySessionId}`;
                              setSelectedSessionUrl(url);
                            }}
                          >
                            {t.viewRecording || "View Recording"}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Top Events & Platform Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.topEvents}</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <p className="text-muted-foreground">{t.loading}</p>
            ) : (
              <div className="space-y-2">
                {stats?.eventsByType.map((item) => (
                  <div key={item.eventType} className="flex items-center justify-between py-2 border-b">
                    <span className="font-mono text-sm">{item.eventType}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.platformDistribution}</CardTitle>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <p className="text-muted-foreground">{t.loading}</p>
            ) : (
              <div className="space-y-2">
                {stats?.eventsByPlatform.map((item) => (
                  <div key={item.platform} className="flex items-center justify-between py-2 border-b">
                    <span className="capitalize">{item.platform}</span>
                    <Badge variant="secondary">{item.count}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Session Replay Modal */}
      {selectedSessionUrl && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedSessionUrl(null)}>
          <div className="bg-card rounded-lg shadow-xl w-full max-w-7xl h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-semibold">{t.sessionReplay}</h2>
              <Button variant="outline" size="sm" onClick={() => setSelectedSessionUrl(null)}>
                {t.closeModal}
              </Button>
            </div>
            <div className="flex-1 overflow-hidden">
              <iframe
                src={selectedSessionUrl}
                className="w-full h-full border-0"
                title="Clarity Session Replay"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
