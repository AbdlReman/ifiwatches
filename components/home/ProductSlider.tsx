"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ProductCard from "@/components/shop/ProductCard";
import type { IProduct } from "@/types/product";

type ProductSliderProps = {
  products: IProduct[];
  priorityCount?: number;
};

export default function ProductSlider({ products, priorityCount = 2 }: ProductSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [products, updateArrows]);

  const scroll = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const step = Math.max(el.clientWidth * 0.85, 300);
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  const arrowClass =
    "absolute top-[38%] z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-900 shadow-md transition hover:border-zinc-400 hover:bg-zinc-50 disabled:pointer-events-none disabled:opacity-0";

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous products"
        className={`${arrowClass} left-0 -translate-x-1/2 sm:left-2 sm:translate-x-0`}
        disabled={!canPrev}
        onClick={() => scroll("prev")}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        ref={trackRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {products.map((product, idx) => (
          <div key={product._id} className="w-[min(85vw,280px)] shrink-0 snap-start sm:w-[300px]">
            <ProductCard product={product} priority={idx < priorityCount} />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Next products"
        className={`${arrowClass} right-0 translate-x-1/2 sm:right-2 sm:translate-x-0`}
        disabled={!canNext}
        onClick={() => scroll("next")}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
