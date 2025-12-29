"use client";

import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";

export default function layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
