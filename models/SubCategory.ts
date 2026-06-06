import mongoose, { Schema } from "mongoose";

const SubCategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubCategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubCategory =
  mongoose.models.SubCategory || mongoose.model("SubCategory", SubCategorySchema);
export default SubCategory;
