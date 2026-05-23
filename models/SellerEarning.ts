import mongoose, { Schema } from "mongoose";

const SellerEarningSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderNumber: { type: String, required: true, trim: true },
    grossAmount: { type: Number, required: true, min: 0 },
    commissionRate: { type: Number, required: true, min: 0, max: 1, default: 0.1 },
    commissionAmount: { type: Number, required: true, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["available", "reserved", "paid"],
      default: "available",
      index: true,
    },
    payoutRequestId: { type: Schema.Types.ObjectId, ref: "PayoutRequest", default: null },
  },
  { timestamps: true }
);

SellerEarningSchema.index({ sellerId: 1, orderId: 1 }, { unique: true });

const SellerEarning =
  mongoose.models.SellerEarning || mongoose.model("SellerEarning", SellerEarningSchema);
export default SellerEarning;
