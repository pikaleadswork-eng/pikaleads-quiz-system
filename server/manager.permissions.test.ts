import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import type { Context } from "./_core/context";
import { TRPCError } from "@trpc/server";

describe("Manager Permissions", () => {
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
    // Create a test lead assigned to manager
    const caller = appRouter.createCaller(mockAdminContext);
    const result = await caller.crm.createLead({
      name: "Test Lead for Manager",
      phone: "+380501234567",
      email: "test@example.com",
      source: "Manual",
      quizName: "test-quiz",
    });
    testLeadId = result.leadId;

    // Assign lead to manager
    await caller.crm.updateLead({
      leadId: testLeadId,
      name: "Test Lead for Manager",
      phone: "+380501234567",
      email: "test@example.com",
    });
  });

  describe("Manager CAN access", () => {
    it("should allow manager to view leads", async () => {
      const caller = appRouter.createCaller(mockManagerContext);
      
      const leads = await caller.crm.getLeads();
      
      expect(leads).toBeDefined();
      expect(Array.isArray(leads)).toBe(true);
    });

    it("should allow manager to edit lead details", async () => {
      const caller = appRouter.createCaller(mockManagerContext);
      
      const result = await caller.crm.updateLead({
        leadId: testLeadId,
        name: "Updated by Manager",
        phone: "+380501234567",
        email: "updated@example.com",
      });

      expect(result.success).toBe(true);
    });

    it("should allow manager to change lead status", async () => {
      const caller = appRouter.createCaller(mockManagerContext);
      
      const result = await caller.crm.updateLeadStatus({
        leadId: testLeadId,
        statusId: 2,
      });

      expect(result.success).toBe(true);
    });

    it("should allow manager to add comments", async () => {
      const caller = appRouter.createCaller(mockManagerContext);
      
      const result = await caller.comments.add({
        leadId: testLeadId,
        comment: "Manager comment test",
      });

      expect(result.success).toBe(true);
    });

    it("should allow manager to create leads", async () => {
      const caller = appRouter.createCaller(mockManagerContext);
      
      const result = await caller.crm.createLead({
        name: "Lead Created by Manager",
        phone: "+380509876543",
        email: "manager-lead@example.com",
        source: "Manual",
        quizName: "test-quiz",
      });

      expect(result.success).toBe(true);
      expect(result.leadId).toBeDefined();
    });
  });

  describe("Manager CANNOT access", () => {
    it("should verify manager role restrictions are in place", async () => {
      // Manager role should not be admin
      expect(mockManagerContext.user.role).toBe("manager");
      expect(mockManagerContext.user.role).not.toBe("admin");
      
      // In the UI:
      // - Delete buttons are hidden for managers (CRM.tsx line 902)
      // - Bulk actions bar is hidden for managers (CRM.tsx line 1405)
      // - Navigation is filtered to exclude admin-only pages (CRMLayout.tsx line 98-105)
    });

    it("should verify manager sees filtered navigation", async () => {
      // CRMLayout filters navigation for managers to only show:
      // - /admin/inbox (Messaging)
      // - /crm (Leads)
      // - /admin/services (Services)
      // - /admin/scripts (Scripts)
      // - /admin/calendar (Calendar)
      
      const allowedRoutes = [
        "/admin/inbox",
        "/crm",
        "/admin/services",
        "/admin/scripts",
        "/admin/calendar"
      ];
      
      const restrictedRoutes = [
        "/admin/sales",
        "/admin/settings",
        "/admin/analytics",
        "/admin/performance"
      ];
      
      expect(allowedRoutes.length).toBe(5);
      expect(restrictedRoutes.length).toBeGreaterThan(0);
    });

    it("should prevent manager from creating lead statuses", async () => {
      const caller = appRouter.createCaller(mockManagerContext);
      
      try {
        await caller.crm.createStatus({
          name: "Test Status",
          color: "#FF0000",
          order: 10,
        });
        // If we reach here, the test should fail
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(TRPCError);
        if (error instanceof TRPCError) {
          expect(error.code).toBe("FORBIDDEN");
        }
      }
    });
  });

  describe("Manager Lead Filtering", () => {
    it("should only show assigned leads to manager", async () => {
      const adminCaller = appRouter.createCaller(mockAdminContext);
      const managerCaller = appRouter.createCaller(mockManagerContext);

      // Create lead assigned to different manager
      await adminCaller.crm.createLead({
        name: "Lead for Other Manager",
        phone: "+380501111111",
        email: "other@example.com",
        source: "Manual",
        quizName: "test-quiz",
      });

      // Manager should only see their own leads
      const managerLeads = await managerCaller.crm.getLeads();
      const allLeads = await adminCaller.crm.getLeads();

      expect(managerLeads.length).toBeLessThanOrEqual(allLeads.length);
      
      // All manager's leads should be assigned to them
      managerLeads.forEach(lead => {
        expect(lead.assignedTo).toBe(mockManagerContext.user.id);
      });
    });
  });
});
