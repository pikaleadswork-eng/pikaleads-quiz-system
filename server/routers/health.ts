import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import os from "os";

export const healthRouter = router({
  /**
   * Health check endpoint
   * Returns server status, database connection, memory usage, uptime
   */
  check: publicProcedure.query(async () => {
    const startTime = Date.now();
    
    // Check database connection
    let dbStatus = "healthy";
    let dbResponseTime = 0;
    try {
      const dbStart = Date.now();
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      await db.execute("SELECT 1");
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = "unhealthy";
      console.error("[Health Check] Database error:", error);
    }

    // Get system metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = Math.round((usedMemory / totalMemory) * 100);

    const uptime = process.uptime();
    const uptimeHours = Math.floor(uptime / 3600);
    const uptimeMinutes = Math.floor((uptime % 3600) / 60);

    const responseTime = Date.now() - startTime;

    return {
      status: dbStatus === "healthy" ? "healthy" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${uptimeHours}h ${uptimeMinutes}m`,
      },
      database: {
        status: dbStatus,
        responseTime: `${dbResponseTime}ms`,
      },
      memory: {
        total: `${Math.round(totalMemory / 1024 / 1024)}MB`,
        used: `${Math.round(usedMemory / 1024 / 1024)}MB`,
        free: `${Math.round(freeMemory / 1024 / 1024)}MB`,
        usagePercent: `${memoryUsagePercent}%`,
      },
      cpu: {
        cores: os.cpus().length,
        model: os.cpus()[0]?.model || "Unknown",
        loadAverage: os.loadavg().map((load) => load.toFixed(2)),
      },
      responseTime: `${responseTime}ms`,
      nodeVersion: process.version,
      platform: process.platform,
    };
  }),

  /**
   * Get error logs from the last 24 hours
   */
  getErrorLogs: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const result = await db.execute(
      `SELECT * FROM error_logs 
       WHERE createdAt > DATE_SUB(NOW(), INTERVAL 24 HOUR) 
       ORDER BY createdAt DESC 
       LIMIT 100`
    );
    return Array.isArray(result) ? result : [];
  }),
});
