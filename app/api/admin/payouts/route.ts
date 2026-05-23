import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PayoutRequest from "@/models/PayoutRequest";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth/apiAuth";

export async function GET() {
  try {
    const auth = await requireRoles(["admin"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const payouts = await PayoutRequest.find().sort({ createdAt: -1 }).limit(100).lean();
    const sellerIds = [...new Set(payouts.map((p) => String((p as { sellerId: unknown }).sellerId)))];
    const sellers = await User.find({ _id: { $in: sellerIds } })
      .select("name email")
      .lean();
    const sellerMap = new Map(
      sellers.map((s) => {
        const u = s as { _id: unknown; name?: string; email?: string };
        return [String(u._id), { name: u.name || "", email: u.email || "" }];
      })
    );

    return NextResponse.json({
      payouts: payouts.map((p: Record<string, unknown>) => ({
        ...p,
        _id: String(p._id),
        sellerId: String(p.sellerId),
        seller: sellerMap.get(String(p.sellerId)) || null,
        createdAt: String(p.createdAt),
        updatedAt: String(p.updatedAt),
        processedAt: p.processedAt ? String(p.processedAt) : null,
      })),
    });
  } catch (error) {
    console.error("GET admin payouts:", error);
    return NextResponse.json({ error: "Failed to fetch payouts" }, { status: 500 });
  }
}
