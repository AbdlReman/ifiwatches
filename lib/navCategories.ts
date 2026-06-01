import Category from "@/models/Category";
import Product from "@/models/Product";
import { siteConfig } from "@/lib/siteConfig";
import { publishedProductFilter } from "@/lib/publishedProductFilter";

function namesFromProducts(raw: Record<string, unknown>[]): string[] {
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
  return Array.from(set);
}

/** Category names for storefront navigation (admin DB → live products → site config). */
export async function getNavCategories(): Promise<string[]> {
  const dbRows = await Category.find({ isActive: { $ne: false } }).sort({ name: 1 }).lean();

  let names = dbRows
    .map((row) => String((row as { name?: string }).name || "").trim())
    .filter(Boolean);

  if (names.length === 0) {
    const productRows = await Product.find(publishedProductFilter).select("category categories").lean();
    names = namesFromProducts(productRows as Record<string, unknown>[]);
  }

  if (names.length === 0) {
    names = [...siteConfig.categories];
  }

  const excluded = new Set(["men", "women"]);
  return [...new Set(names)]
    .filter((c) => !excluded.has(c.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));
}
