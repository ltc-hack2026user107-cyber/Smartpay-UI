"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { ORDERS } from "@/data/mockData";
import { formatGBP } from "@/lib/format";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { Order } from "@/lib/types";

export default function BuyerOrdersPage() {
  const [tab, setTab] = useState<"Ongoing" | "History">("Ongoing");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const visibleOrders =
    tab === "Ongoing"
      ? ORDERS.filter((o) => o.status !== "Delivered" && o.status !== "Refunded")
      : ORDERS.filter((o) => o.status === "Delivered" || o.status === "Refunded");

  return (
    <AppShell title="4. My Orders">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex gap-6 border-b border-slate-100">
          {(["Ongoing", "History"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
                tab === t
                  ? "border-sidebar-active text-sidebar-active"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "Ongoing" ? "Ongoing Orders" : "History"}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search orders..."
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
                <th className="pb-3 font-medium">Seller</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Escrow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-medium text-sidebar-active hover:underline"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="py-3 text-slate-700">{order.seller}</td>
                  <td className="py-3 text-slate-700">{order.description}</td>
                  <td className="py-3">
                    <Badge status={order.status} />
                  </td>
                  <td className="py-3 font-medium text-slate-900">
                    {formatGBP(order.amount)}
                  </td>
                  <td className="py-3">
                    <Badge status={order.escrowStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
          <p>Showing 1 to {visibleOrders.length} of 12 orders</p>
          <div className="flex items-center gap-1">
            <button className="rounded-md border border-slate-200 p-1.5 text-slate-400 hover:bg-slate-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((p) => (
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
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          perspective="buyer"
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AppShell>
  );
}
