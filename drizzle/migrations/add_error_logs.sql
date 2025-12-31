-- Create error_logs table for monitoring
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
);
