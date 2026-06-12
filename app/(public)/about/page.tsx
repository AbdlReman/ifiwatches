import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const differentiators = [
  {
    icon: "🔒",
    title: "One Seller Per Product",
    desc: "Each product on IFI Lifestyle has exactly one verified seller. No duplicates. No price wars. No confusion. You see a product — you know exactly who stands behind it. One choice. Full trust.",
  },
  {
    icon: "✅",
    title: "Verified Sellers Only",
    desc: "Every seller is personally reviewed and approved by our team before going live. We do not allow open registration. If a seller is on IFI Lifestyle — they have earned that place. Fake sellers do not exist here.",
  },
  {
    icon: "🎯",
    title: "Everything in One Place",
    desc: "Fashion. Eyewear. Fragrance. Phones. Jewellery. Accessories. All curated lifestyle categories — in one trusted store. No jumping between platforms. No searching multiple websites. One place. Every thing. Full quality.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Section 1 — Hero Statement */}
      <section className="bg-zinc-950 text-white min-h-[65vh] flex items-center border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}About
          </p>
          <div className="max-w-5xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: siteConfig.brandColor }}>
              Iconic Futures Innovations
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-tight mb-8">
              We Are Not a Marketplace.{" "}
              <span style={{ color: siteConfig.brandColor }}>We Are a Standard.</span>
            </h1>
            <p className="text-zinc-300 text-lg md:text-xl leading-relaxed max-w-3xl">
              IFI Lifestyle — Iconic Futures Innovations — Pakistan&apos;s first curated lifestyle portal where every seller is verified, every product is exclusive, and every customer shops with complete confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2 — Our Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Our Story</p>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-10">
            Built to Fix What&apos;s{" "}
            <span style={{ color: siteConfig.brandColor }}>Broken</span>
          </h2>
          <div className="space-y-6 text-gray-600 text-base leading-relaxed">
            <p>
              <strong className="text-black">IFI Lifestyle was founded by Ibrar Yousafzai</strong> with one goal: to fix what is broken in Pakistan&apos;s online shopping experience.
            </p>
            <p>
              Pakistani shoppers face the same problems every day — fake products, too many sellers for the same item, no accountability, and platforms that don&apos;t care. We built IFI Lifestyle to solve all of that.
            </p>
            <p className="text-xl font-black uppercase tracking-tight text-black">
              One product. One verified seller. Zero confusion.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3 — What Makes Us Different */}
      <section className="bg-zinc-950 py-20 border-y border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-3">What Makes Us Different</p>
            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              We Solve What Marketplaces Cannot
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {differentiators.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="border border-zinc-800 bg-zinc-900 p-8 rounded-xl"
              >
                <span className="text-4xl mb-5 block">{icon}</span>
                <h3 className="font-black uppercase tracking-tight text-lg text-white mb-3">{title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4 — Our Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6">Our Mission</p>
        <blockquote
          className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight leading-snug max-w-4xl mx-auto"
          style={{ color: "inherit" }}
        >
          <span
            className="block border-l-4 pl-6 text-left text-zinc-800 italic font-semibold tracking-normal normal-case text-lg md:text-xl leading-relaxed"
            style={{ borderColor: siteConfig.brandColor }}
          >
            &ldquo;To give every Pakistani shopper a simple, honest, and trustworthy online experience — and to give every genuine seller a platform that respects and recognizes their brand.&rdquo;
          </span>
        </blockquote>
      </section>

      {/* Section 5 — Meet the Founder */}
      <section className="bg-zinc-100 border-y border-zinc-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-10">Meet the Founder</p>
          <div className="max-w-2xl">
            <div className="bg-white border border-zinc-200 p-8 sm:p-10">
              <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Ibrar Yousafzai</h2>
              <p className="text-sm font-bold uppercase tracking-widest mb-6" style={{ color: siteConfig.brandColor }}>
                Founder &amp; CEO — IFI Lifestyle
              </p>
              <div className="space-y-2 text-sm text-zinc-600 mb-8">
                <p>
                  <span className="mr-2">📱</span>
                  <a href={`tel:${siteConfig.contact.phone}`} className="hover:text-black transition-colors">
                    {siteConfig.contact.phone}
                  </a>
                </p>
                <p>
                  <span className="mr-2">🔗</span>
                  <a
                    href="https://linkedin.com/in/ibrar-yousafzai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-black transition-colors underline"
                  >
                    linkedin.com/in/ibrar-yousafzai
                  </a>
                </p>
              </div>
              <blockquote
                className="border-l-4 pl-5 text-zinc-700 italic leading-relaxed"
                style={{ borderColor: siteConfig.brandColor }}
              >
                &ldquo;I built IFI Lifestyle because I believe Pakistani consumers deserve better. Better sellers. Better products. Better trust. This is just the beginning.&rdquo;
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6 — Our Vision */}
      <section className="bg-zinc-950 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Our Vision</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-8 leading-tight">
            A Standard the{" "}
            <span style={{ color: siteConfig.brandColor }}>World Needs</span>
          </h2>
          <p className="text-zinc-300 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            We are starting in Pakistan — but our model of verified, exclusive, curated selling is designed to go international. IFI Lifestyle is not just a store. It is a standard that the world needs.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-block px-8 py-3 text-xs font-black uppercase tracking-widest text-zinc-950"
              style={{ background: siteConfig.brandGradient }}
            >
              Shop Now
            </Link>
            <Link
              href="/contact"
              className="inline-block border border-zinc-600 px-8 py-3 text-xs font-black uppercase tracking-widest text-white hover:border-white transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
