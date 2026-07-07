"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const inputCls =
  "w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelCls = "block text-slate-400 text-xs font-semibold uppercase mb-1";

type ShopHeroState = {
  image: string;
  heading: string;
  subheading: string;
};

const DEFAULT_SHOP_HERO: ShopHeroState = {
  image: "",
  heading: "IFI BEST PRODUCTS FROM BRANDS YOU LOVE",
  subheading: "",
};

type HeroState = {
  image: string;
  badgeText: string;
  heading: string;
  headingAccent: string;
  subheading: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  pillsRaw: string; // comma-separated
};

const DEFAULT_HERO: HeroState = {
  image: "",
  badgeText: "Multi-vendor marketplace",
  heading: "One Product.",
  headingAccent: "One Trusted Seller. Zero Confusion..",
  subheading:
    "IFI Lifestyle brings verified vendors together under one standard — premium watches, perfumes, eyewear, gadgets, and fashion with one seller per product.",
  primaryBtnText: "Explore marketplace",
  primaryBtnHref: "/shop",
  secondaryBtnText: "Become a seller",
  secondaryBtnHref: "/register",
  pillsRaw: "Verified vendors, One seller per SKU, Nationwide delivery",
};

const MAX_HERO_SLIDES = 4;

export default function HomePageContentClient() {
  const [saleImage, setSaleImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [heroImagesUploading, setHeroImagesUploading] = useState(false);
  const [mobileHeroImages, setMobileHeroImages] = useState<string[]>([]);
  const [mobileHeroImagesUploading, setMobileHeroImagesUploading] = useState(false);
  const [shopHero, setShopHero] = useState<ShopHeroState>(DEFAULT_SHOP_HERO);
  const [topbarText, setTopbarText] = useState("Free shipping on orders above Rs. 5,999 across Pakistan");
  const [topbarEnabled, setTopbarEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [shopHeroImgUploading, setShopHeroImgUploading] = useState(false);
  const [vidUploading, setVidUploading] = useState(false);
  const [vidProgress, setVidProgress] = useState(0);
  const [error, setError] = useState("");
  const [vidError, setVidError] = useState("");
  const [success, setSuccess] = useState(false);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const shopHeroImgFileRef = useRef<HTMLInputElement>(null);
  const heroSlideFileRef = useRef<HTMLInputElement>(null);
  const mobileHeroSlideFileRef = useRef<HTMLInputElement>(null);
  const vidFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/homepage-content", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setSaleImage(data.content?.saleImage ?? "");
        setVideoUrl(data.content?.videoUrl ?? "");
        setHeroImages(Array.isArray(data.content?.heroImages) ? data.content.heroImages.filter(Boolean) : []);
        setMobileHeroImages(Array.isArray(data.content?.mobileHeroImages) ? data.content.mobileHeroImages.filter(Boolean) : []);
        if (data.content?.topbarText) setTopbarText(data.content.topbarText);
        setTopbarEnabled(data.content?.topbarEnabled !== false);
        const sh = data.content?.shopHero ?? {};
        setShopHero({
          image: sh.image ?? "",
          heading: sh.heading ?? DEFAULT_SHOP_HERO.heading,
          subheading: sh.subheading ?? "",
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uploadHeroSlide = async (file: File) => {
    if (heroImages.length >= MAX_HERO_SLIDES) return;
    setHeroImagesUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("folder", "homepage/slides");
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setHeroImages((prev) => [...prev, data.urls[0]].filter(Boolean).slice(0, MAX_HERO_SLIDES));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setHeroImagesUploading(false);
    }
  };

  const uploadMobileHeroSlide = async (file: File) => {
    if (mobileHeroImages.length >= MAX_HERO_SLIDES) return;
    setMobileHeroImagesUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("folder", "homepage/mobile-slides");
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setMobileHeroImages((prev) => [...prev, data.urls[0]].filter(Boolean).slice(0, MAX_HERO_SLIDES));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setMobileHeroImagesUploading(false);
    }
  };

  const uploadImage = async (file: File, target: "sale" | "shopHero") => {
    if (target === "sale") setImgUploading(true);
    else setShopHeroImgUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("folder", "homepage");
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      if (target === "sale") setSaleImage(data.urls[0] ?? "");
      else setShopHero((prev) => ({ ...prev, image: data.urls[0] ?? "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      if (target === "sale") setImgUploading(false);
      else setShopHeroImgUploading(false);
    }
  };

  // Uploads directly from browser → Cloudinary (bypasses Next.js body size limit)
  const uploadVideo = async (file: File) => {
    setVidUploading(true);
    setVidProgress(0);
    setVidError("");
    try {
      const sigRes = await fetch("/api/admin/homepage-content/upload-signature", {
        credentials: "include",
      });
      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error || "Could not get upload credentials");

      const { signature, timestamp, folder, cloudName, apiKey } = sigData;

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", apiKey);
      form.append("timestamp", String(timestamp));
      form.append("signature", signature);
      form.append("folder", folder);

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setVidProgress(Math.round((e.loaded / e.total) * 100));
          }
        };

        xhr.onload = () => {
          try {
            const data = JSON.parse(xhr.responseText);
            if (xhr.status >= 200 && xhr.status < 300) {
              setVideoUrl(data.secure_url ?? "");
              resolve();
            } else {
              reject(new Error(data.error?.message || "Cloudinary upload failed"));
            }
          } catch {
            reject(new Error("Invalid response from Cloudinary"));
          }
        };

        xhr.onerror = () => reject(new Error("Network error — check your connection"));
        xhr.send(form);
      });
    } catch (e) {
      setVidError(e instanceof Error ? e.message : "Video upload failed");
    } finally {
      setVidUploading(false);
      setVidProgress(0);
    }
  };

  const deleteVideo = async () => {
    if (!window.confirm("Remove the homepage video?")) return;
    setVideoUrl("");
    await saveContent(saleImage, "");
  };

  const saveContent = async (img: string, vid: string) => {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/homepage-content", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleImage: img,
          videoUrl: vid,
          heroImages,
          mobileHeroImages,
          shopHero: {
            image: shopHero.image,
            heading: shopHero.heading,
            subheading: shopHero.subheading,
          },
          topbarText,
          topbarEnabled,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await saveContent(saleImage, videoUrl);
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-3">
          <Link href="/admin" className="hover:text-slate-300">Dashboard</Link>
          <span>/</span>
          <span className="text-slate-400">Home Page Content</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Home Page Content</h1>
        <p className="text-slate-400 text-sm mt-1">
          Control the hero section, sale banner image, and the autoplay video shown on the homepage.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}
      {success && (
        <div className="bg-green-900/30 border border-green-700 text-green-300 text-sm px-4 py-3 rounded-lg">
          Saved successfully.
        </div>
      )}

      {loading ? (
        <p className="text-slate-500 text-sm">Loading…</p>
      ) : (
        <form onSubmit={save} className="space-y-6">

          {/* ── Top Promo Bar ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Top Promo Bar</h2>
                <p className="text-slate-500 text-xs mt-1">The announcement bar shown at the very top of every page.</p>
              </div>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <span className="text-xs font-semibold text-slate-400">{topbarEnabled ? "Visible" : "Hidden"}</span>
                <button
                  type="button"
                  onClick={() => setTopbarEnabled((v) => !v)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${topbarEnabled ? "bg-indigo-500" : "bg-slate-600"}`}
                  aria-pressed={topbarEnabled}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${topbarEnabled ? "translate-x-6" : "translate-x-1"}`} />
                </button>
              </label>
            </div>
            <div>
              <label className={labelCls}>Promo Text</label>
              <input
                type="text"
                className={inputCls}
                value={topbarText}
                onChange={(e) => setTopbarText(e.target.value)}
                placeholder="Free shipping on orders above Rs. 5,999 across Pakistan"
                maxLength={160}
              />
              <p className="text-[11px] text-slate-500 mt-1">{topbarText.length}/160 characters</p>
            </div>
          </div>

          {/* ── Hero Slider Images ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Hero Slider Images</h2>
              <p className="text-slate-500 text-xs mt-1">
                Upload 1–4 full-screen images for the homepage hero slider. These replace the single hero image below.
              </p>
            </div>

            {/* Slide previews */}
            {heroImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {heroImages.map((url, idx) => (
                  <div key={url} className="relative group rounded-lg overflow-hidden border border-slate-600 aspect-video">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => setHeroImages((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; })}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2 py-1 rounded"
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setHeroImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                      {idx < heroImages.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setHeroImages((prev) => { const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; })}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2 py-1 rounded"
                        >
                          →
                        </button>
                      )}
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={heroSlideFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadHeroSlide(f); e.target.value = ""; }}
              disabled={heroImagesUploading || heroImages.length >= MAX_HERO_SLIDES}
            />
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => heroSlideFileRef.current?.click()}
                disabled={heroImagesUploading || heroImages.length >= MAX_HERO_SLIDES}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                {heroImagesUploading ? "Uploading…" : `Add Slide (${heroImages.length}/${MAX_HERO_SLIDES})`}
              </button>
              {heroImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => { if (window.confirm("Remove all hero slides?")) setHeroImages([]); }}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold underline"
                >
                  Clear all slides
                </button>
              )}
            </div>
            <p className="text-slate-500 text-xs">
              Tip: hover over a slide to reorder or remove it. Slides auto-advance every 5 seconds on the homepage.
            </p>
          </div>

          {/* ── Mobile Hero Slider Images ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Mobile Hero Slider Images</h2>
              <p className="text-slate-500 text-xs mt-1">
                Upload 1–4 portrait/square images optimised for phones. These replace the desktop slides on screens narrower than 640 px.
                Leave empty to reuse the desktop slides on mobile.
              </p>
            </div>

            {/* Mobile slide previews */}
            {mobileHeroImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mobileHeroImages.map((url, idx) => (
                  <div key={url} className="relative group rounded-lg overflow-hidden border border-slate-600 aspect-[9/16]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Mobile slide ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => setMobileHeroImages((prev) => { const a = [...prev]; [a[idx - 1], a[idx]] = [a[idx], a[idx - 1]]; return a; })}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2 py-1 rounded"
                        >
                          ←
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setMobileHeroImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                      {idx < mobileHeroImages.length - 1 && (
                        <button
                          type="button"
                          onClick={() => setMobileHeroImages((prev) => { const a = [...prev]; [a[idx], a[idx + 1]] = [a[idx + 1], a[idx]]; return a; })}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-2 py-1 rounded"
                        >
                          →
                        </button>
                      )}
                    </div>
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <input
              ref={mobileHeroSlideFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadMobileHeroSlide(f); e.target.value = ""; }}
              disabled={mobileHeroImagesUploading || mobileHeroImages.length >= MAX_HERO_SLIDES}
            />
            <div className="flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => mobileHeroSlideFileRef.current?.click()}
                disabled={mobileHeroImagesUploading || mobileHeroImages.length >= MAX_HERO_SLIDES}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-40 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                {mobileHeroImagesUploading ? "Uploading…" : `Add Mobile Slide (${mobileHeroImages.length}/${MAX_HERO_SLIDES})`}
              </button>
              {mobileHeroImages.length > 0 && (
                <button
                  type="button"
                  onClick={() => { if (window.confirm("Remove all mobile hero slides?")) setMobileHeroImages([]); }}
                  className="text-red-400 hover:text-red-300 text-xs font-semibold underline"
                >
                  Clear all mobile slides
                </button>
              )}
            </div>
            <p className="text-slate-500 text-xs">
              Tip: use portrait (9:16) or square images for best results on phones. Hover a slide to reorder or remove it.
            </p>
          </div>

          {/* ── Shop Page Hero ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Shop Page Hero</h2>
              <p className="text-slate-500 text-xs mt-1">
                The banner shown at the top of the Shop page (not shown when a category is selected).
              </p>
            </div>

            {/* Shop hero background image */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Background Image</h3>
              {shopHero.image && (
                <div className="relative group w-full max-w-lg overflow-hidden rounded-lg border border-slate-600 aspect-[16/7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={shopHero.image} alt="Shop hero preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setShopHero((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                ref={shopHeroImgFileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f, "shopHero"); e.target.value = ""; }}
                disabled={shopHeroImgUploading}
              />
              <button
                type="button"
                onClick={() => shopHeroImgFileRef.current?.click()}
                disabled={shopHeroImgUploading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                {shopHeroImgUploading ? "Uploading…" : shopHero.image ? "Replace Image" : "Upload Image"}
              </button>
              <div>
                <label className={labelCls}>Or paste image URL</label>
                <input
                  className={inputCls}
                  type="url"
                  value={shopHero.image}
                  onChange={(e) => setShopHero((prev) => ({ ...prev, image: e.target.value }))}
                  placeholder="https://res.cloudinary.com/… (leave blank to use default)"
                />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-5 grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Heading</label>
                <input
                  className={inputCls}
                  type="text"
                  value={shopHero.heading}
                  onChange={(e) => setShopHero((prev) => ({ ...prev, heading: e.target.value }))}
                  placeholder="IFI BEST PRODUCTS FROM BRANDS YOU LOVE"
                />
              </div>
              <div>
                <label className={labelCls}>Subheading (optional)</label>
                <input
                  className={inputCls}
                  type="text"
                  value={shopHero.subheading}
                  onChange={(e) => setShopHero((prev) => ({ ...prev, subheading: e.target.value }))}
                  placeholder="Discover premium products from verified sellers across Pakistan"
                />
              </div>
            </div>
          </div>

          {/* ── Sale Image ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Sale Banner Image</h2>
              <p className="text-slate-500 text-xs mt-1">Displayed in the sale banner section on the homepage.</p>
            </div>

            {saleImage && (
              <div className="relative group w-full max-w-lg overflow-hidden rounded-lg border border-slate-600 aspect-[16/7]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={saleImage} alt="Sale banner preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setSaleImage("")}
                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              ref={imgFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) void uploadImage(f, "sale"); e.target.value = ""; }}
              disabled={imgUploading}
            />
            <button
              type="button"
              onClick={() => imgFileRef.current?.click()}
              disabled={imgUploading}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              {imgUploading ? "Uploading…" : saleImage ? "Replace Image" : "Upload Image"}
            </button>

            <div>
              <label className={labelCls}>Or paste image URL</label>
              <input
                className={inputCls}
                type="url"
                value={saleImage}
                onChange={(e) => setSaleImage(e.target.value)}
                placeholder="https://res.cloudinary.com/…"
              />
            </div>
          </div>

          {/* ── Homepage Video ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Homepage Video</h2>
              <p className="text-slate-500 text-xs mt-1">
                Autoplays muted and looped below the Featured Drops section.
              </p>
            </div>

            {vidError && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 text-xs px-3 py-2 rounded-lg">
                {vidError}
              </div>
            )}

            {videoUrl && !vidUploading && (
              <div className="relative group rounded-lg overflow-hidden border border-slate-600 max-w-lg">
                <video
                  key={videoUrl}
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full block"
                />
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    type="button"
                    onClick={() => vidFileRef.current?.click()}
                    className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold px-3 py-1 rounded-md"
                  >
                    Replace
                  </button>
                  <button
                    type="button"
                    onClick={deleteVideo}
                    disabled={saving}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {vidUploading && (
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center justify-between">
                  <p className="text-slate-300 text-xs font-medium">
                    {vidProgress < 100
                      ? `Uploading to Cloudinary… ${vidProgress}%`
                      : "Upload complete ✓"}
                  </p>
                  <span className="text-slate-400 text-xs">{vidProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500 transition-all duration-150"
                    style={{ width: `${vidProgress}%` }}
                  />
                </div>
              </div>
            )}

            <input
              ref={vidFileRef}
              type="file"
              accept="video/*"
              className="sr-only"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadVideo(f); e.target.value = ""; }}
              disabled={vidUploading}
            />

            {!videoUrl && (
              <button
                type="button"
                onClick={() => vidFileRef.current?.click()}
                disabled={vidUploading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                {vidUploading ? `Uploading… ${vidProgress}%` : "Upload Video"}
              </button>
            )}

            <div>
              <label className={labelCls}>Or paste video URL</label>
              <input
                className={inputCls}
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/…/video.mp4"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || imgUploading || heroImagesUploading || mobileHeroImagesUploading || shopHeroImgUploading || vidUploading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
