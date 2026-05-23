import mongoose, { Schema } from "mongoose";

const PayoutRequestSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "approved", "paid", "rejected"],
      default: "pending",
      index: true,
    },
    sellerNote: { type: String, default: "", trim: true, maxlength: 500 },
    adminNote: { type: String, default: "", trim: true, maxlength: 500 },
    processedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const PayoutRequest =
  mongoose.models.PayoutRequest || mongoose.model("PayoutRequest", PayoutRequestSchema);
export default PayoutRequest;
