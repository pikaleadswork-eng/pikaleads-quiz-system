import { describe, it, expect, afterAll } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { getDb } from "./db";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-admin",
    email: "admin@test.com",
    name: "Test Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {} as any,
    res: {} as any,
  };
}

describe("Analytics Settings Router", () => {
  const ctx = createTestContext();
  const caller = appRouter.createCaller(ctx);
  let createdProviders: string[] = [];

  afterAll(async () => {
    // Cleanup: delete all test analytics settings
    const db = await getDb();
    if (db && createdProviders.length > 0) {
      const { analyticsSettings } = await import("../drizzle/schema");
      const { inArray } = await import("drizzle-orm");
      await db.delete(analyticsSettings).where(
        inArray(analyticsSettings.provider, createdProviders as any)
      );
    }
  });

  it("should save GA4 analytics setting with API Secret", async () => {
    const result = await caller.analyticsSettings.save({
      provider: "ga4",
      trackingId: "G-TEST123456",
      apiSecret: "test_api_secret_123",
      isActive: true,
    });

    expect(result.success).toBe(true);
    createdProviders.push("ga4");
    
    // Verify API Secret was saved
    const setting = await caller.analyticsSettings.getByProvider({
      provider: "ga4",
    });
    expect(setting?.apiSecret).toBe("test_api_secret_123");
  });

  it("should save Meta Pixel analytics setting with Access Token", async () => {
    const result = await caller.analyticsSettings.save({
      provider: "meta_pixel",
      trackingId: "1234567890123456",
      apiSecret: "meta_access_token_xyz",
      isActive: true,
    });

    expect(result.success).toBe(true);
    createdProviders.push("meta_pixel");
    
    // Verify Access Token was saved
    const setting = await caller.analyticsSettings.getByProvider({
      provider: "meta_pixel",
    });
    expect(setting?.apiSecret).toBe("meta_access_token_xyz");
  });

  it("should save Microsoft Clarity analytics setting", async () => {
    const result = await caller.analyticsSettings.save({
      provider: "microsoft_clarity",
      trackingId: "abcdefghij",
      isActive: true,
    });

    expect(result.success).toBe(true);
    createdProviders.push("microsoft_clarity");
  });

  it("should get all analytics settings", async () => {
    const settings = await caller.analyticsSettings.getAll();

    expect(Array.isArray(settings)).toBe(true);
    expect(settings.length).toBeGreaterThanOrEqual(3);
    
    const ga4 = settings.find(s => s.provider === "ga4");
    expect(ga4).toBeDefined();
    expect(ga4?.trackingId).toBe("G-TEST123456");
  });

  it("should get analytics setting by provider", async () => {
    const setting = await caller.analyticsSettings.getByProvider({
      provider: "ga4",
    });

    expect(setting).toBeDefined();
    expect(setting?.provider).toBe("ga4");
    expect(setting?.trackingId).toBe("G-TEST123456");
    expect(setting?.isActive).toBe(true);
  });

  it("should update existing analytics setting", async () => {
    // Update GA4 tracking ID
    const result = await caller.analyticsSettings.save({
      provider: "ga4",
      trackingId: "G-UPDATED999",
      isActive: false,
    });

    expect(result.success).toBe(true);

    // Verify update
    const updated = await caller.analyticsSettings.getByProvider({
      provider: "ga4",
    });

    expect(updated?.trackingId).toBe("G-UPDATED999");
    expect(updated?.isActive).toBe(false);
  });

  it("should toggle analytics setting active status", async () => {
    const result = await caller.analyticsSettings.toggleActive({
      provider: "meta_pixel",
      isActive: false,
    });

    expect(result.success).toBe(true);

    // Verify toggle
    const setting = await caller.analyticsSettings.getByProvider({
      provider: "meta_pixel",
    });

    expect(setting?.isActive).toBe(false);
  });

  it("should save GTM with Server Container URL", async () => {
    const result = await caller.analyticsSettings.save({
      provider: "gtm",
      trackingId: "GTM-TEST123",
      serverContainerUrl: "https://server.example.com",
      isActive: true,
    });

    expect(result.success).toBe(true);
    createdProviders.push("gtm");
    
    // Verify Server Container URL was saved
    const setting = await caller.analyticsSettings.getByProvider({
      provider: "gtm",
    });
    expect(setting?.serverContainerUrl).toBe("https://server.example.com");
  });

  it("should test GTM configuration", async () => {
    const result = await caller.analyticsSettings.test({
      provider: "gtm",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("gtm");
  });

  it("should test Clarity configuration", async () => {
    const result = await caller.analyticsSettings.test({
      provider: "microsoft_clarity",
    });

    expect(result.success).toBe(true);
    expect(result.message).toContain("microsoft_clarity");
  });

  it("should delete analytics setting", async () => {
    const result = await caller.analyticsSettings.delete({
      provider: "microsoft_clarity",
    });

    expect(result.success).toBe(true);

    // Verify deletion
    const deleted = await caller.analyticsSettings.getByProvider({
      provider: "microsoft_clarity",
    });

    expect(deleted).toBeNull();
    
    // Remove from cleanup list
    createdProviders = createdProviders.filter(p => p !== "microsoft_clarity");
  });
});
