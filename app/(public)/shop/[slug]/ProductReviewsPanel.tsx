"use client";

import { useCallback, useEffect, useState } from "react";
import type { IReview } from "@/types/review";
import { REVIEW_ACCESS_STORAGE_KEY } from "@/types/review";

function readTokens(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(REVIEW_ACCESS_STORAGE_KEY) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function saveToken(reviewId: string, token: string) {
  const map = { ...readTokens(), [reviewId]: token };
  localStorage.setItem(REVIEW_ACCESS_STORAGE_KEY, JSON.stringify(map));
}

function removeToken(reviewId: string) {
  const map = { ...readTokens() };
  delete map[reviewId];
  localStorage.setItem(REVIEW_ACCESS_STORAGE_KEY, JSON.stringify(map));
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const AVATAR_COLORS = [
  "bg-rose-100 text-rose-700",
  "bg-sky-100 text-sky-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-violet-100 text-violet-700",
  "bg-orange-100 text-orange-700",
];

function avatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function FilledStar({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className ?? "h-4 w-4"}>
      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
    </svg>
  );
}

function StarDisplay({ value, max = 5 }: { value: number; max?: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`${value} out of ${max} stars`}>
      {Array.from({ length: max }).map((_, i) => (
        <FilledStar key={i} className={`h-3.5 w-3.5 ${i < value ? "text-amber-400" : "text-neutral-200"}`} />
      ))}
    </span>
  );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const display = hovered || value;
  const labels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange(n)}
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            className="transition-transform hover:scale-110 focus:outline-none"
          >
            <FilledStar className={`h-7 w-7 transition-colors ${n <= display ? "text-amber-400" : "text-neutral-200"}`} />
          </button>
        ))}
      </div>
      <span className="text-sm font-semibold text-neutral-500">{labels[display]}</span>
    </div>
  );
}

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3 text-xs">
      <span className="w-4 text-right font-bold text-neutral-700 tabular-nums">{stars}</span>
      <FilledStar className="h-3 w-3 text-amber-400 shrink-0" />
      <div className="flex-1 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="w-4 text-neutral-400 tabular-nums">{count}</span>
    </div>
  );
}

export default function ProductReviewsPanel({
  productId,
  onCountChange,
}: {
  productId: string;
  onCountChange?: (count: number) => void;
}) {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokens, setTokens] = useState<Record<string, string>>({});

  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/reviews?productId=${encodeURIComponent(productId)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load reviews");
      const loaded: IReview[] = data.reviews || [];
      setReviews(loaded);
      setTokens(readTokens());
      onCountChange?.(loaded.length);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }, [productId, onCountChange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const submitNew = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, authorName, rating, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not submit review");
      if (data.editToken && data.review?._id) saveToken(data.review._id, data.editToken);
      setAuthorName("");
      setRating(5);
      setBody("");
      setShowAddForm(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteReview = async (id: string) => {
    const token = tokens[id];
    if (!token || !window.confirm("Delete this review permanently?")) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch(`/api/reviews/${id}?editToken=${encodeURIComponent(token)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not delete");
      removeToken(id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setSubmitting(false);
    }
  };

  // Computed stats
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / totalReviews : 0;
  const dist = [5, 4, 3, 2, 1].map((s) => ({ stars: s, count: reviews.filter((r) => r.rating === s).length }));

  if (loading) {
    return (
      <div className="space-y-6 py-4" aria-busy="true" aria-label="Loading reviews">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse border-b border-neutral-100 pb-6 last:border-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-neutral-200" />
              <div className="space-y-1.5">
                <div className="h-3 w-24 rounded bg-neutral-200" />
                <div className="h-2.5 w-16 rounded bg-neutral-100" />
              </div>
            </div>
            <div className="h-2.5 w-20 rounded bg-neutral-100 mb-3" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded bg-neutral-100" />
              <div className="h-3 w-4/5 rounded bg-neutral-50" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-black">
          Customer Reviews
        </h3>
        <button
          type="button"
          onClick={() => setShowAddForm((open) => !open)}
          className="inline-flex items-center gap-2 bg-black text-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
        >
          {showAddForm ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Write a Review
            </>
          )}
        </button>
      </div>

      {/* Rating summary — shown when there are reviews */}
      {totalReviews > 0 && (
        <div className="flex flex-col sm:flex-row gap-8 border border-neutral-100 bg-neutral-50 p-6">
          {/* Average score */}
          <div className="flex flex-col items-center justify-center sm:border-r sm:border-neutral-200 sm:pr-8 sm:min-w-[9rem]">
            <span className="text-5xl font-black text-black tabular-nums">{avgRating.toFixed(1)}</span>
            <div className="mt-2 flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <FilledStar key={i} className={`h-4 w-4 ${i < Math.round(avgRating) ? "text-amber-400" : "text-neutral-200"}`} />
              ))}
            </div>
            <p className="mt-1.5 text-xs text-neutral-500">{totalReviews} {totalReviews === 1 ? "review" : "reviews"}</p>
          </div>
          {/* Distribution bars */}
          <div className="flex-1 flex flex-col justify-center gap-2.5">
            {dist.map(({ stars, count }) => (
              <RatingBar key={stars} stars={stars} count={count} total={totalReviews} />
            ))}
          </div>
        </div>
      )}

      {/* Write review form */}
      {showAddForm && (
        <form onSubmit={submitNew} className="border border-neutral-200 bg-neutral-50 p-6 space-y-5">
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-black mb-4">Your Review</h4>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-neutral-500">Rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold uppercase text-neutral-500">Your Name</label>
              <input
                required
                maxLength={80}
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
                placeholder="e.g. Sara Ahmed"
              />
            </div>
            <div className="flex flex-col gap-1 sm:hidden">
              {/* spacer on mobile */}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase text-neutral-500">Review</label>
              <span className="text-[10px] text-neutral-400 tabular-nums">{body.length} / 2000</span>
            </div>
            <textarea
              required
              maxLength={2000}
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="border border-neutral-300 bg-white px-3 py-2.5 text-sm text-black placeholder:text-neutral-400 resize-y focus:outline-none focus:border-black transition-colors"
              placeholder="Share your experience with this product — what did you love, what could be better?"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors"
            >
              {submitting ? (
                <>
                  <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Submitting…
                </>
              ) : "Submit Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="border border-neutral-300 bg-white px-5 py-2.5 text-xs font-bold uppercase text-neutral-600 hover:border-neutral-400 transition-colors"
            >
              Cancel
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            After posting you can delete your review from this device. Reviews are visible to all customers.
          </p>
        </form>
      )}

      {/* Review list */}
      {totalReviews === 0 ? (
        <div className="flex flex-col items-center py-14 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-neutral-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
          </svg>
          <p className="text-sm font-bold text-neutral-400">No reviews yet</p>
          <p className="mt-1 text-xs text-neutral-400 max-w-xs">Be the first to share your experience with this product.</p>
          {!showAddForm && (
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="mt-5 bg-black text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
            >
              Write the First Review
            </button>
          )}
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {reviews.map((r) => {
            const initials = getInitials(r.authorName);
            const colorCls = avatarColor(r.authorName);
            const canDelete = !!tokens[r._id];
            return (
              <li key={r._id} className="py-6 first:pt-0 last:pb-0">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black ${colorCls}`}
                    aria-hidden
                  >
                    {initials}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                      <p className="text-sm font-bold text-black">{r.authorName}</p>
                      <time className="text-[11px] text-neutral-400 tabular-nums" dateTime={r.createdAt}>
                        {new Date(r.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </time>
                    </div>

                    <div className="mt-1 flex items-center gap-2">
                      <StarDisplay value={r.rating} />
                      <span className="text-[11px] font-bold text-neutral-500">{r.rating}.0</span>
                    </div>

                    <p className="mt-2.5 text-sm leading-relaxed text-neutral-700 whitespace-pre-wrap">{r.body}</p>

                    {canDelete && (
                      <button
                        type="button"
                        onClick={() => deleteReview(r._id)}
                        disabled={submitting}
                        className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                        Delete my review
                      </button>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
