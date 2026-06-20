"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";

type Role = "user" | "seller";

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatCnic(val: string): string {
  const d = val.replace(/\D/g, "").slice(0, 13);
  if (d.length <= 5) return d;
  if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`;
  return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`;
}

async function uploadToKyc(file: File): Promise<string> {
  const form = new FormData();
  form.append("images", file);
  form.append("folder", "seller-kyc");
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.urls[0];
}

// ── Sub-components ────────────────────────────────────────────────────────────

const STEP_LABELS = ["Account Info", "Business Details", "Verification"];

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-start mb-8">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const done = step > num;
        const active = step === num;
        return (
          <div key={label} className={`flex items-center ${i < STEP_LABELS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 transition-all ${
                  done
                    ? "bg-zinc-900 text-white"
                    : active
                    ? "bg-zinc-900 text-white ring-4 ring-zinc-200"
                    : "border-2 border-zinc-200 text-zinc-400 bg-white"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                ) : (
                  num
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider text-center leading-tight ${
                  active ? "text-zinc-900" : done ? "text-zinc-500" : "text-zinc-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`h-px flex-1 mx-2 mb-5 transition-colors ${done ? "bg-zinc-900" : "bg-zinc-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ImageUploadBox({
  label,
  hint,
  url,
  uploading,
  onUpload,
  square,
}: {
  label: string;
  hint?: string;
  url: string;
  uploading: boolean;
  onUpload: (file: File) => void;
  square?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-colors w-full disabled:opacity-60 ${
          url
            ? "border-zinc-300 hover:border-zinc-500"
            : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"
        } ${square ? "aspect-square" : "aspect-[4/3]"}`}
      >
        {url ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={label} className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Replace</span>
            </div>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="text-[11px] font-medium">Uploading…</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-zinc-400 px-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
            <span className="text-[11px] font-medium text-center">Click to upload</span>
          </div>
        )}
      </button>
      {hint && <p className="text-[10px] text-zinc-400">{hint}</p>}
    </div>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────

const INPUT = "public-input";
const LABEL = "block text-xs font-bold uppercase text-zinc-500 mb-1";

function Req() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<Role>("user");
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Step 2
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [address, setAddress] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessSummary, setBusinessSummary] = useState("");

  // Step 3
  const [cnic, setCnic] = useState("");
  const [cnicFrontUrl, setCnicFrontUrl] = useState("");
  const [cnicBackUrl, setCnicBackUrl] = useState("");
  const [sellerImageUrl, setSellerImageUrl] = useState("");
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);
  const [uploadingSelfie, setUploadingSelfie] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRoleChange = (r: Role) => {
    setRole(r);
    setStep(1);
    setError("");
  };

  const handleUpload = async (
    file: File,
    setUrl: (u: string) => void,
    setUploading: (b: boolean) => void
  ) => {
    setUploading(true);
    setError("");
    try {
      const url = await uploadToKyc(file);
      setUrl(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const nextStep = () => {
    setError("");
    if (step === 1) {
      if (!name.trim()) return setError("Full name is required.");
      if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return setError("A valid email address is required.");
      if (password.length < 8) return setError("Password must be at least 8 characters.");
    }
    if (step === 2) {
      if (!phone.trim()) return setError("Phone number is required.");
      if (!whatsapp.trim()) return setError("WhatsApp number is required.");
      if (!businessCategory.trim()) return setError("Business category is required.");
      if (!businessSummary.trim() || businessSummary.trim().length < 20)
        return setError("Business summary must be at least 20 characters.");
    }
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "seller") {
      if (!cnic || !/^\d{5}-\d{7}-\d{1}$/.test(cnic))
        return setError("Enter a valid CNIC (format: XXXXX-XXXXXXX-X).");
      if (!cnicFrontUrl) return setError("Please upload the front of your CNIC.");
      if (!cnicBackUrl) return setError("Please upload the back of your CNIC.");
      if (!sellerImageUrl) return setError("Please upload your own photo.");
    }

    setLoading(true);
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
          whatsapp: role === "seller" ? whatsapp : undefined,
          address,
          businessCategory: role === "seller" ? businessCategory : undefined,
          businessSummary: role === "seller" ? businessSummary : undefined,
          cnic: role === "seller" ? cnic : undefined,
          cnicFront: role === "seller" ? cnicFrontUrl : undefined,
          cnicBack: role === "seller" ? cnicBackUrl : undefined,
          sellerImage: role === "seller" ? sellerImageUrl : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      if (role === "seller") {
        setSuccess(
          "Your seller application has been submitted. Our admin will review it and approve your account — you will be able to sign in once approved."
        );
        return;
      }

      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      if (!loginRes.ok) {
        router.push("/login");
        return;
      }
      const loginData = await loginRes.json();
      router.push(loginData.user?.role === "seller" ? "/seller" : "/account");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const anyUploading = uploadingFront || uploadingBack || uploadingSelfie;

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
        <form onSubmit={handleSubmit} className="public-card space-y-6">

          {/* ── Account type selector ── */}
          <fieldset>
            <legend className={LABEL}>Account type</legend>
            <div className="grid grid-cols-2 gap-3">
              {(["user", "seller"] as Role[]).map((r) => (
                <label
                  key={r}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-3 cursor-pointer transition-colors ${
                    role === r
                      ? "border-zinc-900 bg-zinc-50"
                      : "border-zinc-200 hover:border-zinc-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    checked={role === r}
                    onChange={() => handleRoleChange(r)}
                    className="sr-only"
                  />
                  {r === "user" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-600">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-zinc-600">
                      <path d="M5.223 2.25c-.497 0-.974.198-1.325.55l-1.3 1.298A3.75 3.75 0 007.5 9.75c.627.47 1.406.75 2.25.75.844 0 1.624-.28 2.25-.75.626.47 1.406.75 2.25.75.844 0 1.623-.28 2.25-.75a3.75 3.75 0 004.902-5.652l-1.3-1.299a1.875 1.875 0 00-1.325-.549H5.223z" />
                      <path fillRule="evenodd" d="M3 20.25v-8.755c1.42.674 3.08.673 4.5 0A5.234 5.234 0 009.75 12c.804 0 1.568-.182 2.25-.506a5.234 5.234 0 002.25.506c.804 0 1.567-.182 2.25-.506 1.42.674 3.08.675 4.5.001v8.755h.75a.75.75 0 010 1.5H2.25a.75.75 0 010-1.5H3zm3-6a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v3a.75.75 0 01-.75.75h-3a.75.75 0 01-.75-.75v-3zm8.25-.75a.75.75 0 00-.75.75v5.25c0 .414.336.75.75.75h3a.75.75 0 00.75-.75v-5.25a.75.75 0 00-.75-.75h-3z" clipRule="evenodd" />
                    </svg>
                  )}
                  <span className="text-xs font-semibold text-zinc-700 text-center">
                    {r === "user" ? "Shop as customer" : `Sell on ${siteConfig.brandName}`}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* ── Seller step bar ── */}
          {role === "seller" && <StepBar step={step} />}

          {/* ── Step 1: Account Info ── */}
          {(role === "user" || step === 1) && (
            <div className="space-y-5">
              <div>
                <label className={LABEL}>Full name <Req /></label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={INPUT}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className={LABEL}>Email <Req /></label>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={INPUT}
                />
              </div>
              <div>
                <label className={LABEL}>
                  Password <Req />{" "}
                  <span className="text-zinc-400 font-normal normal-case">(min 8 characters)</span>
                </label>
                <input
                  type="password"
                  required
                  autoComplete="new-password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={INPUT}
                />
              </div>
            </div>
          )}

          {/* ── Step 2: Business Details ── */}
          {role === "seller" && step === 2 && (
            <div className="space-y-5">
              <div>
                <label className={LABEL}>Phone number <Req /></label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={INPUT}
                  placeholder="+92 300 0000000"
                />
              </div>
              <div>
                <label className={LABEL}>WhatsApp number <Req /></label>
                <input
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className={INPUT}
                  placeholder="+92 300 0000000"
                />
              </div>
              <div>
                <label className={LABEL}>
                  Business address{" "}
                  <span className="text-zinc-400 font-normal normal-case">(optional)</span>
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  rows={2}
                  className={`${INPUT} resize-none`}
                  placeholder="City, Province, Country"
                />
              </div>
              <div>
                <label className={LABEL}>Business category <Req /></label>
                <input
                  type="text"
                  required
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className={INPUT}
                  placeholder="e.g. Fashion, Electronics, Beauty"
                />
              </div>
              <div>
                <label className={LABEL}>What do you want to sell? <Req /></label>
                <textarea
                  required
                  value={businessSummary}
                  onChange={(e) => setBusinessSummary(e.target.value)}
                  rows={4}
                  minLength={20}
                  placeholder="Describe your products, your store's focus, and what makes your offering special."
                  className={`${INPUT} resize-none`}
                />
                <p className="text-xs text-zinc-400 mt-1">
                  {businessSummary.length}/1000 — minimum 20 characters
                </p>
              </div>
            </div>
          )}

          {/* ── Step 3: Verification ── */}
          {role === "seller" && step === 3 && (
            <div className="space-y-7">
              {/* CNIC number */}
              <div>
                <label className={LABEL}>CNIC number <Req /></label>
                <input
                  type="text"
                  value={cnic}
                  onChange={(e) => setCnic(formatCnic(e.target.value))}
                  className={INPUT}
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength={15}
                />
                <p className="text-xs text-zinc-400 mt-1">
                  13-digit national identity card number
                </p>
              </div>

              {/* CNIC photos */}
              <div>
                <p className={LABEL}>
                  CNIC photo — both sides <Req />
                </p>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <ImageUploadBox
                    label="Front side"
                    hint="Show the side with your name & photo"
                    url={cnicFrontUrl}
                    uploading={uploadingFront}
                    onUpload={(f) => handleUpload(f, setCnicFrontUrl, setUploadingFront)}
                  />
                  <ImageUploadBox
                    label="Back side"
                    hint="Show the side with the barcode"
                    url={cnicBackUrl}
                    uploading={uploadingBack}
                    onUpload={(f) => handleUpload(f, setCnicBackUrl, setUploadingBack)}
                  />
                </div>
              </div>

              {/* Seller photo */}
              <div>
                <p className={LABEL}>Your photo <Req /></p>
                <div className="mt-2 max-w-[160px]">
                  <ImageUploadBox
                    label="Clear photo of yourself"
                    hint="Well-lit, face clearly visible"
                    url={sellerImageUrl}
                    uploading={uploadingSelfie}
                    onUpload={(f) => handleUpload(f, setSellerImageUrl, setUploadingSelfie)}
                    square
                  />
                </div>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5">
                <p className="text-xs text-amber-700 font-medium">
                  Your application will be reviewed by an admin before you can start selling. You will receive access once approved.
                </p>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* ── Navigation buttons ── */}
          <div className={`flex gap-3 pt-1 ${role === "seller" && step > 1 ? "justify-between" : ""}`}>
            {role === "seller" && step > 1 && (
              <button
                type="button"
                onClick={() => { setStep((s) => s - 1); setError(""); }}
                className="border border-zinc-300 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-700 hover:border-zinc-900 transition-colors"
              >
                Back
              </button>
            )}

            {role === "user" || step === 3 ? (
              <button
                type="submit"
                disabled={loading || anyUploading}
                className="btn-primary flex-1 text-center disabled:opacity-50"
              >
                {loading
                  ? role === "seller"
                    ? "Submitting application…"
                    : "Creating account…"
                  : role === "seller"
                  ? "Submit seller application"
                  : "Create account"}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary flex-1 text-center"
              >
                Next
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
