"use client";

import React from "react";
import { Truck, ShieldCheck, Clock, Headphones, Award } from "lucide-react";

const features = [
  {
    icon: Truck,
    title: "Free Express Delivery",
    desc: "On all orders over ৳500",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Award,
    title: "100% Organic & Pure",
    desc: "Chemical-free & farm fresh",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: Clock,
    title: "30-Min Fast Delivery",
    desc: "Quick delivery to your door",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Secure Payment",
    desc: "bKash, Nagad & Cash on delivery",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-100",
  },
  {
    icon: Headphones,
    title: "24/7 Dedicated Support",
    desc: "Instant live agent assistance",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
];

export default function FeaturesBar() {
  return (
    <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-5 pb-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3.5">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl bg-white border ${item.border} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-800 truncate">
                  {item.title}
                </h4>
                <p className="text-[11px] text-gray-500 truncate hidden xs:block">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
