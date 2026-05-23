"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { IProduct } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";

type Days = 30 | 60 | 90;

export default function SlowMovingClient() {
  const router = useRouter();
  const [days, setDays] = useState<Days>(30);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [discountInput, setDiscountInput] = useState("15");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/inventory/slow-moving?days=${days}`, {
        credentials: "include",
      });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    load();
  }, [load]);

  const runAction = async (
    productId: string,
    action: string,
    extra?: Record<string, unknown>
  ) => {
    setActingId(productId);
    try {
      const res = await fetch("/api/admin/inventory/actions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ productId, action, ...extra }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Action failed");
        return;
      }
      await load();
      router.refresh();
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">
            No sales in
          </label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value) as Days)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm"
          >
            <option value={30}>30 days</option>
            <option value={60}>60 days</option>
            <option value={90}>90 days</option>
          </select>
        </div>
        <div>
          <label className="text-xs uppercase tracking-widest text-slate-500 font-bold block mb-1">
            Discount %
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm w-24"
          />
        </div>
        <p className="text-sm text-slate-400 pb-2">
          {loading ? "Loading…" : `${products.length} slow-moving product(s)`}
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 uppercase text-xs tracking-widest border-b border-slate-700">
                <th className="p-4">Product</th>
                <th className="p-4">Sold</th>
                <th className="p-4">Last sold</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-slate-700/80 hover:bg-slate-700/30">
                  <td className="p-4">
                    <Link
                      href={`/admin/products/${p._id}/edit`}
                      className="text-white font-medium hover:text-amber-300"
                    >
                      {p.name}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {p.isClearance ? "Clearance · " : ""}
                      {p.isHidden ? "Hidden · " : ""}
                      {p.isArchived ? "Archived" : ""}
                    </p>
                  </td>
                  <td className="p-4 text-slate-300 tabular-nums">{p.soldCount ?? 0}</td>
                  <td className="p-4 text-slate-400 text-xs">
                    {p.lastSoldAt ? new Date(p.lastSoldAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-4 text-slate-300">{p.stockQuantity}</td>
                  <td className="p-4 text-slate-300">{formatPkr(p.price)}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={actingId === p._id}
                        onClick={() =>
                          runAction(p._id, "applyDiscount", {
                            discount: Number(discountInput) || 15,
                          })
                        }
                        className="px-2 py-1 rounded bg-amber-600/20 text-amber-300 text-xs hover:bg-amber-600/40 disabled:opacity-50"
                      >
                        Discount
                      </button>
                      <button
                        type="button"
                        disabled={actingId === p._id}
                        onClick={() =>
                          runAction(p._id, "markClearance", {
                            discount: Number(discountInput) || 25,
                          })
                        }
                        className="px-2 py-1 rounded bg-orange-600/20 text-orange-300 text-xs hover:bg-orange-600/40 disabled:opacity-50"
                      >
                        Clearance
                      </button>
                      <button
                        type="button"
                        disabled={actingId === p._id}
                        onClick={() => runAction(p._id, "hide")}
                        className="px-2 py-1 rounded bg-slate-600/40 text-slate-200 text-xs hover:bg-slate-600 disabled:opacity-50"
                      >
                        Hide
                      </button>
                      <button
                        type="button"
                        disabled={actingId === p._id}
                        onClick={() => {
                          if (!confirm(`Archive "${p.name}"?`)) return;
                          runAction(p._id, "archive");
                        }}
                        className="px-2 py-1 rounded bg-red-900/30 text-red-300 text-xs hover:bg-red-900/50 disabled:opacity-50"
                      >
                        Archive
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No slow-moving products for this period.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
