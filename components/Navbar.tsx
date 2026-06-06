"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import BrandLogoMark from "@/components/BrandLogoMark";

type AuthUser = { id: string; email: string; name: string; role: string };

const PRIMARY_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
];

const SECONDARY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function categoryShopHref(name: string) {
  return `/shop?category=${encodeURIComponent(name)}`;
}

function subCategoryShopHref(category: string, subCategory: string) {
  return `/shop?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subCategory)}`;
}

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category")?.trim() || "";
  const activeSubCategory = searchParams.get("subcategory")?.trim() || "";
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [authUser, setAuthUser] = useState<AuthUser | null | undefined>(undefined);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [subCategoriesByCategory, setSubCategoriesByCategory] = useState<Record<string, string[]>>({});

  const refreshAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json();
      setAuthUser(data.user ?? null);
    } catch {
      setAuthUser(null);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshAuth();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [refreshAuth]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/navigation/collections")
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        if (Array.isArray(data.categories)) {
          setCategories(data.categories.map(String).filter(Boolean));
        }
        if (data.subCategoriesByCategory && typeof data.subCategoriesByCategory === "object") {
          setSubCategoriesByCategory(data.subCategoriesByCategory as Record<string, string[]>);
        }
      })
      .catch(() => {
        if (!cancelled) setCategories([...siteConfig.categories]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const sync = () => {
      const items = JSON.parse(localStorage.getItem("cart_items") || "[]");
      const count = items.reduce((sum: number, i: { quantity: number }) => sum + Number(i.quantity || 0), 0);
      setCartCount(count);
    };
    sync();
    window.addEventListener("cart_updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart_updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const isHome = pathname === "/";
  const isShop = pathname === "/shop";
  const isCategoriesActive = isShop && (Boolean(activeCategory) || Boolean(activeSubCategory));

  const linkClass = (active: boolean) =>
    `nav-link text-zinc-700 hover:text-zinc-950 transition-colors ${active ? "border-b-2 border-[rgb(218,170,88)] text-zinc-950" : ""}`;

  const categoriesDropdown =
    categories.length > 0 ? (
      <div
        className="relative"
        onMouseEnter={() => setCategoriesOpen(true)}
        onMouseLeave={() => setCategoriesOpen(false)}
      >
        <button
          type="button"
          className={`${linkClass(isCategoriesActive)} inline-flex items-center gap-1 align-middle leading-none`}
          aria-expanded={categoriesOpen}
          aria-haspopup="true"
        >
          Categories
          <svg
            className="h-3.5 w-3.5 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {categoriesOpen ? (
          <div className="absolute left-0 top-full z-50 mt-2 min-w-[14rem] max-h-[min(70vh,22rem)] overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-xl">
            <Link
              href="/shop"
              className="block border-b border-zinc-100 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-zinc-900 hover:bg-zinc-50"
              onClick={() => setCategoriesOpen(false)}
            >
              All products
            </Link>
            {categories.map((name) => {
              const subs = subCategoriesByCategory[name] || [];
              return (
                <div key={name}>
                  <Link
                    href={categoryShopHref(name)}
                    className={`block px-4 py-2 text-sm hover:bg-zinc-50 ${
                      activeCategory === name && !activeSubCategory
                        ? "font-semibold text-zinc-950 bg-zinc-50"
                        : "text-zinc-700"
                    }`}
                    onClick={() => setCategoriesOpen(false)}
                  >
                    {name}
                  </Link>
                  {subs.map((sc) => (
                    <Link
                      key={sc}
                      href={subCategoryShopHref(name, sc)}
                      className={`block pl-7 pr-4 py-1.5 text-xs hover:bg-zinc-50 ${
                        activeCategory === name && activeSubCategory === sc
                          ? "font-semibold text-zinc-900"
                          : "text-zinc-500 hover:text-zinc-800"
                      }`}
                      onClick={() => setCategoriesOpen(false)}
                    >
                      ↳ {sc}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    ) : null;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-200 shadow-sm">
      {/* Top promo bar */}
      <div className="hidden sm:block bg-zinc-950 text-white py-2 text-xs font-bold tracking-widest uppercase border-b border-zinc-800">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>Free shipping on orders above Rs. 3000 across Pakistan</span>
          <span className="text-[11px] text-white/80">
            {siteConfig.contact.phone} | {siteConfig.contact.email}
          </span>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-5 min-h-16 py-3">
          <Link href="/" className="flex shrink-0 items-center" aria-label={`${siteConfig.brandName} home`}>
            <BrandLogoMark size="lg" />
          </Link>

          <nav className="hidden xl:flex items-center gap-5">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(
                  link.href === "/" ? isHome : link.href === "/shop" ? isShop && !activeCategory : false
                )}
              >
                {link.label}
              </Link>
            ))}
            {categoriesDropdown}
            {SECONDARY_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className={linkClass(pathname === link.href)}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {authUser === undefined ? null : authUser ? (
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  className="text-sm font-semibold text-zinc-800 hover:text-zinc-950 uppercase tracking-widest"
                  aria-expanded={accountOpen}
                >
                  Account
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[12rem] rounded-md border border-zinc-200 bg-white py-1 shadow-xl z-50">
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-3 py-2 text-sm text-zinc-800 hover:bg-zinc-50"
                      onClick={() => setAccountOpen(false)}
                    >
                      My orders
                    </Link>
                    {authUser.role === "seller" ? (
                      <Link
                        href="/seller"
                        className="block px-3 py-2 text-sm text-emerald-700 hover:bg-zinc-50"
                        onClick={() => setAccountOpen(false)}
                      >
                        Seller dashboard
                      </Link>
                    ) : null}
                    {authUser.role === "admin" ? (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-sm text-indigo-700 hover:bg-zinc-50"
                        onClick={() => setAccountOpen(false)}
                      >
                        Admin panel
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-zinc-50"
                      onClick={async () => {
                        await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                        setAuthUser(null);
                        setAccountOpen(false);
                        window.location.href = "/";
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3 text-sm font-semibold uppercase tracking-widest">
                <Link href="/login" className="text-zinc-600 hover:text-zinc-950">
                  Sign in
                </Link>
                <Link href="/register" className="text-zinc-900 hover:text-zinc-950">
                  Register
                </Link>
              </div>
            )}
            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block hover:opacity-70 transition-opacity text-zinc-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link href="/compare" aria-label="Compare" className="hidden sm:block hover:opacity-70 transition-opacity text-zinc-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M16 3h5v5" />
                <path d="M8 21H3v-5" />
                <path d="M21 3 14 10" />
                <path d="M3 21 10 14" />
              </svg>
            </Link>

            <Link href="/cart" aria-label="Cart" className="relative hover:opacity-70 transition-opacity text-zinc-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              {cartCount > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-zinc-950 text-xs w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: siteConfig.brandGradient }}
                >
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              className="xl:hidden hover:opacity-70 transition-opacity text-zinc-800"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="xl:hidden border-t border-zinc-200 bg-white">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link text-sm py-1 text-zinc-800 hover:text-zinc-950 transition-colors ${
                  (link.href === "/" ? isHome : link.href === "/shop" ? isShop && !activeCategory : false)
                    ? "border-b-2 border-[rgb(218,170,88)] w-fit text-zinc-950"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            {categories.length > 0 ? (
              <div>
                <button
                  type="button"
                  onClick={() => setMobileCategoriesOpen((v) => !v)}
                  className={`nav-link flex w-full items-center justify-between text-sm py-1 text-zinc-800 hover:text-zinc-950 ${
                    isCategoriesActive ? "border-b-2 border-[rgb(218,170,88)] w-fit text-zinc-950" : ""
                  }`}
                  aria-expanded={mobileCategoriesOpen}
                >
                  Categories
                  <svg
                    className={`h-4 w-4 transition-transform ${mobileCategoriesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {mobileCategoriesOpen ? (
                  <div className="mt-2 flex flex-col gap-1 border-l-2 border-zinc-200 pl-3">
                    <Link
                      href="/shop"
                      onClick={() => {
                        setMenuOpen(false);
                        setMobileCategoriesOpen(false);
                      }}
                      className="text-sm font-semibold text-zinc-900 py-1"
                    >
                      All products
                    </Link>
                    {categories.map((name) => {
                      const subs = subCategoriesByCategory[name] || [];
                      return (
                        <div key={name}>
                          <Link
                            href={categoryShopHref(name)}
                            onClick={() => { setMenuOpen(false); setMobileCategoriesOpen(false); }}
                            className={`block text-sm py-1 ${
                              activeCategory === name && !activeSubCategory
                                ? "font-semibold text-zinc-950"
                                : "text-zinc-600"
                            }`}
                          >
                            {name}
                          </Link>
                          {subs.map((sc) => (
                            <Link
                              key={sc}
                              href={subCategoryShopHref(name, sc)}
                              onClick={() => { setMenuOpen(false); setMobileCategoriesOpen(false); }}
                              className={`block pl-4 text-xs py-0.5 ${
                                activeCategory === name && activeSubCategory === sc
                                  ? "font-semibold text-zinc-900"
                                  : "text-zinc-400 hover:text-zinc-700"
                              }`}
                            >
                              ↳ {sc}
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>
            ) : null}

            {SECONDARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link text-sm py-1 text-zinc-800 hover:text-zinc-950 transition-colors ${
                  pathname === link.href ? "border-b-2 border-[rgb(218,170,88)] w-fit text-zinc-950" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-3">
              {siteConfig.utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-zinc-600 hover:text-zinc-950"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {authUser === undefined ? null : authUser ? (
              <>
                <Link href="/account" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-zinc-800">
                  Account
                </Link>
                {authUser.role === "seller" ? (
                  <Link href="/seller" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-emerald-700">
                    Seller dashboard
                  </Link>
                ) : null}
                {authUser.role === "admin" ? (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-indigo-700">
                    Admin
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                    setAuthUser(null);
                    setMenuOpen(false);
                    window.location.href = "/";
                  }}
                  className="text-left text-sm py-1 text-red-600"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-zinc-800">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-zinc-800">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
