import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth/password";
import type { UserRole } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const name = String(body.name || "").trim();
    const roleRaw = String(body.role || "user").toLowerCase();
    const phone = String(body.phone || "").trim().slice(0, 40);
    const address = String(body.address || "").trim().slice(0, 240);
    const businessName = String(body.businessName || "").trim().slice(0, 120);
    const businessCategory = String(body.businessCategory || "").trim().slice(0, 120);
    const businessSummary = String(body.businessSummary || "").trim().slice(0, 1000);
    const whatsapp = String(body.whatsapp || "").trim().slice(0, 40);
    const cnic = String(body.cnic || "").trim().slice(0, 15);
    const cnicFront = String(body.cnicFront || "").trim();
    const cnicBack = String(body.cnicBack || "").trim();
    const sellerImage = String(body.sellerImage || "").trim();

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
      if (!phone) {
        return NextResponse.json({ error: "Phone number is required for seller accounts." }, { status: 400 });
      }
      if (!whatsapp) {
        return NextResponse.json({ error: "WhatsApp number is required for seller accounts." }, { status: 400 });
      }
      if (!businessCategory) {
        return NextResponse.json({ error: "Please choose a business category." }, { status: 400 });
      }
      if (!businessSummary || businessSummary.length < 20) {
        return NextResponse.json({ error: "Please provide a business summary (at least 20 characters)." }, { status: 400 });
      }
      if (!cnic || !/^\d{5}-\d{7}-\d{1}$/.test(cnic)) {
        return NextResponse.json({ error: "A valid CNIC is required (format: XXXXX-XXXXXXX-X)." }, { status: 400 });
      }
      if (!cnicFront || !cnicBack) {
        return NextResponse.json({ error: "Both CNIC front and back photos are required." }, { status: 400 });
      }
      if (!sellerImage) {
        return NextResponse.json({ error: "Your photo is required." }, { status: 400 });
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
      whatsapp: role === "seller" && whatsapp ? whatsapp : undefined,
      address: address || undefined,
      businessName: role === "seller" && businessName ? businessName : undefined,
      businessCategory: role === "seller" ? businessCategory : undefined,
      businessSummary: role === "seller" ? businessSummary : undefined,
      cnic: role === "seller" && cnic ? cnic : undefined,
      cnicFront: role === "seller" && cnicFront ? cnicFront : undefined,
      cnicBack: role === "seller" && cnicBack ? cnicBack : undefined,
      sellerImage: role === "seller" && sellerImage ? sellerImage : undefined,
      sellerApproved: role === "seller" ? false : true,
      sellerEnabled: true,
      assignedCategories: [],
      commissionRate: 0,
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
