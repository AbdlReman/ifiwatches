import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireRoles } from "@/lib/auth/apiAuth";
import { parseSlowDays, slowMovingFilter } from "@/lib/slowMoving";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireRoles(["admin"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const days = parseSlowDays(req.nextUrl.searchParams.get("days"));
    const products = await Product.find(slowMovingFilter(days))
      .sort({ lastSoldAt: 1, createdAt: 1 })
      .lean();

    const serialized = products.map((p: Record<string, unknown>) => ({
      ...p,
      _id: String(p._id),
      sellerId: p.sellerId ? String(p.sellerId) : null,
      lastSoldAt: p.lastSoldAt ? String(p.lastSoldAt) : null,
      createdAt: String(p.createdAt),
      updatedAt: String(p.updatedAt),
    }));

    return NextResponse.json({ days, products: serialized, count: serialized.length });
  } catch (error) {
    console.error("GET slow-moving:", error);
    return NextResponse.json({ error: "Failed to fetch slow-moving products" }, { status: 500 });
  }
}
