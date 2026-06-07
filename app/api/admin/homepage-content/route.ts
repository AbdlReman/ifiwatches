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
    content: doc ?? { saleImage: "", videoUrl: "" },
  });
}

export async function PUT(req: NextRequest) {
  const auth = await requireRoles(["admin"]);
  if (!auth.ok) return auth.response;

  await connectDB();
  const { saleImage, videoUrl } = await req.json();

  const doc = await HomePageContent.findOneAndUpdate(
    {},
    { saleImage: saleImage ?? "", videoUrl: videoUrl ?? "" },
    { new: true, upsert: true }
  ).lean();

  return NextResponse.json({ content: doc });
}
