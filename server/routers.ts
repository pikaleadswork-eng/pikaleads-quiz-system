import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  quiz: router({
    submitLead: publicProcedure
      .input(
        z.object({
          quizName: z.string(),
          answers: z.string(),
          name: z.string(),
          phone: z.string(),
          telegram: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { createLead } = await import("./db");
        const { sendTelegramMessage, formatLeadMessage } = await import("./telegram");
        
        // Save to database
        await createLead({
          quizName: input.quizName,
          answers: input.answers,
          name: input.name,
          phone: input.phone,
          telegram: input.telegram || null,
        });
        
        // Send to Telegram
        const message = formatLeadMessage({
          quizName: input.quizName,
          answers: input.answers,
          name: input.name,
          phone: input.phone,
          telegram: input.telegram,
        });
        
        const telegramSent = await sendTelegramMessage(message);
        if (!telegramSent) {
          console.warn("[Quiz] Lead saved but Telegram notification failed");
        }
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
