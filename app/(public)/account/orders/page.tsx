import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { formatPkr } from "@/lib/formatCurrency";

export const dynamic = "force-dynamic";

export default async function AccountOrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/account/orders");

  await connectDB();
  const email = session.email.toLowerCase();
  const orders = await Order.find({
    $or: [{ userId: session.sub }, { "customer.email": email }],
  })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900">My orders</h1>
        <p className="text-zinc-500 text-sm mt-1">Orders placed while signed in or using your email</p>
      </div>

      {orders.length === 0 ? (
        <p className="text-zinc-500 text-sm">
          No orders yet.{" "}
          <Link href="/shop" className="text-zinc-800 underline hover:text-zinc-950">
            Browse the shop
          </Link>
        </p>
      ) : (
        <ul className="space-y-4">
          {(orders as Record<string, unknown>[]).map((o) => (
            <li
              key={String(o._id)}
              className="border border-zinc-200 bg-white rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-sm"
            >
              <div>
                <p className="text-zinc-900 font-semibold">{String(o.orderNumber)}</p>
                <p className="text-zinc-500 text-xs mt-1">
                  {o.createdAt ? new Date(String(o.createdAt)).toLocaleString() : ""}
                </p>
                <p className="text-zinc-500 text-xs mt-1 capitalize">
                  Status: {String(o.orderStatus || "")} · Payment: {String(o.paymentStatus || "")}
                </p>
              </div>
              <p className="text-lg font-black text-zinc-900 tabular-nums">
                {formatPkr(Number(o.totalAmount || 0))}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
