"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { CreditCard, ShieldCheck, PackageCheck, Coins } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface BuyerDashboardResponse {
  availableBalance: number;
  activeOrders: number;
  deliveredOrders: number;
  incompleteOrders: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: typeof CreditCard;
  iconBg: string;
  iconColor: string;
}

const statBaseConfig = [
  { label: "Available Balance", icon: CreditCard, iconBg: "#EDE9FE", iconColor: "#7C3AED" },
  { label: "Active Orders", icon: ShieldCheck, iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { label: "Delivered Orders", icon: PackageCheck, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { label: "Incomplete Orders", icon: Coins, iconBg: "#FEF3C7", iconColor: "#D97706" },
];

export default function BuyerDashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/buyers/buyer_001/dashboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const data: BuyerDashboardResponse = await response.json();

        const mappedStats: StatItem[] = statBaseConfig.map((stat, index) => {
          const value =
            index === 0
              ? `£${data.availableBalance.toLocaleString()}`
              : index === 1
                ? data.activeOrders.toString()
                : index === 2
                  ? data.deliveredOrders.toString()
                  : data.incompleteOrders.toString();

          if (index === 0) {
            return {
              ...stat,
              value: `£${(data.availableBalance ?? 0).toLocaleString()}`,
            };
          }

          return {
            ...stat,
            value,
          };
        });

        setStats(mappedStats);
      } catch (error) {
        console.error("Dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppShell title="Buyer Dashboard">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Buyer Dashboard
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? statBaseConfig.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value="--" icon={stat.icon} iconBg={stat.iconBg} iconColor={stat.iconColor} />
            ))
          : stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
      </div>
    </AppShell>
  );
}
