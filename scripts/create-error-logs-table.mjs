import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

console.log("Creating error_logs table...");

try {
  await connection.execute(`
    CREATE TABLE IF NOT EXISTS error_logs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      type VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      stack TEXT,
      endpoint VARCHAR(255),
      userId INT,
      metadata JSON,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_created_at (createdAt),
      INDEX idx_type (type)
    )
  `);
  
  console.log("✅ error_logs table created successfully");
} catch (error) {
  console.error("❌ Error creating table:", error);
  process.exit(1);
}

await connection.end();
