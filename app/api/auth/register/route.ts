import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import type { UserRole } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const roleRaw = String(body.role || "user").toLowerCase();
    const phone = String(body.phone || "").trim().slice(0, 40);
    const address = String(body.address || "").trim().slice(0, 240);
    const businessCategory = String(body.businessCategory || "").trim().slice(0, 120);
    const businessSummary = String(body.businessSummary || "").trim().slice(0, 1000);

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }
    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Name is required (max 120 characters)." }, { status: 400 });
    }

    let role: UserRole = "user";
    if (roleRaw === "seller") role = "seller";
    else if (roleRaw === "user" || roleRaw === "") role = "user";
    else {
      return NextResponse.json({ error: "Invalid role." }, { status: 400 });
    }

    if (role === "seller") {
      if (!businessCategory) {
        return NextResponse.json({ error: "Please choose a business category." }, { status: 400 });
      }
      if (!businessSummary || businessSummary.length < 20) {
        return NextResponse.json({ error: "Please provide a business summary (at least 20 characters)." }, { status: 400 });
      }
    }

    await connectDB();
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const user = await User.create({
      email,
      passwordHash,
      name,
      role,
      phone: phone || undefined,
      address: address || undefined,
      businessCategory: role === "seller" ? businessCategory : undefined,
      businessSummary: role === "seller" ? businessSummary : undefined,
      sellerApproved: role === "seller" ? false : true,
    });

    return NextResponse.json({
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role as UserRole,
      },
    });
  } catch (e) {
    console.error("register error:", e);
    return NextResponse.json({ error: "Registration failed." }, { status: 500 });
  }
}
