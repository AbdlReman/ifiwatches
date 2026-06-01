import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductTable from "@/app/admin/_components/ProductTable";
import type { IProduct } from "@/types/product";

export const metadata: Metadata = { title: "My Products — Seller" };
export const dynamic = "force-dynamic";

export default async function SellerProductsPage() {
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const raw = await Product.find({ sellerId: session.sub }).sort({ createdAt: -1 }).lean();

  const products: IProduct[] = (raw as Record<string, unknown>[]).map((p) => ({
    _id: String(p._id),
    sellerId: p.sellerId ? String(p.sellerId) : undefined,
    name: String(p.name),
    brand: String(p.brand || ""),
    category: String(p.category || ""),
    categories: Array.isArray(p.categories)
      ? (p.categories as unknown[]).map(String).map((v) => v.trim()).filter(Boolean)
      : [String(p.category || "").trim()].filter(Boolean),
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
    approvalStatus: (p.approvalStatus as IProduct["approvalStatus"]) || "pending",
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
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">My products</h1>
          <p className="text-slate-400 text-sm mt-1">
            {products.length} listings · {inStockCount} in stock
          </p>
        </div>
        <Link
          href="/seller/products/new"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex-shrink-0"
        >
          Add product
        </Link>
      </div>

      <ProductTable
        products={products}
        productsBasePath="/seller/products"
        showPublishAllDrafts={false}
        useStorefrontProductLink
        showApprovalStatus
      />
    </div>
  );
}
