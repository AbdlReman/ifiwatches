import mongoose, { Schema, model, models } from "mongoose";

const HeroSchema = new Schema(
  {
    image: { type: String, default: "" },
    badgeText: { type: String, default: "Multi-vendor marketplace" },
    heading: { type: String, default: "One Product." },
    headingAccent: { type: String, default: "One Trusted Seller. Zero Confusion.." },
    subheading: {
      type: String,
      default:
        "IFI Lifestyle brings verified vendors together under one standard — premium watches, perfumes, eyewear, gadgets, and fashion with one seller per product.",
    },
    primaryBtnText: { type: String, default: "Explore marketplace" },
    primaryBtnHref: { type: String, default: "/shop" },
    secondaryBtnText: { type: String, default: "Become a seller" },
    secondaryBtnHref: { type: String, default: "/register" },
    pills: {
      type: [String],
      default: ["Verified vendors", "One seller per SKU", "Nationwide delivery"],
    },
  },
  { _id: false }
);

const HomePageContentSchema = new Schema(
  {
    saleImage: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    hero: { type: HeroSchema, default: () => ({}) },
  },
  { timestamps: true }
);

const HomePageContent =
  models.HomePageContent || model("HomePageContent", HomePageContentSchema);

export default HomePageContent;
