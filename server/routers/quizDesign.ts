import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizDesignSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "../storage";

export const quizDesignRouter = router({
  // Get design settings for a quiz
  getByQuizId: protectedProcedure
    .input(z.object({
      quizId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const settings = await db.select()
        .from(quizDesignSettings)
        .where(eq(quizDesignSettings.quizId, input.quizId))
        .limit(1);
      
      return settings[0] || null;
    }),

  // Save or update design settings
  save: protectedProcedure
    .input(z.object({
      quizId: z.number(),
      layoutType: z.enum(["center", "split", "background"]),
      backgroundImage: z.string().optional(),
      logoImage: z.string().optional(),
      primaryColor: z.string(),
      accentColor: z.string(),
      fontFamily: z.string(),
      titleText: z.string().optional(),
      subtitleText: z.string().optional(),
      buttonText: z.string().optional(),
      bonusText: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      
      // Check if settings already exist
      const existing = await db.select()
        .from(quizDesignSettings)
        .where(eq(quizDesignSettings.quizId, input.quizId))
        .limit(1);

      if (existing.length > 0) {
        // Update existing settings
        await db.update(quizDesignSettings)
          .set({
            layoutType: input.layoutType,
            backgroundImage: input.backgroundImage,
            logoImage: input.logoImage,
            primaryColor: input.primaryColor,
            accentColor: input.accentColor,
            fontFamily: input.fontFamily,
            titleText: input.titleText,
            subtitleText: input.subtitleText,
            buttonText: input.buttonText,
            bonusText: input.bonusText,
            updatedAt: new Date(),
          })
          .where(eq(quizDesignSettings.quizId, input.quizId));
      } else {
        // Insert new settings
        await db.insert(quizDesignSettings).values({
          quizId: input.quizId,
          layoutType: input.layoutType,
          backgroundImage: input.backgroundImage,
          logoImage: input.logoImage,
          primaryColor: input.primaryColor,
          accentColor: input.accentColor,
          fontFamily: input.fontFamily,
          titleText: input.titleText,
          subtitleText: input.subtitleText,
          buttonText: input.buttonText,
          bonusText: input.bonusText,
        });
      }

      return { success: true };
    }),

  // Upload image to S3
  uploadImage: protectedProcedure
    .input(z.object({
      quizId: z.number(),
      imageType: z.enum(["background", "logo"]),
      imageData: z.string(), // Base64 encoded image
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Decode base64 image
      const base64Data = input.imageData.replace(/^data:image\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Generate unique filename
      const timestamp = Date.now();
      const extension = input.mimeType.split("/")[1];
      const fileKey = `quiz-${input.quizId}/${input.imageType}-${timestamp}.${extension}`;

      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      return { url };
    }),

  // Delete design settings
  delete: protectedProcedure
    .input(z.object({
      quizId: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      await db.delete(quizDesignSettings)
        .where(eq(quizDesignSettings.quizId, input.quizId));

      return { success: true };
    }),
});
