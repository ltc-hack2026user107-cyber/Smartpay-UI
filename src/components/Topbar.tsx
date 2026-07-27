import { Bell } from "lucide-react";
import Image from "next/image";

export default function Topbar({ title }: { title: string }) {
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <h1 className="text-lg font-semibold text-indigo-600">{title}</h1>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Bell className="h-4 w-4 text-slate-500" strokeWidth={2} />
        </button>
        <div className="h-9 w-9 overflow-hidden rounded-full bg-slate-200">
          <Image
            src="https://i.pravatar.cc/72?img=32"
            alt="User avatar"
            width={36}
            height={36}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
}
