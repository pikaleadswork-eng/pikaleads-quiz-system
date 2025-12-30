-- Update passwords for PIKALEADS users
-- Run this on VPS database

-- Add passwordHash column if not exists
ALTER TABLE users ADD COLUMN IF NOT EXISTS passwordHash VARCHAR(255);

-- Update admin password
UPDATE users SET passwordHash = '$2b$10$tw/QD3P47Wri7b1iO2c/5OjNJfwaF9mnPakmFRThBf11XCYd8BLMK' WHERE email = 'pikaleadswork@gmail.com';

-- Update manager password
UPDATE users SET passwordHash = '$2b$10$rYrVRjw9.8cjA.CBvYGKROAcnCEcVDzSPRJiSc3iNqEvmU2sEeW9a' WHERE email = 'managercrm@pika-leads.com';

-- Verify passwords
SELECT email, passwordHash IS NOT NULL as has_password FROM users;
