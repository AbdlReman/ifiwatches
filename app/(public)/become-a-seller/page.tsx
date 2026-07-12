import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Become a Seller — IFI Lifestyle",
  description:
    "Join IFI Lifestyle as a verified seller. List your products, reach thousands of customers across Pakistan, and grow your business on our trusted marketplace.",
};

const WHAT_WE_PROVIDE = [
  {
    title: "Wide Reach",
    desc: "Access to thousands of potential customers",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  },
  {
    title: "Easy Store Setup",
    desc: "Quick onboarding & user-friendly seller dashboard",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    ),
  },
  {
    title: "Secure & Trusted",
    desc: "Safe transactions & reliable environment",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Marketing Support",
    desc: "Promotions, campaigns & featured listings to grow faster",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3c1.456 0 2.864.16 4.205.47m-4.205.47a23.743 23.743 0 0 0-4.205.47" />
      </svg>
    ),
  },
  {
    title: "Grow Your Business",
    desc: "Increase sales with powerful tools & insights",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
      </svg>
    ),
  },
  {
    title: "Dedicated Support",
    desc: "Our team is always here to help you succeed",
    icon: (
      <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636a9 9 0 1 1-12.728 0M12 3v9" />
      </svg>
    ),
  },
];

const WE_SOLVE = [
  "High selling fees",
  "Limited customer reach",
  "Complex selling process",
  "Lack of trustworthy platform",
  "Marketing & visibility challenges",
];

const WHY_CUSTOMERS = [
  {
    title: "Trusted & Secure Shopping",
    desc: "100% genuine products from verified sellers",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Premium Quality Products",
    desc: "Carefully curated collections across top categories",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
      </svg>
    ),
  },
  {
    title: "Smooth Shopping Experience",
    desc: "Easy navigation, secure payments & fast delivery",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Great Value & Offers",
    desc: "Best prices, exclusive deals & seasonal offers",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0c1.1.128 1.907 1.077 1.907 2.185Z" />
      </svg>
    ),
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Create Your Account",
    desc: "Register as a seller with your business details. Quick, free, and straightforward.",
  },
  {
    step: "02",
    title: "Get Verified",
    desc: "Our team reviews your application and approves your seller account within 24–48 hours.",
  },
  {
    step: "03",
    title: "List Your Products",
    desc: "Add your products using our easy seller dashboard. Set prices, upload images, and go live.",
  },
  {
    step: "04",
    title: "Start Earning",
    desc: "Receive orders, manage dispatch, and get paid. We handle customer trust — you handle the goods.",
  },
];

export default function BecomeASellerPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{ background: siteConfig.brandGradient }}
        />
        <div className="relative mx-auto max-w-[90rem] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-6"
              style={{ background: siteConfig.brandGradient }}
            >
              Seller Programme
            </span>
            <h1 className="text-4xl font-black uppercase tracking-tight sm:text-5xl md:text-6xl leading-tight">
              Create Account<br />
              <span style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundImage: siteConfig.brandGradient, backgroundClip: "text" }}>
                Sell Your Products
              </span>
            </h1>
            <p className="mt-4 text-lg italic text-zinc-400" style={{ fontFamily: "Georgia, serif" }}>
              Your Products. Our Platform. Limitless Possibilities.
            </p>
            <p className="mt-6 text-base leading-relaxed text-zinc-400 max-w-2xl mx-auto">
              Join IFI Lifestyle and grow your business with a trusted platform built for quality, trust &amp; success.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest text-zinc-950 transition-opacity hover:opacity-90"
                style={{ background: siteConfig.brandGradient }}
              >
                Create Account Now
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-zinc-700 px-8 py-4 text-sm font-bold uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
              >
                Already a seller? Sign in
              </Link>
            </div>

            {/* quick badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[11px] font-bold uppercase tracking-widest text-zinc-500">
              {["Quick & Free Registration", "Start Selling in Minutes", "Zero Hidden Charges", "Built for Sellers"].map((b) => (
                <span key={b} className="flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 text-[rgb(218,170,88)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── What We Provide ───────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-12 text-center">
            <span
              className="inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950"
              style={{ background: siteConfig.brandGradient }}
            >
              What We Provide
            </span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHAT_WE_PROVIDE.map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-7 transition-all hover:border-[rgb(218,170,88)] hover:shadow-md"
              >
                <div
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-zinc-950 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: siteConfig.brandGradient }}
                >
                  {item.icon}
                </div>
                <h3 className="text-sm font-black uppercase tracking-tight text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── We Solve + Why Customers (2-col) ─────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-zinc-50">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="grid gap-10 lg:grid-cols-2">

            {/* We Solve */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10">
              <span
                className="inline-block rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-950 mb-6"
                style={{ background: siteConfig.brandGradient }}
              >
                We Solve
              </span>
              <ul className="space-y-4">
                {WE_SOLVE.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                      style={{ background: siteConfig.brandGradient }}
                    >
                      <svg className="h-3.5 w-3.5 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </span>
                    <span className="text-sm font-semibold text-zinc-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Customers Come */}
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950 p-8 sm:p-10 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">
                Why Customers Come to IFI Lifestyle
              </p>
              <ul className="space-y-5">
                {WHY_CUSTOMERS.map((item) => (
                  <li key={item.title} className="flex items-start gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-950"
                      style={{ background: siteConfig.brandGradient }}
                    >
                      {item.icon}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-xs text-zinc-400 mt-0.5">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Simple process</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 hover:shadow-md transition-shadow"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-zinc-950"
                  style={{ background: siteConfig.brandGradient }}
                >
                  {item.step}
                </span>
                <h3 className="mt-5 text-sm font-black uppercase tracking-tight text-zinc-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA Bar ────────────────────────────────────────────────── */}
      <section className="bg-zinc-950 text-white">
        <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-zinc-950"
                style={{ background: siteConfig.brandGradient }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-black uppercase tracking-widest">Ready to Grow Your Business?</p>
                <p className="text-xs text-zinc-400 mt-0.5">Create your seller account today and start your journey with IFI Lifestyle!</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {["Quick & Free Registration", "Start Selling in Minutes", "Zero Hidden Charges", "Built for Sellers, Loved by Customers"].map((b) => (
                <span key={b} className="flex items-center gap-1.5">
                  <svg className="h-3 w-3 text-[rgb(218,170,88)]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                  </svg>
                  {b}
                </span>
              ))}
            </div>

            <Link
              href="/register"
              className="shrink-0 inline-flex items-center gap-2 px-8 py-4 text-sm font-black uppercase tracking-widest text-zinc-950 transition-opacity hover:opacity-90 whitespace-nowrap"
              style={{ background: siteConfig.brandGradient }}
            >
              Create Account Now
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
