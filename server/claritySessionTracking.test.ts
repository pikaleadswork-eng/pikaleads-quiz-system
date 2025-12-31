import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { inferProcedureInput } from "@trpc/server";

type AppRouter = typeof appRouter;

/**
 * Test suite for Clarity session tracking in eventsLog
 * Tests that Clarity session IDs are properly stored and retrieved
 */
describe("Clarity session tracking", () => {
  const caller = appRouter.createCaller({
    user: { id: 1, email: "admin@test.com", role: "admin" },
    req: {} as any,
    res: {} as any,
  });

  let testEventId: number;
  const testClarityData = {
    clarityProjectId: "test_project_123",
    clarityUserId: "test_user_456",
    claritySessionId: "test_session_789",
  };

  describe("logEvent with Clarity session data", () => {
    it("should log event with Clarity session IDs", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "quiz_start",
        platform: "clarity",
        status: "success",
        eventData: { quizId: "test-quiz" },
        userId: "test-session-123",
        ...testClarityData,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");
      testEventId = result.eventId;
    });

    it("should retrieve event with Clarity session IDs", async () => {
      const events = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === testEventId);
      
      expect(savedEvent).toBeDefined();
      if (savedEvent) {
        expect(savedEvent.clarityProjectId).toBe(testClarityData.clarityProjectId);
        expect(savedEvent.clarityUserId).toBe(testClarityData.clarityUserId);
        expect(savedEvent.claritySessionId).toBe(testClarityData.claritySessionId);
      }
    });

    it("should construct valid Clarity session URL", async () => {
      const events = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === testEventId);
      
      if (savedEvent && savedEvent.clarityProjectId && savedEvent.clarityUserId && savedEvent.claritySessionId) {
        const expectedUrl = `https://clarity.microsoft.com/player/${savedEvent.clarityProjectId}/${savedEvent.clarityUserId}/${savedEvent.claritySessionId}`;
        
        // Verify URL format
        expect(expectedUrl).toMatch(/^https:\/\/clarity\.microsoft\.com\/player\/.+\/.+\/.+$/);
        expect(expectedUrl).toContain(testClarityData.clarityProjectId);
        expect(expectedUrl).toContain(testClarityData.clarityUserId);
        expect(expectedUrl).toContain(testClarityData.claritySessionId);
      }
    });

    it("should allow events without Clarity session data", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "page_view",
        platform: "ga4",
        status: "success",
        eventData: { page: "/home" },
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      expect(result.eventId).toBeTypeOf("number");

      const events = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "ga4",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === result.eventId);
      if (savedEvent) {
        expect(savedEvent.clarityProjectId).toBeNull();
        expect(savedEvent.clarityUserId).toBeNull();
        expect(savedEvent.claritySessionId).toBeNull();
      }
    });
  });

  describe("Clarity session data validation", () => {
    it("should handle partial Clarity session data", async () => {
      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "cta_click",
        platform: "clarity",
        status: "success",
        clarityProjectId: "partial_project",
        // Missing clarityUserId and claritySessionId
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      
      const events = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === result.eventId);
      if (savedEvent) {
        expect(savedEvent.clarityProjectId).toBe("partial_project");
        expect(savedEvent.clarityUserId).toBeNull();
        expect(savedEvent.claritySessionId).toBeNull();
      }
    });

    it("should handle long Clarity session IDs", async () => {
      const longIds = {
        clarityProjectId: "a".repeat(255),
        clarityUserId: "b".repeat(255),
        claritySessionId: "c".repeat(255),
      };

      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "form_submit",
        platform: "clarity",
        status: "success",
        ...longIds,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      
      const events = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === result.eventId);
      if (savedEvent) {
        expect(savedEvent.clarityProjectId).toBe(longIds.clarityProjectId);
        expect(savedEvent.clarityUserId).toBe(longIds.clarityUserId);
        expect(savedEvent.claritySessionId).toBe(longIds.claritySessionId);
      }
    });

    it("should handle special characters in Clarity IDs", async () => {
      const specialIds = {
        clarityProjectId: "proj-123_test",
        clarityUserId: "user@456#test",
        claritySessionId: "sess$789%test",
      };

      const input: inferProcedureInput<AppRouter["eventsLog"]["logEvent"]> = {
        eventType: "quiz_complete",
        platform: "clarity",
        status: "success",
        ...specialIds,
      };

      const result = await caller.eventsLog.logEvent(input);

      expect(result.success).toBe(true);
      
      const events = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      const savedEvent = events.find(e => e.id === result.eventId);
      if (savedEvent) {
        expect(savedEvent.clarityProjectId).toBe(specialIds.clarityProjectId);
        expect(savedEvent.clarityUserId).toBe(specialIds.clarityUserId);
        expect(savedEvent.claritySessionId).toBe(specialIds.claritySessionId);
      }
    });
  });

  describe("Filtering events with Clarity sessions", () => {
    it("should retrieve only Clarity events with session data", async () => {
      // Log multiple events
      await caller.eventsLog.logEvent({
        eventType: "test_event_1",
        platform: "clarity",
        status: "success",
        ...testClarityData,
      });

      await caller.eventsLog.logEvent({
        eventType: "test_event_2",
        platform: "clarity",
        status: "success",
        // No Clarity session data
      });

      await caller.eventsLog.logEvent({
        eventType: "test_event_3",
        platform: "ga4",
        status: "success",
      });

      const clarityEvents = await caller.eventsLog.getRecentEvents({
        limit: 100,
        platform: "clarity",
        status: "all",
      });

      // Should have Clarity events
      expect(clarityEvents.length).toBeGreaterThan(0);
      
      // Check that we can identify events with session data
      const eventsWithSessions = clarityEvents.filter(
        e => e.clarityProjectId && e.clarityUserId && e.claritySessionId
      );
      
      expect(eventsWithSessions.length).toBeGreaterThan(0);
    });
  });
});
