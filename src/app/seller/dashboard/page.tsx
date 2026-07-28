"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { Wrench, CheckCircle2, Truck, Wallet } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface SellerDashboardResponse {
  pendingOrders: number;
  acceptedOrders: number;
  inTransitOrders: number;
  amountReceived: number;
}

interface StatItem {
  label: string;
  value: string;
  icon: typeof Wrench;
  iconBg: string;
  iconColor: string;
}

const statBaseConfig = [
  { label: "Pending Orders", icon: Wrench, iconBg: "#FEF3C7", iconColor: "#D97706" },
  { label: "Accepted Orders", icon: CheckCircle2, iconBg: "#DCFCE7", iconColor: "#16A34A" },
  { label: "In Transit", icon: Truck, iconBg: "#DBEAFE", iconColor: "#2563EB" },
  { label: "Amount Received", icon: Wallet, iconBg: "#DCFCE7", iconColor: "#16A34A" },
];

export default function SellerDashboardPage() {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/sellers/seller_001/dashboard`);
        if (!response.ok) {
          throw new Error("Failed to fetch seller dashboard data");
        }

        const data: SellerDashboardResponse = await response.json();

        const mappedStats: StatItem[] = statBaseConfig.map((stat, index) => {
          const value =
            index === 0
              ? data.pendingOrders.toString()
              : index === 1
                ? data.acceptedOrders.toString()
                : index === 2
                  ? data.inTransitOrders.toString()
                  : `£${data.amountReceived.toLocaleString()}`;

          return {
            ...stat,
            value,
          };
        });

        setStats(mappedStats);
      } catch (error) {
        console.error("Seller dashboard fetch failed", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AppShell title="Seller Dashboard">
      <h2 className="mb-5 text-base font-semibold text-slate-900">
        Seller Dashboard
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
