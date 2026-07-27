import { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export default function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F3F4F8]">
      <Sidebar />
      <div className="flex-1">
        <Topbar title={title} />
        <main className="px-8 pb-8">{children}</main>
      </div>
    </div>
  );
}
