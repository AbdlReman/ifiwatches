import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SubCategory from "@/models/SubCategory";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const subcategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        name: String(body.name || "").trim(),
        category: String(body.category || "").trim(),
        isActive: body.isActive !== false,
      },
      { new: true, runValidators: true }
    ).lean();
    if (!subcategory) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const sc = subcategory as Record<string, unknown>;
    return NextResponse.json({ subcategory: { ...sc, _id: String(sc._id) } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update sub category";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    await SubCategory.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/subcategories/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete sub category" }, { status: 500 });
  }
}
