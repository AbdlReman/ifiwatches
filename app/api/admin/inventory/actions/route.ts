import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireRoles } from "@/lib/auth/apiAuth";

const ACTIONS = ["applyDiscount", "markClearance", "hide", "archive"] as const;

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireRoles(["admin"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const body = await req.json();
    const productId = String(body.productId || "").trim();
    const action = String(body.action || "") as (typeof ACTIONS)[number];

    if (!productId) {
      return NextResponse.json({ error: "Missing productId" }, { status: 400 });
    }
    if (!ACTIONS.includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const update: Record<string, unknown> = {};

    if (action === "applyDiscount") {
      const discount = Number(body.discount);
      if (Number.isNaN(discount) || discount < 0 || discount > 100) {
        return NextResponse.json({ error: "Discount must be 0–100" }, { status: 400 });
      }
      update.discount = discount;
    } else if (action === "markClearance") {
      update.isClearance = true;
      if (body.discount != null) {
        const discount = Number(body.discount);
        if (!Number.isNaN(discount) && discount >= 0 && discount <= 100) {
          update.discount = discount;
        }
      } else if (!body.keepDiscount) {
        update.discount = Math.max(20, Number(body.minDiscount || 20));
      }
    } else if (action === "hide") {
      update.isHidden = true;
      update.isActive = false;
    } else if (action === "archive") {
      update.isArchived = true;
      update.isActive = false;
      update.isHidden = true;
      update.status = "Draft";
    }

    const product = await Product.findByIdAndUpdate(productId, { $set: update }, { new: true }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const p = product as Record<string, unknown>;
    return NextResponse.json({
      product: {
        ...p,
        _id: String(p._id),
        sellerId: p.sellerId ? String(p.sellerId) : null,
        lastSoldAt: p.lastSoldAt ? String(p.lastSoldAt) : null,
      },
    });
  } catch (error) {
    console.error("PATCH inventory action:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}
