import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { UserRole } from "@/lib/auth/jwt";
import UsersTable from "./UsersTable";

export const metadata: Metadata = { title: "Users — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectDB();
  const rows = await User.find({})
    .sort({ createdAt: -1 })
    .select("email name role createdAt phone businessCategory businessSummary sellerApproved")
    .lean();

  const users = rows.map((r) => {
    const u = r as {
      _id: unknown;
      email: string;
      name: string;
      role: string;
      createdAt?: Date;
      phone?: string;
      businessCategory?: string;
      businessSummary?: string;
      sellerApproved?: boolean;
    };
    return {
      id: String(u._id),
      email: u.email,
      name: u.name,
      role: u.role as UserRole,
      phone: u.phone || "",
      businessCategory: u.businessCategory || "",
      businessSummary: u.businessSummary || "",
      sellerApproved: Boolean(u.sellerApproved),
      createdAt: u.createdAt ? u.createdAt.toLocaleString() : "—",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Users & sellers</h1>
        <p className="text-slate-400 text-sm mt-1">
          View all accounts and approve new seller registration requests from this page.
        </p>
      </div>

      <UsersTable initialUsers={users} />

      {users.length === 0 ? <p className="text-slate-500 text-sm">No users yet.</p> : null}
    </div>
  );
}
