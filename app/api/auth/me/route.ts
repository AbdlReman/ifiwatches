import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getSession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    await connectDB();
    const doc = await User.findById(session.sub).lean();
    if (!doc) {
      return NextResponse.json({ user: null });
    }

    const u = doc as { _id: unknown; email: string; name: string; role: string };
    return NextResponse.json({
      user: {
        id: String(u._id),
        email: u.email,
        name: u.name,
        role: u.role as UserRole,
      },
    });
  } catch (e) {
    console.error("me error:", e);
    return NextResponse.json({ error: "Failed to load session." }, { status: 500 });
  }
}
