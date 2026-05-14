/** Labels for stored payment method codes (orders, emails, admin). */
export function paymentMethodLabel(code: string): string {
  switch ((code || "").toLowerCase()) {
    case "easypaisa":
      return "Easy Paisa";
    case "jazzcash":
      return "Jazz Cash";
    case "raast":
      return "Raast Payment";
    default:
      return (code || "").trim() || "—";
  }
}
