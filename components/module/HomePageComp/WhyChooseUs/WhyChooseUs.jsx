"use client";

import React from "react";
import {
  CheckCircle2,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  Sprout,
  RefreshCw,
  ArrowRight,
  Award,
  Leaf,
  FlaskConical,
  Scale,
} from "lucide-react";

const pillars = [
  {
    step: "01",
    tag: "Fair & Fresh",
    badge: "50+ Vetted Farms",
    icon: Sprout,
    title: "Direct From Local Farmers",
    desc: "We partner directly with certified organic growers across Bogura, Rajshahi, and Sylhet. No middlemen, no inflated markups — ensuring maximum harvest freshness and fair earnings for our farmers.",
    perks: ["Zero Middlemen Markup", "Harvested Daily at Dawn", "Fair Farmer Pricing"],
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
    border: "border-emerald-200/80 hover:border-emerald-500",
    iconBg: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
    tagBg: "bg-emerald-100/80 text-emerald-800",
    hoverGlow: "group-hover:shadow-emerald-600/10",
  },
  {
    step: "02",
    tag: "100% Purity",
    badge: "Lab-Tested 0% Formalin",
    icon: FlaskConical,
    title: "100% Formalin & Chemical Free",
    desc: "Every single lot of vegetables, fruits, cold-pressed oils, and dairy undergoes strict purity screening before reaching packaging. Zero artificial ripeners, zero chemicals, pure nutrition.",
    perks: ["Tested for Formalin & Carbides", "Unadulterated Cold Pressed", "Lab Certified Quality"],
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
    border: "border-amber-200/80 hover:border-amber-500",
    iconBg: "bg-amber-500/15 text-amber-600 ring-amber-500/20",
    tagBg: "bg-amber-100/80 text-amber-800",
    hoverGlow: "group-hover:shadow-amber-600/10",
  },
  {
    step: "03",
    tag: "Risk Free",
    badge: "No Questions Asked",
    icon: RefreshCw,
    title: "Instant Replacement Guarantee",
    desc: "We take 100% responsibility for your satisfaction. If any produce fails to meet your freshness or taste expectations, we replace or refund it immediately with zero paperwork.",
    perks: ["Instant WhatsApp Support", "Same-Day Free Replacement", "Full Refund Guarantee"],
    gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    border: "border-blue-200/80 hover:border-blue-500",
    iconBg: "bg-blue-500/15 text-blue-600 ring-blue-500/20",
    tagBg: "bg-blue-100/80 text-blue-800",
    hoverGlow: "group-hover:shadow-blue-600/10",
  },
  {
    step: "04",
    tag: "Eco Friendly",
    badge: "Zero Single-Use Plastic",
    icon: Leaf,
    title: "Biodegradable Food Packaging",
    desc: "We deliver all fresh items using food-grade recyclable cardboard and biodegradable cloth bags, protecting your family’s meals while keeping Bangladeshi soil and rivers plastic-free.",
    perks: ["Food-Grade Paper Bags", "Reusable Fabric Pouches", "100% Eco-Safe Delivery"],
    gradient: "from-teal-500/10 via-teal-500/5 to-transparent",
    border: "border-teal-200/80 hover:border-teal-500",
    iconBg: "bg-teal-500/15 text-teal-600 ring-teal-500/20",
    tagBg: "bg-teal-100/80 text-teal-800",
    hoverGlow: "group-hover:shadow-teal-600/10",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-12 sm:py-20 bg-gradient-to-b from-white via-emerald-50/20 to-white overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2.5 bg-emerald-100/70 border border-emerald-300/80 px-3.5 py-1 rounded-full shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>The PureBD Mart Promise</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight mb-3 leading-tight">
            Why Thousands of Families <span className="text-emerald-600">Trust PureBD Mart</span>
          </h2>

          <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
            We are on a mission to bring clean, authentic, and naturally grown food straight from Bangladeshi countryside to your dining table.
          </p>
        </div>

        {/* 4 Pillars Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`relative group bg-white rounded-3xl p-6 border ${item.border} shadow-sm hover:shadow-2xl ${item.hoverGlow} hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden`}
              >
                {/* Top Subtle Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-b ${item.gradient} pointer-events-none`} />

                <div className="relative z-10">
                  {/* Top Header Row with Icon & Pillar Step Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-13 h-13 rounded-2xl ${item.iconBg} ring-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xs`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>

                    <span className="font-mono text-xs font-extrabold text-gray-400 group-hover:text-gray-900 transition-colors bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-full">
                      Pillar {item.step}
                    </span>
                  </div>

                  {/* Micro Badge Tag */}
                  <span className={`inline-block text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${item.tagBg} mb-2 shadow-xs`}>
                    {item.badge}
                  </span>

                  {/* Title */}
                  <h3 className="font-extrabold text-base sm:text-lg text-gray-900 mb-2.5 leading-snug group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-5">
                    {item.desc}
                  </p>
                </div>

                {/* Bottom Perks Checklist */}
                <div className="relative z-10 pt-4 border-t border-gray-100/80 space-y-1.5 mt-auto">
                  {item.perks.map((perk, pIdx) => (
                    <div
                      key={pIdx}
                      className="flex items-center gap-2 text-[11px] sm:text-xs text-gray-700 font-semibold"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{perk}</span>
                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
