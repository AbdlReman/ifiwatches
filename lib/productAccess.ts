import type { SessionPayload } from "@/lib/auth/jwt";

export function productSellerIdString(product: { sellerId?: unknown } | null): string | null {
  if (!product?.sellerId) return null;
  return String(product.sellerId);
}

export function sellerOwnsProduct(session: SessionPayload, product: { sellerId?: unknown } | null): boolean {
  if (session.role !== "seller" || !product) return false;
  const sid = productSellerIdString(product);
  return sid !== null && sid === session.sub;
}

export function canMutateProduct(
  session: SessionPayload,
  product: { sellerId?: unknown } | null
): boolean {
  if (session.role === "admin") return true;
  return sellerOwnsProduct(session, product);
}
