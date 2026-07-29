"use client";

import { ReactNode, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export default function AppShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F3F4F8] overflow-x-hidden">
      {/* Mobile Sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-[1.5px] md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col justify-between min-w-0">
        <div>
          <Topbar title={title} onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="px-4 sm:px-8 pb-8">{children}</main>
        </div>
        <Footer />
      </div>
    </div>
  );
}
