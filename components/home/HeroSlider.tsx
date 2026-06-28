"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

const INTERVAL = 5000;

export default function HeroSlider({ images, fallback }: { images: string[]; fallback: string }) {
  const slides = images.length > 0 ? images : [fallback];
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 700);
    },
    [animating, current]
  );

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, slides.length, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, slides.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setTimeout(next, INTERVAL);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current, slides.length, next]);

  return (
    <section className="relative w-full overflow-hidden" style={{ height: "min(92vh, 780px)" }}>
      {/* Slides */}
      {slides.map((src, idx) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-700"
          style={{ opacity: idx === current ? 1 : 0, zIndex: idx === current ? 1 : 0 }}
          aria-hidden={idx !== current}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`Hero slide ${idx + 1}`}
            className="h-full w-full object-cover"
            loading={idx === 0 ? "eager" : "lazy"}
          />
          {/* Very subtle dark vignette bottom-only */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
      ))}

      {/* Arrows — only when more than 1 slide */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:left-6 sm:h-12 sm:w-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/30 text-white backdrop-blur-sm transition hover:bg-black/50 sm:right-6 sm:h-12 sm:w-12"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 flex items-center gap-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{
                width: idx === current ? "2rem" : "0.375rem",
                backgroundColor: idx === current ? siteConfig.brandColor : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
}
