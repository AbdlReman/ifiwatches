import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { isAdmin } from "@/lib/isAdmin";
import Product from "@/models/Product";
import SellerEarning from "@/models/SellerEarning";
import Order from "@/models/Order";

function periodStart(period: string): Date | null {
  if (period === "7d") return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  if (period === "30d") return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return null;
}

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sellerId = req.nextUrl.searchParams.get("sellerId");
    if (!sellerId || !mongoose.isValidObjectId(sellerId)) {
      return NextResponse.json({ error: "Invalid sellerId" }, { status: 400 });
    }

    const period = req.nextUrl.searchParams.get("period") ?? "lifetime";
    const from = periodStart(period);

    await connectDB();

    const sellerObjId = new mongoose.Types.ObjectId(sellerId);

    const earningsFilter: Record<string, unknown> = { sellerId: sellerObjId };
    if (from) earningsFilter.createdAt = { $gte: from };

    const [products, earnings, sellerProductIds] = await Promise.all([
      Product.find({ sellerId }).select("name soldCount stockQuantity price approvalStatus isActive").lean(),
      SellerEarning.find(earningsFilter)
        .sort({ createdAt: -1 })
        .lean()
        .then(async (rows) => {
          // Exclude earnings for cancelled orders
          const orderIds = rows.map((r) => (r as Record<string, unknown>).orderId);
          const cancelledIds = await Order.distinct("_id", {
            _id: { $in: orderIds },
            orderStatus: "cancelled",
          });
          const cancelledSet = new Set(cancelledIds.map(String));
          return rows.filter((r) => !cancelledSet.has(String((r as Record<string, unknown>).orderId)));
        }),
      Product.find({ sellerId }).distinct("_id"),
    ]);

    const ordersFilter: Record<string, unknown> = {
      "items.productId": { $in: sellerProductIds.map(String) },
    };
    if (from) ordersFilter.createdAt = { $gte: from };

    const totalOrdersRaw = sellerProductIds.length
      ? await Order.countDocuments(ordersFilter)
      : 0;

    const totalProducts = products.length;
    const activeProducts = products.filter(
      (p) =>
        (p as Record<string, unknown>).isActive !== false &&
        (p as Record<string, unknown>).approvalStatus === "approved"
    ).length;
    const totalSold = products.reduce(
      (sum, p) => sum + Number((p as Record<string, unknown>).soldCount || 0),
      0
    );

    const totalRevenue = earnings.reduce((sum, e) => sum + Number((e as Record<string, unknown>).grossAmount || 0), 0);
    const totalCommission = earnings.reduce((sum, e) => sum + Number((e as Record<string, unknown>).commissionAmount || 0), 0);
    const totalNet = earnings.reduce((sum, e) => sum + Number((e as Record<string, unknown>).netAmount || 0), 0);

    const recentOrders = earnings.slice(0, 10).map((e) => {
      const rec = e as Record<string, unknown>;
      return {
        orderNumber: String(rec.orderNumber || ""),
        grossAmount: Number(rec.grossAmount || 0),
        commissionRate: Number(rec.commissionRate ?? 0),
        commissionAmount: Number(rec.commissionAmount || 0),
        netAmount: Number(rec.netAmount || 0),
        status: String(rec.status || ""),
        createdAt: String(rec.createdAt || ""),
      };
    });

    const topProducts = [...products]
      .sort(
        (a, b) =>
          Number((b as Record<string, unknown>).soldCount || 0) -
          Number((a as Record<string, unknown>).soldCount || 0)
      )
      .slice(0, 5)
      .map((p) => {
        const rec = p as Record<string, unknown>;
        return {
          name: String(rec.name || ""),
          soldCount: Number(rec.soldCount || 0),
          price: Number(rec.price || 0),
        };
      });

    return NextResponse.json({
      totalProducts,
      activeProducts,
      totalSold,
      totalOrders: totalOrdersRaw,
      completedOrders: earnings.length,
      totalRevenue,
      totalCommission,
      totalNet,
      recentOrders,
      topProducts,
    });
  } catch (error) {
    console.error("GET /api/admin/seller-stats error:", error);
    return NextResponse.json({ error: "Failed to fetch seller stats" }, { status: 500 });
  }
}
