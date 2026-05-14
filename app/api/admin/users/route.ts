import { NextResponse } from "next/server";
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
      .select("email name role createdAt")
      .lean();

    const users = rows.map((r) => {
      const u = r as { _id: unknown; email: string; name: string; role: string; createdAt?: Date };
      return {
        id: String(u._id),
        email: u.email,
        name: u.name,
        role: u.role as UserRole,
        createdAt: u.createdAt ? String(u.createdAt) : "",
      };
    });

    return NextResponse.json({ users });
  } catch (e) {
    console.error("admin users GET:", e);
    return NextResponse.json({ error: "Failed to load users." }, { status: 500 });
  }
}
