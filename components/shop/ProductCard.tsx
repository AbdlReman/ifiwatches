"use client";

import Image from "next/image";
import Link from "next/link";
import type { IProduct } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";

function cardPrice(product: IProduct) {
  const hasDiscount = Number(product.discount || 0) > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - finalPrice / Math.max(product.price, 1)) * 100)
    : 0;
  return { hasDiscount, finalPrice, discountPercent };
}

function promoLabel(product: IProduct, hasDiscount: boolean, discountPercent: number): string {
  if (hasDiscount) return `Was ${formatPkr(product.price)}`;
  if (product.isBestSeller) return "Best Seller";
  if (product.isFeatured) return "Featured Pick";
  if (product.brand) return product.brand;
  return "";
}

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a",
  white: "#f5f5f5",
  red: "#e4002b",
  blue: "#1d4ed8",
  green: "#16a34a",
  yellow: "#eab308",
  orange: "#ea580c",
  pink: "#ec4899",
  purple: "#9333ea",
  grey: "#6b7280",
  gray: "#6b7280",
  silver: "#c0c0c0",
  gold: "#DAA520",
  brown: "#92400e",
  navy: "#1e3a5f",
  beige: "#d4bfa0",
};

function colorDot(color: string): string {
  const key = color.toLowerCase().trim();
  return COLOR_MAP[key] || (key.startsWith("#") ? key : "#9ca3af");
}

export default function ProductCard({
  product,
  priority,
}: {
  product: IProduct;
  onOpenImage?: (src: string, alt: string) => void;
  priority?: boolean;
}) {
  const activeVariant = product.colorVariants[0];
  const mainImage = activeVariant?.images?.[0] || product.images[0] || "";
  const { hasDiscount, finalPrice, discountPercent } = cardPrice(product);
  const cloudinary = mainImage.startsWith("https://res.cloudinary.com");
  const promo = promoLabel(product, hasDiscount, discountPercent);

  const colorList = product.colorVariants.length > 0
    ? product.colorVariants.map((v) => v.color)
    : product.colors;
  const visibleColors = colorList.slice(0, 4);
  const extraColors = colorList.length > 4 ? colorList.length - 4 : 0;

  return (
    <Link href={`/shop/${product.slug}`} className="group flex h-full flex-col">
      <article className="flex flex-col bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">

        {/* Image area */}
        <div className="relative bg-zinc-50 aspect-square overflow-hidden">
          {/* Promo label */}
          {promo && (
            <span
              className="absolute left-3 top-3 z-10 text-[10px] font-black uppercase tracking-widest"
              style={{ color: "rgb(218,170,88)" }}
            >
              {promo}
            </span>
          )}

          {mainImage ? (
            cloudinary ? (
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
                priority={priority}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-contain p-3 transition-transform duration-500 group-hover:scale-105"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-widest text-neutral-300">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col px-3 pt-3 pb-4 gap-2">

          {/* Name + discount */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[13px] font-black leading-snug text-zinc-900 line-clamp-2 flex-1">
              {product.name}
            </h3>
            {hasDiscount && (
              <span className="shrink-0 text-[11px] font-black text-red-500 whitespace-nowrap">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Short description */}
          {product.description && (
            <p className="text-[11px] text-zinc-500 leading-snug line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Colors + rating */}
          <div className="flex items-center justify-between gap-2">
            {/* Color dots */}
            {colorList.length > 0 ? (
              <div className="flex items-center gap-1">
                {visibleColors.map((c) => (
                  <span
                    key={c}
                    title={c}
                    className="h-3.5 w-3.5 rounded-full border border-white shadow-sm ring-1 ring-zinc-200"
                    style={{ backgroundColor: colorDot(c) }}
                  />
                ))}
                {extraColors > 0 && (
                  <span className="text-[10px] font-bold text-zinc-400">+{extraColors}</span>
                )}
              </div>
            ) : <span />}

            {/* Rating placeholder — real rating via ProductRatingSummary is server-only, so show stars count if soldCount exists */}
            {product.soldCount > 0 && (
              <div className="flex items-center gap-0.5">
                <svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
                </svg>
                <span className="text-[10px] font-bold text-zinc-600">{product.soldCount > 100 ? "4.8+" : "4.5+"}</span>
              </div>
            )}
          </div>

          {/* Price row */}
          <div className="flex items-end justify-between gap-2 mt-auto pt-1">
            <div className="flex flex-col gap-0.5">
              {hasDiscount && (
                <span className="text-[11px] text-zinc-400 line-through tabular-nums">
                  {formatPkr(product.price)}
                </span>
              )}
              <span className="text-[15px] font-black tabular-nums text-zinc-950">
                {formatPkr(finalPrice)}
              </span>
            </div>

            {/* Buy Now pill */}
            <span className="shrink-0 rounded-full bg-zinc-950 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors group-hover:bg-zinc-700">
              Buy Now
            </span>
          </div>

        </div>
      </article>
    </Link>
  );
}
