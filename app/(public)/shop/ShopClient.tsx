"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Breadcrumbs from "@/components/shop/Breadcrumbs";
import ProductCard from "@/components/shop/ProductCard";
import ShopPagination from "@/components/shop/ShopPagination";
import type { IProduct } from "@/types/product";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { siteConfig } from "@/lib/siteConfig";

const SORTS = [
  { value: "latest", label: "Newest" },
  { value: "priceLow", label: "Price: Low to high" },
  { value: "priceHigh", label: "Price: High to low" },
  { value: "popular", label: "Popular" },
];

const PAGE_SIZE = 12;

const filterInputClass =
  "w-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-black outline-none " +
  "placeholder:text-neutral-400 focus:border-neutral-500";

const selectClass =
  filterInputClass +
  " cursor-pointer appearance-none bg-[length:0.9rem] bg-[right_0.5rem_center] bg-no-repeat pr-8 " +
  "[background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000000'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")]";

const labelClass = "mb-1 block text-[10px] font-semibold uppercase tracking-wide text-neutral-500";

function categoriesOf(product: IProduct): string[] {
  if (Array.isArray(product.categories) && product.categories.length > 0) {
    return product.categories.map(String).map((v) => v.trim()).filter(Boolean);
  }
  return product.category ? [product.category] : [];
}

type ShopHero = { image?: string; heading?: string; subheading?: string };

export default function ShopClient({
  products,
  subCategoriesByCategory = {},
  shopHero,
}: {
  products: IProduct[];
  subCategoriesByCategory?: Record<string, string[]>;
  shopHero?: ShopHero;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const requestedCategory = searchParams.get("category");
  const requestedSubCategory = searchParams.get("subcategory");
  const onSale = searchParams.get("sale") === "1";

  const categories = useMemo(() => {
    const rest = Array.from(new Set([...siteConfig.categories, ...products.flatMap((p) => categoriesOf(p))].filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
    return ["All", ...rest];
  }, [products]);
  const brands = useMemo(() => {
    const rest = Array.from(
      new Set(products.map((p) => p.brand?.trim()).filter((b): b is string => Boolean(b)))
    ).sort((a, b) => a.localeCompare(b));
    return ["All", ...rest];
  }, [products]);
  const sizes = useMemo(() => {
    const rest = Array.from(new Set(products.flatMap((p) => p.sizes).map(String))).sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
      if (!Number.isNaN(na) && !Number.isNaN(nb) && a === String(na) && b === String(nb)) return na - nb;
      return a.localeCompare(b, undefined, { numeric: true });
    });
    return ["All", ...rest];
  }, [products]);
  const colors = useMemo(() => {
    const rest = Array.from(new Set(products.flatMap((p) => p.colors).filter(Boolean))).sort((a, b) =>
      a.localeCompare(b)
    );
    return ["All", ...rest];
  }, [products]);

  const category =
    requestedCategory && categories.includes(requestedCategory) ? requestedCategory : "All";

  const availableSubCategories = useMemo(
    () => (category !== "All" ? (subCategoriesByCategory[category] ?? []) : []),
    [category, subCategoriesByCategory]
  );

  const subCategory = useMemo(() => {
    if (availableSubCategories.length === 0) return "All";
    return requestedSubCategory && availableSubCategories.includes(requestedSubCategory)
      ? requestedSubCategory
      : "All";
  }, [requestedSubCategory, availableSubCategories]);

  const [brand, setBrand] = useState("All");
  const [size, setSize] = useState("All");
  const [color, setColor] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setDrawerOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [drawerOpen]);

  const setCategory = (next: string) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") params.delete("category");
    else params.set("category", next);
    params.delete("subcategory");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setSubCategory = (next: string) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (next === "All") params.delete("subcategory");
    else params.set("subcategory", next);
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setOnSaleFilter = (v: boolean) => {
    setPage(1);
    const params = new URLSearchParams(searchParams.toString());
    if (v) params.set("sale", "1");
    else params.delete("sale");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const setBrandFilter = (v: string) => { setPage(1); setBrand(v); };
  const setSizeFilter = (v: string) => { setPage(1); setSize(v); };
  const setColorFilter = (v: string) => { setPage(1); setColor(v); };
  const setSearchFilter = (v: string) => { setPage(1); setSearch(v); };
  const setSortFilter = (v: string) => { setPage(1); setSort(v); };

  const filtered = useMemo(() => {
    return products
      .filter((p) => category === "All" || categoriesOf(p).includes(category))
      .filter(
        (p) =>
          subCategory === "All" ||
          (Array.isArray(p.subCategories) && p.subCategories.includes(subCategory))
      )
      .filter((p) => brand === "All" || (p.brand?.trim() || "") === brand)
      .filter((p) => size === "All" || p.sizes.includes(size))
      .filter((p) => color === "All" || p.colors.includes(color))
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .filter((p) => !onSale || Number(p.discount || 0) > 0)
      .sort((a, b) => {
        if (sort === "priceLow") return a.price - b.price;
        if (sort === "priceHigh") return b.price - a.price;
        if (sort === "popular") return b.popularityScore - a.popularityScore;
        return +new Date(b.createdAt) - +new Date(a.createdAt);
      });
  }, [products, category, subCategory, brand, size, color, search, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);

  const paginated = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const resetFilters = () => {
    startTransition(() => {
      router.replace(pathname, { scroll: false });
      setBrand("All");
      setSize("All");
      setColor("All");
      setSearch("");
      setSort("latest");
      setPage(1);
      setDrawerOpen(false);
    });
  };

  const activeFilters =
    (category !== "All" ? 1 : 0) +
    (subCategory !== "All" ? 1 : 0) +
    (brand !== "All" ? 1 : 0) +
    (size !== "All" ? 1 : 0) +
    (color !== "All" ? 1 : 0) +
    (search.trim() !== "" ? 1 : 0) +
    (onSale ? 1 : 0);

  return (
    <div className="min-h-screen bg-white text-black">
      <header
        className={
          category === "All"
            ? "relative overflow-hidden border-b border-zinc-200"
            : "sm:border-b border-zinc-200 bg-white text-zinc-900"
        }
      >
        {category === "All" && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${shopHero?.image || siteConfig.images.hero})`,
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
          </>
        )}
        <div
          className={
            "relative mx-auto max-w-[90rem] px-4 lg:px-8 " +
            (category === "All"
              ? "py-16 sm:py-20 lg:py-24 sm:px-6"
              : "py-1 sm:px-6 sm:py-8")
          }
        >
          <Breadcrumbs
            className={
              category === "All"
                ? "text-white/70 [&_a]:text-white [&_a:hover]:underline [&_span]:text-white/70"
                : "text-zinc-500 [&_a]:text-zinc-800 [&_a:hover]:underline [&_span]:text-zinc-500"
            }
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: category !== "All" ? "/shop" : undefined },
              ...(category !== "All" ? [{ label: category }] : []),
            ]}
          />
          <h1
            className={
              "mt-6 text-xl font-black uppercase tracking-tight sm:text-3xl lg:text-4xl " +
              (category === "All"
                ? "text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.7)]"
                : "text-zinc-900")
            }
          >
            {category !== "All"
              ? category
              : (shopHero?.heading || "IFI BEST PRODUCTS FROM BRANDS YOU LOVE")}
          </h1>
          {category === "All" && shopHero?.subheading && (
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/85 drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]">
              {shopHero.subheading}
            </p>
          )}
          <p
            className={
              "mt-2 text-sm " +
              (category === "All" ? "text-white/70" : "text-zinc-600")
            }
          >
            {filtered.length} products
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[90rem] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* Desktop filter panel */}
        <div className="mb-8 hidden border border-neutral-200 bg-white p-4 md:block">
          <div className="mb-3 flex items-center justify-between gap-3 border-b border-neutral-100 pb-2.5">
            <h2 className="text-sm font-black uppercase tracking-wide">Filters</h2>
            {activeFilters > 0 ? (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 underline"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div className="flex flex-wrap items-end gap-2.5">
            <div className="min-w-[11rem] flex-1 sm:flex-none sm:w-[14rem]">
              <label htmlFor="filter-search" className={labelClass}>Search</label>
              <input
                id="filter-search"
                value={search}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search"
                className={filterInputClass}
              />
            </div>
            <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10rem]">
              <label htmlFor="filter-category" className={labelClass}>Category</label>
              <select id="filter-category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                {categories.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[8rem] flex-1 sm:flex-none sm:w-[9rem]">
              <label htmlFor="filter-brand" className={labelClass}>Brand</label>
              <select id="filter-brand" value={brand} onChange={(e) => setBrandFilter(e.target.value)} className={selectClass}>
                {brands.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[7rem] flex-1 sm:flex-none sm:w-[8rem]">
              <label htmlFor="filter-size" className={labelClass}>Size</label>
              <select id="filter-size" value={size} onChange={(e) => setSizeFilter(e.target.value)} className={selectClass}>
                {sizes.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="min-w-[8rem] flex-1 sm:flex-none sm:w-[9rem]">
              <label htmlFor="filter-color" className={labelClass}>Color</label>
              <select id="filter-color" value={color} onChange={(e) => setColorFilter(e.target.value)} className={selectClass}>
                {colors.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="flex-none">
              <p className={labelClass}>Sale</p>
              <button
                type="button"
                onClick={() => setOnSaleFilter(!onSale)}
                className={`border px-3 py-2 text-xs font-bold uppercase tracking-widest ${
                  onSale ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black hover:border-black"
                }`}
              >
                {onSale ? "✓ On Sale" : "On Sale"}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile sticky filter bar */}
        <div className="sticky top-0 z-30 mb-4 flex items-center gap-2 border-b border-neutral-200 bg-white py-3 md:hidden">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-1.5 border border-black bg-black px-3 py-2 text-xs font-bold uppercase tracking-widest text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h6" />
            </svg>
            Filters
            {activeFilters > 0 && (
              <span className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-black text-black">
                {activeFilters}
              </span>
            )}
          </button>
          <div className="flex-1">
            <select
              value={sort}
              onChange={(e) => startTransition(() => setSortFilter(e.target.value))}
              className={selectClass}
              aria-label="Sort"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </div>

        {availableSubCategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {["All", ...availableSubCategories].map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setSubCategory(sc)}
                className={
                  "border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors " +
                  (subCategory === sc
                    ? "border-black bg-black text-white"
                    : "border-neutral-300 bg-white text-black hover:border-black")
                }
              >
                {sc === "All" ? "All" : sc}
              </button>
            ))}
          </div>
        )}

        <div className="min-w-0">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="hidden text-xs font-bold uppercase tracking-wider text-neutral-600 sm:block" aria-live="polite">
              {filtered.length} products
              {category !== "All" ? ` · ${category}` : ""}
              {subCategory !== "All" ? ` · ${subCategory}` : ""}
              {onSale ? " · On Sale" : ""}
            </p>
            <div className="hidden w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center md:flex">
              <label className="sr-only" htmlFor="shop-sort-main">Sort</label>
              <select
                id="shop-sort-main"
                value={sort}
                onChange={(e) => startTransition(() => setSortFilter(e.target.value))}
                className={`${selectClass} sm:min-w-[12rem]`}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Link
                href="/cart"
                className="inline-flex items-center justify-center border border-black bg-black px-4 py-2.5 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800 sm:min-w-[7rem]"
              >
                Cart
              </Link>
            </div>
            {/* Cart link visible on mobile in top bar area */}
            {/* <div className="flex md:hidden">
              <Link
                href="/cart"
                className="inline-flex items-center justify-center border border-black bg-black px-4 py-2 text-center text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800"
              >
                Cart
              </Link>
            </div> */}
          </div>

          <div>
            {paginated.length === 0 ? (
              <div className="border border-dashed border-neutral-300 px-6 py-16 text-center">
                <p className="text-sm font-bold uppercase tracking-wide text-black">No products found</p>
                <p className="mt-2 text-sm text-neutral-600">Try changing filters or search.</p>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 border border-black bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white hover:bg-neutral-800"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">
                {paginated.map((product, idx) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    priority={safePage === 1 && idx < 4}
                  />
                ))}
              </div>
            )}
          </div>

          <ShopPagination
            page={safePage}
            pageCount={pageCount}
            totalItems={filtered.length}
            onPageChange={(p) =>
              startTransition(() => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              })
            }
          />
        </div>
      </div>

      {/* Mobile filter drawer */}
      {drawerOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[80] bg-black/50 md:hidden"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          {/* Centered modal */}
          <div className="fixed inset-0 z-[81] flex items-center justify-center p-5 md:hidden">
            <div
              className="flex w-full max-w-sm flex-col rounded-xl bg-white shadow-2xl"
              style={{ maxHeight: "85vh" }}
              role="dialog"
              aria-modal="true"
              aria-label="Filters"
            >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3.5">
              <span className="text-sm font-black uppercase tracking-wide">
                Filters
                {activeFilters > 0 && (
                  <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] font-black text-white">
                    {activeFilters}
                  </span>
                )}
              </span>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 text-neutral-600"
                aria-label="Close filters"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Scrollable filter fields */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              <div>
                <label htmlFor="m-filter-search" className={labelClass}>Search</label>
                <input
                  id="m-filter-search"
                  value={search}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  placeholder="Search products"
                  className={filterInputClass}
                />
              </div>
              <div>
                <label htmlFor="m-filter-category" className={labelClass}>Category</label>
                <select id="m-filter-category" value={category} onChange={(e) => setCategory(e.target.value)} className={selectClass}>
                  {categories.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="m-filter-brand" className={labelClass}>Brand</label>
                <select id="m-filter-brand" value={brand} onChange={(e) => setBrandFilter(e.target.value)} className={selectClass}>
                  {brands.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="m-filter-size" className={labelClass}>Size</label>
                <select id="m-filter-size" value={size} onChange={(e) => setSizeFilter(e.target.value)} className={selectClass}>
                  {sizes.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="m-filter-color" className={labelClass}>Color</label>
                <select id="m-filter-color" value={color} onChange={(e) => setColorFilter(e.target.value)} className={selectClass}>
                  {colors.map((v) => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <p className={labelClass}>Sale</p>
                <button
                  type="button"
                  onClick={() => setOnSaleFilter(!onSale)}
                  className={`w-full border py-2 text-xs font-bold uppercase tracking-widest ${
                    onSale ? "border-black bg-black text-white" : "border-neutral-200 bg-white text-black"
                  }`}
                >
                  {onSale ? "✓ On Sale Only" : "On Sale Only"}
                </button>
              </div>
            </div>

            {/* Footer actions */}
            <div className="flex gap-3 border-t border-neutral-100 px-5 py-4">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 border border-neutral-300 py-2.5 text-xs font-bold uppercase tracking-widest text-black"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="flex-1 border border-black bg-black py-2.5 text-xs font-bold uppercase tracking-widest text-white"
              >
                Show {filtered.length} Results
              </button>
            </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
