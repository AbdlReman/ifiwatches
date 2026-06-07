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
  const [pendingApproval, setPendingApproval] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPendingApproval(false);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();

      if (res.status === 403) {
        setPendingApproval(true);
        return;
      }

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

  if (pendingApproval) {
    return (
      <div className="public-card space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-amber-600">
              <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm2.023 6.828a.75.75 0 10-1.06-1.06 3.75 3.75 0 01-5.304 0 .75.75 0 00-1.06 1.06 5.25 5.25 0 007.424 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-zinc-900 text-sm">Account pending approval</p>
            <p className="text-sm text-zinc-600 mt-1">
              Your seller account is currently under review. Our admin team will approve it shortly. You will be able to sign in once your account has been approved.
            </p>
          </div>
        </div>
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
          <p className="text-xs text-amber-700">
            If you believe this is a mistake or need help, please contact us at{" "}
            <a href="mailto:support@ifilifestyle.com" className="underline">
              support@ifilifestyle.com
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setPendingApproval(false); setError(""); }}
          className="w-full rounded-xl border border-zinc-200 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          Try a different account
        </button>
      </div>
    );
  }

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
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full text-center disabled:opacity-50"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      {/* <p className="text-zinc-600 text-xs mt-6 text-center">
        Store admins sign in at{" "}
        <Link href="/admin/login" className="underline hover:text-zinc-400">
          /admin/login
        </Link>
        .
      </p> */}
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
