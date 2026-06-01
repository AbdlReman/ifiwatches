import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import { getHomeCategories } from "@/lib/homeCategories";
import { publishedProductFilter } from "@/lib/publishedProductFilter";
import Product from "@/models/Product";
import User from "@/models/User";
import type { IProduct } from "@/types/product";
import HomePageView from "@/components/home/HomePageView";

export const dynamic = "force-dynamic";

function toProducts(raw: Record<string, unknown>[]): IProduct[] {
  return raw.map((p) => serializeProductFromLean(p));
}

export default async function HomePage() {
  await connectDB();

  const [featuredRaw, bestSellerRaw, vendorRaw, productCount, sellerCount, categories] = await Promise.all([
    Product.find({ ...publishedProductFilter, isFeatured: true })
      .sort({ updatedAt: -1 })
      .limit(8)
      .lean(),
    Product.find({ ...publishedProductFilter, isBestSeller: true })
      .sort({ soldCount: -1, popularityScore: -1, updatedAt: -1 })
      .limit(12)
      .lean(),
    Product.find({ ...publishedProductFilter, sellerId: { $ne: null } })
      .sort({ popularityScore: -1, createdAt: -1 })
      .limit(4)
      .lean(),
    Product.countDocuments(publishedProductFilter),
    User.countDocuments({ role: "seller" }),
    getHomeCategories(),
  ]);

  const featuredProducts = toProducts(featuredRaw as Record<string, unknown>[]);
  const bestSellerProducts = toProducts(bestSellerRaw as Record<string, unknown>[]);
  const vendorProducts = toProducts(vendorRaw as Record<string, unknown>[]);

  return (
    <HomePageView
      categories={categories}
      featuredProducts={featuredProducts}
      bestSellerProducts={bestSellerProducts}
      vendorProducts={vendorProducts}
      stats={{
        sellerCount,
        productCount,
        categoryCount: categories.length,
      }}
    />
  );
}
