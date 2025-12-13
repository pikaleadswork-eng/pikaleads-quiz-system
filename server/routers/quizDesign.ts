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
      layoutType: z.enum(["standard", "background"]),
      backgroundImage: z.string().optional().nullable(),
      backgroundVideo: z.string().optional().nullable(),
      alignment: z.enum(["left", "center", "right"]).optional(),
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
            backgroundVideo: input.backgroundVideo,
            alignment: input.alignment,
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
          backgroundVideo: input.backgroundVideo,
          alignment: input.alignment || "center",
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

  // Generate AI background image
  generateBackground: protectedProcedure
    .input(z.object({
      niche: z.string(),
      style: z.enum(["modern", "minimalist", "professional", "vibrant"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { generateImage } = await import("../_core/imageGeneration");

      // Create prompt based on niche and style
      const styleDescriptions = {
        modern: "modern, sleek, contemporary design",
        minimalist: "minimalist, clean, simple aesthetic",
        professional: "professional, corporate, business-like",
        vibrant: "vibrant, colorful, energetic",
      };

      const style = input.style || "professional";
      const styleDesc = styleDescriptions[style];

      const nichePrompts: Record<string, string> = {
        furniture: `${styleDesc} furniture showroom background, elegant interior design, high-end furniture display`,
        renovation: `${styleDesc} home renovation background, construction and interior design, modern architecture`,
        ecommerce: `${styleDesc} e-commerce background, online shopping aesthetic, product showcase`,
        services: `${styleDesc} professional services background, business consulting aesthetic`,
        realestate: `${styleDesc} real estate background, luxury property showcase, modern architecture`,
      };

      const prompt = nichePrompts[input.niche] || `${styleDesc} business background for ${input.niche}`;

      try {
        const result = await generateImage({ prompt });
        if (!result || !result.url) {
          throw new Error("Failed to generate image: no URL returned");
        }

        // Upload generated image to S3 for permanent storage
        const response = await fetch(result.url);
        const buffer = Buffer.from(await response.arrayBuffer());
        const timestamp = Date.now();
        const fileKey = `quiz-backgrounds/ai-generated-${timestamp}.png`;
        const { url: s3Url } = await storagePut(fileKey, buffer, "image/png");

        return { url: s3Url, fileKey };
      } catch (error: any) {
        throw new Error(`Failed to generate background: ${error.message}`);
      }
    }),

  // Upload logo to S3
  uploadLogo: protectedProcedure
    .input(z.object({
      fileData: z.string(), // Base64 encoded file
      fileName: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Extract base64 data
      const base64Data = input.fileData.split(",")[1] || input.fileData.replace(/^data:\w+\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Generate unique file key
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const extension = input.fileName.split(".").pop();
      const fileKey = `quiz-logos/${timestamp}-${randomSuffix}.${extension}`;

      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      return { url, fileKey };
    }),

  // Upload background image or video to S3
  uploadBackground: protectedProcedure
    .input(z.object({
      fileData: z.string(), // Base64 encoded file
      fileName: z.string(),
      mimeType: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Extract base64 data
      const base64Data = input.fileData.split(",")[1] || input.fileData.replace(/^data:\w+\/\w+;base64,/, "");
      const buffer = Buffer.from(base64Data, "base64");

      // Generate unique file key
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const extension = input.fileName.split(".").pop();
      const fileKey = `quiz-backgrounds/${timestamp}-${randomSuffix}.${extension}`;

      // Upload to S3
      const { url } = await storagePut(fileKey, buffer, input.mimeType);

      return { url, fileKey };
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
