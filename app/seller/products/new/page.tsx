import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import ProductForm from "@/app/admin/_components/ProductForm";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Add Product — Seller" };

export default async function SellerNewProductPage() {
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const [sellerDoc, categoriesRaw] = await Promise.all([
    User.findById(session.sub).select("assignedCategories").lean(),
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
  ]);

  const seller = sellerDoc as { assignedCategories?: string[] } | null;
  const assignedCategories: string[] = seller?.assignedCategories?.length
    ? seller.assignedCategories
    : [];

  const dbCategories = (categoriesRaw as Record<string, unknown>[])
    .map((c) => String(c.name || ""))
    .filter(Boolean);

  // If admin has assigned specific categories to this seller, restrict to those.
  // Otherwise fall back to all active DB categories + siteConfig categories.
  let finalCategoryOptions: string[];
  if (assignedCategories.length > 0) {
    finalCategoryOptions = assignedCategories;
  } else {
    finalCategoryOptions = Array.from(
      new Set(
        (dbCategories.length > 0 ? dbCategories : [...siteConfig.categories]).concat([
          ...siteConfig.categories,
        ])
      )
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-500 text-xs uppercase tracking-widest mb-3">
          <Link href="/seller/products" className="hover:text-slate-300 transition-colors">
            My products
          </Link>
          <span>/</span>
          <span className="text-slate-400">Add new</span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Add product</h1>
        <p className="text-slate-400 text-sm mt-1">
          Submit for admin approval — your product goes live after it is approved.
        </p>
      </div>

      <ProductForm
        mode="create"
        categoryOptions={finalCategoryOptions}
        showPublishField={false}
        afterSaveRedirect="/seller/products"
      />
    </div>
  );
}
