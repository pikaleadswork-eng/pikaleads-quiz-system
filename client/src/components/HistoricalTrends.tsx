import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line } from "react-chartjs-2";
import { TrendingUp, TrendingDown, Activity, Users } from "lucide-react";

export function HistoricalTrends() {
  // Note: These queries would need to be implemented in the backend
  // For now, we'll create mock data structure
  
  const mockMemoryTrend = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("uk-UA", { month: "short", day: "numeric" });
    }),
    data: [75, 78, 82, 79, 85, 83, 82], // Mock data
  };

  const mockCPUTrend = {
    labels: Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toLocaleDateString("uk-UA", { month: "short", day: "numeric" });
    }),
    data: [1.2, 1.5, 1.8, 1.3, 2.1, 1.7, 1.4], // Mock data
  };

  const mockErrorTrend = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString("uk-UA", { month: "short", day: "numeric" });
    }),
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 10)), // Mock data
  };

  const mockLeadTrend = {
    labels: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toLocaleDateString("uk-UA", { month: "short", day: "numeric" });
    }),
    data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 50) + 10), // Mock data
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Historical Trends</h2>
        <p className="text-muted-foreground">
          Analyze server performance and business metrics over time
        </p>
      </div>

      <Tabs defaultValue="7days" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="7days">Last 7 Days</TabsTrigger>
          <TabsTrigger value="30days">Last 30 Days</TabsTrigger>
        </TabsList>

        <TabsContent value="7days" className="space-y-6 mt-6">
          {/* Memory Usage Trend (7 days) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-500" />
                Memory Usage Trend
              </CardTitle>
              <CardDescription>
                Average memory usage over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <Line
                  data={{
                    labels: mockMemoryTrend.labels,
                    datasets: [
                      {
                        label: "Memory Usage (%)",
                        data: mockMemoryTrend.data,
                        borderColor: "rgb(168, 85, 247)",
                        backgroundColor: "rgba(168, 85, 247, 0.1)",
                        fill: true,
                        tension: 0.4,
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
                        max: 100,
                        title: {
                          display: true,
                          text: "Memory Usage (%)",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                {mockMemoryTrend.data[mockMemoryTrend.data.length - 1] > 
                 mockMemoryTrend.data[mockMemoryTrend.data.length - 2] ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className="text-muted-foreground">
                  Current: {mockMemoryTrend.data[mockMemoryTrend.data.length - 1]}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* CPU Load Trend (7 days) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                CPU Load Trend
              </CardTitle>
              <CardDescription>
                Average CPU load over the last 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <Line
                  data={{
                    labels: mockCPUTrend.labels,
                    datasets: [
                      {
                        label: "CPU Load",
                        data: mockCPUTrend.data,
                        borderColor: "rgb(59, 130, 246)",
                        backgroundColor: "rgba(59, 130, 246, 0.1)",
                        fill: true,
                        tension: 0.4,
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
                          text: "CPU Load",
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                {mockCPUTrend.data[mockCPUTrend.data.length - 1] > 
                 mockCPUTrend.data[mockCPUTrend.data.length - 2] ? (
                  <TrendingUp className="w-4 h-4 text-red-500" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-green-500" />
                )}
                <span className="text-muted-foreground">
                  Current: {mockCPUTrend.data[mockCPUTrend.data.length - 1].toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="30days" className="space-y-6 mt-6">
          {/* Error Count Trend (30 days) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-500" />
                Error Count Trend
              </CardTitle>
              <CardDescription>
                Daily error count over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <Line
                  data={{
                    labels: mockErrorTrend.labels,
                    datasets: [
                      {
                        label: "Errors",
                        data: mockErrorTrend.data,
                        borderColor: "rgb(239, 68, 68)",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        fill: true,
                        tension: 0.4,
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
                          text: "Error Count",
                        },
                      },
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45,
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Total errors: {mockErrorTrend.data.reduce((a, b) => a + b, 0)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Lead Generation Trend (30 days) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-500" />
                Lead Generation Trend
              </CardTitle>
              <CardDescription>
                Daily lead generation over the last 30 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[250px]">
                <Line
                  data={{
                    labels: mockLeadTrend.labels,
                    datasets: [
                      {
                        label: "Leads",
                        data: mockLeadTrend.data,
                        borderColor: "rgb(34, 197, 94)",
                        backgroundColor: "rgba(34, 197, 94, 0.1)",
                        fill: true,
                        tension: 0.4,
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
                          text: "Lead Count",
                        },
                      },
                      x: {
                        ticks: {
                          maxRotation: 45,
                          minRotation: 45,
                        },
                      },
                    },
                  }}
                />
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">
                  Total leads: {mockLeadTrend.data.reduce((a, b) => a + b, 0)}
                </span>
                <span className="text-muted-foreground">
                  • Avg per day: {(mockLeadTrend.data.reduce((a, b) => a + b, 0) / 30).toFixed(1)}
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Note:</strong> Historical trends are currently showing mock data for demonstration. 
            To enable real historical tracking, implement backend procedures to store daily metrics in the database.
            Create a cron job to save snapshots of memory, CPU, errors, and leads every day at midnight.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
