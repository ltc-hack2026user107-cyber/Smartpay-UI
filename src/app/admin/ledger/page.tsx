"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import { LEDGER_ENTRIES } from "@/data/mockData";
import { Search, ChevronDown } from "lucide-react";

const EVENT_FILTERS = ["All Events", "Order Created", "Funds Locked in Escrow", "Shipped", "Delivered"];

export default function LedgerExplorerPage() {
  const [eventFilter, setEventFilter] = useState("All Events");

  return (
    <AppShell title="12. GCUL Ledger Explorer">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Search by Txn Hash or Order ID..."
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
                <th className="pb-3 font-medium">Txn Hash</th>
                <th className="pb-3 font-medium">Order ID</th>
                <th className="pb-3 font-medium">Event</th>
                <th className="pb-3 font-medium">Timestamp</th>
                <th className="pb-3 font-medium">Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {LEDGER_ENTRIES.filter(
                (e) => eventFilter === "All Events" || e.event === eventFilter
              ).map((entry) => (
                <tr key={entry.txnHash}>
                  <td className="py-3 font-mono text-xs text-sidebar-active">
                    {entry.txnHash}
                  </td>
                  <td className="py-3 text-slate-700">{entry.orderId}</td>
                  <td className="py-3 text-slate-700">{entry.event}</td>
                  <td className="py-3 text-slate-500">{entry.timestamp}</td>
                  <td className="py-3 text-slate-500">{entry.block}</td>
                </tr>
              ))}
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
