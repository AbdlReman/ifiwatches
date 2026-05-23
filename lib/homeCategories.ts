import Category from "@/models/Category";
import Product from "@/models/Product";
import { siteConfig } from "@/lib/siteConfig";
import { publishedProductFilter } from "@/lib/publishedProductFilter";

export type HomeCategory = {
  name: string;
  productCount: number;
};

function categoryNamesFromProducts(raw: Record<string, unknown>[]): string[] {
  const set = new Set<string>();
  for (const p of raw) {
    const primary = String(p.category || "").trim();
    if (primary) set.add(primary);
    if (Array.isArray(p.categories)) {
      for (const c of p.categories) {
        const v = String(c || "").trim();
        if (v) set.add(v);
      }
    }
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

async function countProductsInCategory(name: string): Promise<number> {
  return Product.countDocuments({
    ...publishedProductFilter,
    $or: [{ category: name }, { categories: name }],
  });
}

/** Categories for homepage: admin DB first, then live product taxonomy, then site config fallback. */
export async function getHomeCategories(): Promise<HomeCategory[]> {
  const dbRows = await Category.find({ isActive: { $ne: false } }).sort({ name: 1 }).lean();

  let names: string[] = dbRows
    .map((row) => String((row as { name?: string }).name || "").trim())
    .filter(Boolean);

  if (names.length === 0) {
    const productRows = await Product.find(publishedProductFilter).select("category categories").lean();
    names = categoryNamesFromProducts(productRows as Record<string, unknown>[]);
  }

  if (names.length === 0) {
    names = [...siteConfig.categories];
  }

  const uniqueNames = [...new Set(names)];

  return Promise.all(
    uniqueNames.map(async (name) => ({
      name,
      productCount: await countProductsInCategory(name),
    }))
  );
}
