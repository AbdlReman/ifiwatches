import mongoose from "mongoose";
import Product from "@/models/Product";
import User from "@/models/User";
import SellerEarning from "@/models/SellerEarning";
import { attributedOrderTotal, sellerProductIdSet } from "@/lib/sellerAnalytics";

type OrderItem = { productId?: string; price?: number; quantity?: number };

/** Create per-seller earnings when an order is marked completed (idempotent per seller+order). */
export async function recordSellerCommissionsForOrder(order: {
  _id: unknown;
  orderNumber?: string;
  items?: OrderItem[];
}) {
  const orderId = String(order._id);
  const orderNumber = String(order.orderNumber || "");
  const items = order.items || [];
  if (items.length === 0) return;

  const productIds = [
    ...new Set(items.map((i) => String(i.productId || "").trim()).filter(Boolean)),
  ];
  const products = await Product.find({ _id: { $in: productIds } })
    .select("_id sellerId")
    .lean();
  const sellerByProduct = new Map<string, string>();
  for (const p of products) {
    const rec = p as { _id: unknown; sellerId?: unknown };
    if (rec.sellerId) {
      sellerByProduct.set(String(rec._id), String(rec.sellerId));
    }
  }

  const sellerIds = [...new Set(sellerByProduct.values())];
  if (sellerIds.length === 0) return;

  // Fetch each seller's individual commission rate (stored as 0–100 in User model)
  const sellerUsers = await User.find({ _id: { $in: sellerIds } })
    .select("_id commissionRate")
    .lean() as { _id: unknown; commissionRate?: number }[];
  const sellerRateMap = new Map<string, number>();
  for (const u of sellerUsers) {
    // commissionRate in User is 0–100 (percent); convert to decimal 0–1
    const rateDecimal = Math.max(0, Math.min(100, Number(u.commissionRate ?? 0))) / 100;
    sellerRateMap.set(String(u._id), rateDecimal);
  }

  for (const sellerId of sellerIds) {
    const sellerProductIds = productIds.filter((pid) => sellerByProduct.get(pid) === sellerId);
    const idSet = sellerProductIdSet(sellerProductIds);
    const gross = attributedOrderTotal({ items }, idSet);
    if (gross <= 0) continue;

    const existing = await SellerEarning.findOne({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      orderId: new mongoose.Types.ObjectId(orderId),
    }).lean();
    if (existing) continue;

    const rate = sellerRateMap.get(sellerId) ?? 0;
    const commissionAmount = Math.round(gross * rate * 100) / 100;
    const netAmount = Math.round((gross - commissionAmount) * 100) / 100;

    await SellerEarning.create({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      orderId: new mongoose.Types.ObjectId(orderId),
      orderNumber,
      grossAmount: gross,
      commissionRate: rate,
      commissionAmount,
      netAmount,
      status: "available",
    });
  }
}
