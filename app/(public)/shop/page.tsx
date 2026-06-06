import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import Product from "@/models/Product";
import SubCategory from "@/models/SubCategory";
import type { IProduct } from "@/types/product";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  await connectDB();
  const [raw, subCatsRaw] = await Promise.all([
    Product.find({
      isActive: true,
      $or: [{ status: "Published" }, { status: { $exists: false } }],
    })
      .sort({ createdAt: -1 })
      .lean(),
    SubCategory.find({ isActive: true }).sort({ category: 1, name: 1 }).lean(),
  ]);

  const products: IProduct[] = (raw as Record<string, unknown>[]).map(serializeProductFromLean);

  // Only surface subcategories that actually appear in at least one published product
  const usedSubCats = new Set<string>();
  for (const p of products) {
    if (Array.isArray(p.subCategories)) {
      for (const sc of p.subCategories) {
        if (sc) usedSubCats.add(String(sc));
      }
    }
  }

  const subCategoriesByCategory: Record<string, string[]> = {};
  for (const sc of subCatsRaw as Record<string, unknown>[]) {
    const name = String(sc.name || "").trim();
    const category = String(sc.category || "").trim();
    if (!name || !category || !usedSubCats.has(name)) continue;
    if (!subCategoriesByCategory[category]) subCategoriesByCategory[category] = [];
    subCategoriesByCategory[category].push(name);
  }

  return <ShopClient products={products} subCategoriesByCategory={subCategoriesByCategory} />;
}
