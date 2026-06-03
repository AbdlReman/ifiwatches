import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionToken } from "@/lib/auth/jwt";
import { AUTH_COOKIE, sessionCookieOptions } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email }).select("+passwordHash sellerApproved").lean();
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const u = user as { _id: unknown; email: string; name: string; role: string; passwordHash: string; sellerApproved?: boolean };
    const ok = await verifyPassword(password, u.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (u.role === "seller" && !u.sellerApproved) {
      return NextResponse.json(
        { error: "Seller account is pending admin approval. Please wait for approval before signing in." },
        { status: 403 }
      );
    }

    const role = u.role as UserRole;
    const token = await createSessionToken({
      sub: String(u._id),
      email: u.email,
      name: u.name,
      role,
    });

    const maxAge = 60 * 60 * 24 * 7;
    const jar = await cookies();
    jar.set(AUTH_COOKIE, token, sessionCookieOptions(maxAge));

    return NextResponse.json({
      user: {
        id: String(u._id),
        email: u.email,
        name: u.name,
        role,
      },
    });
  } catch (e) {
    console.error("login error:", e);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
