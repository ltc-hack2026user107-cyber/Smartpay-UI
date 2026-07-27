const STATUS_STYLES: Record<string, string> = {
  Created: "bg-slate-100 text-slate-600",
  Accepted: "bg-emerald-50 text-emerald-600",
  Shipped: "bg-violet-50 text-violet-600",
  "In Transit": "bg-blue-50 text-blue-600",
  Delivered: "bg-emerald-50 text-emerald-600",
  Refunded: "bg-red-50 text-red-600",
  Declined: "bg-red-50 text-red-600",
  Locked: "bg-amber-50 text-amber-600",
  Transferred: "bg-emerald-50 text-emerald-600",
  Active: "bg-emerald-50 text-emerald-600",
  Suspended: "bg-red-50 text-red-600",
  "-": "bg-slate-100 text-slate-400",
};

export default function Badge({ status }: { status: string }) {
  const classes = STATUS_STYLES[status] ?? "bg-slate-100 text-slate-600";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      {status}
    </span>
  );
}
