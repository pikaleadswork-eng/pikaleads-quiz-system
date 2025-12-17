import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendEmailAlert, sendHighMemoryAlert, sendHighCPUAlert, sendDatabaseDownAlert } from "./utils/emailAlerts";

// Mock dependencies
vi.mock("./email", () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
}));

vi.mock("./db", () => ({
  getDb: vi.fn().mockResolvedValue({
    select: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis(),
    where: vi.fn().mockReturnThis(),
    limit: vi.fn().mockResolvedValue([
      {
        provider: "email",
        credentials: {
          fromEmail: "test@example.com",
          adminEmail: "admin@example.com",
        },
        isActive: true,
      },
    ]),
  }),
}));

describe("Email Alerts System", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send critical alert email", async () => {
    const result = await sendEmailAlert({
      subject: "Test Critical Alert",
      body: "This is a test critical alert",
      severity: "critical",
    });

    expect(result).toBe(true);
  });

  it("should send high memory alert", async () => {
    const result = await sendHighMemoryAlert("90%", "3.6GB", "4GB");
    expect(result).toBe(true);
  });

  it("should send high CPU alert", async () => {
    const result = await sendHighCPUAlert(2.5, 4);
    expect(result).toBe(true);
  });

  it("should send database down alert", async () => {
    const result = await sendDatabaseDownAlert("Connection failed");
    expect(result).toBe(true);
  });

  it("should handle missing SMTP configuration gracefully", async () => {
    const { getDb } = await import("./db");
    vi.mocked(getDb).mockResolvedValueOnce({
      select: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      limit: vi.fn().mockResolvedValue([]), // No SMTP config
    } as any);

    const result = await sendEmailAlert({
      subject: "Test",
      body: "Test",
      severity: "info",
    });

    expect(result).toBe(false);
  });
});
