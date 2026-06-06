import type { Metadata } from "next";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import ProductTable from "../_components/ProductTable";
import type { IProduct } from "@/types/product";

export const metadata: Metadata = { title: "Products — Admin" };
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  await connectDB();
  const [raw, pendingCount] = await Promise.all([
    Product.find({}).sort({ createdAt: -1 }).lean(),
    Product.countDocuments({ sellerId: { $ne: null }, approvalStatus: "pending" }),
  ]);

  const sellerIds = [
    ...new Set(
      (raw as Record<string, unknown>[])
        .map((p) => (p.sellerId ? String(p.sellerId) : ""))
        .filter(Boolean)
    ),
  ];
  const sellers = sellerIds.length
    ? await User.find({ _id: { $in: sellerIds } })
        .select("name")
        .lean()
    : [];
  const sellerNameById = new Map(
    sellers.map((s) => {
      const u = s as { _id: unknown; name?: string };
      return [String(u._id), String(u.name || "Seller")];
    })
  );

  const products: IProduct[] = (raw as Record<string, unknown>[]).map((p) => ({
    _id: String(p._id),
    sellerId: p.sellerId ? String(p.sellerId) : undefined,
    sellerName: p.sellerId ? sellerNameById.get(String(p.sellerId)) : undefined,
    name: String(p.name),
    brand: String(p.brand || ""),
    category: String(p.category || ""),
    categories: Array.isArray(p.categories)
      ? (p.categories as unknown[]).map(String).map((v) => v.trim()).filter(Boolean)
      : [String(p.category || "").trim()].filter(Boolean),
    subCategories: Array.isArray(p.subCategories) ? (p.subCategories as string[]) : [],
    price: Number(p.price),
    description: String(p.description || ""),
    detail: String(p.detail || ""),
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]) : [],
    colors: Array.isArray(p.colors) ? (p.colors as string[]) : [],
    colorVariants: Array.isArray(p.colorVariants)
      ? (p.colorVariants as { color: string; images: string[] }[])
      : [],
    stockQuantity: Number(p.stockQuantity || 0),
    images: (p.images as string[]) || [],
    discount: Number(p.discount || 0),
    inStock: Boolean(p.inStock),
    isActive: p.isActive !== false,
    isFeatured: Boolean(p.isFeatured),
    isBestSeller: Boolean(p.isBestSeller),
    approvalStatus: (p.approvalStatus as IProduct["approvalStatus"]) || (p.sellerId ? "pending" : "approved"),
    status:
      p.status === "Published" || (p.status == null && p.isActive !== false)
        ? "Published"
        : "Draft",
    popularityScore: Number(p.popularityScore || 0),
    soldCount: Number(p.soldCount || 0),
    slug: String(p.slug || ""),
    metaTitle: String(p.metaTitle || ""),
    metaDescription: String(p.metaDescription || ""),
    createdAt: String(p.createdAt),
    updatedAt: String(p.updatedAt),
  }));

  const inStockCount = products.filter((p) => p.stockQuantity > 0).length;

  return (
    <div>
      {pendingCount > 0 ? (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-500/40 bg-amber-950/40 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-amber-200">
              {pendingCount} seller listing{pendingCount === 1 ? "" : "s"} awaiting approval
            </p>
            <p className="text-xs text-amber-200/70 mt-0.5">Review and publish vendor products from approvals.</p>
          </div>
          <Link
            href="/admin/approvals"
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-950 hover:bg-amber-400"
          >
            Review now
          </Link>
        </div>
      ) : null}

      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Products</h1>
          <p className="text-slate-400 text-sm mt-1">
            {products.length} total · {inStockCount} in stock
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex-shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Products", value: products.length, color: "text-white" },
          { label: "In Stock", value: inStockCount, color: "text-green-400" },
          { label: "Out of Stock", value: products.length - inStockCount, color: "text-red-400" },
          {
            label: "Avg. Discount",
            value:
              products.length > 0
                ? Math.round(products.reduce((sum, p) => sum + p.discount, 0) / products.length) + "%"
                : "0%",
            color: "text-indigo-400",
          },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-slate-800 rounded-xl border border-slate-700 px-5 py-4">
            <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">{label}</p>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      <ProductTable products={products} showFeaturedColumn showBestSellerColumn showSellerColumn showApprovalStatus />
    </div>
  );
}
