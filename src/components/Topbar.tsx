import { Bell, Menu } from "lucide-react";

export default function Topbar({
  title,
  onMenuClick,
}: {
  title: string;
  onMenuClick?: () => void;
}) {
  return (
    <header className="flex items-center justify-between px-4 sm:px-8 py-6">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-indigo-600">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Bell className="h-4 w-4 text-slate-500" strokeWidth={2} />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-500 text-lg">
          <span aria-hidden="true">👤</span>
          <span className="sr-only">User profile</span>
        </div>
      </div>
    </header>
  );
}
