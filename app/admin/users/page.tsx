import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { UserRole } from "@/lib/auth/jwt";
import UsersTable from "./UsersTable";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = { title: "Users — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectDB();
  const rows = await User.find({})
    .sort({ createdAt: -1 })
    .select(
      "email name role createdAt phone address businessName businessCategory businessSummary sellerApproved sellerEnabled assignedCategories commissionRate"
    )
    .lean();

  const users = rows.map((r) => {
    const u = r as {
      _id: unknown;
      email: string;
      name: string;
      role: string;
      createdAt?: Date;
      phone?: string;
      address?: string;
      businessName?: string;
      businessCategory?: string;
      businessSummary?: string;
      sellerApproved?: boolean;
      sellerEnabled?: boolean;
      assignedCategories?: string[];
      commissionRate?: number;
    };
    return {
      id: String(u._id),
      email: u.email,
      name: u.name,
      role: u.role as UserRole,
      phone: u.phone || "",
      address: u.address || "",
      businessName: u.businessName || "",
      businessCategory: u.businessCategory || "",
      businessSummary: u.businessSummary || "",
      sellerApproved: Boolean(u.sellerApproved),
      sellerEnabled: u.sellerEnabled !== false,
      assignedCategories: u.assignedCategories || [],
      commissionRate: u.commissionRate || 0,
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
      <UsersTable initialUsers={users} allCategories={[...siteConfig.categories]} />
    </div>
  );
}
