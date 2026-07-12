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
  recentOrders: { orderNumber: string; grossAmount: number; commissionRate: number; commissionAmount: number; netAmount: number; status: string; createdAt: string }[];
  topProducts: { name: string; soldCount: number; price: number }[];
};

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  whatsapp: string;
  address: string;
  businessName: string;
  businessCategory: string;
  businessSummary: string;
  cnic: string;
  cnicFront: string;
  cnicBack: string;
  sellerImage: string;
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

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="flex gap-2">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-24">{label}</span>
      <span className="text-sm text-slate-200 break-all">{value}</span>
    </div>
  );
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
  const [statsPeriod, setStatsPeriod] = useState<"7d" | "30d" | "lifetime">("lifetime");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", whatsapp: "", address: "", password: "" });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState("");

  useEffect(() => {
    if (!viewingSeller) return;
    setSellerStats(null);
    setStatsError("");
    setStatsLoading(true);
    fetch(`/api/admin/seller-stats?sellerId=${viewingSeller.id}&period=${statsPeriod}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setStatsError(data.error);
        else setSellerStats(data as SellerStats);
      })
      .catch(() => setStatsError("Failed to load stats"))
      .finally(() => setStatsLoading(false));
  }, [viewingSeller, statsPeriod]);

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

  const openEdit = (user: AdminUser) => {
    setEditForm({ name: user.name, email: user.email, phone: user.phone, whatsapp: user.whatsapp, address: user.address, password: "" });
    setEditError("");
    setEditingUser(user);
  };

  const saveEdit = async () => {
    if (!editingUser) return;
    if (!editForm.name.trim()) { setEditError("Name is required."); return; }
    if (!editForm.email.trim()) { setEditError("Email is required."); return; }
    if (editForm.password && editForm.password.length < 6) { setEditError("Password must be at least 6 characters."); return; }
    setEditSaving(true);
    setEditError("");
    try {
      const payload: Record<string, string> = {
        name: editForm.name.trim(),
        email: editForm.email.trim(),
        phone: editForm.phone.trim(),
        whatsapp: editForm.whatsapp.trim(),
        address: editForm.address.trim(),
      };
      if (editForm.password) payload.password = editForm.password;
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingUser.id, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed.");
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...data.user } : u)));
      setEditingUser(null);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setEditSaving(false);
    }
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
      <div className="flex gap-0 border-b border-slate-700 overflow-x-auto">
        {TAB_CONFIG.map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`relative shrink-0 px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${
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
                  <div className="flex items-start gap-3">
                    {/* Seller photo */}
                    {seller.sellerImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={seller.sellerImage}
                        alt={seller.name}
                        className="h-12 w-12 rounded-full object-cover border-2 border-slate-600 shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0">
                        <span className="text-slate-400 text-lg font-black">
                          {seller.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
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
                      {seller.whatsapp ? (
                        <p className="text-slate-500 text-xs flex items-center gap-1">
                          <span className="font-semibold text-emerald-400">WA:</span> {seller.whatsapp}
                        </p>
                      ) : null}
                      {seller.businessCategory ? (
                        <span className="mt-1 inline-flex rounded-full bg-indigo-900/50 px-2 py-0.5 text-[10px] font-medium text-indigo-300">
                          {seller.businessCategory}
                        </span>
                      ) : null}
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <button
                        type="button"
                        onClick={() => { setStatsPeriod("lifetime"); setViewingSeller(seller); }}
                        title="View seller stats"
                        className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
                          <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.186A10.004 10.004 0 0110 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0110 17c-4.257 0-7.893-2.66-9.336-6.41zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => openEdit(seller)}
                        title="Edit user details"
                        className="flex items-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                          <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                        </svg>
                        Edit
                      </button>
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
                          <span key={cat} className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[11px] font-medium text-white">
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 text-xs italic">None assigned — all categories visible</span>
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
                                {active ? "✓ " : ""}{cat}
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

                  {seller.businessSummary ? (
                    <p className="text-slate-500 text-xs leading-relaxed">{truncate(seller.businessSummary, 120)}</p>
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
            <p className="text-slate-400 text-sm">Review full application details before approving or rejecting</p>
          </div>

          {pendingSellers.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center rounded-xl border border-slate-700 bg-slate-800/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
              </svg>
              <p className="text-slate-400 font-semibold">All clear</p>
              <p className="text-slate-600 text-sm mt-1">No pending applications at this time.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendingSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="rounded-2xl border border-amber-500/25 bg-slate-800/60 overflow-hidden"
                >
                  {/* Card top bar */}
                  <div className="flex items-center justify-between gap-3 px-5 py-3 bg-amber-900/20 border-b border-amber-500/20">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Pending Approval
                    </span>
                    <span className="text-slate-500 text-xs">Applied: {seller.createdAt}</span>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row gap-6">

                      {/* LEFT — identity + info */}
                      <div className="flex-1 min-w-0 space-y-5">

                        {/* Profile header */}
                        <div className="flex items-center gap-4">
                          {seller.sellerImage ? (
                            <button
                              type="button"
                              onClick={() => setLightboxUrl(seller.sellerImage)}
                              className="relative h-16 w-16 shrink-0 rounded-full overflow-hidden border-2 border-slate-600 hover:border-amber-400 transition-colors group"
                              title="View full photo"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={seller.sellerImage} alt={seller.name} className="h-full w-full object-cover" />
                              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">View</span>
                            </button>
                          ) : (
                            <div className="h-16 w-16 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                              </svg>
                            </div>
                          )}
                          <div className="min-w-0">
                            <h3 className="text-xl font-black text-white leading-tight">{seller.name}</h3>
                            {seller.businessName && (
                              <p className="text-slate-300 text-sm font-medium mt-0.5">{seller.businessName}</p>
                            )}
                            {seller.businessCategory && (
                              <span className="inline-flex rounded-full bg-indigo-900/60 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300 mt-1">
                                {seller.businessCategory}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-2.5">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Contact Information</p>
                          <InfoRow label="Email" value={seller.email} />
                          <InfoRow label="Phone" value={seller.phone} />
                          <InfoRow label="WhatsApp" value={seller.whatsapp} />
                          <InfoRow label="Address" value={seller.address} />
                        </div>

                        {/* Business info */}
                        {(seller.businessName || seller.businessCategory || seller.businessSummary) && (
                          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4 space-y-2.5">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Business Details</p>
                            <InfoRow label="Name" value={seller.businessName} />
                            <InfoRow label="Category" value={seller.businessCategory} />
                            {seller.businessSummary && (
                              <div className="flex gap-2">
                                <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-24 mt-0.5">Summary</span>
                                <p className="text-sm text-slate-200 leading-relaxed">{seller.businessSummary}</p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* CNIC */}
                        {seller.cnic && (
                          <div className="rounded-xl border border-slate-700 bg-slate-900/50 p-4">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">CNIC Number</p>
                            <p className="font-mono text-base font-bold text-white tracking-widest">{seller.cnic}</p>
                          </div>
                        )}
                      </div>

                      {/* RIGHT — document images */}
                      <div className="lg:w-72 xl:w-80 shrink-0 space-y-4">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Verification Documents</p>

                        {/* CNIC Front */}
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-slate-400">CNIC — Front</p>
                          {seller.cnicFront ? (
                            <button
                              type="button"
                              onClick={() => setLightboxUrl(seller.cnicFront)}
                              className="block w-full rounded-lg overflow-hidden border border-slate-600 hover:border-amber-400 transition-colors group relative"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={seller.cnicFront}
                                alt="CNIC Front"
                                className="w-full h-36 object-cover group-hover:brightness-90 transition-all"
                              />
                              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                                  Click to enlarge
                                </span>
                              </span>
                            </button>
                          ) : (
                            <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800/50">
                              <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <p className="text-slate-600 text-xs">Not uploaded</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* CNIC Back */}
                        <div className="space-y-1.5">
                          <p className="text-xs font-semibold text-slate-400">CNIC — Back</p>
                          {seller.cnicBack ? (
                            <button
                              type="button"
                              onClick={() => setLightboxUrl(seller.cnicBack)}
                              className="block w-full rounded-lg overflow-hidden border border-slate-600 hover:border-amber-400 transition-colors group relative"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={seller.cnicBack}
                                alt="CNIC Back"
                                className="w-full h-36 object-cover group-hover:brightness-90 transition-all"
                              />
                              <span className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[11px] font-bold px-3 py-1 rounded-full">
                                  Click to enlarge
                                </span>
                              </span>
                            </button>
                          ) : (
                            <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-slate-600 bg-slate-800/50">
                              <div className="text-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-600 mx-auto mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <p className="text-slate-600 text-xs">Not uploaded</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-col gap-2.5 pt-2">
                          <button
                            type="button"
                            disabled={saving === seller.id}
                            onClick={() => patch(seller.id, { sellerApproved: true })}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-xs font-bold uppercase tracking-widest text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                          >
                            {saving === seller.id ? (
                              <>
                                <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                                </svg>
                                Approving…
                              </>
                            ) : (
                              <>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                </svg>
                                Approve Seller
                              </>
                            )}
                          </button>

                          {deletingId === seller.id ? (
                            <div className="flex flex-col gap-2">
                              <p className="text-xs text-center text-slate-400">This will permanently delete the application.</p>
                              <button
                                type="button"
                                disabled={saving === seller.id}
                                onClick={() => deleteUser(seller.id)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-red-500 disabled:opacity-50"
                              >
                                {saving === seller.id ? "Deleting…" : "Confirm Reject & Delete"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(null)}
                                className="rounded-xl bg-slate-700 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-600 text-center"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(seller.id)}
                              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-red-300 hover:bg-red-500/20 transition-colors"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                              </svg>
                              Reject & Delete
                            </button>
                          )}
                        </div>
                      </div>
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
                      <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{user.createdAt}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEdit(user)}
                            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-300 hover:bg-amber-500/20 transition-colors"
                          >
                            Edit
                          </button>
                          {deletingId === user.id ? (
                            <>
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
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeletingId(user.id)}
                              className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] text-red-400 hover:bg-red-500/20 transition-colors"
                            >
                              Delete
                            </button>
                          )}
                        </div>
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

      {/* ── Edit User Modal ── */}
      {editingUser && (
        <>
          <div className="fixed inset-0 z-[90] bg-black/60" onClick={() => setEditingUser(null)} aria-hidden="true" />
          <div className="fixed inset-0 z-[91] flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Edit User</p>
                  <h2 className="text-base font-black text-white mt-0.5">{editingUser.name}</h2>
                  <p className="text-xs text-slate-500">{editingUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5 space-y-4">
                {editError && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">
                    {editError}
                  </div>
                )}

                {/* Profile fields */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Profile Details</p>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">Email</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">Phone</label>
                    <input
                      type="text"
                      value={editForm.phone}
                      onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      placeholder="+92..."
                    />
                  </div>

                  {editingUser.role === "seller" && (
                    <>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">WhatsApp</label>
                        <input
                          type="text"
                          value={editForm.whatsapp}
                          onChange={(e) => setEditForm((f) => ({ ...f, whatsapp: e.target.value }))}
                          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                          placeholder="+92..."
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">Address</label>
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                          placeholder="Full address"
                        />
                      </div>
                    </>
                  )}
                </div>

                {/* Password section */}
                <div className="space-y-3 border-t border-slate-700 pt-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Change Password</p>
                    <p className="text-[11px] text-slate-600 mt-0.5">Leave blank to keep the current password.</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-slate-400">New Password</label>
                    <input
                      type="password"
                      value={editForm.password}
                      onChange={(e) => setEditForm((f) => ({ ...f, password: e.target.value }))}
                      className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                      placeholder="Min. 6 characters"
                      autoComplete="new-password"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-700 px-6 py-4">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={editSaving}
                  onClick={saveEdit}
                  className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-black uppercase tracking-widest text-zinc-950 hover:bg-amber-400 disabled:opacity-50 transition-colors"
                >
                  {editSaving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Image Lightbox ── */}
      {lightboxUrl && (
        <button
          type="button"
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/90 p-4"
          onClick={() => setLightboxUrl(null)}
          aria-label="Close image"
        >
          <span className="absolute right-4 top-4 border border-white/40 bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white rounded-lg">
            Close ✕
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={lightboxUrl}
            alt="Document"
            className="max-h-[90vh] max-w-[92vw] rounded-xl border border-white/10 object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}

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
                <div className="flex items-center gap-3 min-w-0">
                  {viewingSeller.sellerImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={viewingSeller.sellerImage} alt={viewingSeller.name} className="h-12 w-12 rounded-full object-cover border-2 border-slate-600 shrink-0" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center shrink-0">
                      <span className="text-slate-300 text-lg font-black">{viewingSeller.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-0.5">Seller Overview</p>
                    <h2 className="text-lg font-black text-white">{viewingSeller.name}</h2>
                    {viewingSeller.sellerCode && (
                      <p className="font-mono text-xs font-bold text-amber-400">{viewingSeller.sellerCode}</p>
                    )}
                    {viewingSeller.businessName && (
                      <p className="text-slate-400 text-xs mt-0.5">{viewingSeller.businessName}</p>
                    )}
                    <div className="flex flex-wrap gap-3 mt-1">
                      {viewingSeller.phone && <p className="text-slate-400 text-xs">{viewingSeller.phone}</p>}
                      {viewingSeller.whatsapp && (
                        <p className="text-xs flex items-center gap-1">
                          <span className="font-semibold text-emerald-400">WA:</span>
                          <span className="text-slate-400">{viewingSeller.whatsapp}</span>
                        </p>
                      )}
                    </div>
                  </div>
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

                {/* ── Seller Full Details ── */}
                <div className="rounded-xl border border-slate-700 bg-slate-800/50 divide-y divide-slate-700">
                  {/* Contact */}
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Contact Info</p>
                    {viewingSeller.email && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Email</span>
                        <span className="text-sm text-slate-200 break-all">{viewingSeller.email}</span>
                      </div>
                    )}
                    {viewingSeller.phone && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Phone</span>
                        <span className="text-sm text-slate-200">{viewingSeller.phone}</span>
                      </div>
                    )}
                    {viewingSeller.whatsapp && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">WhatsApp</span>
                        <span className="text-sm text-emerald-300">{viewingSeller.whatsapp}</span>
                      </div>
                    )}
                    {viewingSeller.address && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Address</span>
                        <span className="text-sm text-slate-200">{viewingSeller.address}</span>
                      </div>
                    )}
                    {viewingSeller.createdAt && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Joined</span>
                        <span className="text-sm text-slate-200">{new Date(viewingSeller.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    )}
                  </div>

                  {/* Business */}
                  <div className="px-4 py-3 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Business Info</p>
                    {viewingSeller.businessName && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Business</span>
                        <span className="text-sm text-slate-200">{viewingSeller.businessName}</span>
                      </div>
                    )}
                    {viewingSeller.businessCategory && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Category</span>
                        <span className="text-sm text-slate-200">{viewingSeller.businessCategory}</span>
                      </div>
                    )}
                    {viewingSeller.businessSummary && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Summary</span>
                        <span className="text-sm text-slate-200">{viewingSeller.businessSummary}</span>
                      </div>
                    )}
                    {viewingSeller.sellerCode && (
                      <div className="flex gap-2">
                        <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Seller Code</span>
                        <span className="text-sm font-mono font-bold text-amber-400">{viewingSeller.sellerCode}</span>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Commission</span>
                      <span className="text-sm font-bold text-amber-300">{viewingSeller.commissionRate ?? 0}%</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">Status</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${viewingSeller.sellerApproved ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"}`}>
                        {viewingSeller.sellerApproved ? "Approved" : "Pending"}
                      </span>
                      {!viewingSeller.sellerEnabled && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 ml-1">Disabled</span>
                      )}
                    </div>
                  </div>

                  {/* CNIC */}
                  {(viewingSeller.cnic || viewingSeller.cnicFront || viewingSeller.cnicBack) && (
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">CNIC</p>
                      {viewingSeller.cnic && (
                        <div className="flex gap-2">
                          <span className="shrink-0 text-[11px] font-bold uppercase tracking-widest text-slate-500 w-28">CNIC No.</span>
                          <span className="text-sm font-mono text-slate-200">{viewingSeller.cnic}</span>
                        </div>
                      )}
                      {(viewingSeller.cnicFront || viewingSeller.cnicBack) && (
                        <div className="flex gap-3 mt-2">
                          {viewingSeller.cnicFront && (
                            <button type="button" onClick={() => setLightboxUrl(viewingSeller.cnicFront)} className="group relative rounded-lg overflow-hidden border border-slate-600 hover:border-amber-400 transition-colors">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={viewingSeller.cnicFront} alt="CNIC Front" className="h-20 w-36 object-cover" />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] font-bold uppercase tracking-widest text-slate-300 text-center py-0.5 group-hover:text-white">Front</span>
                            </button>
                          )}
                          {viewingSeller.cnicBack && (
                            <button type="button" onClick={() => setLightboxUrl(viewingSeller.cnicBack)} className="group relative rounded-lg overflow-hidden border border-slate-600 hover:border-amber-400 transition-colors">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={viewingSeller.cnicBack} alt="CNIC Back" className="h-20 w-36 object-cover" />
                              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] font-bold uppercase tracking-widest text-slate-300 text-center py-0.5 group-hover:text-white">Back</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Assigned Categories */}
                  {viewingSeller.assignedCategories?.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Assigned Categories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {viewingSeller.assignedCategories.map((cat) => (
                          <span key={cat} className="px-2 py-0.5 rounded-full bg-slate-700 text-xs text-slate-300">{cat}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {statsLoading && (
                  <p className="text-slate-400 text-sm text-center py-8">Loading stats…</p>
                )}
                {statsError && (
                  <p className="text-red-400 text-sm text-center py-8">{statsError}</p>
                )}
                {sellerStats && !statsLoading && (
                  <>
                    {/* Period filter */}
                    <div className="flex gap-2">
                      {(["7d", "30d", "lifetime"] as const).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setStatsPeriod(p)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors ${
                            statsPeriod === p
                              ? "bg-amber-500 text-zinc-950"
                              : "bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white"
                          }`}
                        >
                          {p === "7d" ? "Last 7 Days" : p === "30d" ? "Last Month" : "Lifetime"}
                        </button>
                      ))}
                    </div>

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

                    {sellerStats.recentOrders.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Recent Completed Orders</p>
                        <div className="overflow-x-auto rounded-xl border border-slate-700">
                          <table className="w-full text-xs text-left text-slate-300 min-w-[420px]">
                            <thead className="bg-slate-800/80 text-[10px] uppercase tracking-widest text-slate-500">
                              <tr>
                                <th className="px-3 py-2 font-bold">Order #</th>
                                <th className="px-3 py-2 font-bold text-right">Revenue</th>
                                <th className="px-3 py-2 font-bold text-right text-amber-400">Rate</th>
                                <th className="px-3 py-2 font-bold text-right text-amber-400">Commission</th>
                                <th className="px-3 py-2 font-bold text-right text-emerald-400">Net</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                              {sellerStats.recentOrders.map((o) => (
                                <tr key={o.orderNumber} className="hover:bg-slate-800/60">
                                  <td className="px-3 py-2 font-mono text-white">{o.orderNumber}</td>
                                  <td className="px-3 py-2 text-right tabular-nums">{formatPkr(o.grossAmount)}</td>
                                  <td className="px-3 py-2 text-right tabular-nums text-amber-400/70 font-mono">{(o.commissionRate * 100).toFixed(2)}%</td>
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
