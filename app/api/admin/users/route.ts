import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isAdmin } from "@/lib/isAdmin";
import type { UserRole } from "@/lib/auth/jwt";

const SELECT_FIELDS =
  "email name role createdAt phone address businessName businessCategory businessSummary sellerApproved sellerEnabled assignedCategories commissionRate";

function formatUser(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    email: r.email as string,
    name: r.name as string,
    role: r.role as UserRole,
    phone: (r.phone as string) || "",
    address: (r.address as string) || "",
    businessName: (r.businessName as string) || "",
    businessCategory: (r.businessCategory as string) || "",
    businessSummary: (r.businessSummary as string) || "",
    sellerApproved: Boolean(r.sellerApproved),
    sellerEnabled: r.sellerEnabled !== false,
    assignedCategories: Array.isArray(r.assignedCategories) ? (r.assignedCategories as string[]) : [],
    commissionRate: Number(r.commissionRate || 0),
    createdAt: r.createdAt ? String(r.createdAt) : "",
  };
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const rows = await User.find({}).sort({ createdAt: -1 }).select(SELECT_FIELDS).lean();
    return NextResponse.json({ users: rows.map((r) => formatUser(r as Record<string, unknown>)) });
  } catch (e) {
    console.error("admin users GET:", e);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "User ID is required." }, { status: 400 });

    const update: Record<string, unknown> = {};
    if (typeof body.sellerApproved === "boolean") update.sellerApproved = body.sellerApproved;
    if (typeof body.sellerEnabled === "boolean") update.sellerEnabled = body.sellerEnabled;
    if (Array.isArray(body.assignedCategories)) {
      update.assignedCategories = (body.assignedCategories as unknown[]).map(String).filter(Boolean);
    }
    if (typeof body.commissionRate === "number") {
      update.commissionRate = Math.max(0, Math.min(100, body.commissionRate));
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(id, { $set: update }, { new: true })
      .select(SELECT_FIELDS)
      .lean();
    if (!updated) return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ user: formatUser(updated as Record<string, unknown>) });
  } catch (e) {
    console.error("admin users PATCH:", e);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const id = String(body.id || "").trim();
    if (!id) return NextResponse.json({ error: "User ID is required." }, { status: 400 });

    await connectDB();
    const deleted = await User.findByIdAndDelete(id).lean();
    if (!deleted) return NextResponse.json({ error: "User not found." }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("admin users DELETE:", e);
    return NextResponse.json({ error: "Failed to delete user." }, { status: 500 });
  }
}
