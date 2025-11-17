import DashboardSidebar from "@/components/shared/DashboardSidebar/DashboardSidebar";
import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";
import React from "react";

export default function layout({ children }) {
  return (
    <div className="">
      <Navbar />
      <main className="container mx-auto max-w-7xl px-5 flex flex-row gap-5 my-5">
        <DashboardSidebar />
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
