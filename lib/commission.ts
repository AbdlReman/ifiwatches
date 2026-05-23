/** Platform commission on marketplace (seller) sales. */
export const PLATFORM_COMMISSION_RATE = 0.1;

export function commissionFromGross(gross: number): number {
  return Math.round(gross * PLATFORM_COMMISSION_RATE * 100) / 100;
}

export function sellerNetFromGross(gross: number): number {
  return Math.round(gross * (1 - PLATFORM_COMMISSION_RATE) * 100) / 100;
}
