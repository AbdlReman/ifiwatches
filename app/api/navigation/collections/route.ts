import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getNavCategories } from "@/lib/navCategories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const categories = await getNavCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("GET /api/navigation/collections error:", error);
    return NextResponse.json({ categories: [] }, { status: 200 });
  }
}
