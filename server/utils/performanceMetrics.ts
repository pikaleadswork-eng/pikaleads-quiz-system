import { getDb } from "../db.js";

interface PerformanceMetric {
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  timestamp: Date;
}

// In-memory storage for recent metrics (last 1000 requests)
const metricsBuffer: PerformanceMetric[] = [];
const MAX_BUFFER_SIZE = 1000;

// Aggregated statistics
const endpointStats: Map<string, {
  count: number;
  totalTime: number;
  minTime: number;
  maxTime: number;
  errors: number;
}> = new Map();

/**
 * Record a performance metric
 */
export function recordMetric(metric: PerformanceMetric) {
  // Add to buffer
  metricsBuffer.push(metric);
  if (metricsBuffer.length > MAX_BUFFER_SIZE) {
    metricsBuffer.shift(); // Remove oldest
  }

  // Update aggregated stats
  const key = `${metric.method} ${metric.endpoint}`;
  const stats = endpointStats.get(key) || {
    count: 0,
    totalTime: 0,
    minTime: Infinity,
    maxTime: 0,
    errors: 0,
  };

  stats.count++;
  stats.totalTime += metric.responseTime;
  stats.minTime = Math.min(stats.minTime, metric.responseTime);
  stats.maxTime = Math.max(stats.maxTime, metric.responseTime);
  if (metric.statusCode >= 400) {
    stats.errors++;
  }

  endpointStats.set(key, stats);
}

/**
 * Get performance statistics for all endpoints
 */
export function getPerformanceStats() {
  const stats: Array<{
    endpoint: string;
    method: string;
    count: number;
    avgResponseTime: number;
    minResponseTime: number;
    maxResponseTime: number;
    errorRate: number;
  }> = [];

  endpointStats.forEach((data, key) => {
    const [method, ...endpointParts] = key.split(' ');
    const endpoint = endpointParts.join(' ');

    stats.push({
      endpoint,
      method,
      count: data.count,
      avgResponseTime: Math.round(data.totalTime / data.count),
      minResponseTime: data.minTime === Infinity ? 0 : data.minTime,
      maxResponseTime: data.maxTime,
      errorRate: data.count > 0 ? (data.errors / data.count) * 100 : 0,
    });
  });

  // Sort by average response time (slowest first)
  return stats.sort((a, b) => b.avgResponseTime - a.avgResponseTime);
}

/**
 * Get recent metrics from buffer
 */
export function getRecentMetrics(limit: number = 100) {
  return metricsBuffer.slice(-limit);
}

/**
 * Identify bottlenecks (endpoints with high response times)
 */
export function identifyBottlenecks(threshold: number = 1000) {
  const stats = getPerformanceStats();
  return stats.filter(s => s.avgResponseTime > threshold);
}

/**
 * Get slowest endpoints
 */
export function getSlowestEndpoints(limit: number = 10) {
  const stats = getPerformanceStats();
  return stats.slice(0, limit);
}

/**
 * Get endpoints with highest error rates
 */
export function getHighErrorEndpoints(limit: number = 10) {
  const stats = getPerformanceStats();
  return stats
    .filter(s => s.errorRate > 0)
    .sort((a, b) => b.errorRate - a.errorRate)
    .slice(0, limit);
}

/**
 * Save metrics to database (batch insert)
 */
export async function flushMetricsToDatabase() {
  if (metricsBuffer.length === 0) return;

  try {
    const db = await getDb();
    if (!db) return;

    // Batch insert last 100 metrics
    const metricsToSave = metricsBuffer.slice(-100);
    
    for (const metric of metricsToSave) {
      await db.execute(
        `INSERT INTO performance_metrics (endpoint, method, responseTime, statusCode, timestamp) 
         VALUES (?, ?, ?, ?, ?)`,
      );
    }

    console.log(`[Performance Metrics] Saved ${metricsToSave.length} metrics to database`);
  } catch (error) {
    console.error("[Performance Metrics] Failed to save to database:", error);
  }
}

/**
 * Performance metrics middleware for Express
 */
export function performanceMiddleware(req: any, res: any, next: any) {
  const startTime = Date.now();

  // Capture response finish event
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    
    recordMetric({
      endpoint: req.path || req.url,
      method: req.method,
      responseTime,
      statusCode: res.statusCode,
      timestamp: new Date(),
    });

    // Log slow requests
    if (responseTime > 1000) {
      console.warn(`[Performance] Slow request: ${req.method} ${req.path} - ${responseTime}ms`);
    }
  });

  next();
}

// Flush metrics to database every 5 minutes
setInterval(() => {
  flushMetricsToDatabase();
}, 5 * 60 * 1000);
