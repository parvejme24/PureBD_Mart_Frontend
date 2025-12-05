"use client";

import Footer from "@/components/shared/Footer/Footer";
import Navbar from "@/components/shared/Navbar/Navbar";

export default function layout({ children }) {
  return (
    <div className="">
      <Navbar />
      <main className="">
        {children}
      </main>
      <Footer />
    </div>
  );
}
