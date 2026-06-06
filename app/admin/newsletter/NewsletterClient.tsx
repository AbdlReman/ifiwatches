"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type SubscriberRow = {
  _id: string;
  email: string;
  name: string;
  status: "subscribed" | "unsubscribed";
  source: string;
  notes: string;
  subscribedAt: string;
};

const input =
  "w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const label = "block text-slate-400 text-xs font-semibold uppercase mb-1";

function toDate(iso: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString();
}

export default function NewsletterClient() {
  const [rows, setRows] = useState<SubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newSource, setNewSource] = useState("admin");
  const [newStatus, setNewStatus] = useState<"subscribed" | "unsubscribed">("subscribed");
  const [newNotes, setNewNotes] = useState("");

  const [editing, setEditing] = useState<SubscriberRow | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/newsletter", { credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load subscribers");
      setRows(data.subscribers || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load subscribers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initial async fetch on mount
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.email, r.name, r.status, r.source, r.notes]
        .map((v) => String(v || "").toLowerCase())
        .some((v) => v.includes(q))
    );
  }, [rows, search]);

  const subscribedCount = useMemo(
    () => rows.filter((r) => r.status === "subscribed").length,
    [rows]
  );

  const createSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          source: newSource,
          status: newStatus,
          notes: newNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create subscriber");
      setNewEmail("");
      setNewName("");
      setNewSource("admin");
      setNewStatus("subscribed");
      setNewNotes("");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/${editing._id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editing),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this subscriber?")) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/newsletter/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      if (editing?._id === id) setEditing(null);
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  };

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((r) => selectedIds.has(r._id));
  const someFilteredSelected = filtered.some((r) => selectedIds.has(r._id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.delete(r._id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((r) => next.add(r._id));
        return next;
      });
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const exportCsv = (which: "selected" | "all") => {
    const toExport =
      which === "selected" && selectedIds.size > 0
        ? filtered.filter((r) => selectedIds.has(r._id))
        : filtered;
    if (toExport.length === 0) return;
    const headers = ["Email", "Name", "Status", "Source", "Subscribed At", "Notes"];
    const escape = (v: string) => `"${String(v || "").replace(/"/g, '""')}"`;
    const csvRows = [
      headers.join(","),
      ...toExport.map((r) =>
        [
          escape(r.email),
          escape(r.name),
          escape(r.status),
          escape(r.source),
          escape(toDate(r.subscribedAt)),
          escape(r.notes),
        ].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-3">
          <Link href="/admin" className="hover:text-slate-300">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-400">Newsletter</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Newsletter</h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage subscribers. Public subscribe endpoint is connected to the website footer.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Total</p>
          <p className="text-2xl font-black text-white mt-1">{rows.length}</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4">
          <p className="text-xs text-slate-500 uppercase tracking-widest">Subscribed</p>
          <p className="text-2xl font-black text-green-300 mt-1">{subscribedCount}</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={createSubscriber} className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Add subscriber</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className={label}>Email *</label>
            <input className={input} type="email" required value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
          </div>
          <div>
            <label className={label}>Name</label>
            <input className={input} value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div>
            <label className={label}>Source</label>
            <input className={input} value={newSource} onChange={(e) => setNewSource(e.target.value)} />
          </div>
          <div>
            <label className={label}>Status</label>
            <select className={input} value={newStatus} onChange={(e) => setNewStatus(e.target.value as "subscribed" | "unsubscribed")}>
              <option value="subscribed">Subscribed</option>
              <option value="unsubscribed">Unsubscribed</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-2">
            <label className={label}>Notes</label>
            <input className={input} value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
        >
          {saving ? "Saving..." : "Add subscriber"}
        </button>
      </form>

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email, name, status, source..."
          className={input}
        />
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => exportCsv("selected")}
            disabled={selectedIds.size === 0}
            title={selectedIds.size === 0 ? "Select rows to export" : `Export ${selectedIds.size} selected`}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </button>
          <button
            type="button"
            onClick={() => exportCsv("all")}
            disabled={filtered.length === 0}
            title="Export all visible rows"
            className="inline-flex items-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Export All
          </button>
        </div>
      </div>
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>{selectedIds.size} selected</span>
          <button
            type="button"
            onClick={() => setSelectedIds(new Set())}
            className="text-slate-500 hover:text-slate-300 underline"
          >
            Clear selection
          </button>
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">
            Subscribers
            {filtered.length !== rows.length && (
              <span className="ml-2 text-slate-500 font-normal normal-case tracking-normal">
                — {filtered.length} of {rows.length} shown
              </span>
            )}
          </h2>
          {selectedIds.size > 0 && (
            <span className="text-xs text-indigo-300 font-semibold">
              {selectedIds.size} selected
            </span>
          )}
        </div>
        {loading ? (
          <p className="p-6 text-slate-500 text-sm">Loading...</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-slate-500 text-sm">No subscribers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-slate-300">
              <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allFilteredSelected}
                      ref={(el) => { if (el) el.indeterminate = someFilteredSelected && !allFilteredSelected; }}
                      onChange={toggleSelectAll}
                      className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                      title="Select all"
                    />
                  </th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Source</th>
                  <th className="px-4 py-3">Subscribed</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filtered.map((r) =>
                  editing?._id === r._id ? (
                    <tr key={r._id} className="bg-slate-900/40">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          <div>
                            <label className={label}>Email</label>
                            <input className={input} type="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} />
                          </div>
                          <div>
                            <label className={label}>Name</label>
                            <input className={input} value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
                          </div>
                          <div>
                            <label className={label}>Source</label>
                            <input className={input} value={editing.source} onChange={(e) => setEditing({ ...editing, source: e.target.value })} />
                          </div>
                          <div>
                            <label className={label}>Status</label>
                            <select className={input} value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as "subscribed" | "unsubscribed" })}>
                              <option value="subscribed">Subscribed</option>
                              <option value="unsubscribed">Unsubscribed</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className={label}>Notes</label>
                            <input className={input} value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} />
                          </div>
                        </div>
                        <div className="mt-4 flex gap-2">
                          <button type="button" onClick={saveEdit} disabled={saving} className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase">
                            Save
                          </button>
                          <button type="button" onClick={() => setEditing(null)} className="border border-slate-600 text-slate-300 px-4 py-2 rounded-lg text-xs font-bold uppercase">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr key={r._id} className={`hover:bg-slate-700/20 ${selectedIds.has(r._id) ? "bg-indigo-900/10" : ""}`}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(r._id)}
                          onChange={() => toggleRow(r._id)}
                          className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-indigo-500 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3 font-mono text-white">{r.email}</td>
                      <td className="px-4 py-3">{r.name || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${r.status === "subscribed" ? "bg-green-900/50 text-green-300" : "bg-amber-900/50 text-amber-300"}`}>
                          {r.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-400">{r.source || "website"}</td>
                      <td className="px-4 py-3 text-slate-400">{toDate(r.subscribedAt)}</td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button type="button" onClick={() => setEditing({ ...r })} className="text-indigo-400 text-xs font-semibold uppercase">
                          Edit
                        </button>
                        <button type="button" onClick={() => remove(r._id)} className="text-red-400 text-xs font-semibold uppercase">
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
