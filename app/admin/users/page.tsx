import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Category from "@/models/Category";
import type { UserRole } from "@/lib/auth/jwt";
import UsersTable from "./UsersTable";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Users — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectDB();
  const [rows, categoriesRaw] = await Promise.all([
    User.find({})
    .sort({ createdAt: -1 })
    .select(
      "email name role createdAt phone whatsapp address businessName businessCategory businessSummary cnic cnicFront cnicBack sellerImage sellerApproved sellerEnabled assignedCategories commissionRate sellerCode"
    )
    .lean(),
    Category.find({ isActive: true }).sort({ name: 1 }).select("name").lean(),
  ]);

  const users = rows.map((r) => {
    const u = r as {
      _id: unknown;
      email: string;
      name: string;
      role: string;
      createdAt?: Date;
      phone?: string;
      whatsapp?: string;
      address?: string;
      businessName?: string;
      businessCategory?: string;
      businessSummary?: string;
      cnic?: string;
      cnicFront?: string;
      cnicBack?: string;
      sellerImage?: string;
      sellerApproved?: boolean;
      sellerEnabled?: boolean;
      assignedCategories?: string[];
      commissionRate?: number;
      sellerCode?: string;
    };
    return {
      id: String(u._id),
      email: u.email,
      name: u.name,
      role: u.role as UserRole,
      phone: u.phone || "",
      whatsapp: u.whatsapp || "",
      address: u.address || "",
      businessName: u.businessName || "",
      businessCategory: u.businessCategory || "",
      businessSummary: u.businessSummary || "",
      cnic: u.cnic || "",
      cnicFront: u.cnicFront || "",
      cnicBack: u.cnicBack || "",
      sellerImage: u.sellerImage || "",
      sellerApproved: Boolean(u.sellerApproved),
      sellerEnabled: u.sellerEnabled !== false,
      assignedCategories: u.assignedCategories || [],
      commissionRate: u.commissionRate || 0,
      sellerCode: u.sellerCode || "",
      createdAt: u.createdAt ? u.createdAt.toLocaleString() : "—",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Users & Sellers</h1>
        <p className="text-slate-400 text-sm mt-1">
          Approve seller applications, assign categories, set commission rates and manage all accounts.
        </p>
      </div>
      <UsersTable
        initialUsers={users}
        allCategories={Array.from(new Set([
          ...(categoriesRaw as { name: string }[]).map((c) => c.name).filter(Boolean),
          ...siteConfig.categories,
        ]))}
      />
    </div>
  );
}
