import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import OrdersAdminClient, { type AdminOrderRow, type AdminOrderItem } from "@/app/admin/orders/OrdersAdminClient";

export const metadata: Metadata = { title: "Orders — Seller" };
export const dynamic = "force-dynamic";

export default async function SellerOrdersPage() {
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const ids = await Product.find({ sellerId: session.sub }).distinct("_id");
  const strIds = ids.map(String);
  const raw =
    strIds.length === 0
      ? []
      : await Order.find({ "items.productId": { $in: strIds } }).sort({ createdAt: -1 }).lean();

  const orders: AdminOrderRow[] = (raw as Record<string, unknown>[]).map((o) => ({
    _id: String(o._id),
    orderNumber: String(o.orderNumber),
    customer: o.customer as AdminOrderRow["customer"],
    items: (Array.isArray(o.items) ? o.items : []) as AdminOrderItem[],
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
      <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">Orders</h1>
      <p className="text-slate-400 text-sm mb-6">
        Orders that include at least one of your products. Status changes are managed by the store admin.
      </p>
      {orders.length === 0 ? (
        <p className="text-slate-500 text-sm">No orders yet.</p>
      ) : (
        <OrdersAdminClient orders={orders} sellerMode={true} />
      )}
    </div>
  );
}
