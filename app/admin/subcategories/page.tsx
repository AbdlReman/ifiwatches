import { connectDB } from "@/lib/mongodb";
import Category from "@/models/Category";
import SubCategory from "@/models/SubCategory";
import SubCategoryManager from "../_components/SubCategoryManager";

export const dynamic = "force-dynamic";

export default async function AdminSubCategoriesPage() {
  await connectDB();
  const [categoriesRaw, subCategoriesRaw] = await Promise.all([
    Category.find({ isActive: true }).sort({ name: 1 }).lean(),
    SubCategory.find({}).sort({ category: 1, name: 1 }).lean(),
  ]);

  const categoryOptions = (categoriesRaw as Record<string, unknown>[]).map((c) =>
    String(c.name || "")
  ).filter(Boolean);

  const initialItems = (subCategoriesRaw as Record<string, unknown>[]).map((sc) => ({
    _id: String(sc._id),
    name: String(sc.name || ""),
    category: String(sc.category || ""),
    isActive: sc.isActive !== false,
  }));

  return (
    <SubCategoryManager categoryOptions={categoryOptions} initialItems={initialItems} />
  );
}
