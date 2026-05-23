import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { getCategoryVisual } from "@/components/home/categoryStyles";
import ProductCard from "@/components/shop/ProductCard";
import type { IProduct } from "@/types/product";
import type { HomeCategory } from "@/lib/homeCategories";

export type HomeStats = {
  sellerCount: number;
  productCount: number;
  categoryCount: number;
};

const MARKETPLACE_STEPS = [
  {
    step: "01",
    title: "Browse the catalog",
    desc: "Watches, perfumes, eyewear, fashion, and more — all in one trusted storefront.",
  },
  {
    step: "02",
    title: "One seller per product",
    desc: "Every listing has a single verified vendor. No duplicates, no guesswork.",
  },
  {
    step: "03",
    title: "Shop with confidence",
    desc: "Approved listings, clear pricing, and reliable delivery across Pakistan.",
  },
];

const TRUST_FEATURES = [
  {
    title: "One Seller Per Product",
    desc: "Every product has one verified seller — full accountability on every order.",
  },
  {
    title: "Verified Vendors Only",
    desc: "Seller accounts are reviewed before listings go live on the marketplace.",
  },
  ...siteConfig.trustBadges.map((b) => ({ title: b.title, desc: b.description })),
];

function buildCategoryCards(categories: HomeCategory[]) {
  return categories.map((cat, index) => {
    const visual = getCategoryVisual(cat.name);
    const tagline =
      cat.productCount > 0
        ? `${cat.productCount} live listing${cat.productCount === 1 ? "" : "s"}`
        : visual.tagline;
    return {
      name: cat.name,
      productCount: cat.productCount,
      visual: { ...visual, tagline },
      wide: index === 0,
    };
  });
}

export default function HomePageView({
  categories,
  featuredProducts,
  vendorProducts,
  stats,
}: {
  categories: HomeCategory[];
  featuredProducts: IProduct[];
  vendorProducts: IProduct[];
  stats: HomeStats;
}) {
  const categoryCards = buildCategoryCards(categories);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: `url(${siteConfig.images.hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="pointer-events-none absolute -right-24 top-1/2 h-[520px] w-[520px] -translate-y-1/2 rounded-full border border-zinc-300/60" />
        <div className="pointer-events-none absolute right-8 top-1/2 h-[380px] w-[380px] -translate-y-1/2 rounded-full border border-[rgb(218,170,88)]/30" />

        <div className="relative mx-auto grid max-w-[90rem] gap-12 px-4 py-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8 lg:py-20">
          <div>
            <span
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-[rgb(218,170,88)]/40 bg-white/90 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-800 shadow-sm"
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: siteConfig.brandColor }} />
              Multi-vendor marketplace
            </span>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-zinc-950 sm:text-5xl lg:text-6xl">
              Shop lifestyle.
              <br />
              <span style={{ color: siteConfig.brandColor }}>Trust every seller.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-zinc-600 md:text-lg">
              IFI Lifestyle brings verified vendors together under one standard — premium watches, perfumes,
              eyewear, gadgets, and fashion with one seller per product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Explore marketplace
              </Link>
              <Link href="/register" className="btn-outline-dark">
                Become a seller
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Verified vendors", "One seller per SKU", "Nationwide delivery"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-600"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {categoryCards.slice(0, 4).map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${cat.visual.gradient} p-5 text-white shadow-lg transition-transform hover:-translate-y-0.5 sm:p-6`}
              >
                <span className="text-4xl font-black opacity-20">{cat.visual.letter}</span>
                <p className="mt-6 text-[10px] font-bold uppercase tracking-widest text-white/70">{cat.visual.tagline}</p>
                <h3 className="mt-1 text-sm font-black uppercase tracking-tight sm:text-base">{cat.name}</h3>
                <span className="mt-3 inline-block text-[10px] font-bold uppercase tracking-widest opacity-0 transition-opacity group-hover:opacity-100">
                  Shop →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-zinc-800 bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-[90rem] grid-cols-2 gap-px bg-zinc-800 md:grid-cols-4">
          {[
            { label: "Verified sellers", value: stats.sellerCount },
            { label: "Live listings", value: stats.productCount },
            { label: "Categories", value: stats.categoryCount },
            { label: "Free shipping", value: "3K+" },
          ].map((item) => (
            <div key={item.label} className="bg-zinc-950 px-6 py-8 text-center md:py-10">
              <p className="text-3xl font-black tabular-nums md:text-4xl" style={{ color: siteConfig.brandColor }}>
                {typeof item.value === "number" ? item.value.toLocaleString() : item.value}
              </p>
              <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories bento — from admin categories or live product taxonomy */}
      {categoryCards.length > 0 ? (
        <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Marketplace categories</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
                Shop by department
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
            >
              View all products →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
            {categoryCards.map((cat) => (
              <Link
                key={cat.name}
                href={`/shop?category=${encodeURIComponent(cat.name)}`}
                className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${cat.visual.gradient} ${
                  cat.wide ? "lg:col-span-2 lg:min-h-[220px]" : "min-h-[180px]"
                } flex flex-col justify-end p-6 text-white transition-transform hover:-translate-y-0.5`}
              >
                <span className="absolute right-4 top-4 text-5xl font-black opacity-15">{cat.visual.letter}</span>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">{cat.visual.tagline}</p>
                <h3 className={`mt-2 font-black uppercase tracking-tight ${cat.wide ? "text-3xl md:text-4xl" : "text-2xl"}`}>
                  {cat.name}
                </h3>
                <span className="mt-4 text-[10px] font-bold uppercase tracking-widest opacity-70 transition-opacity group-hover:opacity-100">
                  Explore vendors →
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* Vendor picks */}
      {vendorProducts.length > 0 ? (
        <section className="border-y border-zinc-200 bg-zinc-50">
          <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">From our sellers</p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
                  Vendor marketplace picks
                </h2>
              </div>
              <Link
                href="/shop"
                className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
              >
                Browse all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {vendorProducts.map((product, idx) => (
                <ProductCard key={product._id} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Featured */}
      <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Curated for you</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
              {featuredProducts.length > 0 ? "Latest arrivals" : "Featured drops"}
            </h2>
          </div>
          <Link
            href="/shop"
            className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
          >
            View all →
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, idx) => (
              <ProductCard key={product._id} product={product} priority={idx < 2} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Listings coming soon</p>
            <p className="mt-2 text-zinc-600">New products from verified sellers will appear here.</p>
            <Link href="/shop" className="btn-primary mt-8 inline-block">
              Visit shop
            </Link>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="border-t border-zinc-200 bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">How it works</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
              A marketplace built on trust
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {MARKETPLACE_STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 transition-shadow hover:shadow-md"
              >
                <span
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-zinc-950"
                  style={{ background: siteConfig.brandGradient }}
                >
                  {item.step}
                </span>
                <h3 className="mt-5 text-lg font-black uppercase tracking-tight text-zinc-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seller CTA */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url(${siteConfig.images.hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div
          className="relative mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20"
          style={{ background: siteConfig.brandGradient }}
        >
          <div className="mx-auto max-w-2xl text-center text-zinc-950">
            <p className="text-xs font-bold uppercase tracking-[0.2em]">For brands & sellers</p>
            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight md:text-4xl">
              Join the IFI vendor network
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-800 md:text-base">
              List your products on a curated multi-vendor platform. Get approved, manage orders from your seller
              dashboard, and reach customers across Pakistan.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/register" className="btn-outline-dark bg-white/90 hover:bg-zinc-950 hover:text-white">
                Start selling
              </Link>
              <Link href="/about" className="border-2 border-zinc-950/30 px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-zinc-950/10">
                Our standard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Promo banner */}
      <section className="relative overflow-hidden border-y border-zinc-200">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${siteConfig.images.hero})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-white/88" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-5xl">
            The future of digital lifestyle
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-zinc-600 leading-relaxed">
            One seller per product. Trusted vendors only. Free shipping above Rs. 3,000 and discreet packaging across
            Pakistan.
          </p>
          <Link href="/shop" className="btn-primary mt-8 inline-block">
            Shop the marketplace
          </Link>
        </div>
      </section>

      {/* Trust grid */}
      <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Why {siteConfig.brandName}</p>
          <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
            Built different
          </h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST_FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-zinc-200 p-6 text-center transition-shadow hover:border-[rgb(218,170,88)]/50 hover:shadow-sm"
            >
              <div
                className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full"
                style={{ background: siteConfig.brandGradient }}
              >
                <Image src={siteConfig.logo.src} alt="" width={24} height={24} className="h-6 w-6 object-contain opacity-80" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-tight text-zinc-950">{feature.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
