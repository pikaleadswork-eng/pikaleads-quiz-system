import bcrypt from 'bcryptjs';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { mysqlTable, int, varchar, boolean, timestamp } from 'drizzle-orm/mysql-core';
import { eq } from 'drizzle-orm';

// Define users table schema
const users = mysqlTable('users', {
  id: int('id').primaryKey().autoincrement(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  passwordHash: varchar('passwordHash', { length: 255 }).notNull(),
  role: varchar('role', { length: 50 }).notNull().default('user'),
  isActive: boolean('isActive').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  lastSignedIn: timestamp('lastSignedIn'),
});

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Hash password: "admin123"
const passwordHash = await bcrypt.hash('admin123', 10);

// Check if admin@pikaleads.com exists
const [existingUser] = await db
  .select()
  .from(users)
  .where(eq(users.email, 'admin@pikaleads.com'))
  .limit(1);

if (existingUser) {
  // Update existing user with password
  await db
    .update(users)
    .set({ passwordHash, isActive: true })
    .where(eq(users.email, 'admin@pikaleads.com'));
  console.log('✅ Updated admin@pikaleads.com with password');
} else {
  // Create new admin user
  await db.insert(users).values({
    name: 'Admin',
    email: 'admin@pikaleads.com',
    passwordHash,
    role: 'admin',
    isActive: true,
  });
  console.log('✅ Created admin@pikaleads.com');
}

console.log('\n📧 Email: admin@pikaleads.com');
console.log('🔑 Password: admin123');

await connection.end();
