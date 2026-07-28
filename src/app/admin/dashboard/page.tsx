"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { Users, Store, ClipboardList, Landmark, CircleDollarSign, Undo2 } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";


interface AdminDashboardResponse {
  totalBuyers: number;
  totalSellers: number;
  totalOrders: number;
  escrowBalance: number;
  settledAmount: number;
  refundAmount: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: typeof Users;
  iconBg: string;
  iconColor: string;
}

const topStatsConfig = [
  { label: "Total Buyers", icon: Users, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { label: "Total Sellers", icon: Store, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { label: "Total Orders", icon: ClipboardList, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
];

const bottomStatsConfig = [
  { label: "Escrow Balance", icon: Landmark, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { label: "Settled Amount", icon: CircleDollarSign, iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { label: "Refund Amount", icon: Undo2, iconBg: "#FEF3C7", iconColor: "#D97706" },
];

export default function AdminDashboardPage() {
  const [topStats, setTopStats] = useState<StatItem[]>([]);
  const [bottomStats, setBottomStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/dashboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch admin dashboard data");
        }

        const data: AdminDashboardResponse = await response.json();

        setTopStats(
          topStatsConfig.map((stat, index) => ({
            ...stat,
            value:
              index === 0
                ? data.totalBuyers.toString()
                : index === 1
                  ? data.totalSellers.toString()
                  : data.totalOrders.toString(),
          }))
        );

        setBottomStats(
          bottomStatsConfig.map((stat, index) => ({
            ...stat,
            value:
              index === 0
                ? `£${data.escrowBalance.toLocaleString()}`
                : index === 1
                  ? `£${data.settledAmount.toLocaleString()}`
                  : `£${data.refundAmount.toLocaleString()}`,
          }))
        );
      } catch (error) {
        console.error("Admin dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppShell title="9. Admin Dashboard">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Admin Dashboard
      </h2>
      <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {(loading ? topStatsConfig : topStats).map((stat) => (
          <StatCard key={stat.label} {...stat} value={loading ? "--" : stat.value} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {(loading ? bottomStatsConfig : bottomStats).map((stat) => (
          <StatCard key={stat.label} {...stat} value={loading ? "--" : stat.value} />
        ))}
      </div>
    </AppShell>
  );
}
