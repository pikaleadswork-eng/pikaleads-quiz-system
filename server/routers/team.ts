import { z } from "zod";
import { publicProcedure, protectedProcedure, router, adminProcedure } from "../_core/trpc";
import { 
  getAllTeamMembers, 
  getTeamMemberById, 
  createTeamMember, 
  updateTeamMember, 
  deleteTeamMember,
  updateTeamMemberOrder 
} from "../db";

export const teamRouter = router({
  // Public - get all active team members for homepage
  getAll: publicProcedure.query(async () => {
    return await getAllTeamMembers();
  }),

  // Admin - get team member by ID
  getById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await getTeamMemberById(input.id);
    }),

  // Admin - create new team member
  create: adminProcedure
    .input(
      z.object({
        name: z.string().min(1),
        position: z.string().min(1),
        bio: z.string().optional(),
        photoUrl: z.string().optional(),
        experience: z.string().optional(),
        metaBlueprintCertified: z.number().min(0).max(1).default(0),
        googleAdsCertified: z.number().min(0).max(1).default(0),
        tiktokCertified: z.number().min(0).max(1).default(0),
        linkedinUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        telegramUrl: z.string().optional(),
        orderIndex: z.number().default(0),
        isActive: z.number().min(0).max(1).default(1),
      })
    )
    .mutation(async ({ input }) => {
      return await createTeamMember(input);
    }),

  // Admin - update team member
  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1),
        position: z.string().min(1),
        bio: z.string().optional(),
        photoUrl: z.string().optional(),
        experience: z.string().optional(),
        metaBlueprintCertified: z.number().min(0).max(1),
        googleAdsCertified: z.number().min(0).max(1),
        tiktokCertified: z.number().min(0).max(1),
        linkedinUrl: z.string().optional(),
        facebookUrl: z.string().optional(),
        instagramUrl: z.string().optional(),
        telegramUrl: z.string().optional(),
        orderIndex: z.number(),
        isActive: z.number().min(0).max(1),
      })
    )
    .mutation(async ({ input }) => {
      return await updateTeamMember(input.id, input);
    }),

  // Admin - delete team member
  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return await deleteTeamMember(input.id);
    }),

  // Admin - update team member order (for drag-and-drop)
  updateOrder: adminProcedure
    .input(
      z.object({
        updates: z.array(
          z.object({
            id: z.number(),
            orderIndex: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input }) => {
      return await updateTeamMemberOrder(input.updates);
    }),
});
