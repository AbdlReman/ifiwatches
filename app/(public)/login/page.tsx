"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      const next = searchParams.get("next") || "";
      const role = data.user?.role as string;

      if (next.startsWith("/seller") && role !== "seller") {
        router.push("/account");
        router.refresh();
        return;
      }

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "seller") {
        router.push(next.startsWith("/seller") ? next : "/seller");
      } else if (next.startsWith("/account")) {
        router.push(next);
      } else {
        router.push("/account");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="public-card space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Email</label>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="public-input"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Password</label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="public-input"
          />
        </div>
        {error ? <p className="text-red-600 text-sm">{error}</p> : null}
        <button type="submit" disabled={loading} className="btn-primary w-full text-center disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="text-zinc-600 text-xs mt-6 text-center">
        Store admins sign in at{" "}
        <Link href="/admin/login" className="underline hover:text-zinc-400">
          /admin/login
        </Link>
        .
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-2">Sign in</h1>
      <p className="text-zinc-600 text-sm mb-8">
        New here?{" "}
        <Link href="/register" className="text-zinc-900 underline hover:text-zinc-600">
          Create an account
        </Link>
      </p>

      <Suspense fallback={<p className="text-zinc-500 text-sm">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
