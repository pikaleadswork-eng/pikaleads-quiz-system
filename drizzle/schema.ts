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
  source: varchar("source", { length: 100 }), // Lead source: Facebook, Google, YouTube, Email, Cold Lead, Manual
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

/**
 * Services table - products/services offered by the business
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 100 }).notNull(), // e.g., "Consultation", "Development", "Marketing"
  price: int("price").notNull(), // price in cents to avoid decimal issues
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Additional Services table - add-ons like banner creation, extra features
 */
export const additionalServices = mysqlTable("additional_services", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  price: int("price").notNull(), // price in cents
  description: text("description"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AdditionalService = typeof additionalServices.$inferSelect;
export type InsertAdditionalService = typeof additionalServices.$inferInsert;

/**
 * Sales table - track closed deals with revenue
 */
export const sales = mysqlTable("sales", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),
  serviceId: int("serviceId").notNull(),
  additionalServices: text("additionalServices"), // JSON array of additional service IDs
  totalAmount: int("totalAmount").notNull(), // total price in cents
  managerId: int("managerId").notNull(), // who closed the sale
  saleDate: timestamp("saleDate").defaultNow().notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Sale = typeof sales.$inferSelect;
export type InsertSale = typeof sales.$inferInsert;

/**
 * Sales Scripts table - reusable sales scripts for different scenarios
 */
export const salesScripts = mysqlTable("sales_scripts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // "Cold Call", "Follow-up", "Objection Handling", "Closing"
  content: text("content").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalesScript = typeof salesScripts.$inferSelect;
export type InsertSalesScript = typeof salesScripts.$inferInsert;

/**
 * Integration settings table for storing API credentials
 */
export const integrationSettings = mysqlTable("integration_settings", {
  id: int("id").autoincrement().primaryKey(),
  provider: varchar("provider", { length: 50 }).notNull().unique(), // instagram, whatsapp, email, google_calendar
  credentials: text("credentials").notNull(), // JSON string of encrypted credentials
  isActive: boolean("isActive").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type IntegrationSetting = typeof integrationSettings.$inferSelect;
export type InsertIntegrationSetting = typeof integrationSettings.$inferInsert;

/**
 * Conversations table for tracking messaging threads
 */
export const conversations = mysqlTable("conversations", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // Reference to leads table
  assignedManagerId: int("assignedManagerId"), // Manager assigned to this conversation
  channel: varchar("channel", { length: 50 }).notNull(), // whatsapp, instagram, telegram
  externalId: varchar("externalId", { length: 255 }).notNull(), // Phone number, Instagram username, Telegram chat ID
  lastMessageAt: timestamp("lastMessageAt").defaultNow().notNull(),
  unreadCount: int("unreadCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

/**
 * Inbound messages table for storing received messages
 */
export const inboundMessages = mysqlTable("inbound_messages", {
  id: int("id").autoincrement().primaryKey(),
  conversationId: int("conversationId").notNull(), // Reference to conversations table
  senderId: varchar("senderId", { length: 255 }).notNull(), // External sender ID (phone, username, chat ID)
  senderName: varchar("senderName", { length: 255 }), // Sender display name
  content: text("content").notNull(), // Message text
  messageType: varchar("messageType", { length: 50 }).default("text").notNull(), // text, image, video, audio, file
  mediaUrl: varchar("mediaUrl", { length: 500 }), // URL to media file if applicable
  isRead: boolean("isRead").default(false).notNull(),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InboundMessage = typeof inboundMessages.$inferSelect;
export type InsertInboundMessage = typeof inboundMessages.$inferInsert;

/**
 * Scheduled Messages table for delayed message sending
 */
export const scheduledMessages = mysqlTable("scheduled_messages", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // Reference to leads table
  channel: varchar("channel", { length: 50 }).notNull(), // telegram, whatsapp, email
  message: text("message").notNull(), // Message content
  scheduledAt: timestamp("scheduledAt").notNull(), // When to send
  status: varchar("status", { length: 20 }).default("pending").notNull(), // pending, sent, failed, cancelled
  sentAt: timestamp("sentAt"), // Actual send time
  errorMessage: text("errorMessage"), // Error details if failed
  createdBy: int("createdBy").notNull(), // Manager who scheduled
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScheduledMessage = typeof scheduledMessages.$inferSelect;
export type InsertScheduledMessage = typeof scheduledMessages.$inferInsert;

/**
 * Scheduled Calls table for call reminders and planning
 */
export const scheduledCalls = mysqlTable("scheduled_calls", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // Reference to leads table
  scheduledAt: timestamp("scheduledAt").notNull(), // When to call
  duration: int("duration").default(30).notNull(), // Expected duration in minutes
  notes: text("notes"), // Call notes or agenda
  status: varchar("status", { length: 20 }).default("scheduled").notNull(), // scheduled, completed, missed, cancelled
  completedAt: timestamp("completedAt"), // Actual call time
  outcome: text("outcome"), // Call result notes
  createdBy: int("createdBy").notNull(), // Manager who scheduled
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ScheduledCall = typeof scheduledCalls.$inferSelect;
export type InsertScheduledCall = typeof scheduledCalls.$inferInsert;

/**
 * Interaction History table for tracking all lead interactions
 */
export const interactionHistory = mysqlTable("interaction_history", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // Reference to leads table
  type: varchar("type", { length: 50 }).notNull(), // message, call, email, status_change, note, meeting
  channel: varchar("channel", { length: 50 }), // telegram, whatsapp, email, phone (null for non-message types)
  message: text("message"), // Message content or interaction description
  direction: varchar("direction", { length: 10 }), // inbound, outbound (for messages)
  userId: int("userId"), // Manager who performed the action
  metadata: text("metadata"), // JSON for additional data (e.g., status change details)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type InteractionHistory = typeof interactionHistory.$inferSelect;
export type InsertInteractionHistory = typeof interactionHistory.$inferInsert;

/**
 * Call Logs table for tracking all phone calls
 */
export const callLogs = mysqlTable("call_logs", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // Reference to leads table
  managerId: int("managerId").notNull(), // Manager who made the call
  phone: varchar("phone", { length: 50 }).notNull(), // Phone number called
  provider: varchar("provider", { length: 50 }).notNull(), // zadarma, twilio, etc.
  callId: varchar("callId", { length: 255 }), // External call ID from provider
  duration: int("duration").default(0), // Call duration in seconds
  status: varchar("status", { length: 50 }).notNull(), // initiated, ringing, answered, completed, failed, missed
  recordingUrl: varchar("recordingUrl", { length: 500 }), // URL to call recording
  notes: text("notes"), // Call notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type CallLog = typeof callLogs.$inferSelect;
export type InsertCallLog = typeof callLogs.$inferInsert;

/**
 * Meetings table for scheduled video calls
 */
export const meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(), // Reference to leads table
  managerId: int("managerId").notNull(), // Manager who scheduled the meeting
  platform: varchar("platform", { length: 50 }).notNull(), // google_meet, zoom
  meetingUrl: varchar("meetingUrl", { length: 500 }).notNull(), // Meeting link
  externalId: varchar("externalId", { length: 255 }), // External meeting ID from provider
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").default(30), // Duration in minutes
  status: varchar("status", { length: 50 }).default("scheduled").notNull(), // scheduled, completed, cancelled, no_show
  notes: text("notes"), // Meeting notes
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;

/**
 * Reminders table for scheduled notifications
 */
export const reminders = mysqlTable("reminders", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId"), // Reference to leads table (optional - can be general reminder)
  managerId: int("managerId").notNull(), // Manager who created the reminder
  type: varchar("type", { length: 50 }).notNull(), // call, meeting, follow_up, task
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  scheduledAt: timestamp("scheduledAt").notNull(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, sent, dismissed
  notifyVia: varchar("notifyVia", { length: 50 }).default("crm").notNull(), // crm, telegram, email
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  sentAt: timestamp("sentAt"),
});

export type Reminder = typeof reminders.$inferSelect;
export type InsertReminder = typeof reminders.$inferInsert;

/**
 * Roles table for custom role management
 */
export const roles = mysqlTable("roles", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  description: text("description"),
  permissions: text("permissions").notNull(), // JSON string of permissions
  isSystem: boolean("isSystem").default(false).notNull(), // System roles cannot be deleted
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

/**
 * User invitations table
 */
export const userInvitations = mysqlTable("userInvitations", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  roleId: int("roleId"), // Reference to roles table (optional, can use default role)
  roleName: varchar("roleName", { length: 100 }), // Role name for display
  token: varchar("token", { length: 255 }).notNull().unique(),
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, accepted, expired
  invitedBy: int("invitedBy").notNull(), // User ID who sent the invitation
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
});

export type UserInvitation = typeof userInvitations.$inferSelect;
export type InsertUserInvitation = typeof userInvitations.$inferInsert;

/**
 * Filter presets for CRM - allows users to save commonly used filter combinations
 */
export const filterPresets = mysqlTable("filterPresets", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // Owner of the preset
  name: varchar("name", { length: 100 }).notNull(), // e.g., "High-value leads", "This week's campaigns"
  filters: text("filters").notNull(), // JSON string of filter values
  isDefault: boolean("isDefault").default(false).notNull(), // Auto-apply on page load
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type FilterPreset = typeof filterPresets.$inferSelect;
export type InsertFilterPreset = typeof filterPresets.$inferInsert;
