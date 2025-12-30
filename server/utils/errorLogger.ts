import { getDb } from "../db.js";
import fs from "fs/promises";
import path from "path";

/**
 * Log error to database and file system
 */
export async function logError(error: {
  type: string;
  message: string;
  stack?: string;
  endpoint?: string;
  userId?: number;
  metadata?: Record<string, any>;
}) {
  const timestamp = new Date().toISOString();
  
  // Log to database
  try {
    const db = await getDb();
    if (db) {
      await db.execute(
        `INSERT INTO error_logs (type, message, stack, endpoint, userId, metadata, createdAt) 
         VALUES (?, ?, ?, ?, ?, ?, NOW())`
      );
    }
  } catch (dbError) {
    console.error("[Error Logger] Failed to log to database:", dbError);
  }

  // Log to file system (fallback)
  try {
    const logDir = path.join(process.cwd(), "logs");
    await fs.mkdir(logDir, { recursive: true });
    
    const logFile = path.join(logDir, `errors-${new Date().toISOString().split("T")[0]}.log`);
    const logEntry = `[${timestamp}] ${error.type}: ${error.message}\n${error.stack || ""}\n${JSON.stringify(error.metadata || {})}\n\n`;
    
    await fs.appendFile(logFile, logEntry);
  } catch (fileError) {
    console.error("[Error Logger] Failed to log to file:", fileError);
  }

  // Console log (always)
  console.error(`[${timestamp}] ${error.type}:`, error.message, error.stack || "");
}

/**
 * Get error statistics for monitoring
 */
export async function getErrorStats() {
  try {
    const db = await getDb();
    if (!db) return null;

    const result = await db.execute(
      `SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN createdAt > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 1 ELSE 0 END) as lastHour,
        SUM(CASE WHEN createdAt > DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN 1 ELSE 0 END) as last24Hours,
        type,
        COUNT(*) as count
       FROM error_logs 
       WHERE createdAt > DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY type
       ORDER BY count DESC`
    );

    return Array.isArray(result) ? result : [];
  } catch (error) {
    console.error("[Error Stats] Failed to get stats:", error);
    return null;
  }
}
