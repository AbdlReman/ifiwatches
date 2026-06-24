"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPkr } from "@/lib/formatCurrency";

type PendingProduct = {
  _id: string;
  name: string;
  brand: string;
  price: number;
  discount: number;
  stockQuantity: number;
  soldCount: number;
  status: string;
  isActive: boolean;
  isFeatured: boolean;
  isBestSeller: boolean;
  description: string;
  detail: string;
  category: string;
  categories: string[];
  subCategories: string[];
  colors: string[];
  sizes: string[];
  images: string[];
  colorVariants: { color: string; images: string[] }[];
  slug: string;
  sellerCode?: string;
  approvalStatus: string;
  seller?: { name: string; email: string } | null;
  createdAt: string;
  updatedAt: string;
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${color}`}>
      {label}
    </span>
  );
}

function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const all = images.filter(Boolean);
  if (all.length === 0) {
    return (
      <div className="aspect-square w-full bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z" />
          </svg>
          <p className="text-slate-500 text-xs">No images uploaded</p>
        </div>
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col gap-2">
        {/* Main image */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="relative aspect-square w-full overflow-hidden rounded-xl border border-slate-700 bg-slate-800 cursor-zoom-in group"
          aria-label="Enlarge image"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={all[active]} alt={name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Zoom ↗
          </span>
          {all.length > 1 && (
            <span className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              {active + 1} / {all.length}
            </span>
          )}
        </button>

        {/* Thumbnails */}
        {all.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {all.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActive(i)}
                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                  i === active ? "border-amber-400 opacity-100" : "border-slate-700 opacity-60 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <button
          type="button"
          className="fixed inset-0 z-[120] flex cursor-zoom-out items-center justify-center bg-black/95 p-4"
          onClick={() => setLightbox(false)}
          aria-label="Close"
        >
          <span className="absolute right-4 top-4 border border-white/30 bg-black/60 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white rounded-lg">
            Close ✕
          </span>
          {all.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive((i) => (i - 1 + all.length) % all.length); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
              >‹</button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setActive((i) => (i + 1) % all.length); }}
                className="absolute right-14 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
              >›</button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={all[active]}
            alt={name}
            className="max-h-[88vh] max-w-[88vw] rounded-xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </button>
      )}
    </>
  );
}

export default function ApprovalsClient() {
  const router = useRouter();
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [preview, setPreview] = useState<PendingProduct | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products/approvals", { credentials: "include" });
      const data = await res.json();
      setProducts(data.products || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Close modal on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setPreview(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const decide = async (id: string, decision: "approve" | "reject", publish?: boolean) => {
    setActingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}/approval`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ decision, publish: publish === true }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed");
        return;
      }
      setPreview(null);
      await load();
      router.refresh();
    } finally {
      setActingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-slate-700 bg-slate-800/50 p-4 flex gap-4">
            <div className="h-16 w-16 rounded-lg bg-slate-700 shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-4 w-48 rounded bg-slate-700" />
              <div className="h-3 w-32 rounded bg-slate-700/60" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center py-20 text-center rounded-xl border border-slate-700 bg-slate-800/30">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.745 3.745 0 0 1 3.296-1.043A3.745 3.745 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.745 3.745 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
        </svg>
        <p className="text-slate-400 font-semibold">All clear — no pending products</p>
        <p className="text-slate-600 text-sm mt-1">Seller listings awaiting review will appear here.</p>
      </div>
    );
  }

  const finalPrice = (p: PendingProduct) =>
    p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price;

  return (
    <>
      {/* ── Product list ── */}
      <div className="space-y-3">
        {products.map((p) => {
          const thumb = p.images?.[0] || "";
          const busy = actingId === p._id;
          return (
            <div
              key={p._id}
              className="rounded-xl border border-slate-700 bg-slate-800/60 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Thumbnail */}
              <button
                type="button"
                onClick={() => setPreview(p)}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-600 bg-slate-700 hover:border-amber-400 transition-colors group"
                title="Preview product"
              >
                {thumb ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={thumb} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500 text-xs">No img</div>
                )}
                <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </span>
              </button>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <p className="font-bold text-white truncate">{p.name}</p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{p.brand}</span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                  <span className="font-bold text-white">{formatPkr(finalPrice(p))}</span>
                  {p.discount > 0 && (
                    <span className="text-slate-500 line-through">{formatPkr(p.price)}</span>
                  )}
                  {p.discount > 0 && (
                    <Badge label={`−${p.discount}%`} color="bg-rose-900/60 text-rose-300" />
                  )}
                  <span className="text-slate-500">{p.stockQuantity} in stock</span>
                  {p.seller?.name && <span className="text-indigo-400">{p.seller.name}</span>}
                </div>
                {(p.categories?.length > 0 || p.category) && (
                  <p className="text-[11px] text-slate-500 mt-1">
                    {(p.categories?.length > 0 ? p.categories : [p.category]).join(" · ")}
                    {p.subCategories?.length > 0 && ` → ${p.subCategories.join(", ")}`}
                  </p>
                )}
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Submitted {new Date(p.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setPreview(p)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.964-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Full Preview
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => decide(p._id, "approve", true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600/30 border border-emerald-500/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-emerald-300 hover:bg-emerald-600/50 disabled:opacity-50 transition-colors"
                >
                  {busy ? "…" : "Approve & Publish"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => decide(p._id, "approve", false)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700/60 border border-slate-600 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-700 disabled:opacity-50 transition-colors"
                >
                  {busy ? "…" : "Approve Only"}
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => { if (!confirm("Reject this listing?")) return; decide(p._id, "reject"); }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-900/30 border border-red-500/30 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-red-300 hover:bg-red-900/50 disabled:opacity-50 transition-colors"
                >
                  {busy ? "…" : "Reject"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Full Preview Modal ── */}
      {preview && (
        <>
          <div
            className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
            onClick={() => setPreview(null)}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-[91] flex items-start justify-center p-3 sm:p-6 overflow-y-auto">
            <div
              className="relative w-full max-w-5xl rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-slate-700 bg-slate-900/95 px-5 py-4 backdrop-blur rounded-t-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 border border-amber-500/40 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-amber-300 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                    Pending Review
                  </span>
                  <p className="text-white font-black text-base truncate">{preview.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal body */}
              <div className="p-5 sm:p-6">
                <div className="grid gap-6 lg:grid-cols-2">

                  {/* LEFT — image gallery */}
                  <div>
                    <ImageGallery
                      images={[
                        ...preview.images,
                        ...(preview.colorVariants?.flatMap((v) => v.images) ?? []),
                      ].filter((v, i, a) => v && a.indexOf(v) === i)}
                      name={preview.name}
                    />
                    {/* Color variants */}
                    {preview.colorVariants?.length > 0 && (
                      <div className="mt-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Color Variants</p>
                        <div className="flex flex-wrap gap-2">
                          {preview.colorVariants.map((v) => (
                            <span key={v.color} className="flex items-center gap-1.5 rounded-full border border-slate-600 bg-slate-800 px-3 py-1 text-xs text-slate-300">
                              <span className="h-2.5 w-2.5 rounded-full border border-slate-500" style={{ background: v.color.toLowerCase() }} />
                              {v.color}
                              <span className="text-slate-500">({v.images.length} img)</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* RIGHT — product details */}
                  <div className="space-y-5">

                    {/* Name & brand */}
                    <div>
                      {preview.brand && (
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">{preview.brand}</p>
                      )}
                      <h2 className="text-xl font-black text-white leading-tight">{preview.name}</h2>
                      {preview.sellerCode && (
                        <p className="font-mono text-[11px] font-bold text-amber-400 mt-0.5">{preview.sellerCode}</p>
                      )}
                    </div>

                    {/* Pricing */}
                    <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Pricing</p>
                      <div className="flex flex-wrap items-end gap-3">
                        {preview.discount > 0 ? (
                          <>
                            <span className="text-3xl font-black text-white tabular-nums">{formatPkr(preview.price * (1 - preview.discount / 100))}</span>
                            <span className="text-base text-slate-500 line-through tabular-nums">{formatPkr(preview.price)}</span>
                            <Badge label={`${preview.discount}% off`} color="bg-rose-900/60 text-rose-300" />
                          </>
                        ) : (
                          <span className="text-3xl font-black text-white tabular-nums">{formatPkr(preview.price)}</span>
                        )}
                      </div>
                    </div>

                    {/* Stock & status */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Stock</p>
                        <p className={`text-xl font-black ${preview.stockQuantity > 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {preview.stockQuantity}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{preview.stockQuantity > 0 ? "units available" : "out of stock"}</p>
                      </div>
                      <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Units Sold</p>
                        <p className="text-xl font-black text-white">{preview.soldCount ?? 0}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">total sold</p>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Categories</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(preview.categories?.length > 0 ? preview.categories : [preview.category]).filter(Boolean).map((c) => (
                          <span key={c} className="rounded-full bg-indigo-900/60 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">{c}</span>
                        ))}
                      </div>
                      {preview.subCategories?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {preview.subCategories.map((sc) => (
                            <span key={sc} className="rounded-md bg-slate-700/60 border border-slate-600 px-2 py-0.5 text-[11px] text-slate-300">{sc}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Colors & Sizes */}
                    {(preview.colors?.length > 0 || preview.sizes?.length > 0) && (
                      <div className="grid grid-cols-2 gap-3">
                        {preview.colors?.length > 0 && (
                          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Colors</p>
                            <div className="flex flex-wrap gap-1.5">
                              {preview.colors.map((c) => (
                                <span key={c} className="rounded-full border border-slate-600 bg-slate-700 px-2.5 py-0.5 text-[11px] text-slate-200">{c}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {preview.sizes?.length > 0 && (
                          <div className="rounded-xl border border-slate-700 bg-slate-800/60 p-3">
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Sizes</p>
                            <div className="flex flex-wrap gap-1.5">
                              {preview.sizes.map((s) => (
                                <span key={s} className="rounded border border-slate-600 bg-slate-700 px-2 py-0.5 text-[11px] font-mono text-slate-200">{s}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Flags */}
                    <div className="flex flex-wrap gap-2">
                      <Badge
                        label={preview.isFeatured ? "Featured" : "Not featured"}
                        color={preview.isFeatured ? "bg-amber-900/60 text-amber-300" : "bg-slate-700/60 text-slate-500"}
                      />
                      <Badge
                        label={preview.isBestSeller ? "Best Seller" : "Not best seller"}
                        color={preview.isBestSeller ? "bg-emerald-900/60 text-emerald-300" : "bg-slate-700/60 text-slate-500"}
                      />
                      <Badge
                        label={preview.isActive ? "Active" : "Inactive"}
                        color={preview.isActive ? "bg-sky-900/60 text-sky-300" : "bg-slate-700/60 text-slate-500"}
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                {preview.description && (
                  <div className="mt-6 rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Description</p>
                    <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{preview.description}</p>
                  </div>
                )}

                {/* Detail (rich HTML) */}
                {preview.detail && (
                  <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/40 p-5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-3">Product Detail (Rich)</p>
                    <div
                      className="prose prose-invert prose-sm max-w-none prose-headings:text-slate-200 prose-p:text-slate-400 prose-li:text-slate-400"
                      dangerouslySetInnerHTML={{ __html: preview.detail }}
                    />
                  </div>
                )}

                {/* Seller info */}
                <div className="mt-4 rounded-xl border border-slate-700 bg-slate-800/40 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Submitted by</p>
                    <p className="text-white font-semibold">{preview.seller?.name || "Unknown seller"}</p>
                    {preview.seller?.email && (
                      <p className="text-slate-400 text-xs">{preview.seller.email}</p>
                    )}
                    <p className="text-slate-600 text-xs mt-1">
                      {new Date(preview.createdAt).toLocaleString("en-PK", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/admin/products/${preview._id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-slate-700 px-4 py-2 text-xs font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-600 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                    </svg>
                    Edit Product
                  </Link>
                </div>
              </div>

              {/* Modal footer — decision buttons */}
              <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-slate-700 bg-slate-900/95 px-5 py-4 backdrop-blur rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-lg border border-slate-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white hover:border-slate-500 transition-colors"
                >
                  Close
                </button>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={actingId === preview._id}
                    onClick={() => { if (!confirm("Reject this listing?")) return; decide(preview._id, "reject"); }}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-900/30 border border-red-500/40 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-red-300 hover:bg-red-900/60 disabled:opacity-50 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {actingId === preview._id ? "Working…" : "Reject"}
                  </button>
                  <button
                    type="button"
                    disabled={actingId === preview._id}
                    onClick={() => decide(preview._id, "approve", false)}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-700 border border-slate-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-200 hover:bg-slate-600 disabled:opacity-50 transition-colors"
                  >
                    {actingId === preview._id ? "Working…" : "Approve Only"}
                  </button>
                  <button
                    type="button"
                    disabled={actingId === preview._id}
                    onClick={() => decide(preview._id, "approve", true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                  >
                    {actingId === preview._id ? (
                      <>
                        <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                        </svg>
                        Working…
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                        Approve & Publish
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
