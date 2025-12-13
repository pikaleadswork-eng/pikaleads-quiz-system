import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import type { TrpcContext } from "./_core/context";

describe("Quiz Design Router", () => {
  let ctx: TrpcContext;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    // Create mock context with admin user
    ctx = await createContext({
      req: {
        headers: {},
        cookies: {},
      } as any,
      res: {} as any,
    });

    // Mock user as admin for protected procedures
    ctx.user = {
      id: 1,
      openId: "test-admin",
      name: "Test Admin",
      email: "admin@test.com",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLoginAt: new Date(),
      isActive: 1,
    };

    caller = appRouter.createCaller(ctx);
  });

  describe("save design settings", () => {
    it("should save new design settings", async () => {
      const result = await caller.quizDesign.save({
        quizId: 999,
        layoutType: "background",
        backgroundImage: "https://example.com/bg.jpg",
        backgroundVideo: null,
        alignment: "center",
        primaryColor: "#FACC15",
        accentColor: "#A855F7",
        fontFamily: "Inter",
      });

      expect(result).toEqual({ success: true });
    });

    it("should update existing design settings", async () => {
      // First save
      await caller.quizDesign.save({
        quizId: 998,
        layoutType: "standard",
        primaryColor: "#FF0000",
        accentColor: "#00FF00",
        fontFamily: "Arial",
      });

      // Then update
      const result = await caller.quizDesign.save({
        quizId: 998,
        layoutType: "background",
        backgroundImage: "https://example.com/new-bg.jpg",
        alignment: "left",
        primaryColor: "#0000FF",
        accentColor: "#FFFF00",
        fontFamily: "Helvetica",
      });

      expect(result).toEqual({ success: true });

      // Verify update
      const settings = await caller.quizDesign.getByQuizId({ quizId: 998 });
      expect(settings?.layoutType).toBe("background");
      expect(settings?.backgroundImage).toBe("https://example.com/new-bg.jpg");
      expect(settings?.alignment).toBe("left");
    });
  });

  describe("getByQuizId", () => {
    it("should return null for non-existent quiz", async () => {
      const result = await caller.quizDesign.getByQuizId({ quizId: 99999 });
      expect(result).toBeNull();
    });

    it("should return design settings for existing quiz", async () => {
      // First save settings
      await caller.quizDesign.save({
        quizId: 997,
        layoutType: "standard",
        primaryColor: "#FACC15",
        accentColor: "#A855F7",
        fontFamily: "Inter",
      });

      // Then retrieve
      const result = await caller.quizDesign.getByQuizId({ quizId: 997 });
      
      expect(result).not.toBeNull();
      expect(result?.quizId).toBe(997);
      expect(result?.layoutType).toBe("standard");
      expect(result?.primaryColor).toBe("#FACC15");
    });
  });

  describe("uploadBackground", () => {
    it("should upload background file and return S3 URL", async () => {
      // Create a small test image in base64
      const testImageBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

      const result = await caller.quizDesign.uploadBackground({
        fileData: testImageBase64,
        fileName: "test-bg.png",
        mimeType: "image/png",
      });

      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("fileKey");
      expect(result.url).toContain("quiz-backgrounds/");
      expect(result.fileKey).toContain(".png");
    });
  });

  describe("generateBackground", () => {
    it("should generate AI background for furniture niche", async () => {
      const result = await caller.quizDesign.generateBackground({
        niche: "furniture",
        style: "professional",
      });

      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("fileKey");
      expect(result.url).toBeTruthy();
      expect(result.fileKey).toContain("ai-generated");
    }, 30000); // 30 second timeout for AI generation

    it("should generate AI background for renovation niche with modern style", async () => {
      const result = await caller.quizDesign.generateBackground({
        niche: "renovation",
        style: "modern",
      });

      expect(result).toHaveProperty("url");
      expect(result).toHaveProperty("fileKey");
    }, 30000);
  });
});
