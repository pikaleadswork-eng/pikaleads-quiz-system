import { describe, expect, it } from "vitest";
import { sendTelegramMessage, formatLeadMessage } from "./telegram";

describe("Telegram Integration", () => {
  it("should format lead message correctly", () => {
    const testData = {
      quizName: "meta-furniture",
      answers: JSON.stringify(["Kitchens", "$200-$700", "$500-$1500", "Leads"]),
      name: "John Doe",
      phone: "+1234567890",
      telegram: "@johndoe",
    };

    const message = formatLeadMessage(testData);

    expect(message).toContain("Новий Лід з PIKALEADS Quiz");
    expect(message).toContain("meta-furniture");
    expect(message).toContain("John Doe");
    expect(message).toContain("+1234567890");
    expect(message).toContain("@johndoe");
    expect(message).toContain("Kitchens");
  });

  it("should send telegram message with valid credentials", async () => {
    const testMessage = `🧪 <b>Test Message from PIKALEADS</b>\n\nThis is a test to validate Telegram Bot credentials.\nTime: ${new Date().toISOString()}`;

    const result = await sendTelegramMessage(testMessage);

    expect(result).toBe(true);
  }, 10000); // 10 second timeout for network request
});
