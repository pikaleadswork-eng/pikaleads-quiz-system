import { boolean, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).unique().notNull(),
  passwordHash: varchar("passwordHash", { length: 255 }).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
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
  email: varchar("email", { length: 320 }),
  language: varchar("language", { length: 10 }),
  // UTM tracking parameters
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  utmAdGroup: varchar("utmAdGroup", { length: 255 }),
  utmAd: varchar("utmAd", { length: 255 }),
  utmPlacement: varchar("utmPlacement", { length: 255 }),
  utmKeyword: varchar("utmKeyword", { length: 255 }),
  utmSite: varchar("utmSite", { length: 255 }),
  utmSource: varchar("utmSource", { length: 100 }),
  utmMedium: varchar("utmMedium", { length: 100 }),
  utmContent: varchar("utmContent", { length: 255 }),
  utmTerm: varchar("utmTerm", { length: 255 }),
  statusId: int("statusId").default(1), // link to leadStatuses
  assignedTo: int("assignedTo"), // manager user id
  leadScore: int("leadScore").default(0), // 0-100 quality score
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

/**
 * Manager Invitations table
 */
export const managerInvitations = mysqlTable("manager_invitations", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  invitedBy: int("invitedBy").notNull(),
  status: mysqlEnum("status", ["pending", "accepted", "expired"]).default("pending").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  acceptedAt: timestamp("acceptedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ManagerInvitation = typeof managerInvitations.$inferSelect;
export type InsertManagerInvitation = typeof managerInvitations.$inferInsert;
/**
 * Assignment Rules table - configure automatic lead assignment
 */
export const assignmentRules = mysqlTable("assignment_rules", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  quizName: varchar("quizName", { length: 100 }), // null = all quizzes
  managerId: int("managerId").notNull(), // user id with role=manager
  priority: int("priority").default(0).notNull(), // higher = higher priority
  isActive: int("isActive").default(1).notNull(), // 0 = disabled, 1 = enabled
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AssignmentRule = typeof assignmentRules.$inferSelect;
export type InsertAssignmentRule = typeof assignmentRules.$inferInsert;

/**
 * Assignment History table - log all lead assignments
 */
export const assignmentHistory = mysqlTable("assignment_history", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  managerId: int("managerId").notNull(),
  ruleId: int("ruleId"), // null if manual assignment
  assignedBy: int("assignedBy"), // user id who triggered assignment (null for auto)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AssignmentHistory = typeof assignmentHistory.$inferSelect;
export type InsertAssignmentHistory = typeof assignmentHistory.$inferInsert;

/**
 * System Settings table - for auto-assignment toggle and other settings
 */
export const systemSettings = mysqlTable("system_settings", {
  id: int("id").autoincrement().primaryKey(),
  settingKey: varchar("settingKey", { length: 100 }).notNull().unique(),
  settingValue: text("settingValue").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;


/**
 * Appointments table for scheduling meetings with leads
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  managerId: int("managerId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").notNull(), // in minutes
  status: varchar("status", { length: 20 }).notNull().default('scheduled'), // scheduled, completed, cancelled
  calendlyEventId: varchar("calendlyEventId", { length: 255 }),
  googleEventId: varchar("googleEventId", { length: 255 }),
  meetingLink: varchar("meetingLink", { length: 500 }),
  reminderSent: boolean("reminderSent").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;
