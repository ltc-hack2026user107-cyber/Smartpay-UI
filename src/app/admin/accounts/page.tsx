"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { BUYER_ACCOUNTS, SELLER_ACCOUNTS } from "@/data/mockData";
import { formatGBP } from "@/lib/format";

export default function AdminAccountsPage() {
  const [tab, setTab] = useState<"Buyers" | "Sellers">("Buyers");

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
                  <th className="pb-3 font-medium">Wallet Balance</th>
                  <th className="pb-3 font-medium">Escrow Balance</th>
                  <th className="pb-3 font-medium">Total Orders</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {BUYER_ACCOUNTS.map((b) => (
                  <tr key={b.id}>
                    <td className="py-3 font-medium text-sidebar-active">{b.id}</td>
                    <td className="py-3 text-slate-700">{b.name}</td>
                    <td className="py-3 text-slate-700">{formatGBP(b.walletBalance)}</td>
                    <td className="py-3 text-slate-700">{formatGBP(b.escrowBalance)}</td>
                    <td className="py-3 text-slate-700">{b.totalOrders}</td>
                    <td className="py-3">
                      <Badge status={b.status} />
                    </td>
                  </tr>
                ))}
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
                  <th className="pb-3 font-medium">Wallet Balance</th>
                  <th className="pb-3 font-medium">Escrow Balance</th>
                  <th className="pb-3 font-medium">Total Orders</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {SELLER_ACCOUNTS.map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 font-medium text-sidebar-active">{s.id}</td>
                    <td className="py-3 text-slate-700">{s.name}</td>
                    <td className="py-3 text-slate-700">{formatGBP(s.walletBalance)}</td>
                    <td className="py-3 text-slate-700">
                      {s.escrowBalance === null ? "-" : formatGBP(s.escrowBalance)}
                    </td>
                    <td className="py-3 text-slate-700">{s.totalOrders}</td>
                    <td className="py-3">
                      <Badge status={s.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
