import mongoose from "mongoose";

export interface IThumbnail extends mongoose.Document {
  userId: string;
  title: string;
  description?: string;
  style:
    | "Bold & Graphic"
    | "Minimalist"
    | "Photorealistic"
    | "Illustrated"
    | "Tech/Futuristic";
  aspectRatio?: "16:9" | "9:16" | "1:1";
  color_schema?:
    | "vibrant"
    | "sunset"
    | "forest"
    | "neon"
    | "purple"
    | "monochrome"
    | "ocean"
    | "pastel";
  text_overlay?: boolean;
  image_url?: string;
  prompt_used?: string;
  user_prompt?: string;
  isGenerating?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const thumbnailSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    style: {
      type: String,
      required: true,
      enum: [
        "Bold & Graphic",
        "Minimalist",
        "Photorealistic",
        "Illustrated",
        "Tech/Futuristic",
      ],
    },
    aspectRatio: {
      type: String,
      required: false,
      enum: ["16:9", "9:16", "1:1"],
      default: "16:9",
    },
    color_schema: {
      type: String,
      required: false,
      enum: [
        "vibrant",
        "sunset",
        "forest",
        "neon",
        "purple",
        "monochrome",
        "ocean",
        "pastel",
      ],
    },
    text_overlay: {
      type: Boolean,
      default: false,
    },
    image_url: {
      type: String,
      required: false,
      default: "",
    },
    prompt_used: {
      type: String,
    },
    user_prompt: {
      type: String,
      required: true,
    },
    isGenerating: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Thumbnail =
  mongoose.models.Thumbnail || mongoose.model("Thumbnail", thumbnailSchema);

export default Thumbnail;
