import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "manager"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Leads table for storing quiz submissions
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  quizName: varchar("quizName", { length: 100 }).notNull(),
  answers: text("answers").notNull(), // JSON string of answers
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  telegram: varchar("telegram", { length: 100 }),
  language: varchar("language", { length: 10 }),
  statusId: int("statusId").default(1), // link to leadStatuses
  assignedTo: int("assignedTo"), // manager user id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Lead Statuses table - customizable by admin
 */
export const leadStatuses = mysqlTable("lead_statuses", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  order: int("order").notNull(),
  isDefault: int("isDefault").default(0).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeadStatus = typeof leadStatuses.$inferSelect;
export type InsertLeadStatus = typeof leadStatuses.$inferInsert;

/**
 * Lead Comments table
 */
export const leadComments = mysqlTable("lead_comments", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  userId: int("userId").notNull(),
  comment: text("comment").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadComment = typeof leadComments.$inferSelect;
export type InsertLeadComment = typeof leadComments.$inferInsert;

/**
 * Activity Log table
 */
export const activityLog = mysqlTable("activity_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  leadId: int("leadId"),
  action: varchar("action", { length: 100 }).notNull(),
  details: text("details"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = typeof activityLog.$inferInsert;

/**
 * Messages table - Instagram and Telegram
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  platform: varchar("platform", { length: 20 }).notNull(),
  direction: varchar("direction", { length: 10 }).notNull(),
  message: text("message").notNull(),
  sentBy: int("sentBy"),
  externalId: varchar("externalId", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * A/B Test Variants table
 */
export const abTestVariants = mysqlTable("ab_test_variants", {
  id: int("id").autoincrement().primaryKey(),
  quizId: varchar("quizId", { length: 100 }).notNull(),
  variantName: varchar("variantName", { length: 100 }).notNull(),
  isControl: int("isControl").default(0).notNull(), // 0 = variant, 1 = control
  trafficPercentage: int("trafficPercentage").default(50).notNull(),
  isActive: int("isActive").default(1).notNull(),
  // Variant content (JSON)
  title: text("title"),
  subtitle: text("subtitle"),
  bonus: text("bonus"),
  questions: text("questions"), // JSON string
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ABTestVariant = typeof abTestVariants.$inferSelect;
export type InsertABTestVariant = typeof abTestVariants.$inferInsert;

/**
 * A/B Test Assignments table - tracks which variant each user saw
 */
export const abTestAssignments = mysqlTable("ab_test_assignments", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  quizId: varchar("quizId", { length: 100 }).notNull(),
  variantId: int("variantId").notNull(),
  converted: int("converted").default(0).notNull(), // 0 = no, 1 = yes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ABTestAssignment = typeof abTestAssignments.$inferSelect;
export type InsertABTestAssignment = typeof abTestAssignments.$inferInsert;

/**
 * Incomplete Quiz Sessions table - for remarketing
 */
export const incompleteQuizSessions = mysqlTable("incomplete_quiz_sessions", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull().unique(),
  quizId: varchar("quizId", { length: 100 }).notNull(),
  currentStep: int("currentStep").notNull(),
  totalSteps: int("totalSteps").notNull(),
  answers: text("answers"), // JSON string of partial answers
  // Contact info (if provided)
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  language: varchar("language", { length: 10 }),
  // Remarketing tracking
  remindersSent: int("remindersSent").default(0).notNull(),
  lastReminderAt: timestamp("lastReminderAt"),
  completed: int("completed").default(0).notNull(), // 0 = incomplete, 1 = completed
  unsubscribed: int("unsubscribed").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IncompleteQuizSession = typeof incompleteQuizSessions.$inferSelect;
export type InsertIncompleteQuizSession = typeof incompleteQuizSessions.$inferInsert;