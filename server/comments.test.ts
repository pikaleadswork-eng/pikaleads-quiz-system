import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("Comments System", () => {
  const mockAdminContext: Context = {
    user: {
      id: 1,
      name: "Admin User",
      email: "admin@pikaleads.com",
      role: "admin",
      isActive: true,
      passwordHash: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  const mockManagerContext: Context = {
    user: {
      id: 2,
      name: "Manager User",
      email: "manager@pikaleads.com",
      role: "manager",
      isActive: true,
      passwordHash: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {} as any,
    res: {} as any,
  };

  let testLeadId: number;

  beforeAll(async () => {
    // Create a test lead for comments
    const caller = appRouter.createCaller(mockAdminContext);
    const result = await caller.crm.createLead({
      name: "Test Lead for Comments",
      phone: "+380501234567",
      email: "test@example.com",
      source: "Manual",
      quizName: "test-quiz",
    });
    testLeadId = result.leadId;
  });

  it("should allow admin to add comment to lead", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    const result = await caller.comments.add({
      leadId: testLeadId,
      comment: "Test comment from admin",
    });

    expect(result.success).toBe(true);
  });

  it("should allow manager to add comment to lead", async () => {
    const caller = appRouter.createCaller(mockManagerContext);
    
    const result = await caller.comments.add({
      leadId: testLeadId,
      comment: "Test comment from manager",
    });

    expect(result.success).toBe(true);
  });

  it("should retrieve all comments for a lead", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    const comments = await caller.comments.getByLeadId({
      leadId: testLeadId,
    });

    expect(comments).toBeDefined();
    expect(Array.isArray(comments)).toBe(true);
    expect(comments.length).toBeGreaterThanOrEqual(2);
    
    // Check comment structure
    const firstComment = comments[0];
    expect(firstComment).toHaveProperty("id");
    expect(firstComment).toHaveProperty("leadId");
    expect(firstComment).toHaveProperty("userId");
    expect(firstComment).toHaveProperty("comment");
    expect(firstComment).toHaveProperty("createdAt");
    expect(firstComment).toHaveProperty("userName");
  });

  it("should include userName in comment response", async () => {
    const caller = appRouter.createCaller(mockAdminContext);
    
    const comments = await caller.comments.getByLeadId({
      leadId: testLeadId,
    });

    const adminComment = comments.find(c => c.comment === "Test comment from admin");
    expect(adminComment?.userName).toBeDefined();
    expect(typeof adminComment?.userName).toBe("string");
    expect(adminComment?.userName.length).toBeGreaterThan(0);
  });
});
