import { boolean, decimal, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  telegramChatId: varchar("telegramChatId", { length: 255 }),
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
  spentAmount: decimal("spentAmount", { precision: 10, scale: 2 }).default("0.00"), // Ad spend for this lead
  timeOnSite: int("timeOnSite").default(0), // Time spent on site in seconds
  // Tracking data for Meta and GA4
  fbp: varchar("fbp", { length: 255 }), // Facebook browser pixel cookie (_fbp)
  fbc: varchar("fbc", { length: 255 }), // Facebook click ID cookie (_fbc)
  clientIp: varchar("clientIp", { length: 50 }), // Client IP address
  userAgent: text("userAgent"), // Browser user agent
  ga4ClientId: varchar("ga4ClientId", { length: 255 }), // GA4 client ID
  eventId: varchar("eventId", { length: 255 }), // Unique event ID for deduplication
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
  isWinner: int("isWinner").default(0).notNull(), // 0 = no, 1 = yes
  // Variant content (JSON)
  title: text("title"),
  subtitle: text("subtitle"),
  bonus: text("bonus"),
  questions: text("questions"), // JSON string
  designSettings: text("designSettings"), // JSON string of design configuration
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
  
  // Rule type and conditions
  type: varchar("type", { length: 50 }).default("manual").notNull(), // "manual", "workload", "source", "campaign"
  conditions: text("conditions"), // JSON string: {"source": "facebook"}, {"campaign": "summer_sale"}, etc.
  
  // Assignment target
  managerId: int("managerId"), // Specific manager ID (null if using workload balancing)
  assignmentStrategy: varchar("assignmentStrategy", { length: 50 }).default("specific").notNull(), // "specific" or "balance_workload"
  
  // Legacy field for backward compatibility
  quizName: varchar("quizName", { length: 100 }), // null = all quizzes
  
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

/**
 * Webhooks table for CRM integrations
 */
export const webhooks = mysqlTable("webhooks", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(), // e.g., "HubSpot Integration", "Salesforce Sync"
  type: mysqlEnum("type", ["hubspot", "salesforce", "custom"]).notNull(),
  url: varchar("url", { length: 500 }).notNull(), // Webhook endpoint URL
  headers: text("headers"), // JSON string of custom headers
  events: text("events").notNull(), // JSON array of events to trigger on: ["lead.created", "lead.updated"]
  isActive: boolean("isActive").default(true).notNull(),
  apiKey: varchar("apiKey", { length: 500 }), // For HubSpot/Salesforce
  config: text("config"), // JSON string of additional configuration (e.g., Salesforce instance URL)
  lastTriggeredAt: timestamp("lastTriggeredAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Webhook = typeof webhooks.$inferSelect;
export type InsertWebhook = typeof webhooks.$inferInsert;

/**
 * Webhook logs for debugging and monitoring
 */
export const webhookLogs = mysqlTable("webhookLogs", {
  id: int("id").autoincrement().primaryKey(),
  webhookId: int("webhookId").notNull(),
  event: varchar("event", { length: 100 }).notNull(), // e.g., "lead.created"
  payload: text("payload").notNull(), // JSON string of data sent
  response: text("response"), // Response from webhook endpoint
  statusCode: int("statusCode"), // HTTP status code
  success: boolean("success").notNull(),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;


/**
 * Quizzes table - store quiz templates
 */
export const quizzes = mysqlTable("quizzes", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  description: text("description"),
  quizType: mysqlEnum("quizType", [
    "lead_generation",    // Standard lead gen quiz
    "ecommerce",          // Product discovery/recommendation
    "calculator",         // Pricing calculator
    "test",               // True/False knowledge test
    "form",               // Simple lead capture form
    "video_consultant",   // Video-based quiz
  ]).default("lead_generation").notNull(),
  platform: mysqlEnum("platform", [
    "google_ads",         // Google Ads quizzes
    "meta_ads",           // Meta (Facebook/Instagram) Ads quizzes
    "telegram",           // Telegram quizzes
  ]).default("meta_ads").notNull(),
  niche: mysqlEnum("niche", [
    "furniture",          // Furniture business
    "renovation",         // Apartment/house renovation
    "ecommerce",          // E-commerce/online store
    "services",           // Service business
    "realestate",         // Real estate
    "other",              // Other niches
  ]).default("other").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quiz = typeof quizzes.$inferSelect;
export type InsertQuiz = typeof quizzes.$inferInsert;

/**
 * Quiz Questions table - store questions with various types
 */
export const quizQuestions = mysqlTable("quiz_questions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(), // Reference to quizzes table
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", [
    "text_options",       // Варіанти відповідей (text multiple choice)
    "image_options",      // Варіанти з картинками (image grid selection)
    "emoji",              // Емоджі (emoji picker)
    "custom_input",       // Своє поле для вводу (text input)
    "dropdown",           // Випадаючий список (select dropdown)
    "date",               // Дата (date picker)
    "slider",             // Повзунок (range slider)
    "file_upload",        // Завантаження файлу (file upload)
    "page",               // Сторінка (info page, no question)
    "rating",             // Рейтинг (star rating)
    "question_group",     // Група питань (nested questions)
    "address",            // Адреса (address autocomplete)
  ]).notNull(),
  answerOptions: text("answerOptions"), // JSON string of answer options
  orderIndex: int("orderIndex").default(0).notNull(), // Display order (renamed from 'order')
  isRequired: boolean("isRequired").default(true).notNull(),
  settings: text("settings"), // JSON for question-specific settings (merged config + conditionalLogic)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = typeof quizQuestions.$inferInsert;

/**
 * Quiz Answer Options table - store answer choices for choice-based questions
 */
export const quizAnswerOptions = mysqlTable("quiz_answer_options", {
  id: int("id").autoincrement().primaryKey(),
  questionId: int("questionId").notNull(), // Reference to quiz_questions table
  optionText: varchar("optionText", { length: 500 }).notNull(),
  imageUrl: varchar("imageUrl", { length: 500 }), // For image_choice questions
  order: int("order").notNull(),
  score: int("score").default(0), // For scoring/lead qualification
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizAnswerOption = typeof quizAnswerOptions.$inferSelect;
export type InsertQuizAnswerOption = typeof quizAnswerOptions.$inferInsert;

/**
 * Quiz Sessions table - track each quiz attempt
 */
export const quizSessions = mysqlTable("quiz_sessions", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(),
  sessionId: varchar("sessionId", { length: 255 }).notNull().unique(), // UUID for tracking
  leadId: int("leadId"), // Linked after submission
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  completedAt: timestamp("completedAt"),
  status: mysqlEnum("status", ["in_progress", "completed", "abandoned"]).default("in_progress").notNull(),
  totalQuestions: int("totalQuestions").notNull(),
  answeredQuestions: int("answeredQuestions").default(0).notNull(),
  timeSpent: int("timeSpent").default(0), // Total time in seconds
  userAgent: text("userAgent"),
  ipAddress: varchar("ipAddress", { length: 45 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuizSession = typeof quizSessions.$inferSelect;
export type InsertQuizSession = typeof quizSessions.$inferInsert;

/**
 * Quiz Question Events table - track question-level interactions
 */
export const quizQuestionEvents = mysqlTable("quiz_question_events", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull(), // Reference to quiz
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  questionId: int("questionId").notNull(),
  eventType: mysqlEnum("eventType", ["viewed", "answered", "skipped"]).notNull(),
  answer: text("answer"), // JSON string of answer(s)
  timeSpent: int("timeSpent").default(0), // Time on this question in seconds
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type QuizQuestionEvent = typeof quizQuestionEvents.$inferSelect;
export type InsertQuizQuestionEvent = typeof quizQuestionEvents.$inferInsert;

/**
 * Analytics Settings table - store tracking codes for GA4, Meta Pixel, Microsoft Clarity
 */
export const analyticsSettings = mysqlTable("analytics_settings", {
  id: int("id").autoincrement().primaryKey(),
  provider: varchar("provider", { length: 50 }).notNull().unique(), // ga4, meta_pixel, microsoft_clarity, gtm
  trackingId: varchar("trackingId", { length: 255 }).notNull(), // Measurement ID, Pixel ID, Project ID, GTM Container ID
  apiSecret: varchar("apiSecret", { length: 500 }), // GA4 API Secret, Meta Pixel Access Token
  serverContainerUrl: varchar("serverContainerUrl", { length: 500 }), // GTM Server Container URL
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type AnalyticsSetting = typeof analyticsSettings.$inferSelect;
export type InsertAnalyticsSetting = typeof analyticsSettings.$inferInsert;


/**
 * Quiz Design Settings table - store visual design configuration for each quiz
 */
export const quizDesignSettings = mysqlTable("quiz_design_settings", {
  id: int("id").autoincrement().primaryKey(),
  quizId: int("quizId").notNull().unique(),
  layoutType: varchar("layoutType", { length: 20 }).default("standard").notNull(), // standard, background
  backgroundImage: text("backgroundImage"), // S3 URL
  backgroundVideo: text("backgroundVideo"), // S3 URL for video background
  backgroundGradient: text("backgroundGradient"), // CSS gradient for background
  alignment: varchar("alignment", { length: 20 }).default("center"), // left, center, right
  logoImage: text("logoImage"), // S3 URL
  primaryColor: varchar("primaryColor", { length: 7 }).default("#FACC15"), // Yellow
  accentColor: varchar("accentColor", { length: 7 }).default("#A855F7"), // Purple
  fontFamily: varchar("fontFamily", { length: 100 }).default("Inter"),
  titleText: text("titleText"),
  titleColor: varchar("titleColor", { length: 7 }).default("#FFFFFF"),
  titleWeight: varchar("titleWeight", { length: 20 }).default("bold"),
  titleFontSize: int("titleFontSize").default(48), // Font size in pixels (16-96)
  subtitleText: text("subtitleText"),
  subtitleColor: varchar("subtitleColor", { length: 7 }).default("#FFFFFF"),
  subtitleWeight: varchar("subtitleWeight", { length: 20 }).default("normal"),
  subtitleFontSize: int("subtitleFontSize").default(20), // Font size in pixels (12-48)
  buttonText: varchar("buttonText", { length: 100 }),
  buttonRadiusPx: int("buttonRadiusPx").default(25),
  bullets: text("bullets"), // JSON array of bullet points
  bonusEnabled: boolean("bonusEnabled").default(false).notNull(),
  bonusText: text("bonusText"),
  companyName: varchar("companyName", { length: 255 }),
  phoneNumber: varchar("phoneNumber", { length: 50 }),
  // Contact form settings
  contactFormTitle: text("contactFormTitle"), // Multilingual JSON
  contactFormSubtitle: text("contactFormSubtitle"), // Multilingual JSON
  contactFormFields: text("contactFormFields"), // JSON array of enabled fields: ["name", "phone", "email", "telegram"]
  // Thank you page settings
  thankYouTitle: text("thankYouTitle"), // Multilingual JSON
  thankYouSubtitle: text("thankYouSubtitle"), // Multilingual JSON
  thankYouButtonText: text("thankYouButtonText"), // Multilingual JSON
  thankYouButtonUrl: text("thankYouButtonUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizDesignSetting = typeof quizDesignSettings.$inferSelect;
export type InsertQuizDesignSetting = typeof quizDesignSettings.$inferInsert;

/**
 * Quiz Templates table - pre-built quiz templates for different niches
 */
export const quizTemplates = mysqlTable("quiz_templates", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  niche: varchar("niche", { length: 100 }).notNull(), // furniture, renovation, ecommerce, services, realestate
  description: text("description"),
  previewImage: text("previewImage"), // S3 URL
  quizData: text("quizData").notNull(), // JSON string - Full quiz configuration (questions, design, etc.)
  designPreset: text("designPreset").notNull(), // JSON string - Design settings
  isActive: int("isActive").default(1).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuizTemplate = typeof quizTemplates.$inferSelect;
export type InsertQuizTemplate = typeof quizTemplates.$inferInsert;


/**
 * Question Templates table - reusable question templates
 */
export const questionTemplates = mysqlTable("question_templates", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(), // General, Furniture, Renovation, E-commerce, Services
  questionText: text("questionText").notNull(),
  questionType: varchar("questionType", { length: 20 }).default("single").notNull(), // single, multiple, text
  options: text("options").notNull(), // JSON array of options
  isRequired: int("isRequired").default(1).notNull(),
  usageCount: int("usageCount").default(0).notNull(),
  createdBy: int("createdBy"), // User ID who created the template
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuestionTemplate = typeof questionTemplates.$inferSelect;
export type InsertQuestionTemplate = typeof questionTemplates.$inferInsert;

/**
 * Calendar Events table - stores scheduled calls and meetings
 */
export const calendarEvents = mysqlTable("calendar_events", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").references(() => leads.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }), // Manager assigned
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  meetingLink: text("meetingLink"), // Google Meet or Zoom link
  meetingType: varchar("meetingType", { length: 50 }), // call, meeting, demo
  status: varchar("status", { length: 50 }).default("scheduled").notNull(), // scheduled, completed, cancelled, no_show
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CalendarEvent = typeof calendarEvents.$inferSelect;
export type InsertCalendarEvent = typeof calendarEvents.$inferInsert;

/**
 * Event Notifications table - tracks sent reminders
 */
export const eventNotifications = mysqlTable("event_notifications", {
  id: int("id").autoincrement().primaryKey(),
  eventId: int("eventId").notNull().references(() => calendarEvents.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  notificationType: varchar("notificationType", { length: 50 }).default("reminder_15min").notNull(), // reminder_15min, reminder_1hour, reminder_1day
  scheduledFor: timestamp("scheduledFor").notNull(), // When notification should be sent
  sentAt: timestamp("sentAt"), // When notification was actually sent
  status: varchar("status", { length: 50 }).default("pending").notNull(), // pending, sent, failed
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EventNotification = typeof eventNotifications.$inferSelect;
export type InsertEventNotification = typeof eventNotifications.$inferInsert;

/**
 * Lead History table - tracks all changes to leads
 */
export const leadHistory = mysqlTable("lead_history", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull().references(() => leads.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }), // Who made the change
  field: varchar("field", { length: 100 }).notNull(), // Field that was changed (status, assignedTo, name, phone, email, notes, etc.)
  oldValue: text("oldValue"), // Previous value (null for new leads)
  newValue: text("newValue"), // New value
  changedAt: timestamp("changedAt").defaultNow().notNull(),
});

export type LeadHistory = typeof leadHistory.$inferSelect;
export type InsertLeadHistory = typeof leadHistory.$inferInsert;

/**
 * Lead Activities table - timeline of interactions (calls, emails, comments, file uploads)
 */
export const leadActivities = mysqlTable("lead_activities", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull().references(() => leads.id, { onDelete: "cascade" }),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }), // Who performed the activity
  activityType: varchar("activityType", { length: 50 }).notNull(), // call, email, comment, file_upload, status_change, note
  title: varchar("title", { length: 255 }).notNull(), // Activity title
  description: text("description"), // Activity details
  metadata: text("metadata"), // JSON: call duration, email subject, file info, etc.
  fileUrl: varchar("fileUrl", { length: 500 }), // S3 URL for uploaded files
  fileName: varchar("fileName", { length: 255 }), // Original file name
  fileSize: int("fileSize"), // File size in bytes
  fileMimeType: varchar("fileMimeType", { length: 100 }), // MIME type
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;

/**
 * Password reset tokens
 */
export const passwordResetTokens = mysqlTable("password_reset_tokens", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  usedAt: timestamp("usedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// Events Log for Analytics Monitoring
export const events_log = mysqlTable("events_log", {
  id: int("id").autoincrement().primaryKey(),
  eventType: varchar("event_type", { length: 100 }).notNull(), // quiz_start, form_submit, cta_click, etc.
  platform: varchar("platform", { length: 50 }).notNull(), // ga4, meta_pixel, gtm, clarity
  status: varchar("status", { length: 20 }).notNull().default("success"), // success, fail, pending
  eventData: json("event_data"), // Full event payload
  errorMessage: text("error_message"), // Error details if failed
  userId: varchar("user_id", { length: 255 }), // User/session identifier
  quizId: varchar("quiz_id", { length: 255 }), // Quiz identifier if applicable
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  responseTime: int("response_time"), // API response time in ms
  ipAddress: varchar("ip_address", { length: 45 }), // User IP
  userAgent: text("user_agent"), // Browser info
  clarityUserId: varchar("clarity_user_id", { length: 255 }), // Clarity user ID for session recording
  claritySessionId: varchar("clarity_session_id", { length: 255 }), // Clarity session ID for session recording
  clarityProjectId: varchar("clarity_project_id", { length: 255 }), // Clarity project ID
});

/**
 * Blog Categories table
 */
export const blogCategories = mysqlTable("blog_categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogCategory = typeof blogCategories.$inferSelect;
export type InsertBlogCategory = typeof blogCategories.$inferInsert;

/**
 * Blog Posts table
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(), // Short description for cards
  content: text("content").notNull(), // Full HTML content from TipTap
  coverImage: varchar("coverImage", { length: 500 }), // S3 URL
  authorId: int("authorId").notNull().references(() => users.id, { onDelete: "cascade" }),
  categoryId: int("categoryId").references(() => blogCategories.id, { onDelete: "set null" }),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  views: int("views").default(0).notNull(),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Blog SEO Settings table
 */
export const blogSeo = mysqlTable("blog_seo", {
  id: int("id").autoincrement().primaryKey(),
  postId: int("postId").notNull().unique().references(() => blogPosts.id, { onDelete: "cascade" }),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  keywords: text("keywords"), // Comma-separated keywords
  ogImage: varchar("ogImage", { length: 500 }), // Open Graph image URL
  ogTitle: varchar("ogTitle", { length: 255 }),
  ogDescription: text("ogDescription"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogSeo = typeof blogSeo.$inferSelect;
export type InsertBlogSeo = typeof blogSeo.$inferInsert;

/**
 * Case Studies table - store portfolio/success stories
 */
export const caseStudies = mysqlTable("case_studies", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(), // URL-friendly identifier
  client: varchar("client", { length: 255 }).notNull(), // Client name
  industry: varchar("industry", { length: 100 }), // Industry/niche
  description: text("description").notNull(), // Short description
  content: text("content").notNull(), // Full case study content (HTML/Markdown with rich formatting)
  coverImage: varchar("coverImage", { length: 500 }), // Main cover image URL
  images: text("images"), // JSON array of additional image URLs
  results: text("results"), // JSON object with metrics (e.g., {roi: "300%", leads: "500+", roas: "5.2x"})
  tags: text("tags"), // JSON array of tags (e.g., ["Meta Ads", "E-commerce", "ROAS 5x"])
  isPublished: boolean("isPublished").default(false).notNull(),
  publishedAt: timestamp("publishedAt"),
  viewCount: int("viewCount").default(0).notNull(),
  orderIndex: int("orderIndex").default(0).notNull(), // Display order
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CaseStudy = typeof caseStudies.$inferSelect;
export type InsertCaseStudy = typeof caseStudies.$inferInsert;

/**
 * Contact Messages table - store contact form submissions
 */
export const contactMessages = mysqlTable("contact_messages", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "read", "replied", "archived"]).default("new").notNull(),
  assignedTo: int("assignedTo"), // Manager user id
  notes: text("notes"), // Internal notes
  repliedAt: timestamp("repliedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;

/**
 * Team Members table - for displaying team on agency homepage
 */
export const teamMembers = mysqlTable("team_members", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  position: varchar("position", { length: 255 }).notNull(), // e.g., "Performance Marketing Manager"
  bio: text("bio"), // Short biography
  photoUrl: varchar("photoUrl", { length: 500 }), // S3 URL to photo
  experience: varchar("experience", { length: 100 }), // e.g., "5+ років досвіду"
  // Certifications
  metaBlueprintCertified: int("metaBlueprintCertified").default(0).notNull(), // 0 = no, 1 = yes
  googleAdsCertified: int("googleAdsCertified").default(0).notNull(),
  tiktokCertified: int("tiktokCertified").default(0).notNull(),
  // Social media links
  linkedinUrl: varchar("linkedinUrl", { length: 500 }),
  facebookUrl: varchar("facebookUrl", { length: 500 }),
  instagramUrl: varchar("instagramUrl", { length: 500 }),
  telegramUrl: varchar("telegramUrl", { length: 500 }),
  // Display settings
  orderIndex: int("orderIndex").default(0).notNull(), // For sorting
  isActive: int("isActive").default(1).notNull(), // 0 = hidden, 1 = visible
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = typeof teamMembers.$inferInsert;
