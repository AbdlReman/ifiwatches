"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import type { CartItem } from "@/types/product";
import { discountFromPercent } from "@/lib/couponValidation";
import { formatPkr } from "@/lib/formatCurrency";
import { paymentMethods, siteConfig } from "@/lib/siteConfig";

type PaymentMethod = (typeof paymentMethods)[number]["value"] | "";
type Step = 1 | 2 | 3;

async function validateCouponCode(code: string) {
  const res = await fetch("/api/coupons/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });
  return res.json() as Promise<{
    valid: boolean;
    code?: string;
    discountPercent?: number;
    error?: string;
  }>;
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition";
const labelClass = "block text-xs font-bold uppercase tracking-wide text-gray-500 mb-1.5";

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);

  const [items] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    return JSON.parse(localStorage.getItem("cart_items") || "[]");
  });

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    notes: "",
  });

  const [deliveryPreviewOpen, setDeliveryPreviewOpen] = useState(false);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const urlCouponDone = useRef(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [paymentTransactionId, setPaymentTransactionId] = useState("");
  const [paymentScreenshotUrl, setPaymentScreenshotUrl] = useState("");
  const [uploadingShot, setUploadingShot] = useState(false);

  const applyCoupon = useCallback(async (code: string) => {
    const raw = code.trim().toUpperCase();
    if (!raw) {
      setAppliedCoupon("");
      setDiscountPercent(0);
      return;
    }
    const data = await validateCouponCode(raw);
    if (!data.valid) {
      toast.error("Coupon not applied", { description: data.error || "Invalid code." });
      setAppliedCoupon("");
      setDiscountPercent(0);
      return;
    }
    setAppliedCoupon(data.code || raw);
    setDiscountPercent(Number(data.discountPercent || 0));
    toast.success("Coupon applied", { description: `${data.code} · ${data.discountPercent}% off` });
  }, []);

  useEffect(() => {
    if (urlCouponDone.current || typeof window === "undefined") return;
    const param = new URLSearchParams(window.location.search).get("coupon")?.trim();
    if (!param) return;
    urlCouponDone.current = true;
    const timer = window.setTimeout(() => {
      setCouponInput(param.toUpperCase());
      void applyCoupon(param);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [applyCoupon]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const discountAmount = useMemo(() => discountFromPercent(subtotal, discountPercent), [subtotal, discountPercent]);
  const totalAmount = useMemo(() => Math.round((subtotal - discountAmount) * 100) / 100, [subtotal, discountAmount]);

  const emptyWarned = useRef(false);
  useEffect(() => {
    if (items.length > 0 || emptyWarned.current) return;
    emptyWarned.current = true;
    toast.warning("Your cart is empty", {
      description: "Browse the shop and add products before checking out.",
    });
  }, [items.length]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        const data = await res.json();
        if (cancelled || !data.user) return;
        setForm((f) => ({
          ...f,
          name: f.name || String(data.user.name || ""),
          email: f.email || String(data.user.email || ""),
        }));
      } catch {
        /* guest checkout */
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const onScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingShot(true);
    try {
      const fd = new FormData();
      fd.append("images", file);
      fd.append("folder", "payment-screenshots");
      const res = await fetch("/api/upload", { method: "POST", body: fd, credentials: "include" });
      const data = (await res.json()) as { urls?: string[]; error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      const url = data.urls?.[0];
      if (!url) throw new Error("No image URL returned");
      setPaymentScreenshotUrl(url);
      toast.success("Screenshot uploaded");
    } catch (err) {
      setPaymentScreenshotUrl("");
      toast.error("Upload failed", { description: err instanceof Error ? err.message : "Try again." });
    } finally {
      setUploadingShot(false);
      e.target.value = "";
    }
  };

  // Validate step 1 (customer info)
  const validateStep1 = () => {
    if (!form.name.trim()) { toast.error("Full name is required"); return false; }
    if (!form.phone.trim()) { toast.error("Phone number is required"); return false; }
    if (!form.email.trim()) { toast.error("Email address is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(form.email)) { toast.error("Enter a valid email address"); return false; }
    return true;
  };

  // Validate step 2 (delivery)
  const validateStep2 = () => {
    if (!form.address.trim()) { toast.error("Street address is required"); return false; }
    if (!form.city.trim()) { toast.error("City is required"); return false; }
    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Cannot place order", { description: "Your cart is empty." });
      return;
    }
    if (!paymentMethod) {
      toast.error("Payment method required", { description: "Choose a payment method." });
      return;
    }
    const trx = paymentTransactionId.trim();
    const shot = paymentScreenshotUrl.trim();
    if (paymentMethod !== "cod" && !trx && !shot) {
      toast.error("Payment proof required", {
        description: "Enter your Transaction ID / TRX ID or upload a payment screenshot.",
      });
      return;
    }

    setLoading(true);
    toast.loading("Placing your order…", { id: "place-order" });
    let res: Response;
    try {
      res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customer: form,
          items,
          couponCode: appliedCoupon,
          payment: { method: paymentMethod, transactionId: trx, screenshotUrl: shot },
        }),
      });
    } catch {
      toast.dismiss("place-order");
      setLoading(false);
      toast.error("Network error", { description: "Could not reach the server. Try again." });
      return;
    }
    const data = await res.json();
    setLoading(false);
    toast.dismiss("place-order");
    if (!res.ok) {
      toast.error("Order failed", { description: data.error || "Please try again." });
      return;
    }
    localStorage.removeItem("cart_items");
    window.dispatchEvent(new Event("cart_updated"));
    const orderNo = data.order?.orderNumber ?? "confirmed";
    toast.success("Order placed", {
      description: `Order ${orderNo}. Thank you for your purchase.`,
      duration: 3000,
    });
    router.push("/shop");
  };

  const selectedPaymentDetails = paymentMethods.find((m) => m.value === paymentMethod);

  const STEPS: { num: Step; label: string }[] = [
    { num: 1, label: "Customer" },
    { num: 2, label: "Delivery" },
    { num: 3, label: "Payment" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-black uppercase tracking-tight mb-8 text-gray-900">Checkout</h1>

        {/* ── Stepper ── */}
        <div className="flex items-center mb-8">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center">
              <button
                type="button"
                onClick={() => { if (step > s.num) setStep(s.num); }}
                className={`flex items-center gap-2.5 ${step > s.num ? "cursor-pointer" : "cursor-default"}`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                    step > s.num
                      ? "bg-emerald-500 text-white"
                      : step === s.num
                      ? "bg-gray-900 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > s.num ? <CheckIcon /> : s.num}
                </span>
                <span
                  className={`text-sm font-semibold hidden sm:block ${
                    step === s.num ? "text-gray-900" : step > s.num ? "text-emerald-600" : "text-gray-400"
                  }`}
                >
                  {s.label}
                </span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`h-0.5 w-12 sm:w-20 mx-3 rounded-full transition-colors ${step > s.num ? "bg-emerald-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* ── Left: step form ── */}
          <div className="lg:col-span-2">
            <form onSubmit={onSubmit}>

              {/* ─── STEP 1: Customer ─── */}
              {step === 1 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Customer Information</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Who is this order for?</p>
                  </div>
                  <hr className="border-gray-100" />

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Full Name <span className="text-red-500">*</span></label>
                      <input
                        placeholder="Your full name"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className={inputClass}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Phone Number <span className="text-red-500">*</span></label>
                      <input
                        placeholder="+92 3XX XXXXXXX"
                        value={form.phone}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        className={inputClass}
                        autoComplete="tel"
                        type="tel"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                      className={inputClass}
                      autoComplete="email"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Order confirmation will be sent to this email.</p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => { if (validateStep1()) setStep(2); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-7 py-3 text-sm font-bold text-white hover:bg-gray-700 transition-colors"
                    >
                      Next: Delivery
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 2: Delivery ─── */}
              {step === 2 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Delivery Address</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Where should we deliver your order?</p>
                  </div>
                  <hr className="border-gray-100" />

                  <div>
                    <label className={labelClass}>Street Address <span className="text-red-500">*</span></label>
                    <input
                      placeholder="House / flat number, street name"
                      value={form.address}
                      onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                      className={inputClass}
                      autoComplete="street-address"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City <span className="text-red-500">*</span></label>
                      <input
                        placeholder="City"
                        value={form.city}
                        onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                        className={inputClass}
                        autoComplete="address-level2"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>State / Province</label>
                      <input
                        placeholder="Optional"
                        value={form.state}
                        onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                        className={inputClass}
                        autoComplete="address-level1"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Postal Code</label>
                    <input
                      placeholder="Optional"
                      value={form.postalCode}
                      onChange={(e) => setForm((f) => ({ ...f, postalCode: e.target.value }))}
                      className={inputClass}
                      autoComplete="postal-code"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Delivery Notes</label>
                    <textarea
                      placeholder="Any special delivery instructions (optional)"
                      value={form.notes}
                      onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                      className={inputClass + " resize-none"}
                      rows={3}
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => { if (validateStep2()) setStep(3); }}
                      className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-7 py-3 text-sm font-bold text-white hover:bg-gray-700 transition-colors"
                    >
                      Next: Payment
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* ─── STEP 3: Payment ─── */}
              {step === 3 && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5">
                  <div>
                    <h2 className="text-lg font-black text-gray-900">Payment</h2>
                    <p className="text-gray-400 text-sm mt-0.5">Choose how you want to pay.</p>
                  </div>
                  <hr className="border-gray-100" />

                  {/* Review summary chips — click to preview full details */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryPreviewOpen(true)}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="View delivery details"
                    >
                      <CheckIcon />
                      {form.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryPreviewOpen(true)}
                      className="flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                      title="View delivery details"
                    >
                      <CheckIcon />
                      {form.address}, {form.city}
                    </button>
                  </div>

                  {/* Payment method selection */}
                  <div>
                    <p className={labelClass}>Payment Method <span className="text-red-500">*</span></p>
                    <fieldset className="space-y-2.5">
                      <legend className="sr-only">Choose payment method</legend>
                      {paymentMethods.map((opt) => (
                        <label
                          key={opt.value}
                          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-colors ${
                            paymentMethod === opt.value
                              ? "border-gray-900 bg-gray-50 shadow-sm"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={opt.value}
                            checked={paymentMethod === opt.value}
                            onChange={() => setPaymentMethod(opt.value)}
                            className="accent-black"
                          />
                          <span className="text-sm font-semibold text-gray-800">{opt.label}</span>
                          {opt.value === "cod" && (
                            <span className="ml-auto text-[11px] rounded-full bg-green-100 text-green-700 font-bold px-2 py-0.5">
                              Pay on delivery
                            </span>
                          )}
                        </label>
                      ))}
                    </fieldset>
                  </div>

                  {/* COD notice */}
                  {paymentMethod === "cod" && (
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3.5 text-sm text-gray-800">
                      <p className="font-bold text-green-800 mb-1">Cash on Delivery</p>
                      <p className="text-green-700">
                        You will pay <strong>{formatPkr(totalAmount)}</strong> in cash when your order arrives. No payment is required right now.
                      </p>
                    </div>
                  )}

                  {/* Transfer details */}
                  {paymentMethod !== "cod" && selectedPaymentDetails && selectedPaymentDetails.accounts.length > 0 && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-gray-800">
                      <p className="font-bold mb-3">{selectedPaymentDetails.label} transfer details</p>
                      <div className="space-y-3">
                        {selectedPaymentDetails.accounts.map((account, i) => (
                          <div key={`${selectedPaymentDetails.value}-${account.account}`}>
                            {selectedPaymentDetails.accounts.length > 1 && (
                              <p className="font-semibold text-xs text-gray-500 uppercase tracking-wide mb-1">Account {i + 1}</p>
                            )}
                            <p><span className="text-gray-500">Holder:</span> <strong>{account.holder}</strong></p>
                            <p><span className="text-gray-500">Number:</span> <span className="font-mono font-bold">{account.account}</span></p>
                            {"iban" in account ? (
                              <p><span className="text-gray-500">IBAN:</span> <span className="font-mono font-bold">{account.iban}</span></p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-gray-700">
                        Send exactly <strong>{formatPkr(totalAmount)}</strong>, then enter your TRX ID and/or upload a screenshot.
                      </p>
                    </div>
                  )}

                  {/* TRX ID + screenshot */}
                  {paymentMethod !== "" && paymentMethod !== "cod" && (
                    <>
                      <div>
                        <label className={labelClass}>Transaction ID / TRX ID</label>
                        <input
                          placeholder="Enter your transaction ID"
                          value={paymentTransactionId}
                          onChange={(e) => setPaymentTransactionId(e.target.value)}
                          className={inputClass}
                          autoComplete="off"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Payment Screenshot</label>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingShot}
                          onChange={(e) => void onScreenshotChange(e)}
                          className="text-sm w-full text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-gray-700 hover:file:bg-gray-200"
                        />
                        {uploadingShot && <p className="text-xs text-gray-400 mt-1">Uploading…</p>}
                        {paymentScreenshotUrl && (
                          <p className="text-xs text-emerald-600 mt-1.5 font-medium">Screenshot attached — ready to submit.</p>
                        )}
                      </div>
                      <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                        <strong>Note:</strong> Provide either your Transaction ID <strong>or</strong> a payment screenshot (at least one required).
                      </p>
                    </>
                  )}

                  <div className="pt-2 flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-black disabled:opacity-60 transition-opacity"
                      style={{ background: siteConfig.brandGradient }}
                    >
                      {loading ? (
                        <>
                          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                          </svg>
                          Placing…
                        </>
                      ) : (
                        <>Place Order · {formatPkr(totalAmount)}</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 h-fit sticky top-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-4">Order Summary</h2>

            {/* Items */}
            <div className="space-y-3 mb-5">
              {items.length === 0 ? (
                <p className="text-gray-400 text-sm">Your cart is empty.</p>
              ) : (
                items.map((item) => (
                  <div key={`${item.productId}-${item.size}-${item.color}`} className="flex gap-3 items-start">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                      {(item.color || item.size) && (
                        <p className="text-xs text-gray-400">{[item.color, item.size].filter(Boolean).join(" / ")}</p>
                      )}
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900 shrink-0">{formatPkr(item.price * item.quantity)}</p>
                  </div>
                ))
              )}
            </div>

            <hr className="border-gray-100 mb-4" />

            {/* Totals */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal ({items.length} item{items.length !== 1 ? "s" : ""})</span>
                <span>{formatPkr(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount{appliedCoupon ? ` (${appliedCoupon})` : ""}</span>
                  <span>-{formatPkr(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between font-black text-base pt-3 border-t border-gray-100 text-gray-900">
                <span>Total</span>
                <span>{formatPkr(totalAmount)}</span>
              </div>
            </div>

            {/* Coupon */}
            <div className="border-t border-gray-100 mt-5 pt-5 space-y-3">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Coupon Code</p>
              <div className="flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="ENTER CODE"
                  className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-mono tracking-widest text-gray-900 placeholder:text-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10 transition"
                />
                <button
                  type="button"
                  onClick={() => void applyCoupon(couponInput)}
                  className="shrink-0 rounded-lg border border-gray-300 px-3 text-xs font-bold uppercase text-gray-700 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <div className="flex items-center justify-between rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm">
                  <span className="font-semibold text-emerald-700">{appliedCoupon} · {discountPercent}% off</span>
                  <button
                    type="button"
                    onClick={() => { setAppliedCoupon(""); setDiscountPercent(0); setCouponInput(""); toast.message("Coupon removed"); }}
                    className="text-xs text-gray-400 underline hover:text-gray-600"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {step === 3 && (
              <p className="mt-4 text-xs text-gray-400 text-center">
                By placing your order you agree to our terms.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Delivery details preview popup ── */}
      {deliveryPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setDeliveryPreviewOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-black text-gray-900">Order Details</h3>
              <button
                type="button"
                onClick={() => setDeliveryPreviewOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-gray-700 transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Customer info */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Customer</p>
                <button
                  type="button"
                  onClick={() => { setDeliveryPreviewOpen(false); setStep(1); }}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <p className="font-bold text-gray-900 text-sm">{form.name}</p>
              <p className="text-sm text-gray-600 mt-0.5">{form.phone}</p>
              <p className="text-sm text-gray-500">{form.email}</p>
            </div>

            {/* Delivery address */}
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Delivery Address</p>
                <button
                  type="button"
                  onClick={() => { setDeliveryPreviewOpen(false); setStep(2); }}
                  className="text-[11px] font-semibold text-blue-600 hover:underline"
                >
                  Edit
                </button>
              </div>
              <p className="text-sm font-semibold text-gray-900">{form.address}</p>
              <p className="text-sm text-gray-700">
                {form.city}{form.state ? `, ${form.state}` : ""}
                {form.postalCode ? ` — ${form.postalCode}` : ""}
              </p>
              {form.notes && (
                <p className="text-xs text-gray-500 mt-2 border-t border-gray-200 pt-2">
                  <span className="font-semibold">Note:</span> {form.notes}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDeliveryPreviewOpen(false)}
              className="mt-4 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-bold text-white hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
