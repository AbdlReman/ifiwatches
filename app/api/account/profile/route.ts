import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { requireSession } from "@/lib/auth/apiAuth";

export async function PATCH(req: NextRequest) {
  try {
    const gate = await requireSession();
    if (!gate.ok) return gate.response;

    const body = await req.json();
    const name = String(body.name || "").trim();
    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Name is required (max 120 characters)." }, { status: 400 });
    }

    await connectDB();
    const updated = await User.findByIdAndUpdate(
      gate.session.sub,
      { $set: { name } },
      { new: true }
    )
      .select("email name role")
      .lean();

    if (!updated) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const u = updated as { _id: unknown; email: string; name: string; role: string };
    return NextResponse.json({
      user: {
        id: String(u._id),
        email: u.email,
        name: u.name,
        role: u.role,
      },
    });
  } catch (e) {
    console.error("profile PATCH:", e);
    return NextResponse.json({ error: "Update failed." }, { status: 500 });
  }
}
