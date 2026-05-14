"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"user" | "seller">("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) {
        router.push("/login");
        return;
      }

      if (loginData.user?.role === "seller") {
        router.push("/seller");
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100 mb-2">Create account</h1>
      <p className="text-zinc-500 text-sm mb-8">
        Already have an account?{" "}
        <Link href="/login" className="text-zinc-200 underline hover:text-white">
          Sign in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-5 border border-zinc-800 bg-zinc-900/40 p-6 rounded-xl">
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-zinc-700 bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-zinc-700 bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Password (min 8 characters)</label>
          <input
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-zinc-700 bg-zinc-950 text-zinc-100 px-3 py-2 rounded-lg text-sm"
          />
        </div>
        <fieldset>
          <legend className="block text-xs font-bold uppercase text-zinc-500 mb-2">Account type</legend>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="radio"
                name="role"
                checked={role === "user"}
                onChange={() => setRole("user")}
                className="accent-zinc-100"
              />
              Shop as a customer (default)
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="radio"
                name="role"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
                className="accent-zinc-100"
              />
              Sell on {siteConfig.brandName}
            </label>
          </div>
        </fieldset>
        {error ? <p className="text-red-400 text-sm">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-zinc-100 text-zinc-950 font-bold py-2.5 rounded-lg text-sm uppercase tracking-widest hover:bg-white disabled:opacity-50"
        >
          {loading ? "Creating…" : "Register"}
        </button>
      </form>
    </div>
  );
}
