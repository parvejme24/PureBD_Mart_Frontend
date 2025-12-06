"use client";

import DashboardSidebar from "@/components/shared/DashboardSidebar/DashboardSidebar";
import Navbar from "@/components/shared/Navbar/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <Navbar />
      <div className="container mx-auto max-w-7xl pr-5 lg:pr-0 lg:px-5">
        <div className="flex gap-5 py-5">
          {/* Sidebar - Hidden on mobile, shown via floating button */}
          <div className="hidden lg:block w-[280px] shrink-0">
            <DashboardSidebar />
          </div>

          {/* Mobile Sidebar (rendered but hidden by default) */}
          <div className="lg:hidden">
            <DashboardSidebar />
          </div>

          {/* Main Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
