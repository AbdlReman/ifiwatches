import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { formatPkr } from "@/lib/formatCurrency";
import { attributedOrderTotal, sellerProductIdSet } from "@/lib/sellerAnalytics";
import SalesChart from "@/app/admin/_components/SalesChart";

export const dynamic = "force-dynamic";

export default async function SellerDashboardPage() {
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const productDocs = await Product.find({ sellerId: session.sub }).sort({ createdAt: -1 }).lean();
  const productIds = productDocs.map((p) => String((p as { _id: unknown })._id));
  const idSet = sellerProductIdSet(productIds);

  const ordersRaw =
    productIds.length === 0
      ? []
      : await Order.find({ "items.productId": { $in: productIds } })
          .sort({ createdAt: -1 })
          .lean();

  const orders = ordersRaw as Record<string, unknown>[];
  let attributedRevenue = 0;
  const chartPoints: { createdAt: string; totalAmount: number }[] = [];

  for (const o of orders) {
    const amt = attributedOrderTotal(
      { items: (o.items as { productId?: string; price?: number; quantity?: number }[]) || [] },
      idSet
    );
    attributedRevenue += amt;
    chartPoints.push({
      createdAt: String(o.createdAt),
      totalAmount: amt,
    });
  }

  const unitsSold = productDocs.reduce(
    (sum, p) => sum + Number((p as { soldCount?: number }).soldCount || 0),
    0
  );
  const pendingOrders = orders.filter((o) => String(o.orderStatus) === "pending").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Seller dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Products, orders, and sales for your listings</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "My products", value: productDocs.length },
          { label: "Units sold", value: unitsSold },
          { label: "Orders (any)", value: orders.length },
          { label: "Attributed sales", value: formatPkr(attributedRevenue) },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-800 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <SalesChart orders={chartPoints} />

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Recent orders</h2>
          <p className="text-xs text-slate-500 mb-3">{pendingOrders} pending (all or partial lines)</p>
          <div className="space-y-3">
            {orders.slice(0, 6).map((o) => (
              <div key={String(o._id)} className="flex items-center justify-between border-b border-slate-700 pb-2">
                <div>
                  <p className="text-slate-100 text-sm">{String((o.customer as { name?: string })?.name || "Customer")}</p>
                  <p className="text-xs text-slate-500">{String(o.orderNumber || "")}</p>
                </div>
                <p className="text-sm font-semibold text-emerald-300 tabular-nums">
                  {formatPkr(
                    attributedOrderTotal(
                      {
                        items:
                          (o.items as { productId?: string; price?: number; quantity?: number }[]) || [],
                      },
                      idSet
                    )
                  )}
                </p>
              </div>
            ))}
            {orders.length === 0 && <p className="text-sm text-slate-500">No orders with your products yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
