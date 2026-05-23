import ApprovalsClient from "./ApprovalsClient";

export const dynamic = "force-dynamic";

export default function AdminApprovalsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight text-white">Vendor approvals</h1>
        <p className="text-slate-400 text-sm mt-1">
          Review seller listings before they go live. Platform commission is 10% per completed sale.
        </p>
      </div>
      <ApprovalsClient />
    </div>
  );
}


