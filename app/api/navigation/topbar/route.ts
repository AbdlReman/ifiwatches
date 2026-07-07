import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import HomePageContent from "@/models/HomePageContent";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectDB();
    const doc = await HomePageContent.findOne()
      .select("topbarText topbarEnabled topbarPhone topbarEmail")
      .lean() as Record<string, unknown> | null;

    return NextResponse.json({
      topbarText: String(doc?.topbarText || "Free shipping on orders above Rs. 5,999 across Pakistan"),
      topbarEnabled: doc?.topbarEnabled !== false,
      topbarPhone: String(doc?.topbarPhone || siteConfig.contact.phone || ""),
      topbarEmail: String(doc?.topbarEmail || siteConfig.contact.email || ""),
    });
  } catch {
    return NextResponse.json({
      topbarText: "Free shipping on orders above Rs. 5,999 across Pakistan",
      topbarEnabled: true,
      topbarPhone: siteConfig.contact.phone || "",
      topbarEmail: siteConfig.contact.email || "",
    });
  }
}
