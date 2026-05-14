"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Me = { id: string; email: string; name: string; role: string } | null;

export default function AccountProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<Me>(null);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      if (cancelled) return;
      setUser(data.user);
      if (data.user?.name) setName(data.user.name);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      setUser((prev) => (prev ? { ...prev, name: data.user.name } : prev));
      setMessage("Profile updated.");
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/");
    router.refresh();
  };

  if (loading) {
    return <p className="text-zinc-500 text-sm">Loading…</p>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">Profile</h1>
        <p className="text-zinc-500 text-sm mt-1">{user.email}</p>
        <p className="text-zinc-600 text-xs mt-2">
          Role: <span className="text-zinc-400 font-semibold">{user.role}</span>
        </p>
      </div>

      <form onSubmit={onSave} className="max-w-md space-y-4 border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl">
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Display name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-zinc-700 bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg text-sm"
          />
        </div>
        {message ? <p className="text-sm text-zinc-400">{message}</p> : null}
        <button
          type="submit"
          disabled={saving}
          className="bg-zinc-100 text-zinc-950 font-bold px-5 py-2 rounded-lg text-sm uppercase tracking-widest hover:bg-white disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
      </form>

      <button
        type="button"
        onClick={logout}
        className="text-sm text-red-400 hover:text-red-300 underline"
      >
        Sign out
      </button>
    </div>
  );
}
