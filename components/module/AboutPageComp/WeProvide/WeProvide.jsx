"use client";

import React from "react";
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
  HeartHandshake,
  Sprout,
  CheckCircle2,
} from "lucide-react";

const provisions = [
  {
    icon: Tag,
    title: "Best Farm Direct Prices",
    description: "By cutting out traditional middlemen, we offer premium authentic groceries, raw honey, and cold-pressed oils at honest, affordable prices.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100 hover:border-emerald-400",
  },
  {
    icon: Sprout,
    title: "100% Organic & Chemical Free",
    description: "Every single lot of vegetables, fruits, and dairy is rigorously screened for zero formalin, harmful carbides, and artificial preservatives.",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100 hover:border-amber-400",
  },
  {
    icon: Truck,
    title: "Express 30-Min Delivery",
    description: "Fast, reliable doorstep delivery throughout Dhaka city with live dispatch notifications. Free shipping on all orders over ৳500.",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100 hover:border-blue-400",
  },
  {
    icon: RotateCcw,
    title: "Hassle-Free Instant Returns",
    description: "Not 100% delighted with the freshness or taste? We offer immediate replacement or a full refund with zero unnecessary paperwork.",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100 hover:border-rose-400",
  },
  {
    icon: ShieldCheck,
    title: "Verified Source Traceability",
    description: "Know exactly where your food comes from. Every product is traced back to vetted organic growers and traditional Bangladeshi producers.",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100 hover:border-purple-400",
  },
  {
    icon: HeartHandshake,
    title: "24/7 Dedicated Support",
    description: "Our dedicated care team in Dhaka is always available via phone hotline and WhatsApp to assist you with order inquiries and recommendations.",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100 hover:border-teal-400",
  },
];

export default function WeProvide() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Why Choose PureBD Mart</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight mb-2.5">
            The PureBD Mart Difference
          </h2>

          <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
            We hold ourselves to higher standards so you can feed your family with total peace of mind.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {provisions.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`group p-6 sm:p-7 rounded-3xl bg-white border ${item.border} shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100/80 mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Guaranteed Standard</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
