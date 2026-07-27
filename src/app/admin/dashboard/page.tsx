import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { Users, Store, ClipboardList, Landmark, CircleDollarSign, Undo2 } from "lucide-react";

const topStats = [
  { label: "Total Buyers", value: "1", icon: Users, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { label: "Total Sellers", value: "1", icon: Store, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { label: "Total Orders", value: "22", icon: ClipboardList, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
];

const bottomStats = [
  { label: "Escrow Balance", value: "£620,000", icon: Landmark, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { label: "Settled Amount", value: "£1,250,000", icon: CircleDollarSign, iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { label: "Refund Amount", value: "£120,000", icon: Undo2, iconBg: "#FEF3C7", iconColor: "#D97706" },
];

export default function AdminDashboardPage() {
  return (
    <AppShell title="9. Admin Dashboard">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Admin Dashboard
      </h2>
      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {topStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {bottomStats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </AppShell>
  );
}
