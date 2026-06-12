import { NextResponse } from "next/server";
import { getSession } from "./session";
import type { SessionPayload, UserRole } from "./jwt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function requireSession(): Promise<
  { ok: true; session: SessionPayload } | { ok: false; response: NextResponse }
> {
  const session = await getSession();
  if (!session) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { ok: true, session };
}

export async function requireRoles(allowed: UserRole[]): Promise<
  { ok: true; session: SessionPayload } | { ok: false; response: NextResponse }
> {
  const gate = await requireSession();
  if (!gate.ok) return gate;
  if (!allowed.includes(gate.session.role)) {
    return { ok: false, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  // Verify the seller account is still active on every API call
  if (gate.session.role === "seller") {
    await connectDB();
    const seller = await User.findById(gate.session.sub)
      .select("sellerEnabled")
      .lean() as { sellerEnabled?: boolean } | null;
    if (!seller || seller.sellerEnabled === false) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Your account has been disabled by the administrator. Please contact support for further assistance." },
          { status: 403 }
        ),
      };
    }
  }
  return gate;
}
