import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import OrdersAdminClient, { type AdminOrderItem, type AdminOrderRow } from "./OrdersAdminClient";

export const metadata: Metadata = { title: "Orders — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await connectDB();
  const raw = await Order.find({}).sort({ createdAt: -1 }).lean();

  // Collect all product IDs across all orders
  const allProductIds = [
    ...new Set(
      (raw as Record<string, unknown>[]).flatMap((o) =>
        (Array.isArray(o.items) ? o.items : []).map(
          (i: Record<string, unknown>) => String(i.productId || "")
        ).filter(Boolean)
      )
    ),
  ];

  // Map productId → sellerId
  const products = allProductIds.length
    ? await Product.find({ _id: { $in: allProductIds } }).select("_id sellerId").lean() as { _id: unknown; sellerId?: unknown }[]
    : [];
  const productSellerMap = new Map<string, string>();
  for (const p of products) {
    if (p.sellerId) productSellerMap.set(String(p._id), String(p.sellerId));
  }

  // Map sellerId → seller name + seller code
  const sellerIds = [...new Set([...productSellerMap.values()])];
  const sellers = sellerIds.length
    ? await User.find({ _id: { $in: sellerIds } }).select("_id name sellerCode").lean() as { _id: unknown; name?: string; sellerCode?: string }[]
    : [];

  // Backfill: assign sellerCode to any seller that is missing one
  for (const s of sellers) {
    if (!s.sellerCode) {
      const count = await User.countDocuments({ sellerCode: { $exists: true, $nin: [null, ""] } });
      const code = `IFI-S-${String(count + 1).padStart(4, "0")}`;
      await User.findByIdAndUpdate(s._id, { $set: { sellerCode: code } });
      s.sellerCode = code;
    }
  }

  const sellerNameMap = new Map<string, string>();
  const sellerCodeMap = new Map<string, string>();
  for (const s of sellers) {
    sellerNameMap.set(String(s._id), String(s.name || "Seller"));
    if (s.sellerCode) sellerCodeMap.set(String(s._id), s.sellerCode);
  }

  const orders: AdminOrderRow[] = (raw as Record<string, unknown>[]).map((o) => ({
    _id: String(o._id),
    orderNumber: String(o.orderNumber),
    customer: o.customer as AdminOrderRow["customer"],
    items: (Array.isArray(o.items) ? o.items : []).map((i: Record<string, unknown>) => {
      const pid = String(i.productId || "");
      const sid = productSellerMap.get(pid);
      return {
        ...(i as AdminOrderItem),
        sellerName: sid ? sellerNameMap.get(sid) : undefined,
        sellerCode: sid ? sellerCodeMap.get(sid) : undefined,
      };
    }) as AdminOrderItem[],
    subtotal: Number(o.subtotal ?? 0),
    discountAmount: Number(o.discountAmount ?? 0),
    totalAmount: Number(o.totalAmount || 0),
    couponCode: String(o.couponCode || ""),
    paymentMethod: String(o.paymentMethod || ""),
    paymentTransactionId: String(o.paymentTransactionId || ""),
    paymentScreenshotUrl: String(o.paymentScreenshotUrl || ""),
    paymentStatus: String(o.paymentStatus || "pending"),
    orderStatus: String(o.orderStatus || "pending"),
    createdAt: String(o.createdAt),
  }));

  return (
    <div>
      <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-6">Orders</h1>
      {orders.length === 0 ? (
        <p className="text-slate-400 text-sm">No orders yet.</p>
      ) : (
        <OrdersAdminClient orders={orders} />
      )}
    </div>
  );
}
