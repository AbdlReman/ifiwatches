import type { Metadata } from "next";
import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Brand from "@/models/Brand";
import Category from "@/models/Category";
import ProductForm from "@/app/admin/_components/ProductForm";

export const metadata: Metadata = { title: "Add Product — Seller" };

export default async function SellerNewProductPage() {
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const [brandsRaw, categoriesRaw] = await Promise.all([
    Brand.find({ isActive: true }).sort({ name: 1 }).lean(),
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
  ]);
  const brandOptions = (brandsRaw as Record<string, unknown>[]).map((b) => String(b.name || "")).filter(Boolean);
  const categoryOptions = (categoriesRaw as Record<string, unknown>[]).map((c) => String(c.name || "")).filter(Boolean);
  const finalBrandOptions = brandOptions.length > 0 ? brandOptions : ["PUMA"];
  const finalCategoryOptions = Array.from(
    new Set((categoryOptions.length > 0 ? categoryOptions : ["Running"]).concat(["Men", "Women"]))
  );

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
        <p className="text-slate-400 text-sm mt-1">Your listing will be tied to your seller account.</p>
      </div>

      <ProductForm
        mode="create"
        brandOptions={finalBrandOptions}
        categoryOptions={finalCategoryOptions}
        afterSaveRedirect="/seller/products"
      />
    </div>
  );
}
