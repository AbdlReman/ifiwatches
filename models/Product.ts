import mongoose, { Schema } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, trim: true, default: "" },
    category: { type: String, required: true, trim: true },
    categories: { type: [String], default: [] },
    subCategories: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 1000 },
    detail: { type: String, default: "" },
    sizes: { type: [String], default: [] },
    colors: { type: [String], default: [] },
    colorVariants: {
      type: [
        {
          color: { type: String, required: true, trim: true },
          images: { type: [String], default: [] },
        },
      ],
      default: [],
    },
    stockQuantity: { type: Number, required: true, min: 0, default: 0 },
    images: { type: [String], default: [] },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    metaTitle: { type: String, trim: true, maxlength: 70, default: "" },
    metaDescription: { type: String, trim: true, maxlength: 170, default: "" },
    popularityScore: { type: Number, min: 0, default: 0 },
    soldCount: { type: Number, min: 0, default: 0 },
    lastSoldAt: { type: Date, default: null },
    inStock: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    isHidden: { type: Boolean, default: false },
    isClearance: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false },
    /** Homepage “Featured drops”; admin-only. */
    isFeatured: { type: Boolean, default: false, index: true },
    /** Homepage “Our Best Sellers”; admin-only. */
    isBestSeller: { type: Boolean, default: false, index: true },
    status: { type: String, enum: ["Draft", "Published"], default: "Draft" },
    /** Seller listings require admin approval before they can be published. */
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
    },
    slug: { type: String, unique: true },
    /** Set for seller-owned listings; unset/legacy products are store/admin catalog. */
    sellerId: { type: Schema.Types.ObjectId, ref: "User", index: true, default: null },
  },
  { timestamps: true }
);

ProductSchema.pre("save", async function () {
  if (this.isModified("name") || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
});

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
