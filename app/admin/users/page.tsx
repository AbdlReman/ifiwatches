import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { UserRole } from "@/lib/auth/jwt";

export const metadata: Metadata = { title: "Users — Admin" };
export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  await connectDB();
  const rows = await User.find({})
    .sort({ createdAt: -1 })
    .select("email name role createdAt")
    .lean();

  const users = rows.map((r) => {
    const u = r as { email: string; name: string; role: string; createdAt?: Date };
    return {
      email: u.email,
      name: u.name,
      role: u.role as UserRole,
      createdAt: u.createdAt ? u.createdAt.toLocaleString() : "—",
    };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Users &amp; sellers</h1>
        <p className="text-slate-400 text-sm mt-1">
          View all accounts. To grant <span className="text-slate-300 font-semibold">admin</span>, update{" "}
          <code className="text-indigo-300">role</code> in the database only.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
        <table className="w-full text-sm text-left text-slate-300 min-w-[640px]">
          <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Name</th>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Role</th>
              <th className="px-4 py-3 font-bold whitespace-nowrap">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {users.map((u) => (
              <tr key={u.email} className="hover:bg-slate-800/80">
                <td className="px-4 py-3 text-white font-medium">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${
                      u.role === "admin"
                        ? "bg-indigo-900/70 text-indigo-200"
                        : u.role === "seller"
                        ? "bg-emerald-900/70 text-emerald-200"
                        : "bg-slate-700 text-slate-200"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">{u.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 ? <p className="text-slate-500 text-sm">No users yet.</p> : null}
    </div>
  );
}
