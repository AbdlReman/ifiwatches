import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireRoles } from "@/lib/auth/apiAuth";

export async function POST(req: NextRequest) {
  const auth = await requireRoles(["admin"]);
  if (!auth.ok) return auth.response;

  try {
    const formData = await req.formData();
    const file = formData.get("video") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: "ifilifestyle/homepage",
      resource_type: "video",
    });

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
