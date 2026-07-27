"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { SELLER_PENDING_ORDERS } from "@/data/mockData";
import { formatGBP } from "@/lib/format";
import { Search, SlidersHorizontal } from "lucide-react";
import { Order } from "@/lib/types";

const TABS = ["Pending", "Accepted", "All"] as const;

export default function SellerOrdersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Pending");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <AppShell title="6. Seller Orders">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-5 flex gap-6 border-b border-slate-100">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`-mb-px border-b-2 pb-3 text-sm font-medium ${
                tab === t
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search orders..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-emerald-400"
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
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Amount</th>
                <th className="pb-3 font-medium">Delivery Date</th>
                <th className="pb-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {SELLER_PENDING_ORDERS.map((order) => (
                <tr key={order.id}>
                  <td className="py-3">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="font-medium text-sidebar-active hover:underline"
                    >
                      {order.id}
                    </button>
                  </td>
                  <td className="py-3 text-slate-700">{order.buyer}</td>
                  <td className="py-3 text-slate-700">{order.description}</td>
                  <td className="py-3 font-medium text-slate-900">
                    {formatGBP(order.amount)}
                  </td>
                  <td className="py-3 text-slate-700">{order.deliveryDate}</td>
                  <td className="py-3">
                    <div className="flex gap-2">
                      <button className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600">
                        Accept
                      </button>
                      <button className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100">
                        Decline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          perspective="seller"
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </AppShell>
  );
}
