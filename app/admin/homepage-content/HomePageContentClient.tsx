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

export default function HomePageContentClient() {
  const [saleImage, setSaleImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [hero, setHero] = useState<HeroState>(DEFAULT_HERO);
  const [shopHero, setShopHero] = useState<ShopHeroState>(DEFAULT_SHOP_HERO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgUploading, setImgUploading] = useState(false);
  const [heroImgUploading, setHeroImgUploading] = useState(false);
  const [shopHeroImgUploading, setShopHeroImgUploading] = useState(false);
  const [vidUploading, setVidUploading] = useState(false);
  const [vidProgress, setVidProgress] = useState(0);
  const [error, setError] = useState("");
  const [vidError, setVidError] = useState("");
  const [success, setSuccess] = useState(false);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const heroImgFileRef = useRef<HTMLInputElement>(null);
  const shopHeroImgFileRef = useRef<HTMLInputElement>(null);
  const vidFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/homepage-content", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setSaleImage(data.content?.saleImage ?? "");
        setVideoUrl(data.content?.videoUrl ?? "");
        const sh = data.content?.shopHero ?? {};
        setShopHero({
          image: sh.image ?? "",
          heading: sh.heading ?? DEFAULT_SHOP_HERO.heading,
          subheading: sh.subheading ?? "",
        });
        const h = data.content?.hero ?? {};
        setHero({
          image: h.image ?? "",
          badgeText: h.badgeText ?? DEFAULT_HERO.badgeText,
          heading: h.heading ?? DEFAULT_HERO.heading,
          headingAccent: h.headingAccent ?? DEFAULT_HERO.headingAccent,
          subheading: h.subheading ?? DEFAULT_HERO.subheading,
          primaryBtnText: h.primaryBtnText ?? DEFAULT_HERO.primaryBtnText,
          primaryBtnHref: h.primaryBtnHref ?? DEFAULT_HERO.primaryBtnHref,
          secondaryBtnText: h.secondaryBtnText ?? DEFAULT_HERO.secondaryBtnText,
          secondaryBtnHref: h.secondaryBtnHref ?? DEFAULT_HERO.secondaryBtnHref,
          pillsRaw: Array.isArray(h.pills) && h.pills.length > 0
            ? h.pills.join(", ")
            : DEFAULT_HERO.pillsRaw,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uploadImage = async (file: File, target: "sale" | "hero" | "shopHero") => {
    if (target === "sale") setImgUploading(true);
    else if (target === "hero") setHeroImgUploading(true);
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
      else if (target === "hero") setHero((prev) => ({ ...prev, image: data.urls[0] ?? "" }));
      else setShopHero((prev) => ({ ...prev, image: data.urls[0] ?? "" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      if (target === "sale") setImgUploading(false);
      else if (target === "hero") setHeroImgUploading(false);
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
      const pills = hero.pillsRaw
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/homepage-content", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          saleImage: img,
          videoUrl: vid,
          hero: {
            image: hero.image,
            badgeText: hero.badgeText,
            heading: hero.heading,
            headingAccent: hero.headingAccent,
            subheading: hero.subheading,
            primaryBtnText: hero.primaryBtnText,
            primaryBtnHref: hero.primaryBtnHref,
            secondaryBtnText: hero.secondaryBtnText,
            secondaryBtnHref: hero.secondaryBtnHref,
            pills,
          },
          shopHero: {
            image: shopHero.image,
            heading: shopHero.heading,
            subheading: shopHero.subheading,
          },
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

  const setHeroField = (field: keyof HeroState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setHero((prev) => ({ ...prev, [field]: e.target.value }));

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

          {/* ── Hero Section ── */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-5">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Hero Section</h2>
              <p className="text-slate-500 text-xs mt-1">The full-screen banner at the top of the homepage.</p>
            </div>

            {/* Hero background image */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-400">Background Image</h3>
              {hero.image && (
                <div className="relative group w-full max-w-lg overflow-hidden rounded-lg border border-slate-600 aspect-[16/7]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={hero.image} alt="Hero preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setHero((prev) => ({ ...prev, image: "" }))}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Remove
                  </button>
                </div>
              )}
              <input
                ref={heroImgFileRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "hero"); e.target.value = ""; }}
                disabled={heroImgUploading}
              />
              <button
                type="button"
                onClick={() => heroImgFileRef.current?.click()}
                disabled={heroImgUploading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                {heroImgUploading ? "Uploading…" : hero.image ? "Replace Image" : "Upload Image"}
              </button>
              <div>
                <label className={labelCls}>Or paste image URL</label>
                <input
                  className={inputCls}
                  type="url"
                  value={hero.image}
                  onChange={setHeroField("image")}
                  placeholder="https://res.cloudinary.com/… (leave blank to use default)"
                />
              </div>
            </div>

            <div className="border-t border-slate-700 pt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Badge text */}
              <div>
                <label className={labelCls}>Badge Text</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.badgeText}
                  onChange={setHeroField("badgeText")}
                  placeholder="Multi-vendor marketplace"
                />
              </div>

              {/* Heading line 1 */}
              <div>
                <label className={labelCls}>Heading</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.heading}
                  onChange={setHeroField("heading")}
                  placeholder="One Product."
                />
              </div>

              {/* Heading accent (colored line) */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Heading Accent (colored line)</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.headingAccent}
                  onChange={setHeroField("headingAccent")}
                  placeholder="One Trusted Seller. Zero Confusion.."
                />
              </div>

              {/* Subheading */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Subheading Paragraph</label>
                <textarea
                  className={inputCls + " resize-none"}
                  rows={3}
                  value={hero.subheading}
                  onChange={setHeroField("subheading")}
                  placeholder="IFI Lifestyle brings verified vendors…"
                />
              </div>

              {/* Primary button */}
              <div>
                <label className={labelCls}>Primary Button Text</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.primaryBtnText}
                  onChange={setHeroField("primaryBtnText")}
                  placeholder="Explore marketplace"
                />
              </div>
              <div>
                <label className={labelCls}>Primary Button Link</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.primaryBtnHref}
                  onChange={setHeroField("primaryBtnHref")}
                  placeholder="/shop"
                />
              </div>

              {/* Secondary button */}
              <div>
                <label className={labelCls}>Secondary Button Text</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.secondaryBtnText}
                  onChange={setHeroField("secondaryBtnText")}
                  placeholder="Become a seller"
                />
              </div>
              <div>
                <label className={labelCls}>Secondary Button Link</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.secondaryBtnHref}
                  onChange={setHeroField("secondaryBtnHref")}
                  placeholder="/register"
                />
              </div>

              {/* Pills */}
              <div className="sm:col-span-2">
                <label className={labelCls}>Trust Pills (comma-separated)</label>
                <input
                  className={inputCls}
                  type="text"
                  value={hero.pillsRaw}
                  onChange={setHeroField("pillsRaw")}
                  placeholder="Verified vendors, One seller per SKU, Nationwide delivery"
                />
                <p className="text-slate-500 text-xs mt-1">Separate each pill with a comma.</p>
              </div>
            </div>
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
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "shopHero"); e.target.value = ""; }}
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
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f, "sale"); e.target.value = ""; }}
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
            disabled={saving || imgUploading || heroImgUploading || shopHeroImgUploading || vidUploading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
