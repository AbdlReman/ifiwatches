import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import PayoutRequest from "@/models/PayoutRequest";
import SellerEarning from "@/models/SellerEarning";
import { requireRoles } from "@/lib/auth/apiAuth";

type Params = { params: Promise<{ id: string }> };

const VALID = ["approved", "paid", "rejected"] as const;

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireRoles(["admin"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const status = String(body.status || "").toLowerCase() as (typeof VALID)[number];
    const adminNote = String(body.adminNote || "").trim().slice(0, 500);

    if (!VALID.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const payout = await PayoutRequest.findById(id);
    if (!payout) {
      return NextResponse.json({ error: "Payout not found" }, { status: 404 });
    }
    if (payout.status !== "pending" && payout.status !== "approved") {
      return NextResponse.json({ error: "Payout already finalized" }, { status: 409 });
    }

    payout.status = status === "approved" ? "approved" : status;
    payout.adminNote = adminNote || payout.adminNote;
    if (status === "paid" || status === "rejected") {
      payout.processedAt = new Date();
    }
    await payout.save();

    if (status === "paid") {
      await SellerEarning.updateMany(
        { payoutRequestId: payout._id },
        { $set: { status: "paid" } }
      );
      payout.status = "paid";
      await payout.save();
    } else if (status === "rejected") {
      await SellerEarning.updateMany(
        { payoutRequestId: payout._id },
        { $set: { status: "available", payoutRequestId: null } }
      );
    }

    return NextResponse.json({
      payout: {
        _id: String(payout._id),
        status: payout.status,
        processedAt: payout.processedAt ? String(payout.processedAt) : null,
      },
    });
  } catch (error) {
    console.error("PATCH admin payout:", error);
    return NextResponse.json({ error: "Failed to update payout" }, { status: 500 });
  }
}
