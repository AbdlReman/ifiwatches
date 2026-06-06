import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getNavCategories } from "@/lib/navCategories";
import SubCategory from "@/models/SubCategory";
import Product from "@/models/Product";
import { publishedProductFilter } from "@/lib/publishedProductFilter";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const [categories, allSubCatsRaw] = await Promise.all([
      getNavCategories(),
      SubCategory.find({ isActive: true }).sort({ category: 1, name: 1 }).lean(),
    ]);

    const allSubCats = allSubCatsRaw as Record<string, unknown>[];
    const subCategoriesByCategory: Record<string, string[]> = {};

    if (allSubCats.length > 0) {
      // Find which subcategory names are actually used in published products
      const allNames = allSubCats.map((sc) => String(sc.name || "")).filter(Boolean);
      const products = await Product.find({
        ...publishedProductFilter,
        subCategories: { $in: allNames },
      })
        .select("subCategories")
        .lean();

      const usedNames = new Set<string>();
      for (const p of products as Record<string, unknown>[]) {
        if (Array.isArray(p.subCategories)) {
          for (const sc of p.subCategories as string[]) {
            if (sc) usedNames.add(String(sc));
          }
        }
      }

      // Group used subcategories by parent category
      for (const sc of allSubCats) {
        const name = String(sc.name || "").trim();
        const category = String(sc.category || "").trim();
        if (!name || !category || !usedNames.has(name)) continue;
        if (!subCategoriesByCategory[category]) subCategoriesByCategory[category] = [];
        subCategoriesByCategory[category].push(name);
      }
    }

    return NextResponse.json({ categories, subCategoriesByCategory });
  } catch (error) {
    console.error("GET /api/navigation/collections error:", error);
    return NextResponse.json({ categories: [], subCategoriesByCategory: {} }, { status: 200 });
  }
}
