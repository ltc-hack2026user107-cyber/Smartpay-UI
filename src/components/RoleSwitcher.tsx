"use client";

import { useRouter } from "next/navigation";
import { useRole } from "@/context/RoleContext";
import { Role } from "@/lib/types";
import { ChevronDown } from "lucide-react";

const ROLE_LABELS: Record<Role, string> = {
  buyer: "Buyer",
  seller: "Seller",
  admin: "Admin",
};

const ROLE_HOME: Record<Role, string> = {
  buyer: "/buyer/dashboard",
  seller: "/seller/dashboard",
  admin: "/admin/dashboard",
};

export default function RoleSwitcher() {
  const { role, setRole } = useRole();
  const router = useRouter();

  function handleChange(next: Role) {
    setRole(next);
    router.push(ROLE_HOME[next]);
  }

  return (
    <div className="relative mb-6 px-2">
      <label className="sr-only" htmlFor="role-switcher">
        Switch role
      </label>
      <select
        id="role-switcher"
        value={role}
        onChange={(e) => handleChange(e.target.value as Role)}
        className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 py-2 pl-3 pr-8 text-sm font-medium text-white outline-none focus:border-white/30"
      >
        {(Object.keys(ROLE_LABELS) as Role[]).map((r) => (
          <option key={r} value={r} className="bg-sidebar text-white">
            {ROLE_LABELS[r]} view
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        strokeWidth={2}
      />
    </div>
  );
}
