"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { formatGBP } from "@/lib/format";
import { API_BASE_URL } from "@/lib/api";

interface BuyerAccountItem {
  id: string;
  name: string;
  role: string;
  balance: number;
  totalOrders: number;
}

interface SellerAccountItem {
  id: string;
  name: string;
  totalOrders: number;
  balance: number;
}

export default function AdminAccountsPage() {
  const [tab, setTab] = useState<"Buyers" | "Sellers">("Buyers");
  const [buyers, setBuyers] = useState<BuyerAccountItem[]>([]);
  const [sellers, setSellers] = useState<SellerAccountItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const [buyersResponse, sellersResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/admin/buyers`),
          fetch(`${API_BASE_URL}/admin/sellers`),
        ]);

        if (!buyersResponse.ok || !sellersResponse.ok) {
          throw new Error("Failed to fetch accounts");
        }

        const buyersData: BuyerAccountItem[] = await buyersResponse.json();
        const sellersData: SellerAccountItem[] = await sellersResponse.json();

        setBuyers(buyersData);
        setSellers(sellersData);
      } catch (error) {
        console.error("Admin accounts fetch failed", error);
        setBuyers([]);
        setSellers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <AppShell title="10. Accounts">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex gap-6 border-b border-slate-100">
          {(["Buyers", "Sellers"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
                tab === t
                  ? "border-sidebar-active text-sidebar-active"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "Buyers" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-400">
                  <th className="pb-3 font-medium">Buyer ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Total Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      Loading buyers...
                    </td>
                  </tr>
                ) : buyers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-500">
                      No buyers found.
                    </td>
                  </tr>
                ) : (
                  buyers.map((buyer) => (
                    <tr key={buyer.id}>
                      <td className="py-3 font-medium text-sidebar-active">{buyer.id}</td>
                      <td className="py-3 text-slate-700">{buyer.name}</td>
                      <td className="py-3 text-slate-700">{formatGBP(buyer.balance)}</td>
                      <td className="py-3 text-slate-700">{buyer.totalOrders}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-slate-400">
                  <th className="pb-3 font-medium">Seller ID</th>
                  <th className="pb-3 font-medium">Name</th>
                  <th className="pb-3 font-medium">Balance</th>
                  <th className="pb-3 font-medium">Total Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      Loading sellers...
                    </td>
                  </tr>
                ) : sellers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-slate-500">
                      No sellers found.
                    </td>
                  </tr>
                ) : (
                  sellers.map((seller) => (
                    <tr key={seller.id}>
                      <td className="py-3 font-medium text-sidebar-active">{seller.id}</td>
                      <td className="py-3 text-slate-700">{seller.name}</td>
                      <td className="py-3 text-slate-700">{formatGBP(seller.balance)}</td>
                      <td className="py-3 text-slate-700">{seller.totalOrders}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
