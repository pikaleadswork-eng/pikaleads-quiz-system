import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";

describe("leads.create", () => {
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(() => {
    // Create a mock context for public procedure
    const mockContext: Context = {
      user: null,
      req: {} as any,
      res: {} as any,
    };

    caller = appRouter.createCaller(mockContext);
  });

  it("should create a lead with consultation source", async () => {
    const result = await caller.leads.create({
      name: "Test User",
      phone: "+380501234567",
      email: "test@example.com",
      comment: "I want to discuss my project",
      source: "Консультація",
      status: "new",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBeTypeOf("number");
  });

  it("should create a lead with strategy source", async () => {
    const result = await caller.leads.create({
      name: "Strategy Test",
      phone: "+380507654321",
      source: "Стратегія",
      status: "new",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBeTypeOf("number");
  });

  it("should create a lead without optional fields", async () => {
    const result = await caller.leads.create({
      name: "Minimal User",
      phone: "+380991112233",
      source: "Консультація",
      status: "new",
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBeTypeOf("number");
  });

  it("should fail without required name field", async () => {
    await expect(
      caller.leads.create({
        name: "",
        phone: "+380991112233",
        source: "Консультація",
        status: "new",
      })
    ).rejects.toThrow();
  });

  it("should fail without required phone field", async () => {
    await expect(
      caller.leads.create({
        name: "Test User",
        phone: "",
        source: "Консультація",
        status: "new",
      })
    ).rejects.toThrow();
  });
});
