"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Breadcrumbs from "@/components/shop/Breadcrumbs";
import ProductRatingSummary from "@/components/shop/ProductRatingSummary";
import { RelatedProductsSection, RecentlyViewedSection } from "@/components/shop/ProductSections";
import type { CartItem, IProduct } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";
import { pushRecentlyViewed, readRecentlyViewed } from "@/lib/recentlyViewed";
import ProductReviewsPanel from "./ProductReviewsPanel";

const BRAND_GOLD = "rgb(218,170,88)";
const BRAND_GRADIENT = "linear-gradient(135deg,rgb(218,170,88) 0%,rgb(244,202,104) 100%)";
const SALE_RED = "#e4002b";

function addToCart(product: IProduct, color: string, image: string, size: string, qty: number) {
  const n = Math.max(1, Math.floor(qty || 1));
  const existing: CartItem[] = JSON.parse(localStorage.getItem("cart_items") || "[]");
  const idx = existing.findIndex(
    (i) => i.productId === product._id && (i.color || "") === (color || "") && (i.size || "") === (size || "")
  );
  if (idx >= 0) existing[idx].quantity += n;
  else existing.push({ productId: product._id, name: product.name, price: product.price, image, quantity: n, color, size });
  localStorage.setItem("cart_items", JSON.stringify(existing));
  window.dispatchEvent(new Event("cart_updated"));
}

function setCartToSingleItem(item: CartItem) {
  localStorage.setItem("cart_items", JSON.stringify([item]));
  window.dispatchEvent(new Event("cart_updated"));
}

const isCloud = (url: string) => url.startsWith("https://res.cloudinary.com/");

export default function ProductDetailClient({
  product,
  relatedProducts = [],
  siteUrl = "",
}: {
  product: IProduct;
  relatedProducts?: IProduct[];
  siteUrl?: string;
}) {
  const router = useRouter();
  const stock = Math.max(0, Number(product.stockQuantity || 0));
  const oos = stock <= 0;
  const lowStock = !oos && stock <= 5;

  const variants = useMemo(() => {
    if (product.colorVariants.length > 0) return product.colorVariants;
    if (product.colors.length > 0) return product.colors.map((c) => ({ color: c, images: product.images }));
    return [{ color: "Default", images: product.images }];
  }, [product.colorVariants, product.colors, product.images]);

  const sizes = useMemo(
    () => (Array.isArray(product.sizes) ? product.sizes.map((s) => String(s).trim()).filter(Boolean) : []),
    [product.sizes]
  );

  const [selColor, setSelColor] = useState(variants[0]?.color || "Default");
  const [selSize, setSelSize] = useState(sizes[0] || "");
  const [qty, setQty] = useState(1);
  const [lightbox, setLightbox] = useState(false);
  const [recent, setRecent] = useState<{ slug: string; name: string; image: string; brand: string; price: number; discount: number }[]>([]);

  const maxQty = oos ? 1 : Math.min(99, stock);
  const hasDiscount = Number(product.discount || 0) > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const discPct = hasDiscount ? Math.round(product.discount) : 0;
  const lineQty = oos ? 1 : Math.min(Math.max(1, qty), maxQty);

  const allImgs = useMemo(() => {
    const from = variants.flatMap((v) => v.images || []);
    return Array.from(new Set([...from, ...product.images].filter(Boolean)));
  }, [variants, product.images]);

  const activeVariant = useMemo(() => variants.find((v) => v.color === selColor) || variants[0], [variants, selColor]);
  const colorImgs = activeVariant?.images?.length ? activeVariant.images : product.images;
  const thumbs = useMemo(() => {
    const primary = (colorImgs.length ? colorImgs : product.images).filter(Boolean);
    return [...primary, ...allImgs.filter((u) => !primary.includes(u))];
  }, [colorImgs, product.images, allImgs]);

  const [mainImg, setMainImg] = useState(thumbs[0] || "");
  const imgIdx = Math.max(0, thumbs.indexOf(mainImg));

  const changeColor = (c: string) => {
    setSelColor(c);
    const nv = variants.find((v) => v.color === c) || variants[0];
    const ni = nv?.images?.length ? nv.images : product.images;
    setMainImg(ni[0] || allImgs[0] || "");
  };

  useEffect(() => {
    const img = variants[0]?.images?.[0] || product.images[0] || "";
    pushRecentlyViewed({ slug: product.slug, name: product.name, image: img, brand: product.brand ?? "", price: product.price, discount: product.discount }, product.slug);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecent(readRecentlyViewed().filter((e) => e.slug !== product.slug));
  }, [product._id, product.slug, product.name, product.brand, product.price, product.discount, product.images, variants]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox) return;
      if (e.key === "ArrowLeft") setMainImg((c) => { const i = thumbs.indexOf(c); return thumbs[i <= 0 ? thumbs.length - 1 : i - 1] || c; });
      if (e.key === "ArrowRight") setMainImg((c) => { const i = thumbs.indexOf(c); return thumbs[i < 0 || i >= thumbs.length - 1 ? 0 : i + 1] || c; });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [thumbs, lightbox]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.metaDescription,
    image: thumbs.filter(Boolean).slice(0, 8),
    sku: product._id,
    brand: { "@type": "Brand", name: product.brand || "Store" },
    offers: { "@type": "Offer", url: siteUrl ? `${siteUrl}/shop/${product.slug}` : `/shop/${product.slug}`, priceCurrency: "PKR", price: Number(finalPrice.toFixed(2)), availability: `https://schema.org/${oos ? "OutOfStock" : "InStock"}` },
  }), [product, thumbs, siteUrl, finalPrice, oos]);

  const onAddToCart = () => {
    if (oos) return;
    addToCart(product, selColor || "Default", mainImg, selSize, lineQty);
    setQty(1);
    toast.success("Added to cart", { description: `${product.name} · Qty ${lineQty}${selSize ? ` · ${selSize}` : ""}` });
  };

  const onBuyNow = () => {
    if (oos) return;
    setCartToSingleItem({ productId: product._id, name: product.name, price: product.price, image: mainImg, quantity: lineQty, color: selColor || "Default", size: selSize || "" });
    toast.success("Going to checkout…");
    router.push("/checkout");
  };

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(product.category ? [{ label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` }] : []),
    { label: product.name },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ── Breadcrumb ── */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbs} className="text-neutral-400 [&_a]:text-neutral-600 [&_a:hover]:text-black" />
        </div>
      </div>

      {/* ── Main grid ── */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8 lg:py-10">
        <div className="lg:grid lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-14">

          {/* LEFT — Gallery */}
          <div className="flex flex-col lg:sticky lg:top-6">
            <div className="flex flex-1 gap-2.5">

              {/* Vertical thumbnail strip — desktop only */}
              {thumbs.length > 1 && (
                <div className="hidden lg:flex flex-col gap-2 overflow-y-auto max-h-full w-[76px] shrink-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {thumbs.map((img, i) => {
                    const active = mainImg === img;
                    return (
                      <button
                        key={`${img}-${i}`}
                        type="button"
                        onClick={() => setMainImg(img)}
                        className={`relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-150 ${
                          active ? "opacity-100" : "border-transparent opacity-60 hover:opacity-90"
                        }`}
                        style={active ? { borderColor: BRAND_GOLD } : undefined}
                        aria-label={`View image ${i + 1}`}
                      >
                        {isCloud(img) ? (
                          <Image src={img} alt="" fill className="object-cover" sizes="76px" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main image */}
              <div className="relative flex-1 overflow-hidden rounded-2xl bg-neutral-50 h-[280px] sm:h-[360px] lg:h-full lg:min-h-[400px]">
                {/* Sale badge */}
                {hasDiscount && (
                  <span
                    className="absolute left-4 top-4 z-10 rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white"
                    style={{ backgroundColor: SALE_RED }}
                  >
                    −{discPct}%
                  </span>
                )}
                {/* Stock badge */}
                {oos && (
                  <span className="absolute right-4 top-4 z-10 rounded-full bg-neutral-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                    Sold Out
                  </span>
                )}
                {lowStock && (
                  <span
                    className="absolute right-4 top-4 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-black"
                    style={{ background: BRAND_GOLD }}
                  >
                    Only {stock} left
                  </span>
                )}

                {/* Image click → lightbox */}
                <button
                  type="button"
                  onClick={() => setLightbox(true)}
                  className="relative block h-full w-full cursor-zoom-in outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  style={{ "--tw-ring-color": BRAND_GOLD } as React.CSSProperties}
                  aria-label="Enlarge image"
                >
                  {mainImg && isCloud(mainImg) ? (
                    <Image src={mainImg} alt={product.name} fill priority className="object-contain p-4 transition-transform duration-500 hover:scale-[1.03]" sizes="(max-width:1024px) 100vw, 50vw" />
                  ) : mainImg ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mainImg} alt={product.name} className="absolute inset-0 h-full w-full object-contain p-4 transition-transform duration-500 hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-300">No image</div>
                  )}
                </button>

                {/* Image counter */}
                {thumbs.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2.5 py-0.5 text-[10px] font-bold text-white tabular-nums backdrop-blur-sm">
                    {imgIdx + 1} / {thumbs.length}
                  </span>
                )}
              </div>
            </div>

            {/* Horizontal thumbnail strip — mobile only */}
            {thumbs.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {thumbs.map((img, i) => {
                  const active = mainImg === img;
                  return (
                    <button
                      key={`${img}-${i}`}
                      type="button"
                      onClick={() => setMainImg(img)}
                      className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-150 ${
                        active ? "opacity-100" : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                      style={active ? { borderColor: BRAND_GOLD } : undefined}
                      aria-label={`View image ${i + 1}`}
                    >
                      {isCloud(img) ? (
                        <Image src={img} alt="" fill className="object-cover" sizes="72px" />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT — Product info */}
          <div className="mt-8 lg:mt-0">

            {/* Brand pill + badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {product.brand && (
                <span className="rounded-full border px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.18em]" style={{ borderColor: BRAND_GOLD, color: BRAND_GOLD }}>
                  {product.brand}
                </span>
              )}
              {product.isBestSeller && (
                <span className="rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-black" style={{ background: BRAND_GRADIENT }}>
                  Best Seller
                </span>
              )}
              {product.isFeatured && (
                <span className="rounded-full bg-black px-3 py-0.5 text-[10px] font-black uppercase tracking-widest text-white">
                  Featured
                </span>
              )}
            </div>

            {/* Product name */}
            <h1 className="text-2xl font-black leading-tight tracking-tight text-zinc-950 sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-2.5">
              <ProductRatingSummary productId={product._id} />
            </div>

            {/* Price */}
            <div className="mt-3 flex flex-wrap items-end gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-black tabular-nums sm:text-4xl" style={{ color: SALE_RED }}>
                    {formatPkr(finalPrice)}
                  </span>
                  <div className="flex flex-col pb-0.5">
                    <span className="text-sm text-neutral-400 line-through tabular-nums">{formatPkr(product.price)}</span>
                    <span className="text-[11px] font-black uppercase tracking-wide" style={{ color: SALE_RED }}>
                      Save {discPct}%
                    </span>
                  </div>
                </>
              ) : (
                <span className="text-3xl font-black tabular-nums text-zinc-950 sm:text-4xl">
                  {formatPkr(product.price)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className="mt-2 flex items-center gap-2">
              {oos ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-red-600">Out of Stock</span>
                </>
              ) : lowStock ? (
                <>
                  <span className="h-2 w-2 animate-pulse rounded-full" style={{ backgroundColor: BRAND_GOLD }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND_GOLD }}>Only {stock} left</span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">In Stock</span>
                  {stock > 0 && <span className="text-xs text-neutral-400">· {stock} available</span>}
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="mt-3 border-l-[3px] pl-4 text-sm leading-relaxed text-neutral-600" style={{ borderColor: BRAND_GOLD }}>
                {product.description}
              </p>
            )}

            <div className="my-4 h-px bg-neutral-100" />

            {/* Color */}
            {variants.some((v) => v.color !== "Default") && (
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">Color:</span>
                  <span className="text-[11px] font-bold text-zinc-950">{selColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => {
                    const on = selColor === v.color;
                    const vImg = v.images?.[0] || "";
                    return (
                      <button
                        key={v.color}
                        type="button"
                        onClick={() => changeColor(v.color)}
                        title={v.color}
                        aria-label={`Select color ${v.color}`}
                        className={`relative h-[54px] w-[54px] overflow-hidden rounded-lg border-2 transition-all duration-150 ${
                          on ? "" : "border-neutral-200 opacity-60 hover:opacity-95 hover:border-neutral-300"
                        }`}
                        style={on ? { borderColor: BRAND_GOLD } : undefined}
                      >
                        {vImg ? (
                          isCloud(vImg) ? (
                            <Image src={vImg} alt={v.color} fill className="object-cover" sizes="54px" />
                          ) : (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={vImg} alt={v.color} className="absolute inset-0 h-full w-full object-cover" />
                          )
                        ) : (
                          <span className="flex h-full w-full items-center justify-center bg-neutral-100 p-1 text-center text-[8px] font-bold uppercase leading-tight text-neutral-600">
                            {v.color}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-widest text-neutral-500">Size</span>
                  {selSize && <span className="text-[11px] font-semibold text-zinc-950">Selected: {selSize}</span>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const on = selSize === s;
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelSize(s)}
                        className={`flex h-10 min-w-[2.75rem] items-center justify-center rounded-lg border-2 px-3 text-xs font-bold transition-all duration-150 ${
                          on ? "text-zinc-950" : "border-neutral-200 text-neutral-500 hover:border-neutral-400"
                        }`}
                        style={on ? { borderColor: BRAND_GOLD, backgroundColor: "rgba(218,170,88,0.08)" } : undefined}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5">
              <span className="mb-2 block text-[11px] font-black uppercase tracking-widest text-neutral-500">Quantity</span>
              <div className="inline-flex items-center overflow-hidden rounded-full border border-neutral-200 bg-neutral-50">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                  className="flex h-9 w-9 items-center justify-center text-base font-bold text-zinc-950 transition hover:bg-neutral-100 disabled:opacity-30"
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="min-w-[2rem] text-center text-sm font-black tabular-nums text-zinc-950">{lineQty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
                  disabled={oos || qty >= maxQty}
                  className="flex h-9 w-9 items-center justify-center text-base font-bold text-zinc-950 transition hover:bg-neutral-100 disabled:opacity-30"
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA — desktop */}
            <div className="hidden gap-3 lg:flex">
              <button
                type="button"
                disabled={oos}
                onClick={onAddToCart}
                className="flex flex-1 items-center justify-center rounded-full text-xs font-black uppercase tracking-widest text-zinc-950 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: oos ? "#e5e7eb" : BRAND_GRADIENT, height: "2.625rem" }}
              >
                {oos ? "Sold Out" : "Add to Cart"}
              </button>
              <button
                type="button"
                disabled={oos}
                onClick={onBuyNow}
                className="flex flex-1 items-center justify-center rounded-full border-2 border-zinc-950 bg-zinc-950 text-xs font-black uppercase tracking-widest text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300"
                style={{ height: "2.625rem" }}
              >
                {oos ? "Sold Out" : "Buy Now"}
              </button>
            </div>

            {/* Meta table */}
            {(product.brand || product.soldCount > 0) && (
              <div className="mt-4 divide-y divide-neutral-100 rounded-2xl border border-neutral-100 overflow-hidden">
                {product.brand && (
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <span className="font-semibold uppercase tracking-widest text-neutral-400">Brand</span>
                    <span className="font-black text-zinc-950">{product.brand}</span>
                  </div>
                )}
                {product.soldCount > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5 text-xs">
                    <span className="font-semibold uppercase tracking-widest text-neutral-400">Sold</span>
                    <span className="font-black text-zinc-950">{product.soldCount.toLocaleString()} units</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Trust badges row — below both columns ── */}
        <div className="mt-6 flex items-stretch divide-x divide-neutral-200 overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
          {[
            { label: "Fast Delivery", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg> },
            { label: "Nationwide", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" /></svg> },
            { label: "Easy Returns", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg> },
            { label: "Policy Applies", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" /></svg> },
            { label: "Authentic", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" /></svg> },
            { label: "Verified Seller", icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" /></svg> },
          ].map((item) => (
            <div key={item.label} className="flex flex-1 items-center justify-center gap-2 px-2 py-3 sm:px-4">
              <span style={{ color: BRAND_GOLD }}>{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-wide text-zinc-800 whitespace-nowrap hidden sm:block">{item.label}</span>
              <span className="text-[9px] font-black uppercase tracking-wide text-zinc-800 whitespace-nowrap sm:hidden">{item.label}</span>
            </div>
          ))}
        </div>

        {/* ── Description / Reviews tabs ── */}
        <div className="mt-16 border-t border-neutral-100">
          <TabbedSections productId={product._id} detailHtml={product.detail} productName={product.name} />
        </div>

        <RelatedProductsSection title="You may also like" products={relatedProducts} />
        <RecentlyViewedSection entries={recent} />
      </div>

      {/* ── Mobile sticky CTA ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 px-4 py-3 backdrop-blur-sm lg:hidden">
        <div className="flex gap-3">
          <button
            type="button"
            disabled={oos}
            onClick={onAddToCart}
            className="flex h-12 flex-1 items-center justify-center rounded-full text-xs font-black uppercase tracking-widest text-zinc-950 disabled:opacity-40"
            style={{ background: oos ? "#e5e7eb" : BRAND_GRADIENT }}
          >
            {oos ? "Sold Out" : "Add to Cart"}
          </button>
          <button
            type="button"
            disabled={oos}
            onClick={onBuyNow}
            className="flex h-12 flex-1 items-center justify-center rounded-full bg-zinc-950 text-xs font-black uppercase tracking-widest text-white disabled:bg-neutral-300"
          >
            {oos ? "Sold Out" : "Buy Now"}
          </button>
        </div>
      </div>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          {/* Prev */}
          {thumbs.length > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setMainImg((c) => { const i = thumbs.indexOf(c); return thumbs[i <= 0 ? thumbs.length - 1 : i - 1] || c; }); }} className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors" aria-label="Previous">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={mainImg} alt={product.name} className="max-h-[88vh] max-w-[88vw] object-contain" onClick={(e) => e.stopPropagation()} />
          {/* Next */}
          {thumbs.length > 1 && (
            <button type="button" onClick={(e) => { e.stopPropagation(); setMainImg((c) => { const i = thumbs.indexOf(c); return thumbs[i < 0 || i >= thumbs.length - 1 ? 0 : i + 1] || c; }); }} className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 transition-colors" aria-label="Next">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function TabbedSections({ productId, detailHtml, productName }: { productId: string; detailHtml: string; productName: string }) {
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [count, setCount] = useState<number | null>(null);

  return (
    <div>
      {/* Tab bar */}
      <div className="flex gap-6 border-b border-neutral-100" role="tablist">
        {(["details", "reviews"] as const).map((t) => {
          const active = tab === t;
          const label = t === "details" ? "Description" : "Reviews";
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(t)}
              className={`relative pb-4 pt-6 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
                active ? "text-zinc-950" : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {label}
              {t === "reviews" && count !== null && (
                <span
                  className="inline-flex min-w-[1.25rem] items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black"
                  style={active ? { background: BRAND_GRADIENT, color: "#000" } : { background: "#f4f4f5", color: "#71717a" }}
                >
                  {count}
                </span>
              )}
              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: BRAND_GRADIENT }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="py-10" role="tabpanel">
        {tab === "details" ? (
          detailHtml ? (
            <div
              className="prose prose-neutral max-w-4xl
                prose-headings:font-black prose-headings:tracking-tight prose-headings:text-zinc-950
                prose-p:text-neutral-600 prose-p:leading-relaxed
                prose-li:text-neutral-600
                prose-strong:text-zinc-950 prose-strong:font-bold
                prose-a:text-zinc-950 prose-a:underline
                prose-img:rounded-2xl prose-img:border prose-img:border-neutral-100"
              dangerouslySetInnerHTML={{ __html: detailHtml }}
            />
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
              </div>
              <p className="text-sm font-bold text-neutral-400">No description yet</p>
              <p className="mt-1 text-xs text-neutral-400">Details for {productName} will appear here.</p>
            </div>
          )
        ) : (
          <ProductReviewsPanel productId={productId} onCountChange={setCount} />
        )}
      </div>
    </div>
  );
}
