"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { IProduct } from "@/types/product";
import { formatPkr } from "@/lib/formatCurrency";

function productStatusBadge(product: IProduct) {
  const approval = product.approvalStatus || (product.sellerId ? "pending" : "approved");
  if (product.sellerId && approval === "pending") {
    return { label: "Pending approval", className: "bg-amber-900/60 text-amber-300" };
  }
  if (product.sellerId && approval === "rejected") {
    return { label: "Rejected", className: "bg-red-900/60 text-red-300" };
  }
  if (product.status === "Published" && product.isActive) {
    return { label: "Published", className: "bg-emerald-900/60 text-emerald-300" };
  }
  return { label: "Draft", className: "bg-slate-700/80 text-slate-300" };
}

interface ProductTableProps {
  products: IProduct[];
  /** Base path for product management URLs (e.g. `/admin/products` or `/seller/products`). */
  productsBasePath?: string;
  /** Admin-only bulk publish; hidden for sellers. */
  showPublishAllDrafts?: boolean;
  /** When true, "View" opens the public storefront (`/shop/[slug]`) instead of admin preview. */
  useStorefrontProductLink?: boolean;
  /** Admin-only: show Featured drops indicator column. */
  showFeaturedColumn?: boolean;
  /** Admin-only: show Best seller indicator column. */
  showBestSellerColumn?: boolean;
  /** Admin-only: show who created the listing (seller name or store). */
  showSellerColumn?: boolean;
  /** Use approval-aware status labels (admin + seller lists). */
  showApprovalStatus?: boolean;
}

export default function ProductTable({
  products,
  productsBasePath = "/admin/products",
  showPublishAllDrafts = true,
  useStorefrontProductLink = false,
  showFeaturedColumn = false,
  showBestSellerColumn = false,
  showSellerColumn = false,
  showApprovalStatus = false,
}: ProductTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [publishingAll, setPublishingAll] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "outOfStock" | "draft" | "sale">("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 10;
  const [viewProduct, setViewProduct] = useState<IProduct | null>(null);
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => { setImgIdx(0); }, [viewProduct]);

  useEffect(() => {
    if (!viewProduct) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setViewProduct(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [viewProduct]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE", credentials: "include" });
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  const handlePublishAllDrafts = async () => {
    if (!confirm("Publish all draft products?")) return;
    setPublishingAll(true);
    try {
      const res = await fetch("/api/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "publishAllDrafts" }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to publish drafts");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Unable to publish all drafts right now.");
    } finally {
      setPublishingAll(false);
    }
  };

  const draftCount = useMemo(
    () => products.filter((product) => product.status !== "Published").length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    if (filter === "active") return products.filter((product) => product.status === "Published");
    if (filter === "outOfStock") return products.filter((product) => product.stockQuantity <= 0);
    if (filter === "draft") return products.filter((product) => product.status !== "Published");
    if (filter === "sale") return products.filter((product) => Number(product.discount || 0) > 0);
    return products;
  }, [products, filter]);

  const searchedProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return filteredProducts;
    return filteredProducts.filter((product) =>
      [
        product.name,
        product.brand,
        product.category,
        ...(Array.isArray(product.categories) ? product.categories : []),
        ...(Array.isArray(product.subCategories) ? product.subCategories : []),
        product.slug,
      ]
        .map((value) => String(value || "").toLowerCase())
        .some((value) => value.includes(term))
    );
  }, [filteredProducts, search]);

  const totalPages = Math.max(1, Math.ceil(searchedProducts.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = searchedProducts.slice((currentPage - 1) * perPage, currentPage * perPage);

  if (products.length === 0) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 p-16 text-center">
        <p className="text-5xl mb-4">📦</p>
        <p className="text-slate-400 font-medium mb-2">No products yet</p>
        <p className="text-slate-500 text-sm mb-6">Add your first product to get started.</p>
        <Link
          href={`${productsBasePath}/new`}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
        >
          Add Product
        </Link>
      </div>
    );
  }

  return (
    <>
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "outOfStock", label: "Out of Stock" },
            { key: "draft", label: "Draft" },
            { key: "sale", label: "Sale" },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => {
                setFilter(item.key as "all" | "active" | "outOfStock" | "draft" | "sale");
                setPage(1);
              }}
              className={`rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors ${
                filter === item.key
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {showPublishAllDrafts && draftCount > 0 && (
          <button
            type="button"
            onClick={handlePublishAllDrafts}
            disabled={publishingAll}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {publishingAll ? "Publishing..." : `Publish All (${draftCount})`}
          </button>
        )}
      </div>
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search products by name, brand, category..."
          className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-700/60 text-slate-400 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3">Image</th>
              <th className="text-left px-4 py-3">Product</th>
              <th className="text-left px-4 py-3">Status</th>
              {showSellerColumn ? <th className="text-left px-4 py-3">Created by</th> : null}
              {showFeaturedColumn ? <th className="text-left px-4 py-3">Featured</th> : null}
              {showBestSellerColumn ? <th className="text-left px-4 py-3">Best seller</th> : null}
              <th className="text-left px-4 py-3">Brand</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Sub Category</th>
              <th className="text-left px-4 py-3">Price</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {paginatedProducts.map((product) => (
              <tr key={product._id} className="hover:bg-slate-700/30 transition-colors">
                {/* Image */}
                <td className="px-4 py-3">
                  {product.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg border border-slate-600"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center text-lg">
                      👟
                    </div>
                  )}
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-100 max-w-[180px] truncate">{product.name}</p>
                  <p className="text-slate-500 text-xs">{product.colors.join(", ")}</p>
                </td>

                <td className="px-4 py-3">
                  {(() => {
                    const badge = showApprovalStatus
                      ? productStatusBadge(product)
                      : product.status === "Published"
                      ? { label: "Published", className: "bg-emerald-900/60 text-emerald-300" }
                      : { label: "Draft", className: "bg-amber-900/60 text-amber-300" };
                    return (
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    );
                  })()}
                </td>

                {showSellerColumn ? (
                  <td className="px-4 py-3 text-slate-300">
                    {product.sellerId ? (
                      <>
                        <span className="text-xs font-semibold text-indigo-200">Seller</span>
                        <p className="text-sm text-slate-100">{product.sellerName || "Unknown seller"}</p>
                      </>
                    ) : (
                      <span className="text-sm text-slate-400">Store catalog</span>
                    )}
                  </td>
                ) : null}

                {showFeaturedColumn ? (
                  <td className="px-4 py-3">
                    {product.isFeatured ? (
                      <span className="inline-flex items-center rounded-full bg-amber-900/50 px-2.5 py-0.5 text-xs font-medium text-amber-200">
                        Featured
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                ) : null}

                {showBestSellerColumn ? (
                  <td className="px-4 py-3">
                    {product.isBestSeller ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-200">
                        Best seller
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>
                ) : null}

                {/* Brand */}
                <td className="px-4 py-3">
                  <span className="bg-slate-700 text-slate-300 text-xs font-bold px-2 py-1 rounded">
                    {product.brand}
                  </span>
                </td>

                {/* Category */}
                <td className="px-4 py-3 text-slate-400">
                  {Array.isArray(product.categories) && product.categories.length > 0
                    ? product.categories.join(", ")
                    : product.category}
                </td>

                {/* Sub Category */}
                <td className="px-4 py-3">
                  {Array.isArray(product.subCategories) && product.subCategories.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {product.subCategories.map((sc) => (
                        <span
                          key={sc}
                          className="inline-flex items-center rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300"
                        >
                          {sc}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-600 text-xs">—</span>
                  )}
                </td>

                {/* Price */}
                <td className="px-4 py-3">
                  <p className="font-bold text-white">{formatPkr(product.price)}</p>
                  <p className="text-slate-500 text-xs">Discount {product.discount}%</p>
                </td>

                {/* Stock */}
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.stockQuantity > 0
                        ? "bg-green-900/60 text-green-300"
                        : "bg-red-900/60 text-red-300"
                    }`}
                  >
                    {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of Stock"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`${productsBasePath}/${product._id}/edit`}
                      className="text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => setViewProduct(product)}
                      className="text-slate-300 hover:text-slate-100 text-xs font-medium transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.name)}
                      disabled={deletingId === product._id}
                      className="text-red-400 hover:text-red-300 text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      {deletingId === product._id ? "…" : "Delete"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-xs text-slate-400">
        <p>
          Showing {searchedProducts.length === 0 ? 0 : (currentPage - 1) * perPage + 1}-
          {Math.min(currentPage * perPage, searchedProducts.length)} of {searchedProducts.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-slate-200 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-slate-300">
            Page {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="rounded-md border border-slate-600 px-3 py-1.5 text-slate-200 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>

      {/* Product detail modal */}
      {viewProduct && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[90] bg-black/70"
            onClick={() => setViewProduct(null)}
            aria-hidden="true"
          />
          {/* Modal card */}
          <div
            role="dialog"
            aria-modal="true"
            aria-label={viewProduct.name}
            className="fixed inset-0 z-[91] flex items-center justify-center p-4"
            onClick={() => setViewProduct(null)}
          >
            <div
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-slate-600 bg-slate-800 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-slate-700 px-5 py-4">
                <div className="min-w-0">
                  <p className="truncate text-base font-bold text-white">{viewProduct.name}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{viewProduct.brand}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setViewProduct(null)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-600 text-slate-400 hover:border-slate-400 hover:text-white"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                {/* Image gallery */}
                <div className="relative border-b border-slate-700 bg-slate-900 sm:border-b-0 sm:border-r">
                  {viewProduct.images.length > 0 ? (
                    <>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={viewProduct.images[imgIdx]}
                        alt={viewProduct.name}
                        className="h-64 w-full object-contain sm:h-80"
                      />
                      {viewProduct.images.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setImgIdx((i) => (i - 1 + viewProduct.images.length) % viewProduct.images.length)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                            aria-label="Previous image"
                          >
                            ‹
                          </button>
                          <button
                            type="button"
                            onClick={() => setImgIdx((i) => (i + 1) % viewProduct.images.length)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                            aria-label="Next image"
                          >
                            ›
                          </button>
                          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                            {viewProduct.images.map((_, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => setImgIdx(i)}
                                className={`h-1.5 w-1.5 rounded-full transition-colors ${i === imgIdx ? "bg-white" : "bg-white/40"}`}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="flex h-64 items-center justify-center text-5xl sm:h-80">👟</div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4 px-5 py-5">
                  {/* Status */}
                  {(() => {
                    const badge = productStatusBadge(viewProduct);
                    return (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.className}`}>
                        {badge.label}
                      </span>
                    );
                  })()}

                  {/* Price */}
                  <div>
                    <p className="text-2xl font-black text-white">
                      {viewProduct.discount > 0
                        ? formatPkr(Math.round(viewProduct.price * (1 - viewProduct.discount / 100)))
                        : formatPkr(viewProduct.price)}
                    </p>
                    {viewProduct.discount > 0 && (
                      <p className="text-sm text-slate-400 line-through">{formatPkr(viewProduct.price)}</p>
                    )}
                    {viewProduct.discount > 0 && (
                      <span className="mt-1 inline-flex items-center rounded-full bg-red-900/60 px-2 py-0.5 text-xs font-bold text-red-300">
                        {viewProduct.discount}% off
                      </span>
                    )}
                  </div>

                  {/* Stock */}
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      viewProduct.stockQuantity > 0 ? "bg-green-900/60 text-green-300" : "bg-red-900/60 text-red-300"
                    }`}>
                      {viewProduct.stockQuantity > 0 ? `${viewProduct.stockQuantity} in stock` : "Out of stock"}
                    </span>
                    <span className="text-xs text-slate-400">{viewProduct.soldCount} sold</span>
                  </div>

                  {/* Category */}
                  <div>
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Category</p>
                    <p className="text-sm text-slate-300">
                      {Array.isArray(viewProduct.categories) && viewProduct.categories.length > 0
                        ? viewProduct.categories.join(", ")
                        : viewProduct.category}
                    </p>
                    {Array.isArray(viewProduct.subCategories) && viewProduct.subCategories.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {viewProduct.subCategories.map((sc) => (
                          <span key={sc} className="rounded-md bg-indigo-500/15 px-2 py-0.5 text-xs font-medium text-indigo-300">{sc}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sizes */}
                  {viewProduct.sizes.length > 0 && (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Sizes</p>
                      <div className="flex flex-wrap gap-1">
                        {viewProduct.sizes.map((s) => (
                          <span key={s} className="rounded border border-slate-600 bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-200">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Colors */}
                  {viewProduct.colors.length > 0 && (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Colors</p>
                      <div className="flex flex-wrap gap-1">
                        {viewProduct.colors.map((c) => (
                          <span key={c} className="rounded border border-slate-600 bg-slate-700 px-2 py-0.5 text-xs font-medium text-slate-200">{c}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {viewProduct.description && (
                    <div>
                      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">Description</p>
                      <p className="text-xs leading-relaxed text-slate-400 line-clamp-4">{viewProduct.description}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-700 px-5 py-4">
                <button
                  type="button"
                  onClick={() => setViewProduct(null)}
                  className="rounded-lg border border-slate-600 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-slate-400 hover:text-white"
                >
                  Close
                </button>
                <Link
                  href={`${productsBasePath}/${viewProduct._id}/edit`}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  Edit product
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
