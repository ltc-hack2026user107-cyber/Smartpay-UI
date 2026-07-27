import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { Wrench, CheckCircle2, Truck, Wallet } from "lucide-react";

const stats = [
  { label: "Pending Orders", value: "5", icon: Wrench, iconBg: "#FEF3C7", iconColor: "#D97706" },
  { label: "Accepted Orders", value: "7", icon: CheckCircle2, iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { label: "In Transit", value: "3", icon: Truck, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { label: "Amount Received", value: "£320,000", icon: Wallet, iconBg: "#DCFCE7", iconColor: "#16A34A" },
];

export default function SellerDashboardPage() {
  return (
    <AppShell title="5. Seller Dashboard">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Seller Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </AppShell>
  );
}
