"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPkr } from "@/lib/formatCurrency";
import { paymentMethodLabel } from "@/lib/paymentLabels";

export type AdminOrderItem = {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  sellerName?: string;
};

export type AdminOrderRow = {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    city: string;
    state?: string;
    postalCode?: string;
    notes?: string;
  };
  items: AdminOrderItem[];
  subtotal: number;
  discountAmount: number;
  totalAmount: number;
  couponCode: string;
  paymentMethod: string;
  paymentTransactionId: string;
  paymentScreenshotUrl: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
};

type OrderStatus = "pending" | "processing" | "dispatched" | "completed" | "cancelled";
type PaymentStatus = "pending" | "paid" | "failed";

// ─── status config ────────────────────────────────────────────────────────────

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; badge: string; dot: string }
> = {
  pending:    { label: "Pending",    badge: "bg-amber-900/60 text-amber-200 border border-amber-700/50",    dot: "bg-amber-400" },
  processing: { label: "Processing", badge: "bg-blue-900/60 text-blue-200 border border-blue-700/50",       dot: "bg-blue-400" },
  dispatched: { label: "Dispatched", badge: "bg-violet-900/60 text-violet-200 border border-violet-700/50", dot: "bg-violet-400" },
  completed:  { label: "Completed",  badge: "bg-emerald-900/60 text-emerald-200 border border-emerald-700/50", dot: "bg-emerald-400" },
  cancelled:  { label: "Cancelled",  badge: "bg-red-900/60 text-red-200 border border-red-700/50",          dot: "bg-red-400" },
};

const PAYMENT_STATUS_CONFIG: Record<PaymentStatus, { label: string; badge: string }> = {
  pending: { label: "Unpaid",  badge: "bg-amber-900/50 text-amber-300 border border-amber-700/40" },
  paid:    { label: "Paid",    badge: "bg-emerald-900/50 text-emerald-300 border border-emerald-700/40" },
  failed:  { label: "Failed",  badge: "bg-red-900/50 text-red-300 border border-red-700/40" },
};

// next logical action for each order status
const NEXT_ACTIONS: Record<OrderStatus, { status: OrderStatus; label: string; color: string }[]> = {
  pending:    [{ status: "processing", label: "Prepare",  color: "border-blue-600 text-blue-300 hover:bg-blue-900/40" }],
  processing: [{ status: "dispatched", label: "Dispatch", color: "border-violet-600 text-violet-300 hover:bg-violet-900/40" }],
  dispatched: [{ status: "completed",  label: "Complete", color: "border-emerald-600 text-emerald-300 hover:bg-emerald-900/40" }],
  completed:  [],
  cancelled:  [],
};

const ALL_TABS: { key: OrderStatus; label: string }[] = [
  { key: "pending",    label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "dispatched", label: "Dispatched" },
  { key: "completed",  label: "Completed" },
  { key: "cancelled",  label: "Cancelled" },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const cfg = ORDER_STATUS_CONFIG[status as OrderStatus];
  if (!cfg) return <span className="text-slate-400 text-xs">{status}</span>;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cfg.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function PayBadge({ status }: { status: string }) {
  const cfg = PAYMENT_STATUS_CONFIG[status as PaymentStatus];
  if (!cfg) return null;
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${cfg.badge}`}>
      {cfg.label}
    </span>
  );
}

function fmt(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

// ─── component ───────────────────────────────────────────────────────────────

export default function OrdersAdminClient({
  orders: initialOrders,
  allowStatusActions = true,
  sellerMode = false,
}: {
  orders: AdminOrderRow[];
  allowStatusActions?: boolean;
  /** When true: hides customer details, restricts actions to Prepare + Cancel only. */
  sellerMode?: boolean;
}) {
  const [orders, setOrders] = useState<AdminOrderRow[]>(initialOrders);
  const [openId, setOpenId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("pending");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const perPage = 10;

  const selected = openId ? orders.find((o) => o._id === openId) ?? null : null;

  // close modal on Escape
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setOpenId(null);
  }, []);
  useEffect(() => {
    if (!openId) return;
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openId, onKeyDown]);

  // counts per status for summary cards
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const o of orders) c[o.orderStatus] = (c[o.orderStatus] ?? 0) + 1;
    return c;
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (o.orderStatus !== statusFilter) return false;
      if (!q) return true;
      if (sellerMode) return o.orderNumber.toLowerCase().includes(q);
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.email.toLowerCase().includes(q)
      );
    });
  }, [orders, statusFilter, search, sellerMode]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * perPage, currentPage * perPage);

  // patch order in local state so we don't need a full page reload
  const patchOrder = (id: string, patch: Partial<AdminOrderRow>) => {
    setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, ...patch } : o)));
    setOpenId((cur) => {
      // keep modal open with updated data
      return cur === id ? id : cur;
    });
  };

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, status }),
      });
      if (!res.ok) { alert("Failed to update status."); return; }
      patchOrder(orderId, { orderStatus: status });
    } catch { alert("Network error."); }
    finally { setUpdatingId(null); }
  };

  const updatePayment = async (orderId: string, paymentStatus: PaymentStatus) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ orderId, paymentStatus }),
      });
      if (!res.ok) { alert("Failed to update payment status."); return; }
      patchOrder(orderId, { paymentStatus });
    } catch { alert("Network error."); }
    finally { setUpdatingId(null); }
  };

  const cancelOrder = async (orderId: string) => {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    await updateStatus(orderId, "cancelled");
  };

  return (
    <>
      {/* ── Summary cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {ALL_TABS.map((tab) => {
          const cfg = ORDER_STATUS_CONFIG[tab.key];
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              className={`rounded-xl border p-4 text-left transition-all ${
                statusFilter === tab.key
                  ? "border-slate-500 bg-slate-700"
                  : "border-slate-700 bg-slate-800/50 hover:bg-slate-800"
              }`}
            >
              <p className="text-2xl font-black text-white tabular-nums">{counts[tab.key] ?? 0}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{tab.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Filters ───────────────────────────────────────────────── */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-900/60 p-1 flex-wrap gap-0.5">
          {ALL_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => { setStatusFilter(tab.key); setPage(1); }}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest rounded-md transition-colors ${
                statusFilter === tab.key
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label}
              {(counts[tab.key] ?? 0) > 0 && (
                <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-black ${
                  statusFilter === tab.key ? "bg-slate-700 text-slate-100" : "bg-slate-700 text-slate-300"
                }`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder={sellerMode ? "Search order #…" : "Search order #, customer name, phone…"}
          className="flex-1 min-w-[200px] bg-slate-900 border border-slate-700 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-600"
        />
      </div>

      {/* ── Table ────────────────────────────────────────────────── */}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
        <table className="w-full text-sm text-left text-slate-300 min-w-[760px]">
          <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Order</th>
              {!sellerMode && <th className="px-4 py-3 font-bold">Customer</th>}
              <th className="px-4 py-3 font-bold">Items</th>
              <th className="px-4 py-3 font-bold text-right">Total</th>
              <th className="px-4 py-3 font-bold">Payment</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold whitespace-nowrap">Date</th>
              <th className="px-4 py-3 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {paginatedOrders.length === 0 ? (
              <tr>
                <td colSpan={sellerMode ? 7 : 8} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No {statusFilter} orders{search ? ` matching "${search}"` : ""}.
                </td>
              </tr>
            ) : paginatedOrders.map((order) => {
              const nextActions = NEXT_ACTIONS[order.orderStatus as OrderStatus] ?? [];
              // Sellers cannot Prepare (admin-only); they can Dispatch and Complete
              const visibleActions = sellerMode
                ? nextActions.filter((a) => a.status !== "processing")
                : nextActions;
              const isBusy = updatingId === order._id;
              const isTerminal = order.orderStatus === "completed" || order.orderStatus === "cancelled";
              return (
                <tr key={order._id} className="hover:bg-slate-800/80 align-middle">
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-mono font-semibold text-white text-xs">{order.orderNumber}</span>
                  </td>
                  {!sellerMode && (
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-white font-medium truncate">{order.customer.name}</p>
                      <p className="text-slate-500 text-xs truncate">{order.customer.phone}</p>
                    </td>
                  )}
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-white tabular-nums whitespace-nowrap">
                    {formatPkr(order.totalAmount)}
                  </td>
                  <td className="px-4 py-3">
                    <PayBadge status={order.paymentStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.orderStatus} />
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap tabular-nums">
                    {fmt(order.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setOpenId(order._id)}
                        className="text-xs font-bold uppercase tracking-wide text-cyan-400 hover:text-cyan-300 px-2 py-1"
                      >
                        View
                      </button>
                      {(allowStatusActions || sellerMode) && (
                        <>
                          {visibleActions.map((action) => (
                            <button
                              key={action.status}
                              type="button"
                              disabled={isBusy}
                              onClick={() => updateStatus(order._id, action.status)}
                              className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${action.color}`}
                            >
                              {isBusy ? "…" : action.label}
                            </button>
                          ))}
                          {!isTerminal && (
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() => cancelOrder(order._id)}
                              className="rounded-md border border-red-700 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-400 hover:bg-red-900/40 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isBusy ? "…" : "Cancel"}
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ───────────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-4 py-2 text-xs text-slate-300">
          <p>
            {filteredOrders.length === 0 ? "0" : `${(currentPage - 1) * perPage + 1}–${Math.min(currentPage * perPage, filteredOrders.length)}`}
            {" "}of {filteredOrders.length} orders
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}
              className="rounded-md border border-slate-600 px-3 py-1 disabled:opacity-40">
              ←
            </button>
            <span>Page {currentPage} / {totalPages}</span>
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}
              className="rounded-md border border-slate-600 px-3 py-1 disabled:opacity-40">
              →
            </button>
          </div>
        </div>
      )}

      {/* ── Order detail modal ───────────────────────────────────── */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          role="dialog" aria-modal="true"
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto rounded-2xl border border-slate-600 bg-slate-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-700 bg-slate-900/95 px-6 py-4 backdrop-blur">
              <div>
                <p className="text-lg font-black uppercase tracking-tight text-white">{selected.orderNumber}</p>
                <p className="text-xs text-slate-500 mt-0.5">{fmt(selected.createdAt)}</p>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <StatusBadge status={selected.orderStatus} />
                  <PayBadge status={selected.paymentStatus} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="shrink-0 rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-bold uppercase text-slate-300 hover:bg-slate-800"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-6">

              {/* Status pipeline */}
              {(allowStatusActions || sellerMode) && (
                <section className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Order pipeline</p>
                  <div className="flex flex-wrap gap-2">
                    {ALL_TABS.filter((t) => t.key !== "cancelled").map((tab, idx, arr) => {
                      const isActive = selected.orderStatus === tab.key;
                      const isPast = arr.findIndex((t) => t.key === selected.orderStatus) > idx;
                      const isCancelled = selected.orderStatus === "cancelled";
                      const cfg = ORDER_STATUS_CONFIG[tab.key];
                      return (
                        <div key={tab.key} className="flex items-center gap-2">
                          <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest border ${
                            isActive
                              ? cfg.badge
                              : isPast && !isCancelled
                              ? "border-emerald-800/50 bg-emerald-900/20 text-emerald-500"
                              : "border-slate-700 text-slate-600"
                          }`}>
                            {(isPast && !isCancelled) ? "✓ " : ""}{tab.label}
                          </div>
                          {idx < arr.length - 1 && (
                            <span className="text-slate-700 text-sm">→</span>
                          )}
                        </div>
                      );
                    })}
                    {selected.orderStatus === "cancelled" && (
                      <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${ORDER_STATUS_CONFIG.cancelled.badge}`}>
                        ✕ Cancelled
                      </span>
                    )}
                  </div>

                  {/* Action buttons */}
                  {selected.orderStatus !== "completed" && selected.orderStatus !== "cancelled" && (
                    <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-700 pt-4">
                      {(NEXT_ACTIONS[selected.orderStatus as OrderStatus] ?? [])
                        .filter((action) => !sellerMode || action.status !== "processing")
                        .map((action) => (
                          <button
                            key={action.status}
                            type="button"
                            disabled={updatingId === selected._id}
                            onClick={() => updateStatus(selected._id, action.status)}
                            className={`rounded-lg border px-4 py-2 text-xs font-bold uppercase tracking-widest disabled:opacity-50 transition-colors ${action.color}`}
                          >
                            {updatingId === selected._id ? "Updating…" : `Mark as ${action.label}`}
                          </button>
                        ))}
                      <button
                        type="button"
                        disabled={updatingId === selected._id}
                        onClick={() => cancelOrder(selected._id)}
                        className="rounded-lg border border-red-700 px-4 py-2 text-xs font-bold uppercase tracking-widest text-red-400 hover:bg-red-900/40 disabled:opacity-50 transition-colors"
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}
                </section>
              )}

              {/* Customer — hidden from sellers */}
              {!sellerMode && (
                <section>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Customer</p>
                  <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-4 text-sm text-slate-300 space-y-1">
                    <p className="text-white font-semibold text-base">{selected.customer.name}</p>
                    <p><span className="text-slate-500">Phone:</span> <a href={`tel:${selected.customer.phone}`} className="text-cyan-400">{selected.customer.phone}</a></p>
                    <p><span className="text-slate-500">Email:</span> {selected.customer.email}</p>
                    <p><span className="text-slate-500">Address:</span> {selected.customer.address}, {selected.customer.city}</p>
                    {(selected.customer.state || "").trim() ? <p><span className="text-slate-500">State:</span> {selected.customer.state}</p> : null}
                    {(selected.customer.postalCode || "").trim() ? <p><span className="text-slate-500">Postal:</span> {selected.customer.postalCode}</p> : null}
                    {selected.customer.notes ? (
                      <p className="pt-2 border-t border-slate-700 mt-2 text-slate-400">
                        <span className="text-slate-500">Notes:</span> {selected.customer.notes}
                      </p>
                    ) : null}
                  </div>
                </section>
              )}

              {/* Payment — hidden from sellers */}
              {!sellerMode && (
                <section>
                  <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">Payment</p>
                  <div className="rounded-xl border border-blue-900/40 bg-blue-950/20 p-4 text-sm text-slate-200 space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <p><span className="text-slate-500">Method:</span> <span className="text-white font-medium">{paymentMethodLabel(selected.paymentMethod)}</span></p>
                      <div className="flex items-center gap-2">
                        <PayBadge status={selected.paymentStatus} />
                        {allowStatusActions && selected.paymentStatus !== "paid" && (
                          <button
                            type="button"
                            disabled={updatingId === selected._id}
                            onClick={() => updatePayment(selected._id, "paid")}
                            className="rounded-md bg-emerald-700 hover:bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white disabled:opacity-50"
                          >
                            Mark Paid
                          </button>
                        )}
                      </div>
                    </div>
                    <p>
                      <span className="text-slate-500">TRX ID:</span>{" "}
                      {selected.paymentTransactionId?.trim()
                        ? <span className="font-mono text-xs text-white break-all">{selected.paymentTransactionId}</span>
                        : <span className="text-slate-600">—</span>}
                    </p>
                    {selected.paymentScreenshotUrl?.trim().startsWith("https://") ? (
                      <div className="pt-2">
                        <p className="text-slate-500 text-xs mb-2">Screenshot</p>
                        <a href={selected.paymentScreenshotUrl} target="_blank" rel="noopener noreferrer"
                          className="text-cyan-400 text-xs underline">Open full image ↗</a>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={selected.paymentScreenshotUrl} alt="Payment proof"
                          className="mt-2 max-h-56 w-auto max-w-full rounded-lg border border-slate-600 object-contain" />
                      </div>
                    ) : <p className="text-slate-600 text-xs">No screenshot uploaded.</p>}
                  </div>
                </section>
              )}

              {/* Items */}
              <section>
                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
                  Items ({selected.items.length})
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-700">
                  <table className="w-full text-sm text-left text-slate-300">
                    <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
                      <tr>
                        <th className="px-3 py-2 w-10" />
                        <th className="px-3 py-2">Product</th>
                        <th className="px-3 py-2">Seller</th>
                        <th className="px-3 py-2">Variant</th>
                        <th className="px-3 py-2 text-center">Qty</th>
                        <th className="px-3 py-2 text-right">Price</th>
                        <th className="px-3 py-2 text-right">Line</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {selected.items.map((item, idx) => {
                        const qty = Math.max(1, Number(item.quantity || 1));
                        const line = Number(item.price || 0) * qty;
                        const img = (item.image || "").trim();
                        const color = (item.color || "").trim();
                        const size = (item.size || "").trim();
                        return (
                          <tr key={idx} className="align-middle">
                            <td className="px-3 py-2">
                              {img
                                ? <img src={img} alt="" className="h-10 w-10 object-cover rounded border border-slate-600" />  // eslint-disable-line @next/next/no-img-element
                                : <div className="h-10 w-10 rounded bg-slate-700 border border-slate-600" />}
                            </td>
                            <td className="px-3 py-2 font-medium text-white max-w-[180px]">{item.name}</td>
                            <td className="px-3 py-2 text-xs">
                              {item.sellerName
                                ? <span className="rounded-full bg-indigo-900/60 px-2 py-0.5 text-indigo-300 font-semibold">{item.sellerName}</span>
                                : <span className="text-slate-600">Store</span>}
                            </td>
                            <td className="px-3 py-2 text-slate-400 text-xs">
                              {color && <span className="mr-1">{color}</span>}
                              {size && <span>{size}</span>}
                              {!color && !size && <span className="text-slate-600">—</span>}
                            </td>
                            <td className="px-3 py-2 text-center tabular-nums">{qty}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{formatPkr(Number(item.price || 0))}</td>
                            <td className="px-3 py-2 text-right font-semibold text-white tabular-nums">{formatPkr(line)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-slate-900/50 text-xs border-t border-slate-700">
                      <tr>
                        <td colSpan={6} className="px-3 py-2 text-right text-slate-500 uppercase tracking-widest">Subtotal</td>
                        <td className="px-3 py-2 text-right text-slate-200">{formatPkr(selected.subtotal)}</td>
                      </tr>
                      {selected.discountAmount > 0 && (
                        <tr>
                          <td colSpan={6} className="px-3 py-2 text-right text-slate-500 uppercase tracking-widest">
                            Discount{selected.couponCode ? ` (${selected.couponCode})` : ""}
                          </td>
                          <td className="px-3 py-2 text-right text-red-300">−{formatPkr(selected.discountAmount)}</td>
                        </tr>
                      )}
                      <tr>
                        <td colSpan={6} className="px-3 py-2 text-right font-bold text-slate-300 uppercase tracking-widest text-sm">Total</td>
                        <td className="px-3 py-2 text-right font-black text-white text-sm">{formatPkr(selected.totalAmount)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </section>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
