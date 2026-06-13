"use client";

import { useEffect, useState } from "react";
import type { UserRole } from "@/lib/auth/jwt";
import { formatPkr } from "@/lib/formatCurrency";

type SellerStats = {
  totalProducts: number;
  activeProducts: number;
  totalSold: number;
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalCommission: number;
  totalNet: number;
  recentOrders: { orderNumber: string; grossAmount: number; commissionAmount: number; netAmount: number; status: string; createdAt: string }[];
  topProducts: { name: string; soldCount: number; price: number }[];
};

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  address: string;
  businessName: string;
  businessCategory: string;
  businessSummary: string;
  sellerApproved: boolean;
  sellerEnabled: boolean;
  assignedCategories: string[];
  commissionRate: number;
  sellerCode: string;
  createdAt: string;
};

type UsersTableProps = {
  initialUsers: AdminUser[];
  allCategories: string[];
};

type Tab = "sellers" | "pending" | "customers";

function truncate(value: string, max: number) {
  if (!value) return "—";
  return value.length > max ? `${value.slice(0, max)}…` : value;
}

export default function UsersTable({ initialUsers, allCategories }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [activeTab, setActiveTab] = useState<Tab>("sellers");
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [editingCommission, setEditingCommission] = useState<string | null>(null);
  const [commissionInput, setCommissionInput] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewingSeller, setViewingSeller] = useState<AdminUser | null>(null);
  const [sellerStats, setSellerStats] = useState<SellerStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  useEffect(() => {
    if (!viewingSeller) return;
    setSellerStats(null);
    setStatsError("");
    setStatsLoading(true);
    fetch(`/api/admin/seller-stats?sellerId=${viewingSeller.id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setStatsError(data.error);
        else setSellerStats(data as SellerStats);
      })
      .catch(() => setStatsError("Failed to load stats"))
      .finally(() => setStatsLoading(false));
  }, [viewingSeller]);

  const approvedSellers = users.filter((u) => u.role === "seller" && u.sellerApproved);
  const pendingSellers = users.filter((u) => u.role === "seller" && !u.sellerApproved);
  const customers = users.filter((u) => u.role === "user");

  const patch = async (id: string, payload: Record<string, unknown>) => {
    setSaving(id);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data.user } : u)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(null);
    }
  };

  const deleteUser = async (id: string) => {
    setSaving(id);
    setError("");
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed.");
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setDeletingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setSaving(null);
    }
  };

  const saveCommission = async (id: string) => {
    const rate = parseFloat(commissionInput);
    if (isNaN(rate) || rate < 0 || rate > 100) {
      setError("Commission rate must be between 0 and 100.");
      return;
    }
    await patch(id, { commissionRate: rate });
    setEditingCommission(null);
  };

  const toggleCategoryLocal = (userId: string, cat: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u;
        const has = u.assignedCategories.includes(cat);
        return {
          ...u,
          assignedCategories: has
            ? u.assignedCategories.filter((c) => c !== cat)
            : [...u.assignedCategories, cat],
        };
      })
    );
  };

  const saveCategories = async (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    await patch(userId, { assignedCategories: user.assignedCategories });
    setAssigningId(null);
  };

  const TAB_CONFIG: { key: Tab; label: string; count: number }[] = [
    { key: "sellers", label: "Active Sellers", count: approvedSellers.length },
    { key: "pending", label: "Pending Approvals", count: pendingSellers.length },
    { key: "customers", label: "Customers", count: customers.length },
  ];

  return (
    <>
    <div className="space-y-6">
      {error ? (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-slate-700">
        {TAB_CONFIG.map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`relative px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
              activeTab === key
                ? "text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-amber-400"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {label}
            <span
              className={`ml-2 inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] leading-none ${
                activeTab === key
                  ? "bg-amber-400/20 text-amber-400"
                  : "bg-slate-700 text-slate-400"
              } ${key === "pending" && count > 0 ? "!bg-amber-500 !text-slate-950" : ""}`}
            >
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* ── ACTIVE SELLERS TAB ── */}
      {activeTab === "sellers" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Seller Commission Rates</h2>
            <p className="text-slate-400 text-sm">Set individual commission rates and assign product categories for each seller</p>
          </div>

          {approvedSellers.length === 0 ? (
            <p className="text-slate-500 text-sm">No approved sellers yet.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {approvedSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="flex flex-col rounded-2xl border border-slate-700 bg-slate-800/60 p-5 gap-4"
                >
                  {/* Card header */}
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setViewingSeller(seller)}
                      title="View seller stats"
                      className="ml-auto shrink-0 flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                        <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      View
                    </button>
                    <div className="min-w-0 flex-1 order-first">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-bold text-white text-base leading-tight">{seller.name}</p>
                        {/* Toggle */}
                        <button
                          type="button"
                          disabled={saving === seller.id}
                          onClick={() => patch(seller.id, { sellerEnabled: !seller.sellerEnabled })}
                          title={seller.sellerEnabled ? "Disable seller" : "Enable seller"}
                          className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none disabled:opacity-50 ${
                            seller.sellerEnabled ? "bg-emerald-500" : "bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                              seller.sellerEnabled ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                            seller.sellerEnabled
                              ? "bg-emerald-900/60 text-emerald-300"
                              : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {seller.sellerEnabled ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      {seller.businessName ? (
                        <p className="text-slate-400 text-xs mt-0.5 truncate">{seller.businessName}</p>
                      ) : null}
                      {seller.sellerCode ? (
                        <p className="text-[11px] font-mono font-bold text-amber-400 mt-0.5">{seller.sellerCode}</p>
                      ) : null}
                      <p className="text-slate-500 text-xs truncate">{seller.email}</p>
                      {seller.phone ? <p className="text-slate-500 text-xs">{seller.phone}</p> : null}
                      {seller.businessCategory ? (
                        <span className="mt-1 inline-flex rounded-full bg-indigo-900/50 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                          {seller.businessCategory}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <hr className="border-slate-700" />

                  {/* Commission rate */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-slate-400 text-sm font-medium">Commission Rate:</span>
                    {editingCommission === seller.id ? (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          step={0.1}
                          value={commissionInput}
                          onChange={(e) => setCommissionInput(e.target.value)}
                          className="w-16 rounded-lg bg-slate-700 border border-slate-600 px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-amber-500"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveCommission(seller.id);
                            if (e.key === "Escape") setEditingCommission(null);
                          }}
                        />
                        <span className="text-slate-400 text-sm">%</span>
                        <button
                          type="button"
                          disabled={saving === seller.id}
                          onClick={() => saveCommission(seller.id)}
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingCommission(null)}
                          className="rounded-lg bg-slate-700 px-2 py-1 text-[11px] text-slate-300 hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold text-lg leading-none">
                          {seller.commissionRate}%
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCommission(seller.id);
                            setCommissionInput(String(seller.commissionRate));
                          }}
                          title="Edit commission rate"
                          className="rounded-lg bg-amber-500 p-1.5 text-slate-950 hover:bg-amber-400 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-slate-400 text-sm font-medium">Categories:</span>
                      <button
                        type="button"
                        onClick={() => setAssigningId(assigningId === seller.id ? null : seller.id)}
                        className="flex items-center gap-1 rounded-lg border border-indigo-500/40 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-500/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                        </svg>
                        Assign
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 min-h-[24px]">
                      {seller.assignedCategories.length > 0 ? (
                        seller.assignedCategories.map((cat) => (
                          <span
                            key={cat}
                            className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-medium text-white"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-xs italic">
                          None assigned — all categories visible
                        </span>
                      )}
                    </div>

                    {assigningId === seller.id && (
                      <div className="mt-3 rounded-xl border border-slate-600 bg-slate-900/80 p-3 space-y-3">
                        <p className="text-xs text-slate-400 font-medium">
                          Toggle categories this seller can list products under:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allCategories.map((cat) => {
                            const active = seller.assignedCategories.includes(cat);
                            return (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => toggleCategoryLocal(seller.id, cat)}
                                className={`rounded-full px-2.5 py-1 text-[11px] font-medium border transition-colors ${
                                  active
                                    ? "bg-indigo-600 border-indigo-500 text-white"
                                    : "bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400"
                                }`}
                              >
                                {active ? "✓ " : ""}
                                {cat}
                              </button>
                            );
                          })}
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={saving === seller.id}
                            onClick={() => saveCategories(seller.id)}
                            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                          >
                            {saving === seller.id ? "Saving…" : "Save categories"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setAssigningId(null)}
                            className="rounded-lg bg-slate-700 px-3 py-1.5 text-[11px] text-slate-300 hover:bg-slate-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Business summary */}
                  {seller.businessSummary ? (
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {truncate(seller.businessSummary, 120)}
                    </p>
                  ) : null}

                  <hr className="border-slate-700" />

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      disabled={saving === seller.id}
                      onClick={() => patch(seller.id, { sellerApproved: false })}
                      className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors disabled:opacity-50"
                    >
                      Disapprove
                    </button>

                    {deletingId === seller.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Are you sure?</span>
                        <button
                          type="button"
                          disabled={saving === seller.id}
                          onClick={() => deleteUser(seller.id)}
                          className="rounded-lg bg-red-600 px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                        >
                          {saving === seller.id ? "Deleting…" : "Yes, delete"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="rounded-lg bg-slate-700 px-2.5 py-1.5 text-[11px] text-slate-300 hover:bg-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeletingId(seller.id)}
                        className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-[11px] font-semibold text-red-300 hover:bg-red-500/20 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PENDING APPROVALS TAB ── */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Pending Seller Applications</h2>
            <p className="text-slate-400 text-sm">Review applications and approve or reject</p>
          </div>

          {pendingSellers.length === 0 ? (
            <p className="text-slate-500 text-sm">No pending applications.</p>
          ) : (
            <div className="space-y-4">
              {pendingSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="rounded-2xl border border-amber-500/20 bg-slate-800/60 p-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="inline-flex rounded-full bg-amber-900/60 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                        Pending approval
                      </span>
                      <p className="font-bold text-white text-lg mt-1">{seller.name}</p>
                      {seller.sellerCode ? (
                        <p className="text-[11px] font-mono font-bold text-amber-400">{seller.sellerCode}</p>
                      ) : null}
                      {seller.businessName ? (
                        <p className="text-slate-300 text-sm font-medium">{seller.businessName}</p>
                      ) : null}
                      <p className="text-slate-400 text-sm">{seller.email}</p>
                      {seller.phone ? <p className="text-slate-500 text-sm">{seller.phone}</p> : null}
                      {seller.address ? <p className="text-slate-500 text-sm">{seller.address}</p> : null}
                      {seller.businessCategory ? (
                        <span className="mt-1 inline-flex rounded-full bg-indigo-900/50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                          {seller.businessCategory}
                        </span>
                      ) : null}
                      {seller.businessSummary ? (
                        <p className="text-slate-400 text-sm mt-2 max-w-xl leading-relaxed">
                          {seller.businessSummary}
                        </p>
                      ) : null}
                      <p className="text-slate-600 text-xs pt-1">Applied: {seller.createdAt}</p>
                    </div>

                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        type="button"
                        disabled={saving === seller.id}
                        onClick={() => patch(seller.id, { sellerApproved: true })}
                        className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                      >
                        {saving === seller.id ? "Approving…" : "Approve"}
                      </button>

                      {deletingId === seller.id ? (
                        <div className="flex flex-col gap-1.5">
                          <button
                            type="button"
                            disabled={saving === seller.id}
                            onClick={() => deleteUser(seller.id)}
                            className="inline-flex items-center justify-center rounded-full bg-red-600 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white hover:bg-red-500 disabled:opacity-50"
                          >
                            {saving === seller.id ? "Deleting…" : "Confirm Delete"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            className="rounded-full bg-slate-700 px-5 py-2 text-[11px] font-semibold text-slate-300 hover:bg-slate-600 text-center"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setDeletingId(seller.id)}
                          className="inline-flex items-center justify-center rounded-full border border-red-500/40 bg-red-500/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-red-300 hover:bg-red-500/20 transition-colors"
                        >
                          Reject & Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CUSTOMERS TAB ── */}
      {activeTab === "customers" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white">Customer Accounts</h2>
            <p className="text-slate-400 text-sm">Regular shoppers registered on the platform</p>
          </div>

          {customers.length === 0 ? (
            <p className="text-slate-500 text-sm">No customer accounts yet.</p>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
              <table className="w-full text-sm text-left text-slate-300 min-w-[560px]">
                <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-bold">Name</th>
                    <th className="px-4 py-3 font-bold">Email / Phone</th>
                    <th className="px-4 py-3 font-bold whitespace-nowrap">Joined</th>
                    <th className="px-4 py-3 font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {customers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-800/80">
                      <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                      <td className="px-4 py-3">
                        <div>{user.email}</div>
                        <div className="text-slate-500 text-xs">{user.phone || "—"}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                        {user.createdAt}
                      </td>
                      <td className="px-4 py-3">
                        {deletingId === user.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              disabled={saving === user.id}
                              onClick={() => deleteUser(user.id)}
                              className="rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                            >
                              {saving === user.id ? "Deleting…" : "Confirm"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeletingId(null)}
                              className="rounded-lg bg-slate-700 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDeletingId(user.id)}
                            className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>

      {/* ── Seller Stats Modal ── */}
      {viewingSeller && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-black/60"
            onClick={() => setViewingSeller(null)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[81] flex items-center justify-center p-4">
            <div
              className="flex w-full max-w-2xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl"
              style={{ maxHeight: "90vh" }}
            >
              {/* Modal header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-700 px-6 py-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">Seller Overview</p>
                  <h2 className="text-lg font-black text-white">{viewingSeller.name}</h2>
                  {viewingSeller.sellerCode && (
                    <p className="font-mono text-xs font-bold text-amber-400">{viewingSeller.sellerCode}</p>
                  )}
                  {viewingSeller.businessName && (
                    <p className="text-slate-400 text-xs mt-0.5">{viewingSeller.businessName}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setViewingSeller(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {statsLoading && (
                  <p className="text-slate-400 text-sm text-center py-8">Loading stats…</p>
                )}
                {statsError && (
                  <p className="text-red-400 text-sm text-center py-8">{statsError}</p>
                )}
                {sellerStats && !statsLoading && (
                  <>
                    {/* Stat cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Total Orders", value: sellerStats.totalOrders, sub: `${sellerStats.completedOrders} completed` },
                        { label: "Products Listed", value: sellerStats.totalProducts, sub: `${sellerStats.activeProducts} active` },
                        { label: "Items Sold", value: sellerStats.totalSold, sub: "units" },
                        { label: "Total Revenue", value: formatPkr(sellerStats.totalRevenue), sub: "gross" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{s.label}</p>
                          <p className="text-xl font-black text-white mt-1">{s.value}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">{s.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* Commission summary */}
                    <div className="rounded-xl border border-amber-500/30 bg-amber-950/30 px-5 py-4 grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Total Revenue</p>
                        <p className="text-base font-black text-white">{formatPkr(sellerStats.totalRevenue)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/80 mb-1">Admin Commission</p>
                        <p className="text-base font-black text-amber-400">{formatPkr(sellerStats.totalCommission)}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/80 mb-1">Seller Net</p>
                        <p className="text-base font-black text-emerald-400">{formatPkr(sellerStats.totalNet)}</p>
                      </div>
                    </div>

                    {/* Top products */}
                    {sellerStats.topProducts.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Top Products</p>
                        <div className="space-y-2">
                          {sellerStats.topProducts.map((p, i) => (
                            <div key={i} className="flex items-center justify-between gap-3 rounded-lg bg-slate-800/60 px-3 py-2">
                              <p className="text-sm text-white truncate flex-1">{p.name}</p>
                              <span className="text-xs text-slate-400 whitespace-nowrap">{p.soldCount} sold</span>
                              <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">{formatPkr(p.price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent completed orders */}
                    {sellerStats.recentOrders.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Recent Completed Orders</p>
                        <div className="overflow-x-auto rounded-xl border border-slate-700">
                          <table className="w-full text-xs text-left text-slate-300 min-w-[420px]">
                            <thead className="bg-slate-800/80 text-[10px] uppercase tracking-widest text-slate-500">
                              <tr>
                                <th className="px-3 py-2 font-bold">Order #</th>
                                <th className="px-3 py-2 font-bold text-right">Revenue</th>
                                <th className="px-3 py-2 font-bold text-right text-amber-400">Commission</th>
                                <th className="px-3 py-2 font-bold text-right text-emerald-400">Net</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {sellerStats.recentOrders.map((o) => (
                                <tr key={o.orderNumber} className="hover:bg-slate-800/60">
                                  <td className="px-3 py-2 font-mono text-white">{o.orderNumber}</td>
                                  <td className="px-3 py-2 text-right tabular-nums">{formatPkr(o.grossAmount)}</td>
                                  <td className="px-3 py-2 text-right tabular-nums text-amber-400">{formatPkr(o.commissionAmount)}</td>
                                  <td className="px-3 py-2 text-right tabular-nums text-emerald-400">{formatPkr(o.netAmount)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {sellerStats.recentOrders.length === 0 && sellerStats.totalProducts === 0 && (
                      <p className="text-slate-500 text-sm text-center py-4">No activity yet for this seller.</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
