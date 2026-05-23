import SlowMovingClient from "./SlowMovingClient";

export const dynamic = "force-dynamic";

export default function AdminInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Slow-moving inventory</h1>
        <p className="text-slate-400 text-sm mt-1">
          Products with no sales in the selected window. Apply discounts, clearance, hide, or archive.
        </p>
      </div>
      <SlowMovingClient />
    </div>
  );
}
