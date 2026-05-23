"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPkr } from "@/lib/formatCurrency";

type PendingProduct = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  stockQuantity: number;
  seller?: { name: string; email: string } | null;
  createdAt: string;
};

export default function ApprovalsClient() {
  const router = useRouter();
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/approvals", { credentials: "include" });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const decide = async (id: string, decision: "approve" | "reject", publish?: boolean) => {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ decision, publish: publish === true }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed");
        return;
      }
      await load();
      router.refresh();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return <p className="text-slate-400 text-sm">Loading pending vendor products…</p>;
  }

  if (products.length === 0) {
    return (
      <p className="text-slate-400 text-sm bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
        No vendor products awaiting approval.
      </p>
    );
  }

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 uppercase text-xs tracking-widest border-b border-slate-700">
              <th className="p-4">Product</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4">Submitted</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b border-slate-700/80">
                <td className="p-4">
                  <Link
                    href={`/admin/products/${p._id}/edit`}
                    className="text-white font-medium hover:text-amber-300"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-slate-500">{p.brand}</p>
                </td>
                <td className="p-4 text-slate-300">
                  {p.seller?.name || "—"}
                  <p className="text-xs text-slate-500">{p.seller?.email}</p>
                </td>
                <td className="p-4 text-slate-300">{formatPkr(p.price)}</td>
                <td className="p-4 text-slate-300">{p.stockQuantity}</td>
                <td className="p-4 text-slate-400 text-xs">
                  {new Date(p.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={actingId === p._id}
                      onClick={() => decide(p._id, "approve", true)}
                      className="px-3 py-1 rounded bg-emerald-600/30 text-emerald-300 text-xs hover:bg-emerald-600/50 disabled:opacity-50"
                    >
                      Approve & publish
                    </button>
                    <button
                      type="button"
                      disabled={actingId === p._id}
                      onClick={() => decide(p._id, "approve", false)}
                      className="px-3 py-1 rounded bg-slate-600/40 text-slate-200 text-xs hover:bg-slate-600 disabled:opacity-50"
                    >
                      Approve only
                    </button>
                    <button
                      type="button"
                      disabled={actingId === p._id}
                      onClick={() => {
                        if (!confirm("Reject this listing?")) return;
                        decide(p._id, "reject");
                      }}
                      className="px-3 py-1 rounded bg-red-900/30 text-red-300 text-xs hover:bg-red-900/50 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}




