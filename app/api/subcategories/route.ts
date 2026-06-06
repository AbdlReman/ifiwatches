import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubCategory from "@/models/SubCategory";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const categoriesParam = req.nextUrl.searchParams.get("categories");
    const query: Record<string, unknown> = { isActive: true };
    if (categoriesParam) {
      const cats = categoriesParam.split(",").map((c) => c.trim()).filter(Boolean);
      if (cats.length > 0) query.category = { $in: cats };
    }
    const subcategories = await SubCategory.find(query).sort({ category: 1, name: 1 }).lean();
    const serialized = subcategories.map((sc: Record<string, unknown>) => ({
      ...sc,
      _id: String(sc._id),
      createdAt: String(sc.createdAt),
      updatedAt: String(sc.updatedAt),
    }));
    return NextResponse.json({ subcategories: serialized });
  } catch (error) {
    console.error("GET /api/subcategories error:", error);
    return NextResponse.json({ error: "Failed to fetch sub categories" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const subcategory = await SubCategory.create({
      name: String(body.name || "").trim(),
      category: String(body.category || "").trim(),
      isActive: body.isActive !== false,
    });
    return NextResponse.json(
      { subcategory: { ...subcategory.toObject(), _id: String(subcategory._id) } },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to create sub category";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
