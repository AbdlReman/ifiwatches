import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

import ProductCard from "@/components/shop/ProductCard";
import ProductSlider from "@/components/home/ProductSlider";
import HeroSlider from "@/components/home/HeroSlider";
import type { IProduct } from "@/types/product";
import type { HomeCategory } from "@/lib/homeCategories";
import { formatPkr } from "@/lib/formatCurrency";

export type HomeStats = {
  sellerCount: number;
  productCount: number;
  categoryCount: number;
};

export type HeroContent = {
  image?: string;
  badgeText?: string;
  heading?: string;
  headingAccent?: string;
  subheading?: string;
  primaryBtnText?: string;
  primaryBtnHref?: string;
  secondaryBtnText?: string;
  secondaryBtnHref?: string;
  pills?: string[];
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
      </svg>
    ),
  },
  {
    title: "Verified Vendors Only",
    desc: "Seller accounts are reviewed before listings go live on the marketplace.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
      </svg>
    ),
  },
  {
    title: "Free Shipping",
    desc: "Free shipping on all orders above Rs. 5,999 across Pakistan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: "Discreet Packaging",
    desc: "All orders are delivered in plain, discreet packaging for your privacy",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
  },
];


export default function HomePageView({
  categories,
  featuredProducts,
  bestSellerProducts,
  vendorProducts,
  flashSaleProducts,
  justForYouProducts,
  featuredByCategory,
  saleImage,
  videoUrl,
  heroContent,
  heroImages = [],
  mobileHeroImages = [],
}: {
  categories: HomeCategory[];
  featuredProducts: IProduct[];
  bestSellerProducts: IProduct[];
  vendorProducts: IProduct[];
  flashSaleProducts: IProduct[];
  justForYouProducts: IProduct[];
  featuredByCategory: HomeCategoryProducts[];
  saleImage?: string;
  videoUrl?: string;
  heroContent?: HeroContent;
  heroImages?: string[];
  mobileHeroImages?: string[];
}) {
  const fallbackHeroImage = heroContent?.image || siteConfig.images.hero;

  return (
    <div className="bg-white">
      {/* Hero — full-screen image slider */}
      <HeroSlider images={heroImages} mobileImages={mobileHeroImages} fallback={fallbackHeroImage} />

      {/* Invisible h1 for SEO */}
      <h1 className="sr-only">IFI Lifestyle — Premium Multi-Vendor Marketplace Pakistan</h1>

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
      {categories.length > 0 ? (
        <section className="border-y border-zinc-200 bg-white">
          <div className="mx-auto max-w-[90rem] px-3 py-5 sm:px-6 sm:py-8 lg:px-8">
            <div className="mb-4 sm:mb-6 flex items-center justify-between gap-4">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-zinc-950">
                Shop by category
              </h2>
              <Link
                href="/shop"
                className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-zinc-500 underline-offset-4 hover:underline"
              >
                View all →
              </Link>
            </div>

            {/* Flex wrap: 5 per row mobile (w-1/5), 12 per row desktop (w-[8.333%]), always centered */}
            <div className="flex flex-wrap justify-center gap-y-5 py-3" style={{ rowGap: "1.25rem" }}>
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={`/shop?category=${encodeURIComponent(cat.name)}`}
                  className="group flex w-1/5 sm:w-[16.666%] lg:w-[8.333%] flex-col items-center gap-2 sm:gap-3 px-1"
                >
                  {/* Outer ring wrapper — no overflow-hidden so ring/shadow are never clipped */}
                  <div className="relative h-16 w-16 sm:h-[67px] sm:w-[67px] lg:h-[78px] lg:w-[78px] rounded-full shadow-sm ring-2 ring-transparent transition-all duration-200 group-hover:ring-[rgb(218,170,88)] group-hover:shadow-md">
                    {/* Inner clip — overflow-hidden stays here for the zoom effect */}
                    <div className="h-full w-full rounded-full overflow-hidden bg-zinc-100">
                      {cat.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={cat.image}
                          alt={cat.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-zinc-100">
                          <span className="text-xl sm:text-3xl font-black uppercase text-zinc-300">
                            {cat.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Label */}
                  <span className="text-center text-[10px] sm:text-xs font-semibold uppercase tracking-wide text-zinc-700 group-hover:text-zinc-950 transition-colors duration-200 max-w-[64px] sm:max-w-[67px] leading-tight">
                    {cat.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Become  Vendor CTA */}
      <section className="border-b border-zinc-200 bg-zinc-950 text-white">
        <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-5">
              <span
                className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-zinc-950"
                style={{ background: siteConfig.brandGradient }}
              >
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016 2.993 2.993 0 0 0 2.25-1.016 3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
                </svg>
              </span>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">For Brands &amp; Sellers</p>
                <h2 className="text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
                  Become a Vendor on IFI Lifestyle
                </h2>
                <p className="mt-1 text-sm text-zinc-400 max-w-lg">
                  List your products, reach thousands of customers across Pakistan, and grow your business on our trusted marketplace.
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/become-a-seller"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-300 transition-colors hover:border-zinc-400 hover:text-white"
              >
                Learn More
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[11px] font-black uppercase tracking-widest text-zinc-950 transition-opacity hover:opacity-90"
                style={{ background: siteConfig.brandGradient }}
              >
                Start Selling
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
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

      {/* Homepage Video */}
      {videoUrl ? (
        <section className="relative w-full overflow-hidden sm:h-screen">
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:object-cover"
          />
        </section>
      ) : null}

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
                href="/shop?sale=1"
                className="shrink-0 text-xs font-bold uppercase tracking-widest text-zinc-400 underline decoration-1 underline-offset-4 hover:text-white"
              >
                See all deals →
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {flashSaleProducts.map((product, idx) => {
                const finalPrice = product.price * (1 - product.discount / 100);
                return (
                  <Link
                    key={product._id}
                    href={`/shop/${product.slug}`}
                    className="group block"
                  >
                    {/* Image */}
                    <div className="relative overflow-hidden bg-zinc-800 aspect-[3/4]">
                      {product.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading={idx < 2 ? "eager" : "lazy"}
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-zinc-600 text-xs uppercase tracking-widest">No image</div>
                      )}
                      <span className="absolute left-0 top-3 bg-red-500 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
                        −{product.discount}%
                      </span>
                      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/95 py-3 text-center text-[10px] font-black uppercase tracking-[0.18em] text-black transition-transform duration-300 group-hover:translate-y-0">
                        View Product
                      </div>
                    </div>
                    {/* Info */}
                    <div className="mt-3 space-y-0.5 px-0.5">
                      {product.brand && (
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-500">{product.brand}</p>
                      )}
                      <p className="text-[13px] font-semibold leading-snug text-white line-clamp-1">{product.name}</p>
                      <div className="flex items-baseline gap-2 pt-0.5">
                        <span className="text-[13px] font-black tabular-nums text-red-400">{formatPkr(finalPrice)}</span>
                        <span className="text-[11px] tabular-nums text-zinc-500 line-through">{formatPkr(product.price)}</span>
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
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
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

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
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
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {vendorProducts.map((product, idx) => (
                <ProductCard key={product._id} product={product} priority={idx < 2} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Seller CTA */}
      {/* <section className="relative overflow-hidden">
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
      </section> */}

      {/* sale banner */}
      {(saleImage || siteConfig.images.hero) && (
        <section className="relative w-full overflow-hidden sm:h-screen">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={saleImage || siteConfig.images.hero}
            alt=""
            className="block h-auto w-full sm:absolute sm:inset-0 sm:h-full sm:w-full sm:object-cover"
          />
        </section>
      )}

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
              className="group rounded-2xl border border-zinc-200 p-6 text-center transition-all hover:border-[rgb(218,170,88)] hover:shadow-md"
            >
              <div
                className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl text-zinc-950 transition-transform duration-200 group-hover:scale-110"
                style={{ background: siteConfig.brandGradient }}
              >
                {feature.icon}
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
