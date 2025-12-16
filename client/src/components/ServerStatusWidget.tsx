import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Database, HardDrive, Cpu, TrendingUp, AlertCircle } from "lucide-react";
import { Link } from "wouter";

export function ServerStatusWidget() {
  const { data: health, isLoading } = trpc.health.check.useQuery(undefined, {
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  if (isLoading || !health) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Server Status
          </CardTitle>
          <CardDescription>Loading server metrics...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const memoryPercent = parseFloat(health.memory.usagePercent.replace("%", ""));
  const cpuLoad = parseFloat(health.cpu.loadAverage[0]);
  const isHealthy = health.status === "healthy" && health.database.status === "healthy";

  const getMemoryColor = (percent: number) => {
    if (percent < 70) return "text-green-500";
    if (percent < 85) return "text-yellow-500";
    return "text-red-500";
  };

  const getCpuColor = (load: number) => {
    if (load < 1) return "text-green-500";
    if (load < 2) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className="col-span-full border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Server Status
              {isHealthy ? (
                <span className="text-xs font-normal text-green-500 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Healthy
                </span>
              ) : (
                <span className="text-xs font-normal text-red-500 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Degraded
                </span>
              )}
            </CardTitle>
            <CardDescription>Real-time server performance metrics</CardDescription>
          </div>
          <Link href="/admin/monitoring">
            <Button variant="outline" size="sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              View Details
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Memory Usage */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <HardDrive className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Memory</p>
              <p className={`text-xl font-bold ${getMemoryColor(memoryPercent)}`}>
                {health.memory.usagePercent}
              </p>
              <p className="text-xs text-muted-foreground">
                {health.memory.used} / {health.memory.total}
              </p>
            </div>
          </div>

          {/* CPU Load */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <Cpu className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">CPU Load</p>
              <p className={`text-xl font-bold ${getCpuColor(cpuLoad)}`}>
                {cpuLoad.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">
                {health.cpu.cores} cores
              </p>
            </div>
          </div>

          {/* Database */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <Database className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Database</p>
              <p className={`text-xl font-bold ${health.database.status === "healthy" ? "text-green-500" : "text-red-500"}`}>
                {health.database.status === "healthy" ? "ONLINE" : "OFFLINE"}
              </p>
              <p className="text-xs text-muted-foreground">
                {health.database.responseTime}
              </p>
            </div>
          </div>

          {/* Uptime */}
          <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
            <div className="p-2 rounded-full bg-primary/10">
              <Activity className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="text-xl font-bold text-blue-500">
                {health.uptime.formatted}
              </p>
              <p className="text-xs text-muted-foreground">
                {health.nodeVersion}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Messages */}
        {memoryPercent > 85 && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <strong>High Memory Usage:</strong> Memory usage is at {health.memory.usagePercent}. Consider restarting the server or upgrading resources.
            </p>
          </div>
        )}

        {cpuLoad > 2 && (
          <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <p className="text-sm text-yellow-500 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <strong>High CPU Load:</strong> CPU load is {cpuLoad.toFixed(2)}. Check for resource-intensive processes.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
