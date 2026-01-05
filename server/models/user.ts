import mongoose, { Schema, model, Document } from "mongoose";

export type SubscriptionTier = "basic" | "pro" | "enterprise";

const TIER_LIMITS: Record<SubscriptionTier, number> = {
  basic: 10,
  pro: 50,
  enterprise: 100,
};

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  tier: SubscriptionTier;
  getRequestLimit(): number;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    tier: {
      type: String,
      enum: ["basic", "pro", "enterprise"],
      default: "basic",
    },
  },
  { timestamps: true }
);

UserSchema.methods.getRequestLimit = function (): number {
  return TIER_LIMITS[this.tier as SubscriptionTier];
};

const User = mongoose.models.User || model<IUser>("User", UserSchema);

export default User;
