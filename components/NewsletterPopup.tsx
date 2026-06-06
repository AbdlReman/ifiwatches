"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "ifi_nl_popup_v1";

export default function NewsletterPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const triggered = useRef(false);

  const trigger = () => {
    if (triggered.current) return;
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }
    triggered.current = true;
    setVisible(true);
  };

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      return;
    }

    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) return;
      const pct = (window.scrollY / total) * 100;
      if (pct >= 3) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), source: "popup" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setSuccess(true);
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      <div className="relative bg-white w-full max-w-[360px] rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
        {/* Close */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="px-10 pb-10 pt-12 text-center">
          {/* Brand name */}
          <p className="text-[11px] font-black tracking-[0.35em] uppercase text-zinc-900 mb-8">
            IFI LIFESTYLE
          </p>

          {success ? (
            <div className="py-8 space-y-3">
              <p className="text-3xl font-black text-zinc-900 tracking-tight">You&apos;re in!</p>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Thank you for subscribing. Good luck — we&apos;ll be in touch!
              </p>
              <button
                onClick={dismiss}
                className="mt-4 text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-zinc-700 underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              {/* Headline */}
              <p className="text-[13px] text-zinc-500 italic mb-2 tracking-wide">
                Enter For the Chance to
              </p>
              <p
                className="font-black text-zinc-900 leading-none tracking-tight mb-3"
                style={{ fontSize: "clamp(2.6rem, 9vw, 3.4rem)" }}
              >
                WIN RS 9,500
              </p>
              <p className="text-[13px] text-zinc-600 mb-8 leading-snug">
                Worth of Product by Signing Up for Email
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border border-zinc-300 rounded-md px-4 py-3 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900 transition-shadow"
                />
                {error && (
                  <p className="text-red-500 text-xs text-left">{error}</p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-zinc-900 hover:bg-zinc-700 disabled:opacity-60 text-white font-bold tracking-[0.15em] uppercase text-xs py-4 rounded-md transition-colors"
                >
                  {loading ? "Please wait…" : "Continue"}
                </button>
              </form>

              {/* Disclaimer */}
              <p className="mt-5 text-[10px] text-zinc-400 leading-relaxed">
                Offer valid online only and is subject to change at any time. By subscribing, you agree to receive email updates from IFI Lifestyle. You may unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>

    </div>
  );
}
