"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const banners = [
  {
    badge: "DAILY HARVEST",
    badgeColor: "bg-emerald-600 text-white",
    title: "100% Pure Organic Milk & Dairy",
    subtitle: "From grass-fed cows, unadulterated & fresh every morning.",
    offer: "Save 25% Today",
    cta: "Shop Dairy",
    link: "/shop",
    bgGradient: "from-emerald-900/90 via-emerald-800/80 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80",
  },
  {
    badge: "VILLAGE TRADITION",
    badgeColor: "bg-amber-600 text-white",
    title: "Cold-Pressed Mustard Oil & Spices",
    subtitle: "Aromatic, pure wood-pressed oils with rich natural pungency.",
    offer: "Starting at ৳160",
    cta: "Explore Oils",
    link: "/shop",
    bgGradient: "from-amber-950/90 via-amber-900/80 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
  },
];

export default function PromoBanners() {
  return (
    <section className="py-6 sm:py-8">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {banners.map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-3xl overflow-hidden min-h-[220px] sm:min-h-[260px] flex items-center p-6 sm:p-8 shadow-md shadow-emerald-950/5 group border border-emerald-100/40"
            >
              {/* Background Image */}
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
              />

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient}`} />

              {/* Content */}
              <div className="relative z-10 max-w-sm text-white">
                <span className={`inline-block text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full ${item.badgeColor} mb-2 shadow-sm`}>
                  {item.badge}
                </span>

                <h3 className="text-lg sm:text-2xl font-extrabold text-white leading-snug mb-1 drop-shadow-xs">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 mb-3">
                  {item.subtitle}
                </p>

                <p className="text-amber-300 font-extrabold text-xs sm:text-sm tracking-wide mb-4">
                  {item.offer}
                </p>

                <Link href={item.link}>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-emerald-50 text-gray-900 hover:text-emerald-700 font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{item.cta}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
