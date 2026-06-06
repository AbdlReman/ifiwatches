import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/lib/siteConfig";
import { getCategoryVisual } from "@/components/home/categoryStyles";
import ProductCard from "@/components/shop/ProductCard";
import ProductSlider from "@/components/home/ProductSlider";
import type { IProduct } from "@/types/product";
import type { HomeCategory } from "@/lib/homeCategories";
import { formatPkr } from "@/lib/formatCurrency";

export type HomeStats = {
  sellerCount: number;
  productCount: number;
  categoryCount: number;
};

type HomeCategoryProducts = {
  name: string;
  productCount: number;
  products: IProduct[];
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
  bestSellerProducts,
  vendorProducts,
  flashSaleProducts,
  justForYouProducts,
  featuredByCategory,
  stats,
}: {
  categories: HomeCategory[];
  featuredProducts: IProduct[];
  bestSellerProducts: IProduct[];
  vendorProducts: IProduct[];
  flashSaleProducts: IProduct[];
  justForYouProducts: IProduct[];
  featuredByCategory: HomeCategoryProducts[];
  stats: HomeStats;
}) {
  const categoryCards = buildCategoryCards(categories);

  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative min-h-[min(88vh,720px)] overflow-hidden border-b border-zinc-200">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${siteConfig.images.hero})` }}
          role="img"
          aria-label=""
        />

        <div className="relative mx-auto flex min-h-[min(88vh,720px)] max-w-[90rem] items-center px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/35 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-sm backdrop-blur-[2px]">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: siteConfig.brandColor }} />
              Multi-vendor marketplace
            </span>
            <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)] sm:text-5xl lg:text-6xl">
              Shop lifestyle.
              <br />
              <span style={{ color: siteConfig.brandColor }}>Trust every seller.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:text-lg">
              IFI Lifestyle brings verified vendors together under one standard — premium watches, perfumes,
              eyewear, gadgets, and fashion with one seller per product.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary shadow-lg">
                Explore marketplace
              </Link>
              <Link
                href="/register"
                className="border-2 border-white bg-transparent px-10 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-lg transition hover:bg-white hover:text-zinc-950"
              >
                Become a seller
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {["Verified vendors", "One seller per SKU", "Nationwide delivery"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/35 bg-black/30 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-[2px]"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {/* <section className="border-b border-zinc-800 bg-zinc-950 text-white">
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
      </section> */}

      {/* Categories */}
      {categoryCards.length > 0 ? (
        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-zinc-950">
                Shop by category
              </h2>
              <Link
                href="/shop"
                className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 underline-offset-4 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {categoryCards.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group flex flex-col justify-between border border-zinc-200 bg-white p-4 transition-all duration-200 hover:border-transparent hover:shadow-[0_0_0_2px_rgb(218,170,88)]"
                >
                  <span
                    className="mb-3 block h-[2px] w-6 transition-all duration-300 group-hover:w-10"
                    style={{ backgroundColor: "rgb(218, 170, 88)" }}
                  />
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-zinc-950 leading-snug">
                      {cat.name}
                    </h3>
                    <p className="mt-0.5 text-[10px] font-medium text-zinc-400">{cat.visual.tagline}</p>
                  </div>
                  <span
                    className="mt-3 text-[10px] font-bold uppercase tracking-widest opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    style={{ color: "rgb(218, 170, 88)" }}
                  >
                    Shop →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

     
      {/* Best sellers */}
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Customer favorites</p>
              <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
                Our Best Sellers
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 md:text-base">
                Discover the favorites that keep our customers coming back for more.
              </p>
            </div>
            <Link
              href="/shop"
              className="shrink-0 text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
            >
              Shop all →
            </Link>
          </div>

          {bestSellerProducts.length > 0 ? (
            <ProductSlider products={bestSellerProducts} />
          ) : (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-8 py-16 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">Best sellers coming soon</p>
              <p className="mt-2 text-zinc-600">
                Admins can mark published products as best sellers from the product editor.
              </p>
              <Link href="/shop" className="btn-primary mt-8 inline-block">
                Visit shop
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Curated for you</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
              Featured drops
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
            <p className="mt-2 text-zinc-600">
              Admins can mark published products as featured from the product editor.
            </p>
            <Link href="/shop" className="btn-primary mt-8 inline-block">
              Visit shop
            </Link>
          </div>
        )}
      </section>
 {/* Flash Sale */}
      {flashSaleProducts.length > 0 ? (
        <section className="border-y border-zinc-200 bg-zinc-950 text-white">
          <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-red-400">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-red-500" />
                  Limited time
                </span>
                <h2 className="mt-3 text-3xl font-black uppercase tracking-tight text-white md:text-4xl">
                  Flash Sale
                </h2>
                <p className="mt-2 text-sm text-zinc-400">Biggest discounts, handpicked for you today.</p>
              </div>
              <Link
                href="/shop"
                className="shrink-0 text-xs font-bold uppercase tracking-widest text-zinc-400 underline decoration-1 underline-offset-4 hover:text-white"
              >
                See all deals →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {flashSaleProducts.map((product, idx) => {
                const finalPrice = product.price * (1 - product.discount / 100);
                return (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 transition hover:border-zinc-600 hover:shadow-xl"
                  >
                    <div className="relative aspect-square overflow-hidden bg-zinc-800">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                          loading={idx < 2 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-4xl text-zinc-700">🛍</div>
                      )}
                      <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-0.5 text-[11px] font-black text-white shadow">
                        −{product.discount}%
                      </span>
                    </div>
                    <div className="flex flex-col gap-1 p-4">
                      {product.brand ? (
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{product.brand}</p>
                      ) : null}
                      <p className="text-sm font-semibold leading-snug text-white line-clamp-2">{product.name}</p>
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-base font-black text-white">{formatPkr(finalPrice)}</span>
                        <span className="text-xs text-zinc-500 line-through">{formatPkr(product.price)}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Just For You */}
      {justForYouProducts.length > 0 ? (
        <section className="border-b border-zinc-200 bg-white">
          <div className="mx-auto max-w-[90rem] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Picked for you</p>
                <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
                  Just For You
                </h2>
                <p className="mt-2 text-sm text-zinc-500">Fresh arrivals you might love.</p>
              </div>
              <Link
                href="/shop"
                className="shrink-0 text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
              >
                Explore all →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {justForYouProducts.map((product, idx) => (
                <ProductCard key={product._id} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Featured drops by category */}
      {featuredByCategory.length > 0 ? (
        <section className="mx-auto max-w-[90rem] border-t border-zinc-200 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Curated for you</p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-zinc-950 md:text-4xl">
              Featured drops by category
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {featuredByCategory.map((group) => (
              <article key={group.name} className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">Category</p>
                    <h3 className="mt-1 text-2xl font-black uppercase tracking-tight text-zinc-950">{group.name}</h3>
                    <p className="mt-1 text-sm text-zinc-600">
                      {group.productCount.toLocaleString()} live listing
                      {group.productCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <Link
                    href={`/shop?category=${encodeURIComponent(group.name)}`}
                    className="rounded-full border border-zinc-300 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-950"
                  >
                    View More
                  </Link>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {group.products.map((product, idx) => (
                    <ProductCard key={`${group.name}-${product._id}`} product={product} priority={idx === 0} />
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

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
                <p className="mt-2 max-w-2xl text-sm text-zinc-600">
                  Fresh products from verified independent vendors across Pakistan.
                </p>
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
      <section className="relative min-h-[420px] overflow-hidden border-y border-zinc-200 sm:min-h-[480px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${siteConfig.images.hero})` }}
          role="img"
          aria-label=""
        />
        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-3xl flex-col items-center justify-center px-4 py-20 text-center sm:min-h-[480px] sm:px-6">
          <h2 className="text-3xl font-black uppercase tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] md:text-5xl">
            The future of digital lifestyle
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            One seller per product. Trusted vendors only. Free shipping above Rs. 3,000 and discreet packaging across
            Pakistan.
          </p>
          <Link href="/shop" className="btn-primary mt-8 inline-block shadow-lg">
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
