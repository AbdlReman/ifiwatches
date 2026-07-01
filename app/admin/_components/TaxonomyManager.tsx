"use client";

import { useRef, useState } from "react";

interface Item {
  _id: string;
  name: string;
  isActive?: boolean;
  image?: string;
}

export default function TaxonomyManager({
  title,
  apiBase,
  initialItems,
  imageEnabled = false,
}: {
  title: string;
  apiBase: "/api/categories";
  initialItems: Item[];
  imageEnabled?: boolean;
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [name, setName] = useState("");
  const [createImage, setCreateImage] = useState("");
  const [createUploading, setCreateUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; image: string } | null>(null);
  const [editUploading, setEditUploading] = useState(false);

  const createImgRef = useRef<HTMLInputElement>(null);
  const editImgRef = useRef<HTMLInputElement>(null);

  const refresh = async () => {
    const res = await fetch(apiBase);
    const data = await res.json();
    setItems(data.categories || []);
  };

  const uploadImage = async (
    file: File,
    onDone: (url: string) => void,
    setUploading: (v: boolean) => void
  ) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append("images", file);
      form.append("folder", "categories");
      const res = await fetch("/api/upload", { method: "POST", body: form, credentials: "include" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      onDone(data.urls?.[0] ?? "");
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    await fetch(apiBase, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), isActive: true, image: createImage }),
    });
    setName("");
    setCreateImage("");
    await refresh();
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    await fetch(`${apiBase}/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name.trim(), isActive: true, image: editing.image }),
    });
    setEditing(null);
    await refresh();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item?")) return;
    setLoading(true);
    await fetch(`${apiBase}/${id}`, { method: "DELETE" });
    await refresh();
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">{title}</h1>
        <p className="text-slate-400 text-sm mt-1">Create, edit, and delete {title.toLowerCase()}.</p>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-slate-800 border border-slate-700 rounded-xl p-5 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={`Add new ${title.slice(0, -1)}...`}
            className="flex-1 bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 text-sm"
            required
          />
          <button disabled={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
            Add
          </button>
        </div>

        {imageEnabled && (
          <div className="flex flex-col gap-2">
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest">Image (optional)</p>
            <div className="flex items-center gap-3 flex-wrap">
              {/* Hidden file input */}
              <input
                ref={createImgRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadImage(f, setCreateImage, setCreateUploading);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => createImgRef.current?.click()}
                disabled={createUploading}
                className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors"
              >
                {createUploading ? "Uploading…" : createImage ? "Replace Image" : "Upload Image"}
              </button>
              <input
                type="url"
                value={createImage}
                onChange={(e) => setCreateImage(e.target.value)}
                placeholder="or paste image URL"
                className="flex-1 min-w-0 bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2 text-xs placeholder-slate-500"
              />
            </div>
            {createImage && (
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={createImage} alt="preview" className="h-12 w-12 rounded object-cover border border-slate-600" />
                <button
                  type="button"
                  onClick={() => setCreateImage("")}
                  className="text-red-400 hover:text-red-300 text-xs underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        )}
      </form>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-700/60 text-slate-400 text-xs uppercase tracking-widest">
              {imageEnabled && <th className="text-left px-4 py-3 w-16">Image</th>}
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-700/20 align-top">
                {imageEnabled && (
                  <td className="px-4 py-3">
                    {editing?.id === item._id ? null : item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-10 w-10 rounded object-cover border border-slate-600"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded border border-slate-700 bg-slate-900 flex items-center justify-center">
                        <span className="text-slate-600 text-[10px]">None</span>
                      </div>
                    )}
                  </td>
                )}
                <td className="px-4 py-3">
                  {editing?.id === item._id ? (
                    <div className="space-y-2">
                      <input
                        value={editing.name}
                        onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                        className="bg-slate-900 border border-slate-600 text-slate-100 rounded px-2 py-1 text-sm w-full"
                      />
                      {imageEnabled && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <input
                              ref={editImgRef}
                              type="file"
                              accept="image/*"
                              className="sr-only"
                              onChange={(e) => {
                                const f = e.target.files?.[0];
                                if (f) uploadImage(f, (url) => setEditing((prev) => prev ? { ...prev, image: url } : prev), setEditUploading);
                                e.target.value = "";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => editImgRef.current?.click()}
                              disabled={editUploading}
                              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                            >
                              {editUploading ? "Uploading…" : editing.image ? "Replace" : "Upload Image"}
                            </button>
                            <input
                              type="url"
                              value={editing.image}
                              onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                              placeholder="or paste image URL"
                              className="flex-1 min-w-0 bg-slate-900 border border-slate-600 text-slate-100 rounded px-2 py-1.5 text-xs placeholder-slate-500"
                            />
                          </div>
                          {editing.image && (
                            <div className="flex items-center gap-2">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={editing.image} alt="preview" className="h-10 w-10 rounded object-cover border border-slate-600" />
                              <button
                                type="button"
                                onClick={() => setEditing({ ...editing, image: "" })}
                                className="text-red-400 hover:text-red-300 text-xs underline"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-100">{item.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {editing?.id === item._id ? (
                      <>
                        <button onClick={handleSaveEdit} disabled={loading} className="text-indigo-400 text-xs font-medium">Save</button>
                        <button onClick={() => setEditing(null)} className="text-slate-400 text-xs font-medium">Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditing({ id: item._id, name: item.name, image: item.image ?? "" })}
                          className="text-indigo-400 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button onClick={() => handleDelete(item._id)} className="text-red-400 text-xs font-medium">Delete</button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={imageEnabled ? 3 : 2}>No items yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
