import type { Metadata } from "next";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Review from "@/models/Review";

export const metadata: Metadata = { title: "Reviews — Seller" };
export const dynamic = "force-dynamic";

export default async function SellerReviewsPage() {
  const session = await getSession();
  if (!session || session.role !== "seller") return null;

  await connectDB();
  const products = await Product.find({ sellerId: session.sub }).select("name slug").lean();
  const productIds = products.map((p) => (p as { _id: unknown })._id);
  const nameById = new Map(
    products.map((p) => {
      const x = p as { _id: unknown; name?: string };
      return [String(x._id), String(x.name || "")] as const;
    })
  );

  const reviews =
    productIds.length === 0
      ? []
      : await Review.find({ productId: { $in: productIds } })
          .sort({ createdAt: -1 })
          .limit(200)
          .lean();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Reviews</h1>
        <p className="text-slate-400 text-sm mt-1">Feedback on your products</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-800/50">
        <table className="w-full text-sm text-left text-slate-300 min-w-[640px]">
          <thead className="bg-slate-900/80 text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3 font-bold">Product</th>
              <th className="px-4 py-3 font-bold">Rating</th>
              <th className="px-4 py-3 font-bold">Review</th>
              <th className="px-4 py-3 font-bold whitespace-nowrap">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {reviews.map((r) => {
              const row = r as {
                _id: unknown;
                productId: unknown;
                authorName?: string;
                rating?: number;
                body?: string;
                createdAt?: Date;
              };
              const pid = String(row.productId);
              return (
                <tr key={String(row._id)} className="hover:bg-slate-800/80 align-top">
                  <td className="px-4 py-3 text-white font-medium max-w-[200px]">{nameById.get(pid) || "—"}</td>
                  <td className="px-4 py-3 tabular-nums">{row.rating ?? "—"} / 5</td>
                  <td className="px-4 py-3 max-w-md">
                    <p className="text-slate-500 text-xs mb-1">{row.authorName}</p>
                    <p className="text-slate-200">{row.body}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                    {row.createdAt ? new Date(row.createdAt).toLocaleString() : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {reviews.length === 0 ? <p className="text-slate-500 text-sm">No reviews on your products yet.</p> : null}
    </div>
  );
}
