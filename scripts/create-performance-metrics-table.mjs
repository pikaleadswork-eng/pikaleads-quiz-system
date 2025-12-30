import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("Creating performance_metrics table...");

try {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS performance_metrics (
      id INT PRIMARY KEY AUTO_INCREMENT,
      endpoint VARCHAR(255) NOT NULL,
      method VARCHAR(10) NOT NULL,
      responseTime INT NOT NULL,
      statusCode INT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_endpoint (endpoint),
      INDEX idx_timestamp (timestamp),
      INDEX idx_response_time (responseTime)
    )
  `);
  
  console.log("✅ performance_metrics table created successfully");
} catch (error) {
  console.error("❌ Error creating table:", error);
  process.exit(1);
}

await connection.end();
