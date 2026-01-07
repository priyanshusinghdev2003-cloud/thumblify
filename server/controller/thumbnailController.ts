import { Request, Response } from "express";
import Thumbnail from "../models/Thumbnail.ts";
import { GenerationConfig, HarmCategory } from "@google/genai";
import { HarmBlockThreshold } from "@google/genai";
import ai from "../config/ai.ts";
import path from "node:path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

const stylePrompt = {
  "Bold & Graphic":
    "eye-catching, bold and graphic thumbnail design with oversized typography, thick high-contrast fonts, vibrant saturated colors, strong visual hierarchy, expressive facial reactions, exaggerated emotions, dramatic studio lighting, sharp shadows, punchy highlights, clean cut-out subject, dynamic composition, high contrast background, click-worthy YouTube-style layout, modern professional design, ultra-clear focus, attention-grabbing visuals",

  "Tech/Futuristic":
    "futuristic tech-inspired thumbnail with sleek modern design, neon blue and purple color palette, glowing UI elements, holographic effects, digital grids, cyberpunk lighting, high-tech atmosphere, clean minimal geometry, sharp edges, sci-fi aesthetics, cinematic lighting, advanced technology vibe, modern startup style, ultra-detailed, professional futuristic look",

  Minimalist:
    "minimalist thumbnail design with clean layout, simple composition, lots of negative space, limited color palette, soft neutral tones, subtle typography, balanced alignment, calm and elegant aesthetic, flat design elements, distraction-free visuals, modern minimal UI style, professional and refined appearance",

  Photorealistic:
    "highly photorealistic image with natural lighting, realistic skin texture, true-to-life colors, shallow depth of field, DSLR-quality sharpness, cinematic realism, authentic environment, natural shadows and highlights, ultra-high resolution, professional photography look, lifelike details, realistic proportions",

  Illustrated:
    "stylized illustrated artwork with hand-drawn or digital illustration style, bold outlines, smooth shading, vibrant colors, creative character design, playful and expressive visuals, flat or semi-flat illustration, modern vector art style, clean shapes, artistic and imaginative composition",
};

const colorSchemeDescriptions = {
  vibrant:
    "vibrant and energetic colors, high saturation, bold contrasts, eye-catching palette",
  sunset:
    "warm sunset tones, orange pink and purple hues, soft gradients, cinematic glow",
  forest:
    "natural green tones, earthy colors, calm and organic palette, fresh atmosphere",
  neon: "neon glow effects, electric blues and pinks, cyberpunk lighting, high contrast glow",
  purple:
    "purple-dominant color palette, magenta and violet tones, modern and stylish mood",
  monochrome:
    "black and white color scheme, high contrast, dramatic lighting, timeless aesthetic",
  ocean:
    "cool blue and teal tones, aquatic color palette, fresh and clean atmosphere",
  pastel:
    "soft pastel colors, low saturation, gentle tones, calm and friendly aesthetic",
};

export const generateThumbnail = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const {
      title,
      style,
      aspectRatio,
      color_schema,
      text_overlay,
      prompt: user_prompt,
    } = req.body;

    const thumbnail = await Thumbnail.create({
      title,
      style,
      aspectRatio,
      color_schema,
      text_overlay,
      prompt_used: user_prompt || "",
      user_prompt: user_prompt || "",
      userId,
      isGenerating: true,
    });

    const model = "gemini-3-pro-image-preview";
    const generationConfig: GenerationConfig = {
      maxOutputTokens: 32768,
      temperature: 1,
      topP: 0.95,
      responseModalities: ["IMAGE"],
      imageConfig: {
        aspectRatio: aspectRatio || "16:9",
        imageSize: "1k",
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.OFF,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.OFF,
        },
      ],
    };

    let prompt = `create a ${
      stylePrompt[style as keyof typeof stylePrompt]
    } for: ${title}`;
    if (color_schema) {
      prompt += ` Use a ${
        colorSchemeDescriptions[
          color_schema as keyof typeof colorSchemeDescriptions
        ]
      }`;
    }
    if (user_prompt) {
      prompt += ` Additional details : ${user_prompt}`;
    }
    prompt += `The thumbnail should be ${aspectRatio}, visually stunning, and designed to maximize click-through rate. Make it bold, professional, and impossible to ignore.`;
    // generate the image
    const response: any = await ai.models.generateContent({
      model,
      contents: [prompt],
      config: generationConfig,
    });
    // check response
    if (!response?.candidates?.[0]?.content?.parts) {
      return res.status(400).json({ message: "Image generation failed" });
    }
    const parts = response.candidates[0].content.parts;
    let finalBuffer: Buffer | null = null;
    for (const part of parts) {
      if (part.inlineData) {
        finalBuffer = Buffer.from(part.inlineData.data, "base64");
      }
    }
    const filename = `final-output-${Date.now()}.png`;
    const filePath = path.join("images", filename);

    //create the images directory if not exists
    fs.mkdirSync("images", { recursive: true });

    // write the image to the file
    fs.writeFileSync(filePath, finalBuffer!);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "image",
    });
    thumbnail.image_url = uploadResult.secure_url;
    thumbnail.isGenerating = false;
    await thumbnail.save();
    fs.unlinkSync(filePath);
    return res
      .status(200)
      .json({ message: "Image generated successfully", thumbnail });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};

export const deleteThumbnail = async (req: Request, res: Response) => {
  try {
    const { thumbnailId } = req.params;
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const thumbnail = await Thumbnail.findById({ _id: thumbnailId });
    if (!thumbnail) {
      return res.status(404).json({ message: "Thumbnail not found" });
    }
    if (thumbnail?.image_url) {
      const result = await cloudinary.uploader.destroy(thumbnail.image_url);
      if (result) {
        await thumbnail.remove();
        const updatedThumbnails = await Thumbnail.find({ userId });
        return res.status(200).json({
          message: "Thumbnail deleted successfully",
          updatedThumbnails,
        });
      }
    } else {
      await thumbnail.deleteOne();
      const updatedThumbnails = await Thumbnail.find({ userId });
      return res
        .status(200)
        .json({ message: "Thumbnail deleted successfully", updatedThumbnails });
    }

    return res.status(500).json({ message: "Failed to delete thumbnail" });
  } catch (error: any) {
    console.log(error);
    return res
      .status(500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
