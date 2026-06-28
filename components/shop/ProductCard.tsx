"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { IProduct } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";

const SALE_RED = "#e4002b";

function cardPrice(product: IProduct) {
  const hasDiscount = Number(product.discount || 0) > 0;
  const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
  const discountPercent = hasDiscount
    ? Math.round((1 - finalPrice / Math.max(product.price, 1)) * 100)
    : 0;
  return { hasDiscount, finalPrice, discountPercent };
}

export default function ProductCard({
  product,
  priority,
}: {
  product: IProduct;
  onOpenImage?: (src: string, alt: string) => void;
  priority?: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  const activeVariant = product.colorVariants[0];
  const mainImage = activeVariant?.images?.[0] || product.images[0] || "";
  const hoverImage = activeVariant?.images?.[1] || product.images[1] || "";
  const { hasDiscount, finalPrice, discountPercent } = cardPrice(product);
  const cloudinary = mainImage.startsWith("https://res.cloudinary.com");

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-neutral-100 aspect-[3/4]">
        {/* Discount badge */}
        {hasDiscount && (
          <span
            className="absolute left-0 top-3 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white"
            style={{ backgroundColor: SALE_RED }}
          >
            −{discountPercent}%
          </span>
        )}

        {/* New badge */}
        {!hasDiscount && product.isFeatured && (
          <span className="absolute left-0 top-3 z-10 bg-black px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white">
            New
          </span>
        )}

        {/* Main image */}
        {mainImage ? (
          cloudinary ? (
            <Image
              src={hovered && hoverImage ? hoverImage : mainImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-all duration-500 group-hover:scale-[1.03]"
              priority={priority}
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hovered && hoverImage ? hoverImage : mainImage}
              alt={product.name}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-[1.03]"
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] uppercase tracking-widest text-neutral-400">
            No image
          </div>
        )}

        {/* Hover overlay — "Quick View" bar */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-black/90 py-3 text-center text-[10px] font-black uppercase tracking-[0.18em] text-white transition-transform duration-300 group-hover:translate-y-0">
          View Product
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 space-y-0.5 px-0.5">
        {product.brand && (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-neutral-400">
            {product.brand}
          </p>
        )}
        <h3 className="text-[13px] font-semibold leading-snug text-neutral-900 line-clamp-1 group-hover:text-black">
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 pt-0.5">
          <span
            className="text-[13px] font-black tabular-nums"
            style={hasDiscount ? { color: SALE_RED } : { color: "#000" }}
          >
            {formatPkr(finalPrice)}
          </span>
          {hasDiscount && (
            <span className="text-[11px] tabular-nums text-neutral-400 line-through">
              {formatPkr(product.price)}
            </span>
          )}
        </div>

        {/* Color dots */}
        {product.colorVariants.length > 1 && (
          <div className="flex items-center gap-1 pt-1">
            {product.colorVariants.slice(0, 5).map((v) => (
              <span
                key={v.color}
                title={v.color}
                className="h-2.5 w-2.5 rounded-full border border-neutral-200"
                style={{ backgroundColor: v.color.toLowerCase() }}
              />
            ))}
            {product.colorVariants.length > 5 && (
              <span className="text-[10px] text-neutral-400">+{product.colorVariants.length - 5}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
