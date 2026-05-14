import { SignJWT, jwtVerify } from "jose";

export type UserRole = "user" | "seller" | "admin";

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
};

export function getJwtSecretKey(): Uint8Array | null {
  const s = process.env.AUTH_JWT_SECRET || process.env.NEXTAUTH_SECRET;
  if (!s) return null;
  return new TextEncoder().encode(s);
}

export async function createSessionToken(
  payload: SessionPayload,
  maxAgeSec = 60 * 60 * 24 * 7
): Promise<string> {
  const key = getJwtSecretKey();
  if (!key) throw new Error("AUTH_JWT_SECRET or NEXTAUTH_SECRET is required");
  return new SignJWT({
    email: payload.email,
    name: payload.name,
    role: payload.role,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${maxAgeSec}s`)
    .sign(key);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const key = getJwtSecretKey();
  if (!key) return null;
  try {
    const { payload } = await jwtVerify(token, key);
    const sub = String(payload.sub || "");
    const email = String(payload.email || "");
    const name = String(payload.name || "");
    const role = payload.role as UserRole;
    if (!sub || !email || !role) return null;
    if (role !== "user" && role !== "seller" && role !== "admin") return null;
    return { sub, email, name, role };
  } catch {
    return null;
  }
}
