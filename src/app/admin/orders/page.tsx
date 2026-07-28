"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { formatGBP } from "@/lib/format";
import { Search, SlidersHorizontal } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { EscrowStatus, Order, OrderStatus } from "@/lib/types";

interface AdminOrderListItem {
  orderId: string;
  buyerName: string;
  sellerName: string;
  amount: number;
  status: string;
  escrowStatus: string;
  createdOn: string;
}

interface AdminOrderDetailResponse {
  _id: string;
  buyer: { id: string; name: string };
  seller: { id: string; name: string };
  description: string;
  amount: number;
  currency: string;
  deliveryDate: string;
  escrow: { status: string; lockedAmount: number; lockedDate: string };
  timeline: Array<{ status: string; label: string; timestamp: string | null }>;
  createdAt: string;
  orderStatus: string;
  updatedAt: string;
}

export default function AdminOrderExplorerPage() {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/orders`);
        if (!response.ok) {
          throw new Error("Failed to fetch admin orders");
        }

        const data: AdminOrderListItem[] = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Admin orders fetch failed", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleOpenOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const detail: AdminOrderDetailResponse = await response.json();
      setSelectedOrder({
        id: detail._id,
        buyer: detail.buyer.name,
        seller: detail.seller.name,
        description: detail.description,
        amount: detail.amount,
        deliveryDate: detail.deliveryDate,
        status: mapOrderStatus(detail.orderStatus),
        escrowStatus: mapEscrowStatus(detail.escrow.status),
        createdOn: detail.createdAt,
        timeline: [],
      });
    } catch (error) {
      console.error("Admin order details fetch failed", error);
    }
  };

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
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500">
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
                    <td className="py-3 text-slate-700">{order.sellerName}</td>
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
                ))
              )}
            </tbody>
          </table>
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

function mapOrderStatus(status: string): OrderStatus {
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

function mapEscrowStatus(status: string): EscrowStatus {
  switch (status.toUpperCase()) {
    case "LOCKED":
      return "Locked";
    case "TRANSFERRED":
      return "Transferred";
    case "REFUNDED":
      return "Refunded";
    default:
      return "-";
  }
}
