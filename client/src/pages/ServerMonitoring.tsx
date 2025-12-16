import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

interface MetricDataPoint {
  timestamp: string;
  value: number;
}

export function ServerMonitoring() {
  const { data: health, refetch } = trpc.health.check.useQuery(undefined, {
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  const [memoryHistory, setMemoryHistory] = useState<MetricDataPoint[]>([]);
  const [cpuHistory, setCpuHistory] = useState<MetricDataPoint[]>([]);
  const [errorHistory, setErrorHistory] = useState<MetricDataPoint[]>([]);

  // Update history when new health data arrives
  useEffect(() => {
    if (!health) return;

    const timestamp = new Date().toLocaleTimeString("uk-UA", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Memory usage
    const memoryUsage = parseFloat(health.memory.usagePercent.replace("%", ""));
    setMemoryHistory((prev) => {
      const updated = [...prev, { timestamp, value: memoryUsage }];
      return updated.slice(-20); // Keep last 20 data points
    });

    // CPU load average (first value)
    const cpuLoad = parseFloat(health.cpu.loadAverage[0]) * 100;
    setCpuHistory((prev) => {
      const updated = [...prev, { timestamp, value: cpuLoad }];
      return updated.slice(-20);
    });

    // Error count (placeholder - will be updated with real data)
    setErrorHistory((prev) => {
      const updated = [...prev, { timestamp, value: 0 }];
      return updated.slice(-20);
    });
  }, [health]);

  const memoryChartData = {
    labels: memoryHistory.map((d) => d.timestamp),
    datasets: [
      {
        label: "Memory Usage (%)",
        data: memoryHistory.map((d) => d.value),
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const cpuChartData = {
    labels: cpuHistory.map((d) => d.timestamp),
    datasets: [
      {
        label: "CPU Load (%)",
        data: cpuHistory.map((d) => d.value),
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const errorChartData = {
    labels: errorHistory.map((d) => d.timestamp),
    datasets: [
      {
        label: "Errors (count)",
        data: errorHistory.map((d) => d.value),
        borderColor: "rgb(234, 179, 8)",
        backgroundColor: "rgba(234, 179, 8, 0.1)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
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
        max: 100,
        ticks: {
          color: "#9ca3af",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
      x: {
        ticks: {
          color: "#9ca3af",
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
      },
    },
  };

  const getStatusColor = (status: string) => {
    return status === "healthy" ? "text-green-500" : "text-red-500";
  };

  const getMemoryColor = (percent: number) => {
    if (percent < 70) return "text-green-500";
    if (percent < 85) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Server Monitoring</h1>
        <p className="text-muted-foreground">
          Real-time server performance metrics and health status
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Server Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(health?.status || "")}`}>
              {health?.status?.toUpperCase() || "LOADING..."}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {health?.timestamp ? new Date(health.timestamp).toLocaleString("uk-UA") : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Memory Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getMemoryColor(parseFloat(health?.memory.usagePercent.replace("%", "") || "0"))}`}>
              {health?.memory.usagePercent || "0%"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {health?.memory.used} / {health?.memory.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getStatusColor(health?.database.status || "")}`}>
              {health?.database.status?.toUpperCase() || "LOADING..."}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Response: {health?.database.responseTime || "0ms"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {health?.uptime.formatted || "0h 0m"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {health?.uptime.seconds || 0} seconds
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Memory Usage</CardTitle>
            <CardDescription>Real-time memory consumption (last 100 seconds)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={memoryChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CPU Load</CardTitle>
            <CardDescription>Real-time CPU load average (last 100 seconds)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={cpuChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Rate</CardTitle>
            <CardDescription>Errors per minute (last 100 seconds)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <Line data={errorChartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Server hardware and software details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">CPU Model</p>
              <p className="font-medium">{health?.cpu.model || "Loading..."}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CPU Cores</p>
              <p className="font-medium">{health?.cpu.cores || 0} cores</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Node.js Version</p>
              <p className="font-medium">{health?.nodeVersion || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Platform</p>
              <p className="font-medium">{health?.platform || "Unknown"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Response Time</p>
              <p className="font-medium text-green-500">{health?.responseTime || "0ms"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
