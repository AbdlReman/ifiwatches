"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const inputCls =
  "w-full bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelCls = "block text-slate-400 text-xs font-semibold uppercase mb-1";

export default function HomePageContentClient() {
  const [saleImage, setSaleImage] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/homepage-content", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load");
        setSaleImage(data.content?.saleImage ?? "");
        setVideoUrl(data.content?.videoUrl ?? "");
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("folder", "homepage");
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSaleImage(data.urls[0] ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/admin/homepage-content", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saleImage, videoUrl }),
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

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-3">
          <Link href="/admin" className="hover:text-slate-300">
            Dashboard
          </Link>
          <span>/</span>
          <span className="text-slate-400">Home Page Content</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Home Page Content</h1>
        <p className="text-slate-400 text-sm mt-1">
          Control the sale banner image and the autoplay video shown on the homepage.
        </p>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
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
          {/* Sale Image */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Sale Banner Image</h2>
              <p className="text-slate-500 text-xs mt-1">
                Displayed in the sale banner section on the homepage.
              </p>
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
              ref={fileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadImage(file);
                e.target.value = "";
              }}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
            >
              {uploading ? "Uploading…" : saleImage ? "Replace Image" : "Upload Image"}
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

          {/* Video */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-300">Homepage Video</h2>
              <p className="text-slate-500 text-xs mt-1">
                Autoplays muted and looped below the Featured Drops section. Use a direct video URL (.mp4, .webm, etc.).
              </p>
            </div>

            <div>
              <label className={labelCls}>Video URL</label>
              <input
                className={inputCls}
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/…/video.mp4"
              />
            </div>

            {videoUrl && (
              <div className="rounded-lg overflow-hidden border border-slate-600 max-w-lg">
                <video
                  src={videoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || uploading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
