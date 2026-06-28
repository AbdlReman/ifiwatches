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

const BRAND_GOLD = "rgb(218, 170, 88)";
const BRAND_GRADIENT = "linear-gradient(135deg, rgb(218,170,88) 0%, rgb(244,202,104) 100%)";
const SALE_RED = "#e4002b";

function addToCart(
  product: IProduct,
  selectedColor: string,
  selectedImage: string,
  selectedSize: string,
  quantity: number
) {
  const qty = Math.max(1, Math.floor(quantity || 1));
  const existing = JSON.parse(localStorage.getItem("cart_items") || "[]");
  const sizeKey = selectedSize || "";
  const index = existing.findIndex(
    (i: { productId: string; color?: string; size?: string }) =>
      i.productId === product._id &&
      (i.color || "") === (selectedColor || "") &&
      (i.size || "") === sizeKey
  );
  if (index >= 0) existing[index].quantity += qty;
  else {
    existing.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: selectedImage,
      quantity: qty,
      color: selectedColor,
      size: sizeKey,
    });
  }
  localStorage.setItem("cart_items", JSON.stringify(existing));
  window.dispatchEvent(new Event("cart_updated"));
}

function setCartToSingleItem(item: CartItem) {
  localStorage.setItem("cart_items", JSON.stringify([item]));
  window.dispatchEvent(new Event("cart_updated"));
}

function isCloudinary(url: string) {
  return url.startsWith("https://res.cloudinary.com/");
}

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
  const availableStock = Math.max(0, Number(product.stockQuantity || 0));
  const isOutOfStock = availableStock <= 0;
  const isLowStock = !isOutOfStock && availableStock <= 5;

  const variants = useMemo(() => {
    if (product.colorVariants.length > 0) return product.colorVariants;
    if (product.colors.length > 0) {
      return product.colors.map((color) => ({ color, images: product.images }));
    }
    return [{ color: "Default", images: product.images }];
  }, [product.colorVariants, product.colors, product.images]);

  const [selectedColor, setSelectedColor] = useState(variants[0]?.color || "Default");
  const sizes = useMemo(
    () => (Array.isArray(product.sizes) ? product.sizes.map((s) => String(s).trim()).filter(Boolean) : []),
    [product.sizes]
  );
  const [selectedSize, setSelectedSize] = useState(() => sizes[0] || "");
  const maxSelectableQty = useMemo(() => {
    if (availableStock > 0) return Math.min(99, availableStock);
    return 1;
  }, [availableStock]);
  const [quantity, setQuantity] = useState(1);
  const hasDiscount = Number(product.discount || 0) > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const discountPercent = hasDiscount ? Math.round(product.discount) : 0;

  const bumpQty = (delta: number) => {
    setQuantity((q) => Math.min(maxSelectableQty, Math.max(1, q + delta)));
  };
  const lineQty = isOutOfStock ? 1 : Math.min(Math.max(1, quantity), maxSelectableQty);

  const allImages = useMemo(() => {
    const fromVariants = variants.flatMap((v) => v.images || []);
    return Array.from(new Set([...fromVariants, ...product.images].filter(Boolean)));
  }, [variants, product.images]);

  const activeVariant = useMemo(
    () => variants.find((v) => v.color === selectedColor) || variants[0],
    [variants, selectedColor]
  );
  const colorImages = activeVariant?.images?.length ? activeVariant.images : product.images;
  const thumbImages = useMemo(() => {
    const primary = (colorImages.length ? colorImages : product.images).filter(Boolean);
    const rest = allImages.filter((u) => !primary.includes(u));
    return [...primary, ...rest];
  }, [colorImages, product.images, allImages]);

  const [selectedImage, setSelectedImage] = useState(colorImages[0] || allImages[0] || "");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [recentEntries, setRecentEntries] = useState<
    { slug: string; name: string; image: string; brand: string; price: number; discount: number }[]
  >([]);

  const mainImage = selectedImage || colorImages[0] || allImages[0] || "";
  const imageIndex = Math.max(0, thumbImages.indexOf(mainImage));

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const nextVariant = variants.find((v) => v.color === color) || variants[0];
    const nextImages = nextVariant?.images?.length ? nextVariant.images : product.images;
    setSelectedImage(nextImages[0] || allImages[0] || "");
  };

  useEffect(() => {
    const previewImg = variants[0]?.images?.[0] || product.images[0] || "";
    pushRecentlyViewed(
      { slug: product.slug, name: product.name, image: previewImg, brand: product.brand ?? "", price: product.price, discount: product.discount },
      product.slug
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentEntries(readRecentlyViewed().filter((e) => e.slug !== product.slug));
  }, [product._id, product.slug, product.name, product.brand, product.price, product.discount, product.images, variants]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (showImagePreview) return;
      if (e.key === "ArrowLeft") {
        setSelectedImage((cur) => {
          const i = thumbImages.indexOf(cur);
          return thumbImages[i <= 0 ? thumbImages.length - 1 : i - 1] || cur;
        });
      }
      if (e.key === "ArrowRight") {
        setSelectedImage((cur) => {
          const i = thumbImages.indexOf(cur);
          return thumbImages[i < 0 || i >= thumbImages.length - 1 ? 0 : i + 1] || cur;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [thumbImages, showImagePreview]);

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || product.metaDescription,
    image: thumbImages.filter(Boolean).slice(0, 8),
    sku: product._id,
    brand: { "@type": "Brand", name: product.brand || "Store" },
    offers: {
      "@type": "Offer",
      url: siteUrl ? `${siteUrl}/shop/${product.slug}` : `/shop/${product.slug}`,
      priceCurrency: "PKR",
      price: Number(finalPrice.toFixed(2)),
      availability: `https://schema.org/${isOutOfStock ? "OutOfStock" : "InStock"}`,
    },
  }), [product, thumbImages, siteUrl, finalPrice, isOutOfStock]);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(product.category ? [{ label: product.category, href: `/shop?category=${encodeURIComponent(product.category)}` }] : []),
    { label: product.name },
  ];

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const qty = Math.max(1, Math.floor(lineQty || 1));
    addToCart(product, selectedColor || "Default", mainImage, selectedSize, qty);
    setQuantity(1);
    toast.success("Added to cart", {
      description: `${product.name} · Qty ${qty}${selectedSize ? ` · Size ${selectedSize}` : ""}`,
    });
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    const qty = Math.max(1, Math.floor(lineQty || 1));
    setCartToSingleItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: qty,
      color: selectedColor || "Default",
      size: selectedSize || "",
    });
    toast.success("Going to checkout…", { description: `${product.name} × ${qty}` });
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb bar */}
      <div className="border-b border-neutral-100 bg-white">
        <div className="mx-auto max-w-[90rem] px-4 py-3 sm:px-6 lg:px-8">
          <Breadcrumbs items={breadcrumbItems} className="text-neutral-500 [&_a]:text-neutral-700 [&_a:hover]:text-black" />
        </div>
      </div>

      {/* Main two-column */}
      <div className="mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[58%_42%] lg:gap-0">

          {/* ── Left: Gallery ── */}
          <div className="lg:sticky lg:top-0 lg:h-screen lg:overflow-y-auto lg:pr-8 lg:py-10">
            <div className="flex flex-col gap-3 xl:flex-row xl:gap-4">

              {/* Thumbnails strip — bottom on mobile, left column on xl */}
              <div className="order-2 xl:order-1 xl:w-[72px] xl:flex-shrink-0">
                <div className="flex gap-2 overflow-x-auto pb-1 xl:flex-col xl:overflow-y-auto xl:pb-0 xl:gap-2.5 xl:max-h-[calc(100vh-5rem)]">
                  {thumbImages.map((img, idx) => {
                    const active = mainImage === img;
                    return (
                      <button
                        key={`${img}-${idx}`}
                        type="button"
                        onClick={() => setSelectedImage(img)}
                        className={`relative h-16 w-16 xl:w-full xl:aspect-square shrink-0 overflow-hidden transition-all duration-150 ${
                          active
                            ? "ring-2 ring-offset-1 opacity-100"
                            : "opacity-60 hover:opacity-90 ring-1 ring-neutral-200"
                        }`}
                        style={active ? { ringColor: BRAND_GOLD } as React.CSSProperties : undefined}
                        aria-label={`View image ${idx + 1}`}
                        aria-current={active ? "true" : undefined}
                      >
                        {isCloudinary(img) ? (
                          <Image src={img} alt="" fill className="object-cover" sizes="80px" />
                        ) : (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        )}
                        {active && (
                          <span
                            className="absolute inset-0 border-2"
                            style={{ borderColor: BRAND_GOLD }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Main image */}
              <div className="order-1 xl:order-2 flex-1 min-w-0">
                <div className="relative overflow-hidden bg-neutral-50 aspect-[4/5]">
                  {/* Badges */}
                  <div className="absolute left-0 top-4 z-10 flex flex-col gap-1.5">
                    {hasDiscount && (
                      <span
                        className="px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white"
                        style={{ backgroundColor: SALE_RED }}
                      >
                        −{discountPercent}%
                      </span>
                    )}
                    {product.isFeatured && !hasDiscount && (
                      <span className="bg-black px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Stock status top-right */}
                  <div className="absolute right-3 top-3 z-10">
                    {isOutOfStock ? (
                      <span className="bg-neutral-800/80 backdrop-blur-sm px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                        Sold Out
                      </span>
                    ) : isLowStock ? (
                      <span
                        className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-black"
                        style={{ background: BRAND_GOLD }}
                      >
                        Low Stock
                      </span>
                    ) : null}
                  </div>

                  {/* Image */}
                  <button
                    type="button"
                    onClick={() => setShowImagePreview(true)}
                    className="relative block h-full w-full cursor-zoom-in outline-none"
                    aria-label={`Enlarge ${product.name}`}
                  >
                    {mainImage && isCloudinary(mainImage) ? (
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 100vw, 58vw"
                      />
                    ) : mainImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-neutral-400">
                        No image
                      </div>
                    )}
                  </button>

                  {/* Counter */}
                  {thumbImages.length > 1 && (
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-0.5 text-[10px] font-bold text-white tabular-nums">
                      {imageIndex + 1} / {thumbImages.length}
                    </div>
                  )}

                  {/* Zoom hint */}
                  <div className="absolute bottom-3 left-3 opacity-0 hover:opacity-100 transition-opacity">
                    <span className="bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[9px] uppercase tracking-widest text-white">
                      Click to zoom
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Product Info ── */}
          <div className="py-8 lg:py-10 lg:pl-10 lg:border-l border-neutral-100">

            {/* Brand + badges */}
            <div className="flex items-center gap-3 mb-3">
              {product.brand && (
                <span
                  className="text-[11px] font-black uppercase tracking-[0.2em]"
                  style={{ color: BRAND_GOLD }}
                >
                  {product.brand}
                </span>
              )}
              {product.isBestSeller && (
                <span
                  className="px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-black"
                  style={{ background: BRAND_GRADIENT }}
                >
                  Best Seller
                </span>
              )}
            </div>

            <h1 className="text-2xl font-black uppercase leading-tight tracking-tight text-black sm:text-3xl">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="mt-3">
              <ProductRatingSummary productId={product._id} />
            </div>

            {/* Divider */}
            <div className="mt-5 mb-5 h-px w-full" style={{ background: `linear-gradient(to right, ${BRAND_GOLD}, transparent)` }} />

            {/* Price block */}
            <div className="flex flex-wrap items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-black tabular-nums sm:text-4xl" style={{ color: SALE_RED }}>
                    {formatPkr(finalPrice)}
                  </span>
                  <span className="text-lg text-neutral-400 line-through tabular-nums">
                    {formatPkr(product.price)}
                  </span>
                  <span
                    className="inline-flex items-center px-2 py-0.5 text-[11px] font-black uppercase tracking-wider text-white"
                    style={{ backgroundColor: SALE_RED }}
                  >
                    Save {discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-black tabular-nums text-black sm:text-4xl">
                  {formatPkr(product.price)}
                </span>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-4">
              {isOutOfStock ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Out of Stock</span>
                </div>
              ) : isLowStock ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full animate-pulse" style={{ backgroundColor: BRAND_GOLD }} />
                  <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: BRAND_GOLD }}>
                    Only {availableStock} left
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                    In Stock · {availableStock} available
                  </span>
                </div>
              )}
            </div>

            {/* Short description */}
            {product.description && (
              <p className="mt-5 text-sm leading-relaxed text-neutral-600 border-l-2 pl-4" style={{ borderColor: BRAND_GOLD }}>
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className="mt-6 mb-6 h-px bg-neutral-100" />

            {/* Color selector */}
            {variants.some((v) => v.color !== "Default") && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-neutral-500">Color</p>
                  <span className="text-[11px] font-semibold text-black">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant) => {
                    const active = selectedColor === variant.color;
                    return (
                      <button
                        key={`${product._id}-${variant.color}`}
                        type="button"
                        onClick={() => handleColorChange(variant.color)}
                        className={`min-h-10 border-2 px-4 py-2 text-xs font-bold uppercase tracking-wide transition-all duration-150 ${
                          active ? "text-black" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                        }`}
                        style={active ? { borderColor: BRAND_GOLD, backgroundColor: `${BRAND_GOLD}15` } : undefined}
                      >
                        {variant.color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size selector */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-black uppercase tracking-widest text-neutral-500">Size</p>
                  {selectedSize && (
                    <span className="text-[11px] font-semibold text-black">Selected: {selectedSize}</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={`${product._id}-size-${size}`}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`flex min-h-10 min-w-[3rem] items-center justify-center border-2 px-3 text-xs font-bold uppercase tracking-wide transition-all duration-150 ${
                          active ? "text-black" : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-400"
                        }`}
                        style={active ? { borderColor: BRAND_GOLD, backgroundColor: `${BRAND_GOLD}15` } : undefined}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-[11px] font-black uppercase tracking-widest text-neutral-500 mb-3">Quantity</p>
              <div className="inline-flex items-center border border-neutral-200">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => bumpQty(-1)}
                  disabled={quantity <= 1}
                  className="flex h-11 w-11 items-center justify-center text-xl font-bold text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>
                <span className="min-w-[3rem] text-center text-sm font-black tabular-nums">{lineQty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => bumpQty(1)}
                  disabled={isOutOfStock || quantity >= maxSelectableQty}
                  className="flex h-11 w-11 items-center justify-center text-xl font-bold text-black transition-colors hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA buttons — desktop */}
            <div className="hidden flex-col gap-3 lg:flex">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className="flex h-14 w-full items-center justify-center text-sm font-black uppercase tracking-widest text-black transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: isOutOfStock ? undefined : BRAND_GRADIENT }}
              >
                {isOutOfStock ? "Sold Out" : "Add to Cart"}
              </button>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleBuyNow}
                className="flex h-14 w-full items-center justify-center border-2 border-black bg-black text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:bg-neutral-300"
              >
                {isOutOfStock ? "Sold Out" : "Buy Now"}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-8 mb-6 h-px bg-neutral-100" />

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  ),
                  label: "Fast Shipping",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                  ),
                  label: "Easy Returns",
                },
                {
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                    </svg>
                  ),
                  label: "Authentic",
                },
              ].map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-2 text-center">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full"
                    style={{ background: BRAND_GRADIENT }}
                  >
                    {item.icon}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Product meta */}
            {(product.category || product.brand) && (
              <div className="mt-8 space-y-2 rounded-none border border-neutral-100 p-4">
                {product.brand && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 uppercase tracking-widest font-semibold">Brand</span>
                    <span className="font-black text-black">{product.brand}</span>
                  </div>
                )}
                {product.category && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 uppercase tracking-widest font-semibold">Category</span>
                    <span className="font-black text-black">{product.category}</span>
                  </div>
                )}
                {product.soldCount > 0 && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-neutral-500 uppercase tracking-widest font-semibold">Sold</span>
                    <span className="font-black text-black">{product.soldCount.toLocaleString()} units</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Full-width tabs section */}
        <div className="mt-0 border-t border-neutral-100">
          <TabbedProductSections productId={product._id} detailHtml={product.detail} productName={product.name} />
        </div>

        <RelatedProductsSection title="You may also like" products={relatedProducts} />
        <RecentlyViewedSection entries={recentEntries} />
      </div>

      {/* Mobile sticky purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/95 backdrop-blur-sm p-3 lg:hidden">
        <div className="mx-auto flex max-w-[90rem] gap-2">
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="flex min-h-12 flex-1 items-center justify-center text-xs font-black uppercase tracking-widest text-black disabled:opacity-40"
            style={{ background: isOutOfStock ? "#d1d5db" : BRAND_GRADIENT }}
          >
            {isOutOfStock ? "Sold Out" : "Add to Cart"}
          </button>
          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="flex min-h-12 flex-1 items-center justify-center bg-black text-xs font-black uppercase tracking-widest text-white disabled:bg-neutral-300"
          >
            {isOutOfStock ? "Sold Out" : "Buy Now"}
          </button>
        </div>
      </div>

      {/* Fullscreen image lightbox */}
      {showImagePreview && (
        <button
          type="button"
          className="fixed inset-0 z-[90] flex cursor-zoom-out items-center justify-center bg-black/95 p-4"
          onClick={() => setShowImagePreview(false)}
          aria-label="Close fullscreen image"
        >
          <button
            type="button"
            onClick={() => setShowImagePreview(false)}
            className="absolute right-4 top-4 flex items-center gap-1.5 border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            Close
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mainImage}
            alt={product.name}
            className="max-h-[90vh] max-w-[92vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}
    </div>
  );
}

function TabbedProductSections({
  productId,
  detailHtml,
  productName,
}: {
  productId: string;
  detailHtml: string;
  productName: string;
}) {
  const [tab, setTab] = useState<"details" | "reviews">("details");
  const [reviewCount, setReviewCount] = useState<number | null>(null);

  return (
    <div className="bg-white">
      {/* Tab bar */}
      <div className="flex border-b border-neutral-200 sticky top-0 bg-white z-20" role="tablist">
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
              className={`relative px-6 py-4 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 ${
                active ? "text-black" : "text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {label}
              {t === "reviews" && reviewCount !== null && (
                <span
                  className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-black min-w-[1.2rem] ${
                    active ? "text-black" : "bg-neutral-200 text-neutral-600"
                  }`}
                  style={active ? { background: BRAND_GRADIENT } : undefined}
                >
                  {reviewCount}
                </span>
              )}
              {active && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: BRAND_GRADIENT }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Panel */}
      <div className="mx-auto max-w-[90rem] px-4 py-10 sm:px-6 lg:px-8" role="tabpanel">
        {tab === "details" ? (
          detailHtml ? (
            <div
              className="prose prose-neutral max-w-4xl
                prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-black
                prose-p:text-neutral-600 prose-p:leading-relaxed
                prose-li:text-neutral-600 prose-li:leading-relaxed
                prose-strong:text-black prose-strong:font-bold
                prose-a:text-black prose-a:underline
                prose-img:rounded-none prose-img:border prose-img:border-neutral-200"
              dangerouslySetInnerHTML={{ __html: detailHtml }}
            />
          ) : (
            <div className="flex flex-col items-center py-16 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-neutral-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
              <p className="text-sm font-semibold text-neutral-400">No description yet</p>
              <p className="mt-1 text-xs text-neutral-400">
                Detailed specifications for {productName} will appear here when provided.
              </p>
            </div>
          )
        ) : (
          <ProductReviewsPanel productId={productId} onCountChange={setReviewCount} />
        )}
      </div>
    </div>
  );
}
