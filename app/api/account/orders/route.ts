import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import { requireSession } from "@/lib/auth/apiAuth";

export async function GET() {
  try {
    const gate = await requireSession();
    if (!gate.ok) return gate.response;

    await connectDB();
    const email = gate.session.email.toLowerCase();
    const orders = await Order.find({
      $or: [{ userId: gate.session.sub }, { "customer.email": email }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const serialized = orders.map((o: Record<string, unknown>) => ({
      ...o,
      _id: String(o._id),
      userId: o.userId ? String(o.userId) : null,
      createdAt: String(o.createdAt),
      updatedAt: String(o.updatedAt),
    }));

    return NextResponse.json({ orders: serialized });
  } catch (e) {
    console.error("account orders GET:", e);
    return NextResponse.json({ error: "Failed to load orders." }, { status: 500 });
  }
}
