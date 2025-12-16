import { publicProcedure, router } from "../_core/trpc.js";
import { getDb } from "../db.js";
import os from "os";

/**
 * Prometheus metrics router
 * Exposes metrics in Prometheus format for scraping
 */
export const prometheusRouter = router({
  /**
   * Get metrics in Prometheus text format
   */
  metrics: publicProcedure.query(async () => {
    const metrics: string[] = [];
    
    // System metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;
    
    const uptime = process.uptime();
    const loadAvg = os.loadavg();
    
    // Memory metrics
    metrics.push('# HELP pikaleads_memory_total_bytes Total memory in bytes');
    metrics.push('# TYPE pikaleads_memory_total_bytes gauge');
    metrics.push(`pikaleads_memory_total_bytes ${totalMemory}`);
    
    metrics.push('# HELP pikaleads_memory_used_bytes Used memory in bytes');
    metrics.push('# TYPE pikaleads_memory_used_bytes gauge');
    metrics.push(`pikaleads_memory_used_bytes ${usedMemory}`);
    
    metrics.push('# HELP pikaleads_memory_free_bytes Free memory in bytes');
    metrics.push('# TYPE pikaleads_memory_free_bytes gauge');
    metrics.push(`pikaleads_memory_free_bytes ${freeMemory}`);
    
    metrics.push('# HELP pikaleads_memory_usage_percent Memory usage percentage');
    metrics.push('# TYPE pikaleads_memory_usage_percent gauge');
    metrics.push(`pikaleads_memory_usage_percent ${memoryUsagePercent.toFixed(2)}`);
    
    // CPU metrics
    metrics.push('# HELP pikaleads_cpu_cores Number of CPU cores');
    metrics.push('# TYPE pikaleads_cpu_cores gauge');
    metrics.push(`pikaleads_cpu_cores ${os.cpus().length}`);
    
    metrics.push('# HELP pikaleads_cpu_load_1m CPU load average (1 minute)');
    metrics.push('# TYPE pikaleads_cpu_load_1m gauge');
    metrics.push(`pikaleads_cpu_load_1m ${loadAvg[0]}`);
    
    metrics.push('# HELP pikaleads_cpu_load_5m CPU load average (5 minutes)');
    metrics.push('# TYPE pikaleads_cpu_load_5m gauge');
    metrics.push(`pikaleads_cpu_load_5m ${loadAvg[1]}`);
    
    metrics.push('# HELP pikaleads_cpu_load_15m CPU load average (15 minutes)');
    metrics.push('# TYPE pikaleads_cpu_load_15m gauge');
    metrics.push(`pikaleads_cpu_load_15m ${loadAvg[2]}`);
    
    // Uptime
    metrics.push('# HELP pikaleads_uptime_seconds Process uptime in seconds');
    metrics.push('# TYPE pikaleads_uptime_seconds counter');
    metrics.push(`pikaleads_uptime_seconds ${Math.floor(uptime)}`);
    
    // Database metrics
    let dbStatus = 1; // 1 = healthy, 0 = unhealthy
    let dbResponseTime = 0;
    
    try {
      const dbStart = Date.now();
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      await db.execute("SELECT 1");
      dbResponseTime = Date.now() - dbStart;
    } catch (error) {
      dbStatus = 0;
      console.error("[Prometheus] Database check failed:", error);
    }
    
    metrics.push('# HELP pikaleads_database_status Database connection status (1=healthy, 0=unhealthy)');
    metrics.push('# TYPE pikaleads_database_status gauge');
    metrics.push(`pikaleads_database_status ${dbStatus}`);
    
    metrics.push('# HELP pikaleads_database_response_ms Database response time in milliseconds');
    metrics.push('# TYPE pikaleads_database_response_ms gauge');
    metrics.push(`pikaleads_database_response_ms ${dbResponseTime}`);
    
    // Error metrics (last 24 hours)
    try {
      const db = await getDb();
      if (db) {
        const result = await db.execute(
          `SELECT COUNT(*) as count FROM error_logs WHERE createdAt > DATE_SUB(NOW(), INTERVAL 24 HOUR)`
        );
        const errorCount = Array.isArray(result) && result.length > 0 ? (result[0] as any).count : 0;
        
        metrics.push('# HELP pikaleads_errors_24h Total errors in last 24 hours');
        metrics.push('# TYPE pikaleads_errors_24h counter');
        metrics.push(`pikaleads_errors_24h ${errorCount}`);
      }
    } catch (error) {
      console.error("[Prometheus] Error count query failed:", error);
    }
    
    // Lead metrics
    try {
      const db = await getDb();
      if (db) {
        const result = await db.execute(
          `SELECT COUNT(*) as count FROM leads WHERE createdAt > DATE_SUB(NOW(), INTERVAL 24 HOUR)`
        );
        const leadCount = Array.isArray(result) && result.length > 0 ? (result[0] as any).count : 0;
        
        metrics.push('# HELP pikaleads_leads_24h Total leads in last 24 hours');
        metrics.push('# TYPE pikaleads_leads_24h counter');
        metrics.push(`pikaleads_leads_24h ${leadCount}`);
      }
    } catch (error) {
      console.error("[Prometheus] Lead count query failed:", error);
    }
    
    return metrics.join('\n');
  }),
});
