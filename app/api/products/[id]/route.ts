import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireSession } from "@/lib/auth/apiAuth";
import { canMutateProduct } from "@/lib/productAccess";

type Params = { params: Promise<{ id: string }> };

function parseIsFeatured(body: Record<string, unknown>): boolean {
  return body.isFeatured === true || body.featured === true;
}

function normalizeColorVariants(input: unknown) {
  if (!Array.isArray(input)) return [];
  return input
    .map((variant) => {
      const v = variant as { color?: unknown; images?: unknown };
      return {
        color: String(v.color || "").trim(),
        images: Array.isArray(v.images)
          ? v.images.map((img) => String(img)).filter(Boolean)
          : [],
      };
    })
    .filter((v) => v.color);
}

function normalizeCategories(input: unknown, fallbackCategory: unknown): string[] {
  if (Array.isArray(input)) {
    const fromArray = input.map(String).map((v) => v.trim()).filter(Boolean);
    if (fromArray.length > 0) return Array.from(new Set(fromArray));
  }
  const one = String(fallbackCategory || "").trim();
  return one ? [one] : [];
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const p = product as Record<string, unknown>;
    return NextResponse.json({
      product: {
        ...p,
        _id: String(p._id),
        sellerId: p.sellerId ? String(p.sellerId) : null,
        createdAt: String(p.createdAt),
        updatedAt: String(p.updatedAt),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;

    await connectDB();
    const { id } = await params;
    const existing = await Product.findById(id).lean();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!canMutateProduct(auth.session, existing as { sellerId?: unknown })) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const colorVariants = normalizeColorVariants(body.colorVariants);
    const colors =
      colorVariants.length > 0
        ? colorVariants.map((v) => v.color)
        : Array.isArray(body.colors)
        ? body.colors
        : [];
    const images =
      colorVariants.flatMap((v) => v.images).filter(Boolean).length > 0
        ? colorVariants.flatMap((v) => v.images).filter(Boolean)
        : Array.isArray(body.images)
        ? body.images
        : [];
    const isSeller = auth.session.role === "seller";
    const existingSeller = Boolean((existing as { sellerId?: unknown }).sellerId);
    const wantsPublish =
      body.publish === true || body.status === "Published" || body.isActive === true;
    const approvalOk =
      !existingSeller ||
      String((existing as { approvalStatus?: string }).approvalStatus || "approved") ===
        "approved";
    const publish = !isSeller && wantsPublish;
    const sellerCanPublish =
      isSeller && wantsPublish && approvalOk && !Boolean((existing as { isArchived?: boolean }).isArchived);
    const nextStatus = publish || sellerCanPublish ? "Published" : "Draft";
    const categories = normalizeCategories(body.categories, body.category);
    const primaryCategory = categories[0] || "";
    const payload: Record<string, unknown> = {
      name: body.name,
      price: Number(body.price || 0),
      description: body.description || "",
      detail: body.detail || "",
      category: primaryCategory,
      categories,
      sizes: Array.isArray(body.sizes) ? body.sizes : [],
      colors,
      colorVariants,
      stockQuantity: Number(body.stockQuantity || 0),
      images,
      brand: String(body.brand ?? "").trim(),
      discount: Number(body.discount || 0),
      metaTitle: body.metaTitle || "",
      metaDescription: body.metaDescription || "",
      inStock: Number(body.stockQuantity || 0) > 0,
      isActive: publish || sellerCanPublish,
      status: nextStatus,
    };

    if (isSeller && wantsPublish && !approvalOk) {
      return NextResponse.json(
        { error: "This product must be approved by admin before it can be published." },
        { status: 400 }
      );
    }

    if (isSeller) {
      payload.status = sellerCanPublish ? "Published" : "Draft";
      payload.isActive = sellerCanPublish;
      const prevApproval = String((existing as { approvalStatus?: string }).approvalStatus || "pending");
      if (prevApproval === "approved" && !sellerCanPublish) {
        payload.approvalStatus = "pending";
      }
    }

    if (auth.session.role === "admin" && body.sellerId !== undefined) {
      const sid = String(body.sellerId || "").trim();
      if (!sid) {
        payload.sellerId = null;
      } else if (mongoose.isValidObjectId(sid)) {
        payload.sellerId = new mongoose.Types.ObjectId(sid);
      }
    }

    if (auth.session.role === "admin") {
      payload.isFeatured = parseIsFeatured(body as Record<string, unknown>);
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: payload },
      {
        new: true,
        runValidators: true,
      }
    ).lean();
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const p = product as Record<string, unknown>;
    return NextResponse.json({
      product: {
        ...p,
        _id: String(p._id),
        sellerId: p.sellerId ? String(p.sellerId) : null,
        createdAt: String(p.createdAt),
        updatedAt: String(p.updatedAt),
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Failed to update product";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const auth = await requireSession();
    if (!auth.ok) return auth.response;

    await connectDB();
    const { id } = await params;
    const existing = await Product.findById(id).lean();
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!canMutateProduct(auth.session, existing as { sellerId?: unknown })) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await Product.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
