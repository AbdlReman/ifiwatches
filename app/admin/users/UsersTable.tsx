"use client";

import { useState } from "react";
import type { UserRole } from "@/lib/auth/jwt";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  businessCategory: string;
  businessSummary: string;
  sellerApproved: boolean;
  createdAt: string;
};

type UsersTableProps = {
  initialUsers: AdminUser[];
};

function truncate(value: string, maxLength: number) {
  if (!value) return "—";
  return value.length > maxLength ? `${value.slice(0, maxLength)}…` : value;
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  const approveSeller = async (userId: string) => {
    setError("");
    setSaving(userId);

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, sellerApproved: true }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to approve seller.");

      setUsers((prev) =>
        prev.map((user) => (user.id === userId ? { ...user, sellerApproved: true } : user))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to approve seller.");
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-4">
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
        <table className="w-full text-sm text-left text-slate-300 min-w-[880px]">
          <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Email / Phone</th>
              <th className="px-4 py-3 font-bold">Role</th>
              <th className="px-4 py-3 font-bold">Seller status</th>
              <th className="px-4 py-3 font-bold">Seller details</th>
              <th className="px-4 py-3 font-bold whitespace-nowrap">Joined</th>
              <th className="px-4 py-3 font-bold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-800/80">
                <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                <td className="px-4 py-3">
                  <div>{user.email}</div>
                  <div className="text-slate-500 text-xs">{user.phone || "—"}</div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      user.role === "admin"
                        ? "bg-indigo-900/70 text-indigo-200"
                        : user.role === "seller"
                        ? "bg-emerald-900/70 text-emerald-200"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      user.role === "seller"
                        ? user.sellerApproved
                          ? "bg-emerald-900/70 text-emerald-200"
                          : "bg-amber-900/70 text-amber-200"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {user.role === "seller"
                      ? user.sellerApproved
                        ? "Approved"
                        : "Pending approval"
                      : "N/A"}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 text-xs max-w-[260px]">
                  <div className="font-medium text-slate-100">{user.businessCategory || "—"}</div>
                  <div>{truncate(user.businessSummary, 80)}</div>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{user.createdAt}</td>
                <td className="px-4 py-3">
                  {user.role === "seller" && !user.sellerApproved ? (
                    <button
                      type="button"
                      disabled={saving === user.id}
                      onClick={() => approveSeller(user.id)}
                      className="inline-flex items-center rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-emerald-400 disabled:opacity-50"
                    >
                      {saving === user.id ? "Approving…" : "Approve"}
                    </button>
                  ) : (
                    <span className="text-slate-500 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
