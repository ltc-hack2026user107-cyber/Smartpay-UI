"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { Lock, ChevronDown, Calendar } from "lucide-react";
import { SELLERS } from "@/data/mockData";
import { API_BASE_URL } from "@/lib/api";
import { formatGBP } from "@/lib/format";

export default function CreateOrderPage() {
  const today = new Date().toISOString().split("T")[0];
  const [seller, setSeller] = useState(SELLERS[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [deliveryDate, setDeliveryDate] = useState(today);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);

    const trimmedDescription = description.trim();
    const trimmedAmount = Number(amount);
    const trimmedDeliveryDate = deliveryDate?.trim() || "";
    const selectedDate = new Date(trimmedDeliveryDate);
    const todayDate = new Date(today);

    if (!seller || !trimmedDescription || !trimmedAmount || !trimmedDeliveryDate || selectedDate < todayDate) {
      setFeedback({
        type: "error",
        message: "Please fill in all fields before creating the order.",
      });
      return;
    }

    setIsSubmitting(true);

    const payload = {
      _id: `SP${Date.now().toString().slice(-6)}`,
      buyer: {
        id: "buyer_001",
        name: "Lloyds Procurement",
      },
      seller: {
        id: "seller_001",
        name: seller,
      },
      description: trimmedDescription,
      amount: trimmedAmount,
      currency: "GBP",
      deliveryDate: trimmedDeliveryDate,
      orderStatus: "IN_TRANSIT",
      escrow: {
        status: "LOCKED",
        lockedAmount: Number(amount),
        lockedDate: new Date().toISOString(),
      },
      timeline: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(responseData?.message || "Failed to create order");
      }

      setFeedback({
        type: "success",
        message: responseData?.message || "Order created successfully",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "Unable to create order",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell title="Create Order">
      <div className="max-w-xl rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">
          Create New Order
        </h2>
        <p className="mb-6 mt-1 text-sm text-slate-500">
          Fill in the details to create a new order
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Select Seller
            </label>
            <div className="relative">
              <select
                value={seller}
                onChange={(e) => setSeller(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 py-2.5 pl-3 pr-9 text-sm text-slate-900 outline-none focus:border-indigo-400"
              >
                {SELLERS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Goods Description
            </label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Amount (GBP)
              </label>
              <div className="flex items-center rounded-lg border border-slate-200 px-3 py-2.5">
                <span className="mr-1 text-sm text-slate-400">£</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full text-sm text-slate-900 outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Agreed Delivery Date
              </label>
              <div className="relative flex items-center rounded-lg border border-slate-200 px-3 py-2.5">
                <input
                  type="date"
                  min={today}
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full text-sm text-slate-900 outline-none [color-scheme:light]"
                />
                <Calendar className="pointer-events-none h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-indigo-50 px-4 py-4">
            <div>
              <p className="text-sm text-indigo-500">You will pay</p>
              <p className="text-xl font-semibold text-slate-900">
                {formatGBP(typeof amount === "number" ? amount : 0)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Amount will be locked in Escrow
              </p>
            </div>
            <Lock className="h-5 w-5 text-indigo-500" strokeWidth={2} />
          </div>

          {feedback ? (
            <div
              className={`rounded-lg border px-3 py-2 text-sm ${
                feedback.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                  : "border-rose-200 bg-rose-50 text-rose-700"
              }`}
            >
              {feedback.message}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-sidebar-active py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Creating Order..." : "Create Order"}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
