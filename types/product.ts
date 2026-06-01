export interface ColorVariant {
  color: string;
  images: string[];
}

export interface IProduct {
  _id: string;
  /** Seller account that owns this listing, when applicable. */
  sellerId?: string;
  name: string;
  brand?: string;
  category: string;
  categories?: string[];
  price: number;
  description: string;
  detail: string;
  sizes: string[];
  colors: string[];
  colorVariants: ColorVariant[];
  stockQuantity: number;
  images: string[];
  discount: number;
  inStock: boolean;
  isActive: boolean;
  isHidden?: boolean;
  isClearance?: boolean;
  isArchived?: boolean;
  /** Shown in homepage Featured drops; set by admin only. */
  isFeatured?: boolean;
  status: "Draft" | "Published";
  approvalStatus?: "pending" | "approved" | "rejected";
  popularityScore: number;
  soldCount: number;
  lastSoldAt?: string | null;
  slug: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  size?: string;
  color?: string;
  quantity: number;
}
