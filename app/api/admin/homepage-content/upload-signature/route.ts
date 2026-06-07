import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { requireRoles } from "@/lib/auth/apiAuth";

export async function GET() {
  const auth = await requireRoles(["admin"]);
  if (!auth.ok) return auth.response;

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "ifilifestyle/homepage";

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET!
  );

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
