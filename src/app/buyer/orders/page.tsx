"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import Badge from "@/components/Badge";
import OrderDetailsModal from "@/components/OrderDetailsModal";
import { formatGBP } from "@/lib/format";
import { Search, SlidersHorizontal } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { EscrowStatus, Order, OrderStatus, TimelineStep } from "@/lib/types";

interface BuyerOrderListItem {
  orderId: string;
  sellerName: string;
  description: string;
  amount: number;
  deliveryDate: string;
  status: string;
}

interface BuyerOrderDetailResponse {
  _id: string;
  buyer: { id: string; name: string };
  seller: { id: string; name: string };
  description: string;
  amount: number;
  currency: string;
  deliveryDate: string;
  escrow: {
    status: string;
    lockedAmount: number;
    lockedDate: string;
  };
  timeline: Array<{
    status: string;
    label: string;
    timestamp: string | null;
  }>;
  createdAt: string;
  orderStatus: string;
  updatedAt: string;
}

const buyerId = "buyer_001";

export default function BuyerOrdersPage() {
  const [tab, setTab] = useState<"Ongoing" | "History">("Ongoing");
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const endpoint =
          tab === "Ongoing"
            ? `${API_BASE_URL}/orders/buyers/${buyerId}/ongoing`
            : `${API_BASE_URL}/orders/buyers/${buyerId}/history`;

        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data: BuyerOrderListItem[] = await response.json();
        setOrders(
          data.map((item) => mapListItemToOrder(item))
        );
      } catch (error) {
        console.error("Buyer orders fetch failed", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [tab]);

  const handleOpenOrder = async (orderId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const detail: BuyerOrderDetailResponse = await response.json();
      setSelectedOrder(mapDetailToOrder(detail));
    } catch (error) {
      console.error("Order details fetch failed", error);
    }
  };

  return (
    <AppShell title="My Orders">
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
                  <tr key={order.id}>
                    <td className="py-3">
                      <button
                        onClick={() => handleOpenOrder(order.id)}
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
                    {/* <td className="py-3">
                      <Badge status={order.escrowStatus} />
                    </td> */}
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

function mapListItemToOrder(item: BuyerOrderListItem): Order {
  return {
    id: item.orderId,
    buyer: buyerId,
    seller: item.sellerName,
    description: item.description,
    amount: item.amount,
    deliveryDate: item.deliveryDate,
    status: mapOrderStatus(item.status),
    escrowStatus: mapEscrowStatus(item.status),
    createdOn: item.deliveryDate,
    timeline: [],
  };
}

function mapDetailToOrder(detail: BuyerOrderDetailResponse): Order {
  const timeline: TimelineStep[] = detail.timeline.map((step, index, arr) => {
    const currentIndex = arr.findIndex((entry) => entry.status === detail.orderStatus || statusMatches(detail.orderStatus, entry.status));
    const state = currentIndex === -1 ? (index === arr.length - 1 ? "current" : "pending") : index < currentIndex ? "done" : index === currentIndex ? "current" : "pending";

    return {
      label: step.label,
      timestamp: step.timestamp,
      state,
    };
  });

  return {
    id: detail._id,
    buyer: detail.buyer.name,
    seller: detail.seller.name,
    description: detail.description,
    amount: detail.amount,
    deliveryDate: detail.deliveryDate,
    status: mapOrderStatus(detail.orderStatus),
    escrowStatus: mapEscrowStatus(detail.escrow.status),
    createdOn: detail.createdAt,
    timeline,
  };
}

function mapOrderStatus(status: string): OrderStatus {
  switch (status.toUpperCase()) {
    case "ORDER_CREATED":
      return "Created";
    case "ACCEPTED":
    case "SELLER_ACCEPTED":
      return "Accepted";
    case "SHIPPED":
      return "Shipped";
    case "IN_TRANSIT":
      return "In Transit";
    case "DELIVERED":
      return "Delivered";
    case "REFUNDED":
      return "Refunded";
    case "DECLINED":
      return "Declined";
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

function statusMatches(currentStatus: string, candidateStatus: string): boolean {
  return mapOrderStatus(currentStatus) === mapOrderStatus(candidateStatus);
}
