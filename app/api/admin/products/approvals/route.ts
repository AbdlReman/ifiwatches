import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import { requireRoles } from "@/lib/auth/apiAuth";

export async function GET() {
  try {
    const auth = await requireRoles(["admin"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const products = await Product.find({
      sellerId: { $ne: null },
      approvalStatus: "pending",
    })
      .sort({ createdAt: -1 })
      .lean();

    const sellerIds = [
      ...new Set(
        products
          .map((p) => (p as { sellerId?: unknown }).sellerId)
          .filter(Boolean)
          .map(String)
      ),
    ];
    const sellers = await User.find({ _id: { $in: sellerIds } })
      .select("name email")
      .lean();
    const sellerMap = new Map(
      sellers.map((s) => {
        const u = s as { _id: unknown; name?: string; email?: string };
        return [String(u._id), { name: u.name || "", email: u.email || "" }];
      })
    );

    const serialized = products.map((p: Record<string, unknown>) => ({
      ...p,
      _id: String(p._id),
      sellerId: p.sellerId ? String(p.sellerId) : null,
      seller: p.sellerId ? sellerMap.get(String(p.sellerId)) || null : null,
      createdAt: String(p.createdAt),
      updatedAt: String(p.updatedAt),
    }));

    return NextResponse.json({ products: serialized, count: serialized.length });
  } catch (error) {
    console.error("GET approvals:", error);
    return NextResponse.json({ error: "Failed to fetch pending approvals" }, { status: 500 });
  }
}
