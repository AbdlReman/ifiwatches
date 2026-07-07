import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HomePageContent from "@/models/HomePageContent";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await HomePageContent.findOne()
      .select("topbarText topbarEnabled")
      .lean() as Record<string, unknown> | null;

    return NextResponse.json({
      topbarText: String(doc?.topbarText || "Free shipping on orders above Rs. 5,999 across Pakistan"),
      topbarEnabled: doc?.topbarEnabled !== false,
    });
  } catch {
    return NextResponse.json({
      topbarText: "Free shipping on orders above Rs. 5,999 across Pakistan",
      topbarEnabled: true,
    });
  }
}
