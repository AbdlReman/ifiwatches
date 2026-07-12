import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isAdmin } from "@/lib/isAdmin";
import { hashPassword } from "@/lib/auth/password";
import type { UserRole } from "@/lib/auth/jwt";

const SELECT_FIELDS =
  "email name role createdAt phone whatsapp address businessName businessCategory businessSummary sellerApproved sellerEnabled assignedCategories commissionRate sellerCode";

function formatUser(r: Record<string, unknown>) {
  return {
    id: String(r._id),
    email: r.email as string,
    name: r.name as string,
    role: r.role as UserRole,
    phone: (r.phone as string) || "",
    whatsapp: (r.whatsapp as string) || "",
    address: (r.address as string) || "",
    businessName: (r.businessName as string) || "",
    businessCategory: (r.businessCategory as string) || "",
    businessSummary: (r.businessSummary as string) || "",
    sellerApproved: Boolean(r.sellerApproved),
    sellerEnabled: r.sellerEnabled !== false,
    assignedCategories: Array.isArray(r.assignedCategories) ? (r.assignedCategories as string[]) : [],
    commissionRate: Number(r.commissionRate || 0),
    sellerCode: (r.sellerCode as string) || "",
    createdAt: r.createdAt ? String(r.createdAt) : "",
  };
}

async function generateSellerCode(): Promise<string> {
  const count = await User.countDocuments({ sellerCode: { $exists: true, $nin: [null, ""] } });
  return `IFI-S-${String(count + 1).padStart(4, "0")}`;
}

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    // Backfill: assign sellerCodes to approved sellers that don't have one yet
    const missing = await User.find({
      role: "seller",
      sellerApproved: true,
      $or: [{ sellerCode: { $exists: false } }, { sellerCode: null }, { sellerCode: "" }],
    }).select("_id").lean() as { _id: unknown }[];
    for (const u of missing) {
      const code = await generateSellerCode();
      await User.findByIdAndUpdate(u._id, { $set: { sellerCode: code } });
    }

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
    if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim().slice(0, 120);
    if (typeof body.email === "string" && body.email.trim()) update.email = body.email.trim().toLowerCase();
    if (typeof body.phone === "string") update.phone = body.phone.trim().slice(0, 40);
    if (typeof body.whatsapp === "string") update.whatsapp = body.whatsapp.trim().slice(0, 40);
    if (typeof body.address === "string") update.address = body.address.trim().slice(0, 240);
    if (typeof body.password === "string" && body.password.length >= 6) {
      update.passwordHash = await hashPassword(body.password);
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
    }

    await connectDB();

    // Auto-generate a unique Seller ID when approving a seller for the first time
    if (update.sellerApproved === true) {
      const existing = await User.findById(id).select("sellerCode").lean() as { sellerCode?: string } | null;
      if (existing && !existing.sellerCode) {
        update.sellerCode = await generateSellerCode();
      }
    }

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
