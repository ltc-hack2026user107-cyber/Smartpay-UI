"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { formatGBP } from "@/lib/format";
import { Search, SlidersHorizontal } from "lucide-react";
import { Order } from "@/lib/types";
import { API_BASE_URL } from "@/lib/api";

const TABS = ["Pending", "Accepted", "History"] as const;
const sellerId = "seller_001";

interface SellerOrderListItem {
  orderId: string;
  buyerName: string;
  description: string;
  amount: number;
  deliveryDate: string;
  status?: string;
}

export default function SellerOrdersPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Pending");
  const [orders, setOrders] = useState<SellerOrderListItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actioningOrderId, setActioningOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const endpoint =
          tab === "Pending"
            ? `${API_BASE_URL}/orders/sellers/${sellerId}/pending`
            : tab === "Accepted"
              ? `${API_BASE_URL}/orders/sellers/${sellerId}/accepted`
              : `${API_BASE_URL}/orders/sellers/${sellerId}/history`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: SellerOrderListItem[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Seller orders fetch failed", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tab]);

  const handleOrderAction = async (orderId: string, action: "accept" | "decline") => {
    setActioningOrderId(orderId);
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/${action}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(`Failed to ${action} order`);
      }

      setOrders((current) => current.filter((order) => order.orderId !== orderId));
    } catch (error) {
      console.error(`Order ${action} failed`, error);
    } finally {
      setActioningOrderId(null);
    }
  };

  const handleOpenOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const detail = await response.json();
      setSelectedOrder({
        id: detail._id,
        buyer: detail.buyer.name,
        seller: detail.seller.name,
        description: detail.description,
        amount: detail.amount,
        deliveryDate: detail.deliveryDate,
        status: mapOrderStatus(detail.orderStatus),
        escrowStatus: detail.escrow?.status === "LOCKED" ? "Locked" : "-",
        createdOn: detail.createdAt,
        timeline: [],
      });
    } catch (error) {
      console.error("Seller order details fetch failed", error);
    }
  };

  return (
    <AppShell title="Seller Orders">
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
                <th className="pb-3 font-medium">{tab === "Pending" ? "Action" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-slate-500">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="py-3">
                      <button
                        onClick={() => handleOpenOrder(order.orderId)}
                        className="font-medium text-sidebar-active hover:underline"
                      >
                        {order.orderId}
                      </button>
                    </td>
                    <td className="py-3 text-slate-700">{order.buyerName}</td>
                    <td className="py-3 text-slate-700">{order.description}</td>
                    <td className="py-3 font-medium text-slate-900">
                      {formatGBP(order.amount)}
                    </td>
                    <td className="py-3 text-slate-700">{order.deliveryDate}</td>
                    <td className="py-3">
                      {tab === "Pending" ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleOrderAction(order.orderId, "accept")}
                            disabled={actioningOrderId === order.orderId}
                            className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {actioningOrderId === order.orderId ? "Working..." : "Accept"}
                          </button>
                          <button
                            onClick={() => handleOrderAction(order.orderId, "decline")}
                            disabled={actioningOrderId === order.orderId}
                            className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {actioningOrderId === order.orderId ? "Working..." : "Decline"}
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">{order.status ?? "-"}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
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

function mapOrderStatus(status: string): Order["status"] {
  switch (status.toUpperCase()) {
    case "ACCEPTED":
      return "Accepted";
    case "DECLINED":
      return "Declined";
    case "DELIVERED":
      return "Delivered";
    case "REFUNDED":
      return "Refunded";
    default:
      return "Created";
  }
}
