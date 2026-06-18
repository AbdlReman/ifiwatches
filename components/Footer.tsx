"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/siteConfig";
import BrandLogoMark from "@/components/BrandLogoMark";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMsg, setSubscribeMsg] = useState("");

  useEffect(() => {
    if (!subscribeMsg) return;
    const t = window.setTimeout(() => setSubscribeMsg(""), 3000);
    return () => window.clearTimeout(t);
  }, [subscribeMsg]);

  const onSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribing(true);
    setSubscribeMsg("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "footer" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Subscription failed");
      setEmail("");
      setSubscribeMsg("Subscribed successfully.");
    } catch (err) {
      setSubscribeMsg(err instanceof Error ? err.message : "Could not subscribe right now.");
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-zinc-50 text-zinc-900 border-t border-zinc-200">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="mb-4 inline-flex" aria-label={`${siteConfig.brandName} home`}>
              <BrandLogoMark size="md" />
            </Link>
            <p className="text-zinc-600 text-sm leading-relaxed">
              IFI Lifestyle — Iconic Futures Innovations. A trusted lifestyle platform: one product, one seller, quality
              and standards first.
            </p>
            <div className="mt-5 space-y-3">
              {siteConfig.trustBadges.map((badge) => (
                <div key={badge.title} className="border border-zinc-200 rounded-lg p-3 bg-white">
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: siteConfig.brandColor }}>
                    {badge.title}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1">{badge.description}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 mt-6">
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 border border-zinc-300 rounded-full flex items-center justify-center hover:border-zinc-900 transition-colors text-zinc-700 hover:text-zinc-900"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="w-9 h-9 border border-zinc-300 rounded-full flex items-center justify-center hover:border-zinc-900 transition-colors text-zinc-700 hover:text-zinc-900"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
              <a
                href={siteConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 border border-zinc-300 rounded-full flex items-center justify-center hover:border-zinc-900 transition-colors text-zinc-700 hover:text-zinc-900"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href={siteConfig.contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-9 h-9 border border-zinc-300 rounded-full flex items-center justify-center hover:border-zinc-900 transition-colors text-zinc-700 hover:text-zinc-900"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884" />
                </svg>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5">Shop</h4>
            <ul className="space-y-3">
              {siteConfig.categories.map((item) => (
                <li key={item}>
                  <Link
                    href={`/shop?category=${encodeURIComponent(item)}`}
                    className="text-zinc-600 text-sm hover:text-zinc-950 transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5">Contact Info</h4>
            <ul className="space-y-3">
              <li>
                <a href={`tel:${siteConfig.contact.phone}`} className="text-zinc-600 text-sm hover:text-zinc-950 transition-colors">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="text-zinc-600 text-sm hover:text-zinc-950 transition-colors"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-600 text-sm hover:text-zinc-950 transition-colors"
                >
                  WhatsApp: {siteConfig.contact.whatsapp}
                </a>
              </li>
              {siteConfig.utilityLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-zinc-600 text-sm hover:text-zinc-950 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-bold uppercase tracking-widest text-xs mb-5">Newsletter</h4>
            <p className="text-zinc-600 text-sm mb-4">
              Get multi-vendor deals, new arrivals, and lifestyle updates from {siteConfig.domain}.
            </p>
            <form className="flex flex-col gap-2" onSubmit={onSubscribe}>
              <input
                type="email"
                placeholder="Your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border border-zinc-300 text-zinc-900 text-sm px-4 py-2.5 focus:outline-none focus:border-zinc-500 transition-colors placeholder-zinc-400"
              />
              <button
                type="submit"
                disabled={subscribing}
                className="text-black text-xs font-bold uppercase tracking-widest py-2.5 hover:opacity-90 transition-opacity"
                style={{ background: siteConfig.brandGradient }}
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </button>
              {subscribeMsg && <p className="text-xs text-zinc-600 mt-1">{subscribeMsg}</p>}
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-200 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link href="/privacy-policy" className="text-zinc-500 text-xs hover:text-zinc-950 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-zinc-500 text-xs hover:text-zinc-950 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-zinc-500 text-xs hover:text-zinc-950 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
