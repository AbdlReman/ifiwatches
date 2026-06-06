"use client";

import { useState } from "react";

interface SubCategoryItem {
  _id: string;
  name: string;
  category: string;
  isActive?: boolean;
}

export default function SubCategoryManager({
  initialItems,
  categoryOptions,
}: {
  initialItems: SubCategoryItem[];
  categoryOptions: string[];
}) {
  const [items, setItems] = useState<SubCategoryItem[]>(initialItems);
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0] || "");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<{ id: string; name: string; category: string } | null>(null);
  const [error, setError] = useState("");

  const refresh = async () => {
    const res = await fetch("/api/subcategories");
    const data = await res.json();
    setItems(data.subcategories || []);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !selectedCategory) return;
    setLoading(true);
    setError("");
    const res = await fetch("/api/subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), category: selectedCategory, isActive: true }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to create");
    } else {
      setName("");
    }
    await refresh();
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!editing) return;
    setLoading(true);
    setError("");
    const res = await fetch(`/api/subcategories/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editing.name.trim(), category: editing.category, isActive: true }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to update");
    } else {
      setEditing(null);
    }
    await refresh();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this sub category?")) return;
    setLoading(true);
    await fetch(`/api/subcategories/${id}`, { method: "DELETE" });
    await refresh();
    setLoading(false);
  };

  const selectClass =
    "bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500";
  const inputClass =
    "flex-1 bg-slate-900 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Sub Categories</h1>
        <p className="text-slate-400 text-sm mt-1">
          Create, edit, and delete sub categories. Each sub category belongs to a parent category.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col sm:flex-row gap-3"
      >
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
          className={selectClass}
        >
          <option value="">Select category...</option>
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Sub category name..."
          className={inputClass}
          required
        />
        <button
          disabled={loading || !selectedCategory}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
        >
          Add
        </button>
      </form>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {categoryOptions.length === 0 && (
        <div className="bg-amber-900/20 border border-amber-700 text-amber-300 rounded-lg px-4 py-3 text-sm">
          No categories found. Create categories first before adding sub categories.
        </div>
      )}

      <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-700/60 text-slate-400 text-xs uppercase tracking-widest">
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Sub Category Name</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {items.map((item) => (
              <tr key={item._id} className="hover:bg-slate-700/20">
                <td className="px-4 py-3">
                  {editing?.id === item._id ? (
                    <select
                      value={editing.category}
                      onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                      className="bg-slate-900 border border-slate-600 text-slate-100 rounded px-2 py-1 text-sm"
                    >
                      {categoryOptions.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-slate-400 text-xs font-medium uppercase tracking-wide">
                      {item.category}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {editing?.id === item._id ? (
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="bg-slate-900 border border-slate-600 text-slate-100 rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="text-slate-100">{item.name}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {editing?.id === item._id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          disabled={loading}
                          className="text-indigo-400 text-xs font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditing(null)}
                          className="text-slate-400 text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() =>
                            setEditing({ id: item._id, name: item.name, category: item.category })
                          }
                          className="text-indigo-400 text-xs font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="text-red-400 text-xs font-medium"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={3}>
                  No sub categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
