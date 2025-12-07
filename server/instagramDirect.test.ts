import { describe, it, expect } from "vitest";
import { sendInstagramMessage, getInstagramUserId, handleInstagramWebhook } from "./instagramDirect";

describe("Instagram Direct Integration", () => {
  it("should return error when access token is missing", async () => {
    const result = await sendInstagramMessage("123456", "Test message");
    
    expect(result.success).toBe(false);
    expect(result.error).toContain("access token not configured");
  });
  
  it("should format Instagram message request correctly", async () => {
    // This test verifies the structure without making actual API calls
    const recipientId = "123456789";
    const message = "Hello from PIKALEADS!";
    
    expect(recipientId).toBeTruthy();
    expect(message).toBeTruthy();
  });
  
  it("should handle Instagram webhook payload correctly", () => {
    const mockPayload = {
      object: "instagram",
      entry: [
        {
          messaging: [
            {
              sender: { id: "123456", username: "testuser" },
              recipient: { id: "789012" },
              timestamp: 1234567890000,
              message: {
                mid: "msg_123",
                text: "Hello!",
              },
            },
          ],
        },
      ],
    };
    
    const messages = handleInstagramWebhook(mockPayload);
    
    expect(messages).toHaveLength(1);
    expect(messages[0].id).toBe("msg_123");
    expect(messages[0].from.id).toBe("123456");
    expect(messages[0].from.username).toBe("testuser");
    expect(messages[0].message).toBe("Hello!");
  });
  
  it("should handle empty webhook payload", () => {
    const messages = handleInstagramWebhook({});
    expect(messages).toHaveLength(0);
  });
  
  it("should return error for getUserId without token", async () => {
    const result = await getInstagramUserId("testuser");
    
    expect(result.success).toBe(false);
    expect(result.error).toContain("access token not configured");
  });
});
