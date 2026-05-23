import PayoutsAdminClient from "./PayoutsAdminClient";

export const dynamic = "force-dynamic";

export default function AdminPayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Vendor payouts</h1>
        <p className="text-slate-400 text-sm mt-1">
          Approve payout requests from sellers (net earnings after 10% commission).
        </p>
      </motion>
      <PayoutsAdminClient />
    </motion>
  );
}
