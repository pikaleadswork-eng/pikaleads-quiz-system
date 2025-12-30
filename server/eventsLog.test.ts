import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { inferProcedureInput } from "@trpc/server";

type AppRouter = typeof appRouter;

/**
 * Test suite for eventsLog router
 * Tests event logging, retrieval, and statistics
 */
describe("eventsLog router", () => {
  const caller = appRouter.createCaller({
    user: { id: 1, email: "admin@test.com", role: "admin" },
    req: {} as any,
    res: {} as any,
  });

  let testEventId: number;

  describe("logEvent", () => {
    it("should log a success event", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "quiz_start",
        platform: "clarity",
        status: "success",
        eventData: { quizId: "test-quiz", quizName: "Test Quiz" },
        userId: "test-session-123",
        quizId: "test-quiz",
        responseTime: 150,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");
      testEventId = result.eventId;
    });

    it("should log a failed event", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "form_submit",
        platform: "ga4",
        status: "fail",
        errorMessage: "Network timeout",
        eventData: { formType: "lead_form" },
        userId: "test-session-456",
        responseTime: 5000,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");
    });

    it("should log GTM event", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "cta_click",
        platform: "gtm",
        status: "success",
        eventData: { buttonText: "Learn More", location: "home_quiz_furniture" },
        userId: "test-session-789",
        responseTime: 100,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");
    });

    it("should log Meta Pixel event", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "quiz_complete",
        platform: "meta_pixel",
        status: "success",
        eventData: { quizId: "furniture-quiz", totalQuestions: 5 },
        userId: "test-session-meta",
        quizId: "furniture-quiz",
        responseTime: 200,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");
    });
  });

  describe("getRecentEvents", () => {
    it("should retrieve recent events with default filters", async () => {
      const result = await caller.eventsLog.getRecentEvents({
        limit: 10,
        platform: "all",
        status: "all",
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(10);

      // Check event structure
      const event = result[0];
      expect(event).toHaveProperty("id");
      expect(event).toHaveProperty("eventType");
      expect(event).toHaveProperty("platform");
      expect(event).toHaveProperty("status");
      expect(event).toHaveProperty("timestamp");
    });

    it("should filter events by platform", async () => {
      const result = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((event) => {
        expect(event.platform).toBe("clarity");
      });
    });

    it("should filter events by status", async () => {
      const result = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "all",
        status: "success",
      });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((event) => {
        expect(event.status).toBe("success");
      });
    });

    it("should filter events by both platform and status", async () => {
      const result = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "ga4",
        status: "fail",
      });

      expect(Array.isArray(result)).toBe(true);
      result.forEach((event) => {
        expect(event.platform).toBe("ga4");
        expect(event.status).toBe("fail");
      });
    });

    it("should respect limit parameter", async () => {
      const result = await caller.eventsLog.getRecentEvents({
        limit: 5,
        platform: "all",
        status: "all",
      });

      expect(result.length).toBeLessThanOrEqual(5);
    });
  });

  describe("getEventStats", () => {
    it("should retrieve event statistics for 24h", async () => {
      const result = await caller.eventsLog.getEventStats({
        timeRange: "24h",
      });

      expect(result).toHaveProperty("totalEvents");
      expect(result).toHaveProperty("successEvents");
      expect(result).toHaveProperty("failedEvents");
      expect(result).toHaveProperty("successRate");
      expect(result).toHaveProperty("eventsByPlatform");
      expect(result).toHaveProperty("eventsByType");
      expect(result).toHaveProperty("avgResponseTime");

      expect(typeof result.totalEvents).toBe("number");
      expect(typeof result.successRate).toBe("number");
      expect(Array.isArray(result.eventsByPlatform)).toBe(true);
      expect(Array.isArray(result.eventsByType)).toBe(true);
    });

    it("should calculate success rate correctly", async () => {
      const result = await caller.eventsLog.getEventStats({
        timeRange: "24h",
      });

      if (result.totalEvents > 0) {
        expect(result.successRate).toBeGreaterThanOrEqual(0);
        expect(result.successRate).toBeLessThanOrEqual(100);
        
        const calculatedRate = Math.round((result.successEvents / result.totalEvents) * 100);
        expect(result.successRate).toBe(calculatedRate);
      }
    });

    it("should retrieve stats for different time ranges", async () => {
      const ranges: Array<"1h" | "24h" | "7d" | "30d"> = ["1h", "24h", "7d", "30d"];

      for (const timeRange of ranges) {
        const result = await caller.eventsLog.getEventStats({ timeRange });
        
        expect(result).toHaveProperty("totalEvents");
        expect(typeof result.totalEvents).toBe("number");
        expect(result.totalEvents).toBeGreaterThanOrEqual(0);
      }
    });

    it("should return platform distribution", async () => {
      const result = await caller.eventsLog.getEventStats({
        timeRange: "24h",
      });

      expect(Array.isArray(result.eventsByPlatform)).toBe(true);
      
      result.eventsByPlatform.forEach((item) => {
        expect(item).toHaveProperty("platform");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
        expect(["ga4", "meta_pixel", "gtm", "clarity"]).toContain(item.platform);
      });
    });

    it("should return top event types", async () => {
      const result = await caller.eventsLog.getEventStats({
        timeRange: "24h",
      });

      expect(Array.isArray(result.eventsByType)).toBe(true);
      expect(result.eventsByType.length).toBeLessThanOrEqual(10);
      
      result.eventsByType.forEach((item) => {
        expect(item).toHaveProperty("eventType");
        expect(item).toHaveProperty("count");
        expect(typeof item.count).toBe("number");
      });
    });

    it("should calculate average response time", async () => {
      const result = await caller.eventsLog.getEventStats({
        timeRange: "24h",
      });

      expect(typeof result.avgResponseTime).toBe("number");
      expect(result.avgResponseTime).toBeGreaterThanOrEqual(0);
    });
  });

  describe("clearOldEvents", () => {
    it("should clear events older than specified days", async () => {
      const result = await caller.eventsLog.clearOldEvents({
        daysToKeep: 30,
      });

      expect(result.success).toBe(true);
      expect(typeof result.deletedCount).toBe("number");
      expect(result.deletedCount).toBeGreaterThanOrEqual(0);
    });

    it("should accept different retention periods", async () => {
      const periods = [1, 7, 30, 90, 365];

      for (const days of periods) {
        const result = await caller.eventsLog.clearOldEvents({
          daysToKeep: days,
        });

        expect(result.success).toBe(true);
        expect(typeof result.deletedCount).toBe("number");
      }
    });
  });

  describe("Event data integrity", () => {
    it("should preserve event data JSON structure", async () => {
      const eventData = {
        quizId: "test-quiz",
        questionIndex: 3,
        totalQuestions: 5,
        answerText: "Option A",
        timestamp: new Date().toISOString(),
      };

      const logResult = await caller.eventsLog.logEvent({
        eventType: "quiz_question_answer",
        platform: "clarity",
        status: "success",
        eventData,
        userId: "test-session-data-integrity",
      });

      expect(logResult.success).toBe(true);

      const events = await caller.eventsLog.getRecentEvents({
        limit: 1,
        platform: "clarity",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === logResult.eventId);
      if (savedEvent && savedEvent.eventData) {
        expect(savedEvent.eventData).toMatchObject(eventData);
      }
    });

    it("should handle events without optional fields", async () => {
      const result = await caller.eventsLog.logEvent({
        eventType: "page_view",
        platform: "ga4",
        status: "success",
      });

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");
    });
  });
});
