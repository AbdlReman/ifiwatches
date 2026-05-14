"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import BrandLogoMark from "@/components/BrandLogoMark";

type AuthUser = { id: string; email: string; name: string; role: string };

const STATIC_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const dedupe = (values: string[]) =>
  Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [collections, setCollections] = useState<string[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [authUser, setAuthUser] = useState<AuthUser | null | undefined>(undefined);
  const [accountOpen, setAccountOpen] = useState(false);
  const activeCategory = searchParams.get("category") || "";

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

  const categoryLinks = useMemo(
    () =>
      dedupe([...siteConfig.categories, ...collections]).map((category) => ({
        href: `/shop?category=${encodeURIComponent(category)}`,
        label: category,
      })),
    [collections]
  );

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

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/navigation/collections");
        const data = await res.json();
        if (!cancelled) {
          setCollections(Array.isArray(data.categories) ? data.categories : []);
        }
      } catch {
        if (!cancelled) setCollections([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isHome = pathname === "/";
  const isShop = pathname === "/shop" && !activeCategory;
  const isCategoryActive = (label: string) =>
    pathname === "/shop" && activeCategory.toLowerCase() === label.toLowerCase();

  const linkClass = (active: boolean) =>
    `nav-link text-zinc-100 hover:text-white transition-colors ${active ? "border-b-2 border-[rgb(218,170,88)]" : ""}`;

  return (
    <header className="sticky top-0 z-50 bg-zinc-950/95 backdrop-blur border-b border-zinc-800">
      {/* Top promo bar */}
      <div
        className="text-zinc-950 py-2 text-xs font-bold tracking-widest uppercase border-b border-zinc-800"
        style={{ background: siteConfig.brandGradient }}
      >
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-1">
          <span>Free shipping on orders above Rs. 3000 across Pakistan</span>
          <span className="text-[11px]">
            {siteConfig.contact.phone} | {siteConfig.contact.email}
          </span>
        </div>
      </div>

      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-5 min-h-16 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${siteConfig.brandName} home`}>
            <BrandLogoMark size="md" />
            <span className="font-black text-lg lowercase tracking-widest text-zinc-100">
              {siteConfig.brandName}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden xl:flex items-center gap-5">
            {STATIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(link.href === "/" ? isHome : link.href === "/shop" ? isShop : pathname === link.href)}
              >
                {link.label}
              </Link>
            ))}
            {categoryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={linkClass(isCategoryActive(link.label))}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-4">
            {authUser === undefined ? null : authUser ? (
              <div
                className="relative hidden sm:block"
                onMouseEnter={() => setAccountOpen(true)}
                onMouseLeave={() => setAccountOpen(false)}
              >
                <button
                  type="button"
                  className="text-sm font-semibold text-zinc-100 hover:text-white uppercase tracking-widest"
                  aria-expanded={accountOpen}
                >
                  Account
                </button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 min-w-[12rem] rounded-md border border-zinc-700 bg-zinc-900 py-1 shadow-xl z-50">
                    <Link
                      href="/account"
                      className="block px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800"
                      onClick={() => setAccountOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/account/orders"
                      className="block px-3 py-2 text-sm text-zinc-100 hover:bg-zinc-800"
                      onClick={() => setAccountOpen(false)}
                    >
                      My orders
                    </Link>
                    {authUser.role === "seller" ? (
                      <Link
                        href="/seller"
                        className="block px-3 py-2 text-sm text-emerald-300 hover:bg-zinc-800"
                        onClick={() => setAccountOpen(false)}
                      >
                        Seller dashboard
                      </Link>
                    ) : null}
                    {authUser.role === "admin" ? (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-sm text-indigo-300 hover:bg-zinc-800"
                        onClick={() => setAccountOpen(false)}
                      >
                        Admin panel
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-zinc-800"
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
                <Link href="/login" className="text-zinc-300 hover:text-white">
                  Sign in
                </Link>
                <Link href="/register" className="text-zinc-100 hover:text-white">
                  Register
                </Link>
              </div>
            )}
            <Link href="/wishlist" aria-label="Wishlist" className="hidden sm:block hover:opacity-70 transition-opacity text-zinc-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </Link>

            <Link href="/compare" aria-label="Compare" className="hidden sm:block hover:opacity-70 transition-opacity text-zinc-100">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M16 3h5v5" />
                <path d="M8 21H3v-5" />
                <path d="M21 3 14 10" />
                <path d="M3 21 10 14" />
              </svg>
            </Link>

            {/* Cart */}
            <Link href="/cart" aria-label="Cart" className="relative hover:opacity-70 transition-opacity text-zinc-100">
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

            {/* Mobile menu button */}
            <button
              className="xl:hidden hover:opacity-70 transition-opacity text-zinc-100"
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="xl:hidden border-t border-zinc-800 bg-zinc-950">
          <nav className="flex flex-col px-4 py-4 gap-4">
            {STATIC_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`nav-link text-sm py-1 text-zinc-100 hover:text-white transition-colors ${
                  (link.href === "/" ? isHome : link.href === "/shop" ? isShop : pathname === link.href)
                    ? "border-b-2 border-[rgb(218,170,88)] w-fit"
                    : ""
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="grid grid-cols-2 gap-3 border-y border-zinc-800 py-4">
              {categoryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`text-sm text-zinc-200 hover:text-white ${
                    isCategoryActive(link.label) ? "font-bold text-[rgb(218,170,88)]" : ""
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {siteConfig.utilityLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm text-zinc-200 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {authUser === undefined ? null : authUser ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="text-sm py-1 text-zinc-100 hover:text-white"
                >
                  Account
                </Link>
                {authUser.role === "seller" ? (
                  <Link
                    href="/seller"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm py-1 text-emerald-300 hover:text-emerald-200"
                  >
                    Seller dashboard
                  </Link>
                ) : null}
                {authUser.role === "admin" ? (
                  <Link
                    href="/admin"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm py-1 text-indigo-300 hover:text-indigo-200"
                  >
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
                  className="text-left text-sm py-1 text-red-400 hover:text-red-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-zinc-100">
                  Sign in
                </Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm py-1 text-zinc-100">
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
