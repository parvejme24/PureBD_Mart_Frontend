"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, ShieldCheck, Heart, Award, Users, Sprout, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const stats = [
  { value: "50,000+", label: "Happy Households", icon: Users },
  { value: "100+", label: "Partner Farms", icon: Sprout },
  { value: "0%", label: "Formalin or Chemicals", icon: ShieldCheck },
  { value: "99.4%", label: "On-Time Dispatch", icon: Award },
];

export default function AboutUs() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-white pt-10 sm:pt-16 pb-12 sm:pb-16">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Main Grid: Story + Visual Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-14 sm:mb-16">
          
          {/* Left Text Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 border border-emerald-300/80 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>The PureBD Mart Story • Born in Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight leading-tight">
              Bringing <span className="text-emerald-600">Pure, Clean & Authentic Food</span> Directly to Your Family
            </h1>

            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              PureBD Mart was founded with one honest conviction: <strong className="text-gray-900 font-bold">every family in Bangladesh deserves unadulterated, wholesome food</strong> free from toxic chemicals, artificial colors, and synthetic ripeners.
            </p>

            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We cut out predatory middlemen to partner directly with certified organic growers in Bogura, Rajshahi, Dinajpur, and the Sundarbans. From cold-pressed mustard oil, raw honey, and aromatic spices to fresh morning harvest vegetables and farm dairy — every item is lab-tested and delivered fresh to your doorstep within hours.
            </p>

            {/* Core Values Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Zero Chemical Guarantee</h4>
                  <p className="text-[11px] text-gray-500">Rigorous formalin & purity tests.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-white border border-emerald-100 shadow-xs">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Fair Farmer Pricing</h4>
                  <p className="text-[11px] text-gray-500">Supporting local farming roots.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link href="/shop">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all">
                  <span>Explore Organic Mart</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-gray-200 text-gray-700 hover:bg-emerald-50 text-xs sm:text-sm font-bold rounded-xl px-5 py-3">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Visual Image Column (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-emerald-950/15 border-4 border-white bg-gray-100">
              <Image
                src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                alt="PureBD Mart Organic Harvest"
                width={700}
                height={600}
                className="w-full h-80 sm:h-96 object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/80 via-transparent to-transparent" />

              {/* Floating Quality Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/40 shadow-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 font-black text-sm">
                  100%
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900">Fresh Farm-To-Table Promise</h4>
                  <p className="text-[11px] text-gray-500">Harvested within 24 hours of delivery</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 p-5 sm:p-6 rounded-3xl bg-white border border-emerald-100/80 shadow-md shadow-emerald-950/5">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="flex items-center gap-3 p-2">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {s.value}
                  </h3>
                  <p className="text-xs text-gray-500 font-semibold">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
