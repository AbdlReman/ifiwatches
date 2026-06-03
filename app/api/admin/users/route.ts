import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { isAdmin } from "@/lib/isAdmin";
import type { UserRole } from "@/lib/auth/jwt";

export async function GET() {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const rows = await User.find({})
      .sort({ createdAt: -1 })
      .select("email name role createdAt phone businessCategory businessSummary sellerApproved")
      .lean();

    const users = rows.map((r) => {
      const u = r as {
        _id: unknown;
        email: string;
        name: string;
        role: string;
        createdAt?: Date;
        phone?: string;
        businessCategory?: string;
        businessSummary?: string;
        sellerApproved?: boolean;
      };
      return {
        id: String(u._id),
        email: u.email,
        name: u.name,
        role: u.role as UserRole,
        phone: u.phone || "",
        businessCategory: u.businessCategory || "",
        businessSummary: u.businessSummary || "",
        sellerApproved: Boolean(u.sellerApproved),
        createdAt: u.createdAt ? String(u.createdAt) : "",
      };
    });

    return NextResponse.json({ users });
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
    const sellerApproved = Boolean(body.sellerApproved);

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      id,
      { sellerApproved },
      { new: true }
    )
      .select("email name role createdAt phone businessCategory businessSummary sellerApproved")
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const u = updated as {
      _id: unknown;
      email: string;
      name: string;
      role: string;
      createdAt?: Date;
      phone?: string;
      businessCategory?: string;
      businessSummary?: string;
      sellerApproved?: boolean;
    };

    return NextResponse.json({
      user: {
        id: String(u._id),
        email: u.email,
        name: u.name,
        role: u.role as UserRole,
        phone: u.phone || "",
        businessCategory: u.businessCategory || "",
        businessSummary: u.businessSummary || "",
        sellerApproved: Boolean(u.sellerApproved),
        createdAt: u.createdAt ? String(u.createdAt) : "",
      },
    });
  } catch (e) {
    console.error("admin users PATCH:", e);
    return NextResponse.json({ error: "Failed to update user." }, { status: 500 });
  }
}
