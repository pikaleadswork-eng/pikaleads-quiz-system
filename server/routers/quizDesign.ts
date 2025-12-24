import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { quizDesignSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { storagePut } from "../storage";

export const quizDesignRouter = router({
  // Get quiz ID by slug
  getQuizIdBySlug: publicProcedure
    .input(z.object({
      slug: z.string(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const { quizzes } = await import("../../drizzle/schema");
      const quiz = await db.select()
        .from(quizzes)
        .where(eq(quizzes.slug, input.slug))
        .limit(1);
      
      return quiz[0]?.id || null;
    }),

  // Get design settings for a quiz (public for quiz display)
  getByQuizId: publicProcedure
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
      backgroundGradient: z.string().optional().nullable(),
      alignment: z.enum(["left", "center", "right"]).optional(),
      logoImage: z.string().optional(),
      primaryColor: z.string(),
      accentColor: z.string(),
      fontFamily: z.string(),
      titleText: z.string().optional(),
      subtitleText: z.string().optional(),
      buttonText: z.string().optional(),
      bonusText: z.string().optional(),
      bonusEnabled: z.boolean().optional(),
      companyName: z.string().optional(),
      phoneNumber: z.string().optional(),
      // Contact form settings
      contactFormTitle: z.string().optional(),
      contactFormSubtitle: z.string().optional(),
      contactFormFields: z.string().optional(),
      // Thank you page settings
      thankYouTitle: z.string().optional(),
      thankYouSubtitle: z.string().optional(),
      thankYouButtonText: z.string().optional(),
      thankYouButtonUrl: z.string().optional(),
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
            backgroundGradient: input.backgroundGradient,
            alignment: input.alignment,
            logoImage: input.logoImage,
            primaryColor: input.primaryColor,
            accentColor: input.accentColor,
            fontFamily: input.fontFamily,
            titleText: input.titleText,
            subtitleText: input.subtitleText,
            buttonText: input.buttonText,
            bonusText: input.bonusText,
            bonusEnabled: input.bonusEnabled,
            companyName: input.companyName,
            phoneNumber: input.phoneNumber,
            contactFormTitle: input.contactFormTitle,
            contactFormSubtitle: input.contactFormSubtitle,
            contactFormFields: input.contactFormFields,
            thankYouTitle: input.thankYouTitle,
            thankYouSubtitle: input.thankYouSubtitle,
            thankYouButtonText: input.thankYouButtonText,
            thankYouButtonUrl: input.thankYouButtonUrl,
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
          backgroundGradient: input.backgroundGradient,
          alignment: input.alignment || "center",
          logoImage: input.logoImage,
          primaryColor: input.primaryColor,
          accentColor: input.accentColor,
          fontFamily: input.fontFamily,
          titleText: input.titleText,
          subtitleText: input.subtitleText,
          buttonText: input.buttonText,
          bonusText: input.bonusText,
          bonusEnabled: input.bonusEnabled || false,
          companyName: input.companyName,
          phoneNumber: input.phoneNumber,
          contactFormTitle: input.contactFormTitle,
          contactFormSubtitle: input.contactFormSubtitle,
          contactFormFields: input.contactFormFields,
          thankYouTitle: input.thankYouTitle,
          thankYouSubtitle: input.thankYouSubtitle,
          thankYouButtonText: input.thankYouButtonText,
          thankYouButtonUrl: input.thankYouButtonUrl,
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

  // Save quiz questions
  saveQuestions: protectedProcedure
    .input(z.object({
      quizId: z.number(),
      questions: z.array(z.object({
        id: z.string(),
        question: z.string(),
        type: z.enum(["single", "multiple", "text", "slider", "rating", "date", "file", "emoji", "dropdown", "scale", "matrix", "ranking"]),
        options: z.array(z.object({
          text: z.string(),
          imageUrl: z.string().optional(),
        })),
        required: z.boolean().optional(),
        min: z.number().optional(),
        max: z.number().optional(),
        step: z.number().optional(),
        maxFiles: z.number().optional(),
        allowedFileTypes: z.array(z.string()).optional(),
        rows: z.array(z.string()).optional(),
        columns: z.array(z.string()).optional(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const { quizQuestions } = await import("../../drizzle/schema");
      
      // Delete existing questions for this quiz
      await db.delete(quizQuestions)
        .where(eq(quizQuestions.quizId, input.quizId));
      
      // Insert new questions
      for (let i = 0; i < input.questions.length; i++) {
        const q = input.questions[i];
        
        // Map frontend type to database enum
        const typeMapping: Record<string, string> = {
          single: "text_options",
          multiple: "text_options",
          text: "custom_input",
          slider: "slider",
          rating: "rating",
          date: "date",
          file: "file_upload",
          emoji: "emoji",
          dropdown: "dropdown",
          scale: "slider",
          matrix: "question_group",
          ranking: "text_options",
        };
        
        await db.insert(quizQuestions).values({
          quizId: input.quizId,
          questionText: q.question,
          questionType: typeMapping[q.type || "single"] as any,
          answerOptions: JSON.stringify(q.options),
          orderIndex: i,
          isRequired: q.required ?? true,
          settings: JSON.stringify({
            type: q.type,
            min: q.min,
            max: q.max,
            step: q.step,
            maxFiles: q.maxFiles,
            allowedFileTypes: q.allowedFileTypes,
            rows: q.rows,
            columns: q.columns,
          }),
        });
      }
      
      return { success: true };
    }),

  // Load quiz questions (public for quiz display)
  getQuestions: publicProcedure
    .input(z.object({
      quizId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database connection failed");
      const { quizQuestions } = await import("../../drizzle/schema");
      
      const questions = await db.select()
        .from(quizQuestions)
        .where(eq(quizQuestions.quizId, input.quizId))
        .orderBy(quizQuestions.orderIndex);
      
      return questions.map(q => {
        const settings = q.settings ? JSON.parse(q.settings) : {};
        return {
          id: `question-${q.id}`,
          question: q.questionText,
          type: (settings.type || "single") as "single" | "multiple" | "text" | "slider" | "rating" | "date" | "file" | "emoji" | "dropdown" | "scale" | "matrix" | "ranking",
          options: q.answerOptions ? JSON.parse(q.answerOptions).map((opt: any) => {
            // Handle both old format (object with uk/ru/en keys) and new format (object with text property)
            if (typeof opt === 'object' && !opt.text) {
              // Old format: {uk: "...", ru: "...", en: "..."} - keep as multilingual object
              return { text: opt, imageUrl: undefined };
            }
            // New format: {text: "...", imageUrl: "..."} or {text: {uk:..., ru:...}, imageUrl: "..."}
            return opt;
          }) : [],
          required: q.isRequired,
          min: settings.min,
          max: settings.max,
          step: settings.step,
          maxFiles: settings.maxFiles,
          allowedFileTypes: settings.allowedFileTypes,
          rows: settings.rows,
          columns: settings.columns,
        };
      });
    }),
});
