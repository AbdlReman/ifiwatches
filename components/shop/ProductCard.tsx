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
  const visibleColors = colorList.slice(0, 3);
  const extraColors = colorList.length > 3 ? colorList.length - 3 : 0;

  return (
    <Link href={`/shop/${product.slug}`} className="group flex h-full flex-col">
      <article className="flex flex-col bg-white rounded-xl sm:rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">

        {/* Image area */}
        <div className="relative bg-zinc-50 aspect-square overflow-hidden">
          {/* Promo label */}
          {promo && (
            <span
              className="absolute left-2 top-2 z-10 text-[9px] sm:text-[10px] font-black uppercase tracking-wider leading-tight max-w-[80%] line-clamp-1"
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
                className="object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
                priority={priority}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-contain p-2 sm:p-3 transition-transform duration-500 group-hover:scale-105"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-300">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col px-2 pt-2 pb-3 sm:px-3 sm:pt-3 sm:pb-4 gap-1.5 sm:gap-2">

          {/* Name + discount */}
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-[10px] sm:text-[13px] font-black leading-snug text-zinc-900 line-clamp-2 flex-1 min-w-0">
              {product.name}
            </h3>
            {hasDiscount && (
              <span className="shrink-0 text-[8px] sm:text-[11px] font-black text-red-500 whitespace-nowrap ml-1">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Short description — hidden on very small, show from sm */}
          {product.description && (
            <p className="hidden sm:block text-[11px] text-zinc-500 leading-snug line-clamp-1">
              {product.description}
            </p>
          )}

          {/* Colors */}
          {colorList.length > 0 && (
            <div className="flex items-center gap-1">
              {visibleColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border border-white shadow-sm ring-1 ring-zinc-200"
                  style={{ backgroundColor: colorDot(c) }}
                />
              ))}
              {extraColors > 0 && (
                <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400">+{extraColors}</span>
              )}
            </div>
          )}

          {/* Price row */}
          <div className="flex items-end justify-between gap-1 mt-auto pt-1">
            <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
              {hasDiscount && (
                <span className="text-[8px] sm:text-[11px] text-zinc-400 line-through tabular-nums truncate">
                  {formatPkr(product.price)}
                </span>
              )}
              <span className="text-[10px] sm:text-[15px] font-black tabular-nums text-zinc-950 truncate">
                {formatPkr(finalPrice)}
              </span>
            </div>

            {/* Buy Now pill */}
            <span className="shrink-0 rounded-full bg-zinc-950 px-1.5 py-0.5 sm:px-3 sm:py-1.5 text-[7px] sm:text-[10px] font-black uppercase tracking-wider text-white transition-colors group-hover:bg-zinc-700 whitespace-nowrap">
              Buy Now
            </span>
          </div>

        </div>
      </article>
    </Link>
  );
}
