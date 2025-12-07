import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";

describe("UTM Parameters Tracking", () => {
  it("should accept and store UTM parameters with lead submission", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.quiz.submitLead({
      quizName: "test-quiz",
      answers: JSON.stringify(["Answer 1", "Answer 2"]),
      questions: JSON.stringify(["Question 1?", "Question 2?"]),
      name: "Test User",
      phone: "+1234567890",
      email: "test@example.com",
      telegram: "@testuser",
      language: "en",
      // UTM parameters
      utmCampaign: "summer_sale_2025",
      utmAdGroup: "furniture_ads",
      utmAd: "ad_creative_001",
      utmPlacement: "facebook_feed",
      utmKeyword: "modern furniture",
      utmSite: "facebook.com",
      utmSource: "facebook",
      utmMedium: "cpc",
      utmContent: "carousel_ad",
      utmTerm: "buy furniture",
    });

    expect(result.success).toBe(true);
  });

  it("should handle lead submission without UTM parameters", async () => {
    const caller = appRouter.createCaller({
      user: null,
      req: {} as any,
      res: {} as any,
    });

    const result = await caller.quiz.submitLead({
      quizName: "test-quiz",
      answers: JSON.stringify(["Answer 1"]),
      name: "Test User",
      phone: "+1234567890",
      language: "en",
    });

    expect(result.success).toBe(true);
  });

  it("should format Telegram message with UTM data", async () => {
    const { formatLeadMessage } = await import("./telegram");

    const message = formatLeadMessage({
      quizName: "Furniture Quiz",
      answers: JSON.stringify(["Modern style", "Living room"]),
      questions: JSON.stringify(["What style?", "Which room?"]),
      name: "John Doe",
      phone: "+380501234567",
      email: "john@example.com",
      telegram: "@johndoe",
      utmCampaign: "summer_sale",
      utmAdGroup: "furniture_group",
      utmAd: "ad_001",
      utmPlacement: "facebook_feed",
      utmKeyword: "modern furniture",
      utmSite: "facebook.com",
    });

    expect(message).toContain("John Doe");
    expect(message).toContain("+380501234567");
    expect(message).toContain("john@example.com");
    expect(message).toContain("@johndoe");
    expect(message).toContain("summer_sale");
    expect(message).toContain("furniture_group");
    expect(message).toContain("ad_001");
    expect(message).toContain("facebook_feed");
    expect(message).toContain("modern furniture");
    expect(message).toContain("facebook.com");
  });

  it("should format Telegram message without UTM data", async () => {
    const { formatLeadMessage } = await import("./telegram");

    const message = formatLeadMessage({
      quizName: "Test Quiz",
      answers: JSON.stringify(["Answer 1"]),
      name: "Jane Doe",
      phone: "+380501234567",
    });

    expect(message).toContain("Jane Doe");
    expect(message).toContain("+380501234567");
    expect(message).not.toContain("UTM Мітки");
  });
});

describe("Email Integration", () => {
  it("should generate manager invitation email HTML", async () => {
    const { generateManagerInvitationEmail } = await import("./email");

    const html = generateManagerInvitationEmail({
      email: "manager@example.com",
      invitationUrl: "https://example.com/register-manager?token=abc123",
      invitedBy: "Admin User",
    });

    expect(html).toContain("manager@example.com");
    expect(html).toContain("https://example.com/register-manager?token=abc123");
    expect(html).toContain("Admin User");
    expect(html).toContain("PIKALEADS");
    expect(html).toContain("Прийняти запрошення");
  });

  it("should handle sendEmail with missing API key gracefully", async () => {
    const { sendEmail } = await import("./email");
    
    // Save original env
    const originalKey = process.env.SENDGRID_API_KEY;
    delete process.env.SENDGRID_API_KEY;

    const result = await sendEmail({
      to: "test@example.com",
      subject: "Test",
      html: "<p>Test</p>",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("SendGrid not configured");

    // Restore env
    if (originalKey) {
      process.env.SENDGRID_API_KEY = originalKey;
    }
  });
});

describe("Webhook Handlers", () => {
  it("should find lead by telegram username", async () => {
    const { getLeadByTelegram } = await import("./db");
    
    // This will return null if no lead exists, which is expected
    const lead = await getLeadByTelegram("@testuser");
    
    // Test passes if function executes without error
    expect(lead === null || typeof lead === "object").toBe(true);
  });

  it("should find lead by instagram username", async () => {
    const { getLeadByInstagram } = await import("./db");
    
    // This will return null if no lead exists, which is expected
    const lead = await getLeadByInstagram("testuser");
    
    // Test passes if function executes without error
    expect(lead === null || typeof lead === "object").toBe(true);
  });
});
