"use client";

import React from "react";
import ContactInfo from "./ContactInfo/ContactInfo";
import ContactForm from "./ContactForm/ContactForm";
import GoogleMap from "./GoogleMap/GoogleMap";
import { Truck, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function ContactPageContainer() {
  return (
    <div className="bg-gradient-to-b from-emerald-50/20 via-white to-white min-h-screen">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* 1. Contact Information Cards */}
        <ContactInfo />

        {/* 2. Form & Google Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 pb-12 sm:pb-16 items-stretch">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5 h-full">
            <GoogleMap />
          </div>
        </div>

        {/* 3. Delivery Coverage Guarantee Notice */}
        <div className="mb-14 sm:mb-16 p-6 sm:p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 shadow-xl shadow-emerald-950/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-block">
              Dhaka Coverage
            </span>
            <h3 className="font-extrabold text-base sm:text-lg text-white">
              30-Minute Dispatch to All Prime Dhaka Locations
            </h3>
            <p className="text-xs text-emerald-200/90 max-w-xl leading-relaxed">
              Serving Banani, Gulshan, Dhanmondi, Uttara, Mirpur, Mohammadpur, Badda, and Motijheel with live dispatch tracking and insulated temperature-safe bags.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Free over ৳500</span>
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Same-Day Guaranteed</span>
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
