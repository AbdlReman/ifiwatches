import mongoose, { Schema, model, models } from "mongoose";

const HomePageContentSchema = new Schema(
  {
    saleImage: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

const HomePageContent =
  models.HomePageContent || model("HomePageContent", HomePageContentSchema);

export default HomePageContent;
