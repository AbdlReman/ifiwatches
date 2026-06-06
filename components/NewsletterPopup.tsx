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
    } catch { /* ignore */ }
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
      if ((window.scrollY / total) * 100 >= 3) trigger();
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
      try { localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
    >
      {/* Card — no border-radius, matches screenshot */}
      <div
        className="relative bg-white w-full shadow-2xl animate-fade-in-up overflow-hidden"
        style={{ maxWidth: 420 }}
      >
        {/* Close X */}
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 p-1 text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center px-10 pt-14 pb-12">

          {/* Brand name — large, bold, wide tracking */}
          <p
            className="font-black uppercase text-zinc-900 tracking-[0.22em] mb-12"
            style={{ fontSize: "1.65rem", letterSpacing: "0.22em" }}
          >
            IFI LIFESTYLE
          </p>

          {success ? (
            <div className="py-10 flex flex-col items-center gap-4">
              <p
                className="font-black text-zinc-900"
                style={{ fontSize: "2rem", fontFamily: "Georgia, 'Times New Roman', serif" }}
              >
                You&apos;re in!
              </p>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-[260px]">
                Thank you for subscribing.<br />Good luck — we&apos;ll be in touch!
              </p>
              <button
                onClick={dismiss}
                className="mt-4 text-xs uppercase tracking-[0.14em] text-zinc-400 hover:text-zinc-700 underline"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <>
              {/* "Enter For the Chance to" */}
              <p
                className="text-zinc-600 mb-3"
                style={{
                  fontSize: "1rem",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                }}
              >
                Enter For the Chance to
              </p>

              {/* WIN RS 9,500 — hero text */}
              <p
                className="text-zinc-900 leading-none mb-4"
                style={{
                  fontSize: "clamp(3rem, 11vw, 3.75rem)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 900,
                  letterSpacing: "-0.01em",
                }}
              >
                WIN RS 9,500
              </p>

              {/* Subtitle */}
              <p
                className="text-zinc-700 mb-10"
                style={{
                  fontSize: "1.05rem",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  fontWeight: 400,
                }}
              >
                Worth of Product by Signing Up for Email
              </p>

              {/* Email input */}
              <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full border border-zinc-300 px-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-600 transition-colors"
                  style={{ borderRadius: 0 }}
                />
                {error && (
                  <p className="text-red-500 text-xs text-left -mt-1">{error}</p>
                )}

                {/* CONTINUE button — dark navy like screenshot */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white font-bold tracking-[0.15em] uppercase text-sm py-4 transition-opacity disabled:opacity-60"
                  style={{
                    backgroundColor: "#1a3a6b",
                    borderRadius: 0,
                  }}
                >
                  {loading ? "Please wait…" : "Continue"}
                </button>
              </form>

              {/* Disclaimer */}
              <p className="mt-7 text-zinc-400 leading-relaxed" style={{ fontSize: "0.68rem" }}>
                Offer valid online only and is subject to change at any time. By subscribing, you agree to
                receive email updates from IFI Lifestyle. You may unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
