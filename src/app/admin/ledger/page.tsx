"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { Search, ChevronDown } from "lucide-react";
import { formatGBP } from "@/lib/format";
import { API_BASE_URL } from "@/lib/api";

const EVENT_FILTERS = ["All Events", "Order Created", "Funds Locked in Escrow", "Shipped", "Delivered"];

interface LedgerEntry {
  orderId: string;
  event: string;
  buyerHash: string;
  sellerHash: string;
  amount: number;
}

export default function LedgerExplorerPage() {
  const [eventFilter, setEventFilter] = useState("All Events");
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/admin/ledger`);
        if (!response.ok) {
          throw new Error("Failed to fetch ledger data");
        }

        const data: LedgerEntry[] = await response.json();
        setEntries(data);
      } catch (error) {
        console.error("Ledger fetch failed", error);
        setEntries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLedger();
  }, []);

  const filteredEntries = entries.filter(
    (entry) => eventFilter === "All Events" || entry.event === eventFilter
  );

  return (
    <AppShell title="12. GCUL Ledger Explorer">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by Order ID or Event..."
              className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-400"
            />
          </div>
          <div className="relative">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="appearance-none rounded-lg border border-slate-200 py-2 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-indigo-400"
            >
              {EVENT_FILTERS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-xs text-slate-400">
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Event</th>
                <th className="pb-3 font-medium">Buyer Gcul-Id</th>
                <th className="pb-3 font-medium">Seller Gcul-Id</th>
                <th className="pb-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    Loading ledger entries...
                  </td>
                </tr>
              ) : filteredEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-500">
                    No ledger entries found.
                  </td>
                </tr>
              ) : (
                filteredEntries.map((entry) => (
                  <tr key={`${entry.orderId}-${entry.event}`}>
                    <td className="py-3 text-slate-700">{entry.orderId}</td>
                    <td className="py-3 text-slate-700">{entry.event}</td>
                    <td className="py-3 font-mono text-xs text-sidebar-active">{entry.buyerHash}</td>
                    <td className="py-3 font-mono text-xs text-sidebar-active">{entry.sellerHash}</td>
                    <td className="py-3 text-slate-700">{formatGBP(entry.amount)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          Powered by GCUL (Google Cloud Universal Ledger)
        </p>
      </div>
    </AppShell>
  );
}
