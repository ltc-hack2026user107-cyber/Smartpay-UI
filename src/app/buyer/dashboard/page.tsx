import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { CreditCard, ShieldCheck, PackageCheck, Coins } from "lucide-react";

const stats = [
  { label: "Available Balance", value: "£850,000", icon: CreditCard, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { label: "Active Orders", value: "12", icon: ShieldCheck, iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { label: "Completed Orders", value: "18", icon: PackageCheck, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { label: "Total Spent", value: "£1,250,000", icon: Coins, iconBg: "#FEF3C7", iconColor: "#D97706" },
];

export default function BuyerDashboardPage() {
  return (
    <AppShell title="1. Buyer Dashboard">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Buyer Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </AppShell>
  );
}
