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
  const [imgUploading, setImgUploading] = useState(false);
  const [vidUploading, setVidUploading] = useState(false);
  const [vidProgress, setVidProgress] = useState(0);
  const [error, setError] = useState("");
  const [vidError, setVidError] = useState("");
  const [success, setSuccess] = useState(false);
  const imgFileRef = useRef<HTMLInputElement>(null);
  const vidFileRef = useRef<HTMLInputElement>(null);

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
    setImgUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("folder", "homepage");
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setSaleImage(data.urls[0] ?? "");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Image upload failed");
    } finally {
      setImgUploading(false);
    }
  };

  // Uploads directly from browser → Cloudinary (bypasses Next.js body size limit)
  const uploadVideo = async (file: File) => {
    setVidUploading(true);
    setVidProgress(0);
    setVidError("");
    try {
      // 1. Get a signed upload credential from our server
      const sigRes = await fetch("/api/admin/homepage-content/upload-signature", {
        credentials: "include",
      });
      const sigData = await sigRes.json();
      if (!sigRes.ok) throw new Error(sigData.error || "Could not get upload credentials");

      const { signature, timestamp, folder, cloudName, apiKey } = sigData;

      // 2. Upload the file directly to Cloudinary
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
        body: JSON.stringify({ saleImage: img, videoUrl: vid }),
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
          Control the sale banner image and the autoplay video shown on the homepage.
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
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage(f); e.target.value = ""; }}
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

            {/* Video preview */}
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

            {/* Upload progress */}
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
            disabled={saving || imgUploading || vidUploading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </div>
  );
}
