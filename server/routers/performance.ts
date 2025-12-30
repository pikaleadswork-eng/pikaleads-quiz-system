import { publicProcedure, router } from "../_core/trpc.js";
import {
  getPerformanceStats,
  getRecentMetrics,
  identifyBottlenecks,
  getSlowestEndpoints,
  getHighErrorEndpoints,
} from "../utils/performanceMetrics.js";

export const performanceRouter = router({
  /**
   * Get performance statistics for all endpoints
   */
  getStats: publicProcedure.query(() => {
    return getPerformanceStats();
  }),

  /**
   * Get recent metrics (last 100 requests)
   */
  getRecentMetrics: publicProcedure.query(() => {
    return getRecentMetrics(100);
  }),

  /**
   * Identify bottlenecks (endpoints with avg response time > 1000ms)
   */
  getBottlenecks: publicProcedure.query(() => {
    return identifyBottlenecks(1000);
  }),

  /**
   * Get slowest endpoints (top 10)
   */
  getSlowestEndpoints: publicProcedure.query(() => {
    return getSlowestEndpoints(10);
  }),

  /**
   * Get endpoints with highest error rates (top 10)
   */
  getHighErrorEndpoints: publicProcedure.query(() => {
    return getHighErrorEndpoints(10);
  }),
});
