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
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState<string>("");
  const [businessSummary, setBusinessSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (role === "seller" && !businessCategory) {
      setError("Please select a business category.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
          address,
          businessName: role === "seller" ? businessName : undefined,
          businessCategory: role === "seller" ? businessCategory : undefined,
          businessSummary: role === "seller" ? businessSummary : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      if (role === "seller") {
        setSuccess(
          "Your seller application has been submitted successfully. Our admin will review it and approve your account. You will be able to sign in once approved."
        );
        return;
      }

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

  const categoryOptions = siteConfig.categories.length > 0 ? [...siteConfig.categories] : ["General"];

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mb-2">Create account</h1>
      <p className="text-zinc-600 text-sm mb-8">
        Already have an account?{" "}
        <Link href="/login" className="text-zinc-900 underline hover:text-zinc-600">
          Sign in
        </Link>
      </p>

      {success ? (
        <div className="public-card space-y-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-emerald-600">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-zinc-900 text-sm">Application submitted!</p>
              <p className="text-sm text-zinc-600 mt-1">{success}</p>
            </div>
          </div>
          <Link href="/login" className="btn-primary w-full text-center block">
            Go to sign in
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="public-card space-y-5">
          {/* Full name */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">Full name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="public-input"
              placeholder="Your full name"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
              Password <span className="text-zinc-400 font-normal normal-case">(min 8 characters)</span>
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="public-input"
            />
          </div>

          {/* Account type */}
          <fieldset>
            <legend className="block text-xs font-bold uppercase text-zinc-500 mb-2">Account type</legend>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                  role === "user"
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "user"}
                  onChange={() => setRole("user")}
                  className="sr-only"
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-600">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-zinc-700 text-center">Shop as customer</span>
              </label>
              <label
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                  role === "seller"
                    ? "border-zinc-900 bg-zinc-50"
                    : "border-zinc-200 hover:border-zinc-300"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  checked={role === "seller"}
                  onChange={() => setRole("seller")}
                  className="sr-only"
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-600">
                  <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
                  <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-zinc-700 text-center">Sell on {siteConfig.brandName}</span>
              </label>
            </div>
          </fieldset>

          {/* Seller-specific fields */}
          {role === "seller" && (
            <div className="space-y-5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-700">
                Seller application details
              </h2>

              {/* Store / Business name */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                  Store / business name <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="public-input"
                  placeholder="e.g. Luxury Time Co"
                />
              </div>

              {/* Phone — required */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                  Phone number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="public-input"
                  placeholder="+92 300 0000000"
                />
              </div>

              {/* Address — optional */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                  Business address <span className="text-slate-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className="public-input min-h-[72px] resize-none"
                  placeholder="City, Province, Country"
                />
              </div>

              {/* Business category — static chips */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-2">
                  Business category <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBusinessCategory(cat)}
                      className={`rounded-full px-3 py-1.5 text-sm font-medium border-2 transition-colors ${
                        businessCategory === cat
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {businessCategory ? (
                  <p className="text-xs text-emerald-600 mt-1.5 font-medium">Selected: {businessCategory}</p>
                ) : (
                  <p className="text-xs text-slate-400 mt-1.5">Select one category above</p>
                )}
              </div>

              {/* Business summary */}
              <div>
                <label className="block text-xs font-bold uppercase text-zinc-500 mb-1">
                  What do you want to sell? <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={businessSummary}
                  onChange={(e) => setBusinessSummary(e.target.value)}
                  rows={4}
                  minLength={20}
                  placeholder="Describe your products, your store's focus, and what makes your offering special. Minimum 20 characters."
                  className="public-input min-h-[110px] resize-none"
                />
                <p className="text-xs text-slate-400 mt-1">
                  {businessSummary.length}/1000 — minimum 20 characters
                </p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <p className="text-xs text-amber-700 font-medium">
                  Your application will be reviewed by an admin before you can start selling. You will receive access once approved.
                </p>
              </div>
            </div>
          )}

          {error ? <p className="text-red-600 text-sm">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center disabled:opacity-50"
          >
            {loading
              ? role === "seller"
                ? "Submitting application…"
                : "Creating account…"
              : role === "seller"
              ? "Submit seller application"
              : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
