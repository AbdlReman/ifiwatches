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

function promoLabel(product: IProduct, _hasDiscount: boolean, _discountPercent: number): string {
  // if (hasDiscount) return `Was ${formatPkr(product.price)}`;
  if (product.isBestSeller) return "Best Seller";
  if (product.isFeatured) return "Featured Pick";
  if (product.brand) return product.brand;
  return "";
}

const COLOR_MAP: Record<string, string> = {
  black: "#1a1a1a", white: "#f5f5f5", red: "#e4002b", blue: "#1d4ed8",
  green: "#16a34a", yellow: "#eab308", orange: "#ea580c", pink: "#ec4899",
  purple: "#9333ea", grey: "#6b7280", gray: "#6b7280", silver: "#c0c0c0",
  gold: "#DAA520", brown: "#92400e", navy: "#1e3a5f", beige: "#d4bfa0",
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
      <article className="flex flex-col bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden h-full">

        {/* Image */}
        <div className="relative bg-zinc-50 overflow-hidden w-full h-[226px] sm:h-[316px]">
          {promo && (
            <span
              className="absolute left-2 top-2 z-10 font-black uppercase tracking-wider leading-tight max-w-[80%] line-clamp-1
                         text-[10px] max-[400px]:text-[8px]"
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
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                priority={priority}
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={mainImage}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-[11px] uppercase tracking-widest text-neutral-300">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1.5 sm:gap-2
                        px-3 pt-3 pb-4
                        max-[400px]:px-2 max-[400px]:pt-2 max-[400px]:pb-3">

          {/* Name + discount badge */}
          <div className="flex items-start justify-between gap-1">
            <h3 className="flex-1 min-w-0 font-black leading-snug text-zinc-900 line-clamp-2
                           text-[13px] max-[400px]:text-[10px]">
              {product.name}
            </h3>
            {hasDiscount && (
              <span className="shrink-0 font-black text-red-500 whitespace-nowrap ml-1
                               text-[11px] max-[400px]:text-[8px]">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Color dots */}
          {colorList.length > 0 && (
            <div className="flex items-center gap-1">
              {visibleColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="rounded-full border border-white shadow-sm ring-1 ring-zinc-200
                             h-3.5 w-3.5 max-[400px]:h-2.5 max-[400px]:w-2.5"
                  style={{ backgroundColor: colorDot(c) }}
                />
              ))}
              {extraColors > 0 && (
                <span className="font-bold text-zinc-400 text-[10px] max-[400px]:text-[8px]">
                  +{extraColors}
                </span>
              )}
            </div>
          )}

          {/* Price row */}
          <div className="flex items-end justify-between gap-1 mt-auto pt-1">
            <div className="flex flex-col gap-0.5 min-w-0 overflow-hidden">
              {hasDiscount && (
                <span className="text-zinc-400 line-through tabular-nums truncate
                                 text-[11px] max-[400px]:text-[8px]">
                  {formatPkr(product.price)}
                </span>
              )}
              <span className="font-black tabular-nums text-zinc-950 truncate
                               text-[15px] max-[400px]:text-[11px]">
                {formatPkr(finalPrice)}
              </span>
            </div>

            {/* Buy Now */}
            <span className="shrink-0 rounded-full bg-zinc-950 font-black uppercase text-white transition-colors group-hover:bg-zinc-700 whitespace-nowrap
                             px-3 py-1.5 tracking-widest text-[10px]
                             max-[400px]:px-2 max-[400px]:py-1 max-[400px]:text-[8px] max-[400px]:tracking-wide">
              Buy Now
            </span>
          </div>

        </div>
      </article>
    </Link>
  );
}
