import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireRoles } from "@/lib/auth/apiAuth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireRoles(["admin"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const decision = String(body.decision || "").toLowerCase();

    if (decision !== "approve" && decision !== "reject") {
      return NextResponse.json({ error: "decision must be approve or reject" }, { status: 400 });
    }

    const update: Record<string, unknown> = {
      approvalStatus: decision === "approve" ? "approved" : "rejected",
    };
    if (decision === "approve" && body.publish === true) {
      update.status = "Published";
      update.isActive = true;
      update.isHidden = false;
    } else if (decision === "reject") {
      update.status = "Draft";
      update.isActive = false;
    }

    const product = await Product.findByIdAndUpdate(id, { $set: update }, { new: true }).lean();
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const p = product as Record<string, unknown>;
    return NextResponse.json({
      product: {
        ...p,
        _id: String(p._id),
        sellerId: p.sellerId ? String(p.sellerId) : null,
      },
    });
  } catch (error) {
    console.error("PATCH approval:", error);
    return NextResponse.json({ error: "Failed to update approval" }, { status: 500 });
  }
}
