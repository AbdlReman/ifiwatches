type OrderLike = {
  items?: { productId?: string; price?: number; quantity?: number }[];
};

export function sellerProductIdSet(productIds: string[]): Set<string> {
  return new Set(productIds);
}

/** Gross line total for this seller's SKUs in an order (excludes coupons; matches catalog line totals). */
export function attributedOrderTotal(order: OrderLike, productIds: Set<string>): number {
  let sum = 0;
  for (const item of order.items || []) {
    if (productIds.has(String(item.productId || ""))) {
      sum += Number(item.price || 0) * Math.max(1, Number(item.quantity || 1));
    }
  }
  return Math.round(sum * 100) / 100;
}
