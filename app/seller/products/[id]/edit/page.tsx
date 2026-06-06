import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import ProductForm from "@/app/admin/_components/ProductForm";
import type { IProduct } from "@/types/product";
import { sellerOwnsProduct } from "@/lib/productAccess";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Edit Product — Seller" };

export default async function SellerEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const [raw, categoriesRaw, subCategoriesRaw, sellerDoc] = await Promise.all([
    Product.findById(id).lean(),
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    SubCategory.find({ isActive: true }).sort({ category: 1, name: 1 }).lean(),
    User.findById(session.sub).select("assignedCategories").lean(),
  ]);
  if (!raw) notFound();
  if (!sellerOwnsProduct(session, raw as { sellerId?: unknown })) notFound();

  const seller = sellerDoc as { assignedCategories?: string[] } | null;
  const assignedCategories: string[] = seller?.assignedCategories?.length
    ? seller.assignedCategories
    : [];

  const dbCategories = (categoriesRaw as Record<string, unknown>[])
    .map((c) => String(c.name || ""))
    .filter(Boolean);

  const currentProductCategory = String((raw as Record<string, unknown>).category || "").trim();

  const subCategoryOptions = (subCategoriesRaw as Record<string, unknown>[]).map((sc) => ({
    name: String(sc.name || ""),
    category: String(sc.category || ""),
  }));

  let finalCategoryOptions: string[];
  if (assignedCategories.length > 0) {
    // Always include the product's current category so it doesn't disappear
    finalCategoryOptions = Array.from(
      new Set([...assignedCategories, ...(currentProductCategory ? [currentProductCategory] : [])])
    );
  } else {
    finalCategoryOptions = Array.from(
      new Set(
        (dbCategories.length > 0 ? dbCategories : [...siteConfig.categories])
          .concat([...siteConfig.categories])
          .concat(currentProductCategory ? [currentProductCategory] : [])
      )
    );
  }

  const p = raw as Record<string, unknown>;
  const categories = Array.isArray(p.categories)
    ? (p.categories as unknown[]).map(String).map((v) => v.trim()).filter(Boolean)
    : [];
  const mergedCategories = categories.length > 0 ? categories : [String(p.category || "").trim()].filter(Boolean);
  const product: IProduct = {
    _id: String(p._id),
    sellerId: p.sellerId ? String(p.sellerId) : undefined,
    name: String(p.name),
    brand: String(p.brand || ""),
    category: String(p.category || ""),
    categories: mergedCategories,
    subCategories: Array.isArray(p.subCategories) ? (p.subCategories as string[]) : [],
    price: Number(p.price),
    description: String(p.description || ""),
    detail: String(p.detail || ""),
    sizes: Array.isArray(p.sizes) ? (p.sizes as string[]) : [],
    colors: Array.isArray(p.colors) ? (p.colors as string[]) : [],
    colorVariants: Array.isArray(p.colorVariants)
      ? (p.colorVariants as Record<string, unknown>[]).map((v) => ({
          color: String(v.color ?? "").trim(),
          images: Array.isArray(v.images) ? (v.images as unknown[]).map((u) => String(u)).filter(Boolean) : [],
        }))
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
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-3">
          <Link href="/seller/products" className="hover:text-slate-300 transition-colors">
            My products
          </Link>
          <span>/</span>
          <span className="text-slate-400 truncate max-w-[200px]">{product.name}</span>
          <span>/</span>
          <span className="text-slate-400">Edit</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Edit product</h1>
        <p className="text-slate-400 text-sm mt-1 truncate">{product.name}</p>
      </div>

      <ProductForm
        mode="edit"
        initialData={product}
        categoryOptions={finalCategoryOptions}
        subCategoryOptions={subCategoryOptions}
        showPublishField={false}
        afterSaveRedirect="/seller/products"
      />
    </div>
  );
}
