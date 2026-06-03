import mongoose, { Schema } from "mongoose";
import type { UserRole } from "@/lib/auth/jwt";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      default: "user",
      index: true,
    },
    phone: { type: String, trim: true, maxlength: 40 },
    address: { type: String, trim: true, maxlength: 240 },
    businessName: { type: String, trim: true, maxlength: 120 },
    businessCategory: { type: String, trim: true, maxlength: 120 },
    businessSummary: { type: String, trim: true, maxlength: 1000 },
    sellerApproved: { type: Boolean, default: true, index: true },
    sellerEnabled: { type: Boolean, default: true },
    assignedCategories: { type: [String], default: [] },
    commissionRate: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
