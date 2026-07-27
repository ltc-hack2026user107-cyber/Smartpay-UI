"use client";

import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import { ADMIN_ORDER_EXPLORER } from "@/data/mockData";
import { formatGBP } from "@/lib/format";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminOrderExplorerPage() {
  return (
    <AppShell title="11. Order Explorer">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by Order ID, Buyer or Seller..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Buyer</th>
                <th className="pb-3 font-medium">Seller</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Escrow Status</th>
                <th className="pb-3 font-medium">Created On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ADMIN_ORDER_EXPLORER.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 font-medium text-sidebar-active">{order.id}</td>
                  <td className="py-3 text-slate-700">{order.buyer}</td>
                  <td className="py-3 text-slate-700">{order.seller}</td>
                  <td className="py-3 font-medium text-slate-900">
                    {formatGBP(order.amount)}
                  </td>
                  <td className="py-3">
                    <Badge status={order.status} />
                  </td>
                  <td className="py-3">
                    <Badge status={order.escrowStatus} />
                  </td>
                  <td className="py-3 text-slate-500">{order.createdOn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-end gap-1 text-sm text-slate-500">
          <button className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3, 4].map((p) => (
            <button
              key={p}
              className={`h-7 w-7 rounded-md text-sm ${
                p === 1
                  ? "bg-sidebar-active text-white"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              {p}
            </button>
          ))}
          <button className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </AppShell>
  );
}
