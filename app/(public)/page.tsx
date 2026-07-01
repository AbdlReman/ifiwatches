import { connectDB } from "@/lib/mongodb";
import { serializeProductFromLean } from "@/lib/serializeProduct";
import { getHomeCategories } from "@/lib/homeCategories";
import { publishedProductFilter } from "@/lib/publishedProductFilter";
import Product from "@/models/Product";
import HomePageContent from "@/models/HomePageContent";
import type { IProduct } from "@/types/product";
import HomePageView from "@/components/home/HomePageView";

export const dynamic = "force-dynamic";

function toProducts(raw: Record<string, unknown>[]): IProduct[] {
  return raw.map((p) => serializeProductFromLean(p));
}

type CategoryWithProducts = {
  name: string;
  productCount: number;
  products: IProduct[];
};

/** Fisher-Yates shuffle then slice — picks `n` items randomly from an array. */
function pickRandom<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

export default async function HomePage() {
  await connectDB();

  const [
    featuredRaw,
    bestSellerRaw,
    vendorRaw,
    flashSalePool,
    justForYouPool,
    categories,
    homeContent,
  ] = await Promise.all([
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
    // Flash Sale pool: top 30 by discount
    Product.find({ ...publishedProductFilter, discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .limit(30)
      .lean(),
    // Just For You pool: top 30 latest
    Product.find(publishedProductFilter)
      .sort({ createdAt: -1 })
      .limit(30)
      .lean(),
    getHomeCategories(),
    HomePageContent.findOne().lean(),
  ]);

  const featuredProducts = toProducts(featuredRaw as Record<string, unknown>[]);
  const bestSellerProducts = toProducts(bestSellerRaw as Record<string, unknown>[]);
  const vendorProducts = toProducts(vendorRaw as Record<string, unknown>[]);
  const flashSaleProducts = toProducts(
    pickRandom(flashSalePool as Record<string, unknown>[], 4)
  );
  const justForYouProducts = toProducts(
    pickRandom(justForYouPool as Record<string, unknown>[], 4)
  );
  const featuredByCategory: CategoryWithProducts[] = (
    await Promise.all(
      categories
        .filter((cat) => cat.productCount > 0)
        .map(async (cat) => {
          const latestRaw = await Product.find({
            ...publishedProductFilter,
            $or: [{ category: cat.name }, { categories: cat.name }],
          })
            .sort({ createdAt: -1, updatedAt: -1 })
            .limit(2)
            .lean();

          return {
            name: cat.name,
            productCount: cat.productCount,
            products: toProducts(latestRaw as Record<string, unknown>[]),
          };
        })
    )
  ).filter((entry) => entry.products.length > 0);

  const content = homeContent as {
    saleImage?: string;
    videoUrl?: string;
    heroImages?: string[];
    mobileHeroImages?: string[];
    hero?: {
      image?: string;
      badgeText?: string;
      heading?: string;
      headingAccent?: string;
      subheading?: string;
      primaryBtnText?: string;
      primaryBtnHref?: string;
      secondaryBtnText?: string;
      secondaryBtnHref?: string;
      pills?: string[];
    };
  } | null;

  const heroImages: string[] = Array.isArray(content?.heroImages) && content.heroImages.length > 0
    ? content.heroImages.filter(Boolean)
    : content?.hero?.image
    ? [content.hero.image]
    : [];

  const mobileHeroImages: string[] = Array.isArray(content?.mobileHeroImages)
    ? content.mobileHeroImages.filter(Boolean)
    : [];

  return (
    <HomePageView
      categories={categories}
      featuredProducts={featuredProducts}
      bestSellerProducts={bestSellerProducts}
      vendorProducts={vendorProducts}
      flashSaleProducts={flashSaleProducts}
      justForYouProducts={justForYouProducts}
      featuredByCategory={featuredByCategory}
      saleImage={content?.saleImage || ""}
      videoUrl={content?.videoUrl || ""}
      heroContent={content?.hero}
      heroImages={heroImages}
      mobileHeroImages={mobileHeroImages}
    />
  );
}
