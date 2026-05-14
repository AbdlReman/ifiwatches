import { NextResponse } from "next/server";
import { getSession } from "./session";
import type { SessionPayload, UserRole } from "./jwt";

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
  return gate;
}
