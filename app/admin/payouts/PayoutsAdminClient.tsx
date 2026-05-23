"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPkr } from "@/lib/formatCurrency";

type Payout = {
  _id: string;
  amount: number;
  status: string;
  sellerNote: string;
  adminNote: string;
  seller?: { name: string; email: string } | null;
  createdAt: string;
};

export default function PayoutsAdminClient() {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payouts", { credentials: "include" });
      const data = await res.json();
      setPayouts(data.payouts || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (id: string, status: string) => {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/payouts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed");
        return;
      }
      await load();
    } finally {
      setActingId(null);
    }
  };

  if (loading) return <p className="text-slate-400 text-sm">Loading payout requests…</p>;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 uppercase text-xs tracking-widest border-b border-slate-700">
              <th className="p-4">Vendor</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Requested</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((p) => (
              <tr key={p._id} className="border-b border-slate-700/80">
                <td className="p-4 text-slate-300">
                  {p.seller?.name || "—"}
                  <p className="text-xs text-slate-500">{p.seller?.email}</p>
                  {p.sellerNote ? (
                    <p className="text-xs text-slate-400 mt-1">Note: {p.sellerNote}</p>
                  ) : null}
                </td>
                <td className="p-4 text-white font-semibold">{formatPkr(p.amount)}</td>
                <td className="p-4 capitalize text-slate-300">{p.status}</td>
                <td className="p-4 text-slate-400 text-xs">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="p-4">
                  {p.status === "pending" && (
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={actingId === p._id}
                        onClick={() => updateStatus(p._id, "paid")}
                        className="px-2 py-1 rounded bg-emerald-600/30 text-emerald-300 text-xs disabled:opacity-50"
                      >
                        Mark paid
                      </button>
                      <button
                        type="button"
                        disabled={actingId === p._id}
                        onClick={() => {
                          if (!confirm("Reject and release reserved earnings?")) return;
                          updateStatus(p._id, "rejected");
                        }}
                        className="px-2 py-1 rounded bg-red-900/30 text-red-300 text-xs disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {payouts.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No payout requests yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

