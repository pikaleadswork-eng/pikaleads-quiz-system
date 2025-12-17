import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingUp, Clock, XCircle } from "lucide-react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function PerformanceMonitoring() {
  const { data: stats } = trpc.performance.getStats.useQuery(undefined, {
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const { data: bottlenecks } = trpc.performance.getBottlenecks.useQuery();
  const { data: slowest } = trpc.performance.getSlowestEndpoints.useQuery();
  const { data: highErrors } = trpc.performance.getHighErrorEndpoints.useQuery();

  const getResponseTimeColor = (time: number) => {
    if (time < 100) return "text-green-500";
    if (time < 500) return "text-yellow-500";
    if (time < 1000) return "text-orange-500";
    return "text-red-500";
  };

  const getErrorRateColor = (rate: number) => {
    if (rate === 0) return "text-green-500";
    if (rate < 5) return "text-yellow-500";
    if (rate < 10) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Performance Monitoring</h1>
        <p className="text-muted-foreground">
          Track API response times, identify bottlenecks, and monitor error rates
        </p>
      </div>

      {/* Alert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-500/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <CardTitle className="text-sm font-medium">Bottlenecks</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500">
              {bottlenecks?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Endpoints &gt; 1000ms avg response time
            </p>
          </CardContent>
        </Card>

        <Card className="border-orange-500/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <CardTitle className="text-sm font-medium">Slow Endpoints</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {slowest?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Top 10 slowest API endpoints
            </p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-yellow-500" />
              <CardTitle className="text-sm font-medium">High Error Rates</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-500">
              {highErrors?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Endpoints with errors &gt; 0%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Response Time Graph */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              API Response Times
            </CardTitle>
            <CardDescription>
              Average response time for each endpoint (lower is better)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <Bar
                data={{
                  labels: Object.keys(stats).slice(0, 15),
                  datasets: [
                    {
                      label: "Avg Response Time (ms)",
                      data: Object.values(stats).slice(0, 15).map((s: any) => s.avgTime),
                      backgroundColor: Object.values(stats).slice(0, 15).map((s: any) => {
                        if (s.avgTime < 100) return "rgba(34, 197, 94, 0.5)";
                        if (s.avgTime < 500) return "rgba(234, 179, 8, 0.5)";
                        if (s.avgTime < 1000) return "rgba(249, 115, 22, 0.5)";
                        return "rgba(239, 68, 68, 0.5)";
                      }),
                      borderColor: Object.values(stats).slice(0, 15).map((s: any) => {
                        if (s.avgTime < 100) return "rgb(34, 197, 94)";
                        if (s.avgTime < 500) return "rgb(234, 179, 8)";
                        if (s.avgTime < 1000) return "rgb(249, 115, 22)";
                        return "rgb(239, 68, 68)";
                      }),
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
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
                      title: {
                        display: true,
                        text: "Response Time (ms)",
                      },
                    },
                  },
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bottlenecks Table */}
      {bottlenecks && bottlenecks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              Critical Bottlenecks
            </CardTitle>
            <CardDescription>
              Endpoints requiring immediate optimization (avg response time &gt; 1000ms)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Method</th>
                    <th className="text-left p-2">Endpoint</th>
                    <th className="text-right p-2">Avg Time</th>
                    <th className="text-right p-2">Min Time</th>
                    <th className="text-right p-2">Max Time</th>
                    <th className="text-right p-2">Requests</th>
                    <th className="text-right p-2">Error Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {bottlenecks.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <Badge variant="outline">{item.method}</Badge>
                      </td>
                      <td className="p-2 font-mono text-sm">{item.endpoint}</td>
                      <td className={`p-2 text-right font-bold ${getResponseTimeColor(item.avgResponseTime)}`}>
                        {item.avgResponseTime}ms
                      </td>
                      <td className="p-2 text-right text-muted-foreground">{item.minResponseTime}ms</td>
                      <td className="p-2 text-right text-muted-foreground">{item.maxResponseTime}ms</td>
                      <td className="p-2 text-right">{item.count}</td>
                      <td className={`p-2 text-right font-semibold ${getErrorRateColor(item.errorRate)}`}>
                        {item.errorRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Endpoints Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            All Endpoints Performance
          </CardTitle>
          <CardDescription>
            Complete performance metrics for all API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Method</th>
                  <th className="text-left p-2">Endpoint</th>
                  <th className="text-right p-2">Avg Time</th>
                  <th className="text-right p-2">Min Time</th>
                  <th className="text-right p-2">Max Time</th>
                  <th className="text-right p-2">Requests</th>
                  <th className="text-right p-2">Error Rate</th>
                </tr>
              </thead>
              <tbody>
                {stats?.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-muted/50">
                    <td className="p-2">
                      <Badge variant="outline">{item.method}</Badge>
                    </td>
                    <td className="p-2 font-mono text-sm">{item.endpoint}</td>
                    <td className={`p-2 text-right font-bold ${getResponseTimeColor(item.avgResponseTime)}`}>
                      {item.avgResponseTime}ms
                    </td>
                    <td className="p-2 text-right text-muted-foreground">{item.minResponseTime}ms</td>
                    <td className="p-2 text-right text-muted-foreground">{item.maxResponseTime}ms</td>
                    <td className="p-2 text-right">{item.count}</td>
                    <td className={`p-2 text-right font-semibold ${getErrorRateColor(item.errorRate)}`}>
                      {item.errorRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* High Error Endpoints */}
      {highErrors && highErrors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-yellow-500" />
              High Error Rate Endpoints
            </CardTitle>
            <CardDescription>
              Endpoints with the highest error rates requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">Method</th>
                    <th className="text-left p-2">Endpoint</th>
                    <th className="text-right p-2">Error Rate</th>
                    <th className="text-right p-2">Avg Time</th>
                    <th className="text-right p-2">Requests</th>
                  </tr>
                </thead>
                <tbody>
                  {highErrors.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <Badge variant="outline">{item.method}</Badge>
                      </td>
                      <td className="p-2 font-mono text-sm">{item.endpoint}</td>
                      <td className={`p-2 text-right font-bold ${getErrorRateColor(item.errorRate)}`}>
                        {item.errorRate.toFixed(1)}%
                      </td>
                      <td className={`p-2 text-right ${getResponseTimeColor(item.avgResponseTime)}`}>
                        {item.avgResponseTime}ms
                      </td>
                      <td className="p-2 text-right">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
