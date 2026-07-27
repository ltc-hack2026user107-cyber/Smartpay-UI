"use client";

import { X, CheckCircle2, Circle } from "lucide-react";
import { Order } from "@/lib/types";
import { formatGBP } from "@/lib/format";
import Badge from "@/components/Badge";

export default function OrderDetailsModal({
  order,
  perspective,
  onClose,
}: {
  order: Order;
  perspective: "buyer" | "seller";
  onClose: () => void;
}) {
  const counterpartyLabel = perspective === "buyer" ? "Seller" : "Buyer";
  const counterpartyValue = perspective === "buyer" ? order.seller : order.buyer;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between">
          <h3 className="text-base font-semibold text-slate-900">
            3. Order Details (Modal)
          </h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400">Order ID</p>
            <p className="font-semibold text-slate-900">{order.id}</p>
          </div>
          <Badge status={order.status} />
        </div>

        <dl className="mb-6 space-y-3 text-sm">
          <Row label={counterpartyLabel} value={counterpartyValue} />
          <Row label="Description" value={order.description} />
          <Row label="Amount" value={formatGBP(order.amount)} />
          <Row label="Delivery Date" value={order.deliveryDate} />
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Escrow Status</dt>
            <dd>
              <Badge status={order.escrowStatus} />
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-slate-500">Order Status</dt>
            <dd>
              <Badge status={order.status} />
            </dd>
          </div>
        </dl>

        <p className="mb-3 text-sm font-semibold text-slate-900">
          Order Timeline
        </p>
        <ul className="space-y-4">
          {order.timeline.map((step, i) => (
            <li key={step.label} className="flex gap-3">
              <div className="flex flex-col items-center">
                {step.state === "done" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" strokeWidth={2.5} />
                ) : step.state === "current" ? (
                  <span className="flex h-4 w-4 items-center justify-center">
                    <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  </span>
                ) : (
                  <Circle className="h-4 w-4 text-slate-300" strokeWidth={2} />
                )}
                {i < order.timeline.length - 1 && (
                  <span className="mt-1 h-6 w-px bg-slate-200" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    step.state === "pending" ? "text-slate-400" : "text-slate-900"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400">
                  {step.timestamp ?? "Pending"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
