"use client";

import {
  ShieldCheck,
  LayoutDashboard,
  PlusSquare,
  ListChecks,
  Users,
  ClipboardList,
  BookOpen,
  Store,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { Role } from "@/lib/types";
import RoleSwitcher from "@/components/RoleSwitcher";

const NAV_ITEMS: Record<Role, { label: string; href: string; icon: typeof LayoutDashboard }[]> = {
  buyer: [
    { label: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
    { label: "Create Order", href: "/buyer/create-order", icon: PlusSquare },
    { label: "My Orders", href: "/buyer/orders", icon: ListChecks },
  ],
  seller: [
    { label: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
    { label: "Orders", href: "/seller/orders", icon: Store },
  ],
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Accounts", href: "/admin/accounts", icon: Users },
    { label: "Orders", href: "/admin/orders", icon: ClipboardList },
    { label: "Ledger", href: "/admin/ledger", icon: BookOpen },
  ],
};

export default function Sidebar() {
  const { role } = useRole();
  const pathname = usePathname();
  const items = NAV_ITEMS[role];

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col justify-between bg-sidebar px-4 py-6">
      <div>
        <div className="mb-6 flex items-center gap-2 px-2">
          <ShieldCheck className="h-6 w-6 text-white" strokeWidth={2} />
          <span className="text-lg font-semibold tracking-wide text-white">
            SMARTPAY
          </span>
        </div>

        <RoleSwitcher />

        <nav className="flex flex-col gap-1">
          {items.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-active text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" strokeWidth={2} />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white">
        <LogOut className="h-4 w-4" strokeWidth={2} />
        Logout
      </button> */}
    </aside>
  );
}
