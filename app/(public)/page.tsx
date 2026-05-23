import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import Product from "@/models/Product";
import User from "@/models/User";
import { siteConfig } from "@/lib/siteConfig";
import type { IProduct } from "@/types/product";
import HomePageView from "@/components/home/HomePageView";

export const dynamic = "force-dynamic";

const publishedFilter = {
  isActive: true,
  isHidden: { $ne: true },
  isArchived: { $ne: true },
  $or: [{ status: "Published" }, { status: { $exists: false } }],
  $and: [
    {
      $or: [
        { sellerId: null },
        { sellerId: { $exists: false } },
        { approvalStatus: "approved" },
      ],
    },
  ],
};

function toProducts(raw: Record<string, unknown>[]): IProduct[] {
  return raw.map((p) => serializeProductFromLean(p));
}

export default async function HomePage() {
  await connectDB();

  const [featuredRaw, vendorRaw, productCount, sellerCount] = await Promise.all([
    Product.find(publishedFilter).sort({ createdAt: -1 }).limit(8).lean(),
    Product.find({ ...publishedFilter, sellerId: { $ne: null } })
      .sort({ popularityScore: -1, createdAt: -1 })
      .limit(4)
      .lean(),
    Product.countDocuments(publishedFilter),
    User.countDocuments({ role: "seller" }),
  ]);

  const featuredProducts = toProducts(featuredRaw as Record<string, unknown>[]);
  const vendorProducts = toProducts(vendorRaw as Record<string, unknown>[]);

  return (
    <HomePageView
      featuredProducts={featuredProducts}
      vendorProducts={vendorProducts}
      stats={{
        sellerCount,
        productCount,
        categoryCount: siteConfig.categories.length,
      }}
    />
  );
}
