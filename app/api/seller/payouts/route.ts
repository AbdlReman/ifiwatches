import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import PayoutRequest from "@/models/PayoutRequest";
import SellerEarning from "@/models/SellerEarning";
import { requireRoles } from "@/lib/auth/apiAuth";

async function availableBalance(sellerId: string) {
  const rows = await SellerEarning.aggregate([
    { $match: { sellerId: new mongoose.Types.ObjectId(sellerId), status: "available" } },
    { $group: { _id: null, total: { $sum: "$netAmount" } } },
  ]);
  return Math.round(Number(rows[0]?.total || 0) * 100) / 100;
}

export async function GET() {
  try {
    const auth = await requireRoles(["seller"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const sellerId = auth.session.sub;
    const [balance, payouts, earnings] = await Promise.all([
      availableBalance(sellerId),
      PayoutRequest.find({ sellerId }).sort({ createdAt: -1 }).limit(50).lean(),
      SellerEarning.find({ sellerId }).sort({ createdAt: -1 }).limit(30).lean(),
    ]);

    return NextResponse.json({
      availableBalance: balance,
      commissionRate: 0.1,
      payouts: payouts.map((p: Record<string, unknown>) => ({
        ...p,
        _id: String(p._id),
        sellerId: String(p.sellerId),
        createdAt: String(p.createdAt),
        updatedAt: String(p.updatedAt),
        processedAt: p.processedAt ? String(p.processedAt) : null,
      })),
      recentEarnings: earnings.map((e: Record<string, unknown>) => ({
        ...e,
        _id: String(e._id),
        orderId: String(e.orderId),
        createdAt: String(e.createdAt),
      })),
    });
  } catch (error) {
    console.error("GET seller payouts:", error);
    return NextResponse.json({ error: "Failed to load payouts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireRoles(["seller"]);
    if (!auth.ok) return auth.response;

    await connectDB();
    const sellerId = auth.session.sub;
    const body = await req.json();
    const amount = Math.round(Number(body.amount || 0) * 100) / 100;
    const sellerNote = String(body.note || "").trim().slice(0, 500);

    if (amount <= 0) {
      return NextResponse.json({ error: "Enter a valid payout amount" }, { status: 400 });
    }

    const balance = await availableBalance(sellerId);
    if (amount > balance) {
      return NextResponse.json(
        { error: `Requested amount exceeds available balance (${balance})` },
        { status: 400 }
      );
    }

    const pending = await PayoutRequest.findOne({ sellerId, status: "pending" }).lean();
    if (pending) {
      return NextResponse.json(
        { error: "You already have a pending payout request. Wait for admin review." },
        { status: 409 }
      );
    }

    const earnings = await SellerEarning.find({ sellerId, status: "available" }).sort({
      createdAt: 1,
    });

    let reservedSum = 0;
    const reservedIds: mongoose.Types.ObjectId[] = [];
    for (const row of earnings) {
      if (reservedSum >= amount) break;
      const net = Number((row as { netAmount: number }).netAmount);
      if (net <= 0) continue;
      reservedIds.push((row as { _id: mongoose.Types.ObjectId })._id);
      reservedSum = Math.round((reservedSum + net) * 100) / 100;
    }

    if (reservedSum < amount) {
      return NextResponse.json({ error: "Insufficient available balance" }, { status: 400 });
    }

    const created = await PayoutRequest.create({ sellerId, amount, sellerNote, status: "pending" });
    await SellerEarning.updateMany(
      { _id: { $in: reservedIds } },
      { $set: { status: "reserved", payoutRequestId: created._id } }
    );
    return NextResponse.json(
      {
        payout: {
          _id: String(created._id),
          amount: created.amount,
          status: created.status,
        },
        availableBalance: await availableBalance(sellerId),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST seller payout:", error);
    return NextResponse.json({ error: "Failed to request payout" }, { status: 500 });
  }
}
