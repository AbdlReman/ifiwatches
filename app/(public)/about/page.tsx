import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const BRAND_GOLD = "rgb(218,170,88)";
const BRAND_GRADIENT = "linear-gradient(135deg,rgb(218,170,88) 0%,rgb(244,202,104) 100%)";

const differentiators = [
  {
    title: "One Seller Per Product",
    desc: "Each product has exactly one verified seller. No duplicates, no price wars, no confusion — you see a product and know exactly who stands behind it.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    ),
  },
  {
    title: "Verified Sellers Only",
    desc: "Every seller is personally reviewed and approved before going live. We do not allow open registration. If a seller is on IFI Lifestyle — they have earned that place.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
      </svg>
    ),
  },
  {
    title: "Everything in One Place",
    desc: "Fashion, eyewear, fragrance, phones, jewellery, accessories — all curated lifestyle categories in one trusted store. No jumping between platforms. One place. Every thing.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
      </svg>
    ),
  },
];

const stats = [
  { value: "100%", label: "Verified Sellers" },
  { value: "1", label: "Seller Per Product" },
  { value: "PKR", label: "Local Currency" },
  { value: "0", label: "Fake Products" },
];

const values = [
  {
    title: "Trust",
    desc: "We verify every seller. We approve every product. Trust is not a feature — it is our foundation.",
  },
  {
    title: "Quality",
    desc: "Only authentic products from genuine sellers. Standards first, always.",
  },
  {
    title: "Clarity",
    desc: "One product, one seller, one clear choice. No confusion, no noise.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">

      {/* ── Hero ── */}
      <section className="relative bg-zinc-950 overflow-hidden">
        {/* Decorative gold bar */}
        <div className="absolute left-0 top-0 h-1 w-full" style={{ background: BRAND_GRADIENT }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-36">
          {/* Breadcrumb */}
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-10 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-zinc-400">About</span>
          </p>

          <div className="max-w-4xl">
            <span
              className="inline-block text-[11px] font-black uppercase tracking-[0.25em] mb-5 px-3 py-1 rounded-full border"
              style={{ color: BRAND_GOLD, borderColor: "rgba(218,170,88,0.3)" }}
            >
              Iconic Futures Innovations
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.05] text-white mb-8">
              We Are Not a{" "}
              <br className="hidden sm:block" />
              Marketplace.{" "}
              <span style={{ color: BRAND_GOLD }}>We Are a Standard.</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed max-w-2xl">
              Pakistan&apos;s first curated lifestyle portal where every seller is verified,
              every product is exclusive, and every customer shops with complete confidence.
            </p>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-800">
            {stats.map(({ value, label }) => (
              <div key={label} className="bg-zinc-900 px-6 py-7 text-center">
                <p className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color: BRAND_GOLD }}>{value}</p>
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Story ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-4 block">Our Story</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-zinc-950 mb-8 leading-tight">
              Built to Fix What&apos;s{" "}
              <span style={{ color: BRAND_GOLD }}>Broken</span>
            </h2>
            <div className="space-y-5 text-zinc-600 text-base leading-relaxed">
              <p>
                <strong className="text-zinc-950">IFI Lifestyle was founded by Ibrar Yousafzai</strong> with one goal: to fix what is broken in Pakistan&apos;s online shopping experience.
              </p>
              <p>
                Pakistani shoppers face the same problems every day — fake products, too many sellers for the same item, no accountability, and platforms that simply don&apos;t care. We built IFI Lifestyle to solve all of that.
              </p>
            </div>
            <div
              className="mt-8 inline-block rounded-2xl px-6 py-5 border"
              style={{ borderColor: "rgba(218,170,88,0.4)", background: "rgba(218,170,88,0.06)" }}
            >
              <p className="text-xl font-black uppercase tracking-tight" style={{ color: BRAND_GOLD }}>
                One product. One verified seller. Zero confusion.
              </p>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-4">
            {values.map(({ title, desc }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-zinc-100 bg-zinc-50 p-6 hover:border-zinc-200 transition-colors">
                <div
                  className="mt-0.5 h-8 w-8 shrink-0 rounded-full flex items-center justify-center"
                  style={{ background: BRAND_GRADIENT }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </div>
                <div>
                  <p className="font-black uppercase tracking-wide text-zinc-950 text-sm mb-1">{title}</p>
                  <p className="text-sm text-zinc-500 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section className="bg-zinc-950 py-24 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-16">
            <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-4 block">What Makes Us Different</span>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
              We Solve What Marketplaces{" "}
              <span style={{ color: BRAND_GOLD }}>Cannot</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900 p-8 hover:border-zinc-700 transition-all duration-200 hover:bg-zinc-800/60"
              >
                <div
                  className="mb-6 h-12 w-12 rounded-xl flex items-center justify-center text-zinc-950"
                  style={{ background: BRAND_GRADIENT }}
                >
                  {icon}
                </div>
                <h3 className="font-black uppercase tracking-tight text-base text-white mb-3">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our Mission ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-6 block">Our Mission</span>
          <div
            className="rounded-2xl p-10 border"
            style={{ borderColor: "rgba(218,170,88,0.3)", background: "rgba(218,170,88,0.05)" }}
          >
            <svg className="mx-auto mb-6 h-10 w-10 opacity-40" style={{ color: BRAND_GOLD }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
            </svg>
            <p className="text-zinc-700 text-lg sm:text-xl leading-relaxed font-medium italic">
              To give every Pakistani shopper a simple, honest, and trustworthy online experience — and to give every genuine seller a platform that respects and recognises their brand.
            </p>
          </div>
        </div>
      </section>

      {/* ── Meet the Founder ── */}
      <section className="bg-zinc-50 border-y border-zinc-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-12 block">Meet the Founder</span>

          <div className="max-w-2xl">
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              {/* Gold top bar */}
              <div className="h-1.5 w-full" style={{ background: BRAND_GRADIENT }} />
              <div className="p-8 sm:p-10">
                <div className="flex items-start gap-5 mb-8">
                  {/* Avatar placeholder */}
                  <div
                    className="h-16 w-16 shrink-0 rounded-full flex items-center justify-center text-2xl font-black text-zinc-950"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    I
                  </div>
                  <div>
                    <h2 className="text-2xl font-black uppercase tracking-tight text-zinc-950">Ibrar Yousafzai</h2>
                    <p className="text-xs font-black uppercase tracking-widest mt-1" style={{ color: BRAND_GOLD }}>
                      Founder &amp; CEO — IFI Lifestyle
                    </p>
                  </div>
                </div>

                <blockquote
                  className="border-l-4 pl-5 text-zinc-600 italic leading-relaxed text-base mb-8"
                  style={{ borderColor: BRAND_GOLD }}
                >
                  &ldquo;I built IFI Lifestyle because I believe Pakistani consumers deserve better. Better sellers. Better products. Better trust. This is just the beginning.&rdquo;
                </blockquote>

                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`tel:${siteConfig.contact.phone}`}
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                    {siteConfig.contact.phone}
                  </a>
                  <a
                    href="https://linkedin.com/in/ibrar-yousafzai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-xs font-bold text-zinc-700 hover:border-zinc-400 hover:text-zinc-950 transition-colors"
                  >
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Our Vision / CTA ── */}
      <section className="bg-zinc-950 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-1" style={{ background: BRAND_GRADIENT }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-5 block">Our Vision</span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-8 leading-tight">
            A Standard the{" "}
            <span style={{ color: BRAND_GOLD }}>World Needs</span>
          </h2>
          <p className="text-zinc-400 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            We are starting in Pakistan — but our model of verified, exclusive, curated selling is designed to go international. IFI Lifestyle is not just a store. It is a standard.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-xs font-black uppercase tracking-widest text-zinc-950 hover:opacity-90 transition-opacity"
              style={{ background: BRAND_GRADIENT }}
            >
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-zinc-600 px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:border-white transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
