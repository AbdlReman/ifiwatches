import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { requireRoles } from "@/lib/auth/apiAuth";
import HomePageContent from "@/models/HomePageContent";

export async function GET() {
  const auth = await requireRoles(["admin"]);
  if (!auth.ok) return auth.response;

  await connectDB();
  const doc = await HomePageContent.findOne().lean();
  return NextResponse.json({
    content: doc ?? { saleImage: "", videoUrl: "", hero: {} },
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireRoles(["admin"]);
  if (!auth.ok) return auth.response;

  await connectDB();
  const { saleImage, videoUrl, hero } = await req.json();

  const update: Record<string, unknown> = {
    saleImage: saleImage ?? "",
    videoUrl: videoUrl ?? "",
  };
  if (hero !== undefined) {
    update.hero = hero;
  }

  const doc = await HomePageContent.findOneAndUpdate({}, update, {
    new: true,
    upsert: true,
  }).lean();

  return NextResponse.json({ content: doc });
}
