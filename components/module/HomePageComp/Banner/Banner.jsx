"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, Truck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const slides = [
  {
    id: 1,
    tag: "🌱 100% Organic & Chemical Free",
    tagColor: "bg-emerald-500/90 text-white",
    discount: "SAVE UP TO 40% OFF",
    title: "Fresh Farm Harvest",
    highlight: "Direct to Your Doorstep",
    desc: "Handpicked daily vegetables, seasonal fruits, and dairy from certified local Bangladeshi farms.",
    cta: "Shop Daily Groceries",
    link: "/shop",
    bgGradient: "from-emerald-950/85 via-emerald-900/70 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    features: ["Same-Day Delivery", "Pesticide-Free", "Money-back Guarantee"],
  },
  {
    id: 2,
    tag: "⚡ 30-Minute Lightning Delivery",
    tagColor: "bg-amber-500/90 text-white",
    discount: "EXPRESS SERVICE IN DHAKA",
    title: "Need Groceries Now?",
    highlight: "Delivered in 30 Mins",
    desc: "From cooking oils, rice, and spices to everyday essentials — instant delivery at your doorstep.",
    cta: "Order Express Now",
    link: "/shop",
    bgGradient: "from-slate-950/85 via-slate-900/70 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1608686207856-001b95cf60ca?auto=format&fit=crop&w=1600&q=80",
    features: ["Live Tracking", "Freshly Packed", "Zero Hassle Return"],
  },
  {
    id: 3,
    tag: "🍯 Pure & Traditional Delicacies",
    tagColor: "bg-orange-500/90 text-white",
    discount: "AUTHENTIC VILLAGE TASTE",
    title: "Pure Mustard Oil, Ghee",
    highlight: "& Natural Sundarbans Honey",
    desc: "Unadulterated cold-pressed oils, organic honey, and aromatic spices straight from our roots.",
    cta: "Discover Pure Essentials",
    link: "/shop",
    bgGradient: "from-amber-950/85 via-amber-900/70 to-transparent",
    imageUrl: "https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?auto=format&fit=crop&w=1600&q=80",
    features: ["100% Pure Certified", "Lab Tested", "No Preservatives"],
  },
];

const sidePromos = [
  {
    title: "Fresh Seasonal Fruits",
    subtitle: "Mangoes, Apples & Citrus",
    discount: "30% OFF",
    bgGradient: "from-orange-500/10 via-amber-500/20 to-orange-100",
    borderColor: "border-orange-200/60",
    badgeColor: "bg-orange-500 text-white",
    textColor: "text-orange-950",
    imgUrl: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?auto=format&fit=crop&w=500&q=80",
    link: "/shop",
  },
  {
    title: "Cold Pressed Mustards & Spices",
    subtitle: "Authentic Bangali Kitchen",
    discount: "STARTING ৳149",
    bgGradient: "from-emerald-500/10 via-teal-500/20 to-emerald-100",
    borderColor: "border-emerald-200/60",
    badgeColor: "bg-emerald-600 text-white",
    textColor: "text-emerald-950",
    imgUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=500&q=80",
    link: "/shop",
  },
];

export default function Banner() {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Autoplay functionality
  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 5500);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <div className="relative pt-3 sm:pt-6 pb-2 overflow-hidden bg-gradient-to-b from-emerald-50/40 via-white to-gray-50/30">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5 items-stretch">
          
          {/* Main Hero Slider (12 cols on mobile/tablet, 8 cols on desktop) */}
          <div className="lg:col-span-8 w-full">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl shadow-emerald-950/5 border border-emerald-100/60 bg-gray-900 group">
              <Carousel setApi={setApi} className="w-full">
                <CarouselContent>
                  {slides.map((slide, index) => (
                    <CarouselItem key={slide.id}>
                      <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[500px] lg:min-h-[480px] flex items-center overflow-hidden">
                        
                        {/* Background Image with Fallback */}
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          fill
                          priority={index === 0}
                          className="object-cover object-center transform group-hover:scale-105 transition-transform duration-1000 ease-out"
                          sizes="(max-width: 1024px) 100vw, 66vw"
                        />

                        {/* Dark Gradient Overlay for Readability */}
                        <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgGradient}`} />
                        <div className="absolute inset-0 bg-black/25" />

                        {/* Content */}
                        <div className="relative z-10 px-5 sm:px-8 md:px-12 py-8 max-w-2xl text-white">
                          {/* Badge Tag */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md mb-3 sm:mb-4 shadow-sm border border-white/20 bg-white/15">
                            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                            <span>{slide.tag}</span>
                          </div>

                          {/* Discount Pill */}
                          <p className="text-amber-400 font-extrabold text-xs sm:text-sm tracking-wider uppercase mb-1 sm:mb-2">
                            {slide.discount}
                          </p>

                          {/* Main Title */}
                          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-2 sm:mb-3 drop-shadow-sm">
                            {slide.title}{" "}
                            <span className="text-emerald-300 block sm:inline">
                              {slide.highlight}
                            </span>
                          </h1>

                          {/* Description */}
                          <p className="text-gray-200 text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-2 sm:line-clamp-3 max-w-lg">
                            {slide.desc}
                          </p>

                          {/* Features Pills */}
                          <div className="hidden sm:flex flex-wrap items-center gap-3 mb-6 text-xs text-gray-200">
                            {slide.features.map((feat, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-white/10"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                {feat}
                              </span>
                            ))}
                          </div>

                          {/* CTA Actions */}
                          <div className="flex items-center gap-3">
                            <Link href={slide.link}>
                              <Button
                                size="lg"
                                className="bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-bold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-xl shadow-lg shadow-emerald-500/30 transition-all flex items-center gap-2 cursor-pointer text-xs sm:text-base"
                              >
                                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span>{slide.cta}</span>
                                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1" />
                              </Button>
                            </Link>

                            <Link href="/shop" className="hidden sm:inline-block">
                              <Button
                                variant="outline"
                                size="lg"
                                className="border-white/40 text-white hover:bg-white/20 hover:text-white rounded-xl backdrop-blur-sm text-xs sm:text-sm"
                              >
                                Browse All
                              </Button>
                            </Link>
                          </div>
                        </div>

                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Elegant Controls */}
                <div className="hidden sm:block">
                  <CarouselPrevious className="left-4 bg-white/80 hover:bg-white text-gray-800 border-none shadow-md backdrop-blur-md transition-all h-10 w-10 cursor-pointer" />
                  <CarouselNext className="right-4 bg-white/80 hover:bg-white text-gray-800 border-none shadow-md backdrop-blur-md transition-all h-10 w-10 cursor-pointer" />
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/25 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      aria-label={`Go to slide ${i + 1}`}
                      onClick={() => api?.scrollTo(i)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        current === i ? "w-6 bg-emerald-400" : "w-2 bg-white/60 hover:bg-white"
                      }`}
                    />
                  ))}
                </div>
              </Carousel>
            </div>
          </div>

          {/* Right Side Featured Promo Banners (Visible on desktop lg+) */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 lg:gap-4 justify-between">
            {sidePromos.map((promo, idx) => (
              <Link
                key={idx}
                href={promo.link}
                className={`relative flex-1 rounded-2xl sm:rounded-3xl p-5 sm:p-6 overflow-hidden border ${promo.borderColor} bg-gradient-to-br ${promo.bgGradient} shadow-md shadow-emerald-950/5 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
              >
                {/* Background Accent Image */}
                <div className="absolute right-[-10px] bottom-[-10px] w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden opacity-85 group-hover:scale-110 transition-transform duration-500">
                  <Image
                    src={promo.imgUrl}
                    alt={promo.title}
                    fill
                    className="object-cover"
                    sizes="160px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-white/90" />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-[65%]">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${promo.badgeColor} mb-2 shadow-xs`}>
                    {promo.discount}
                  </span>
                  <h3 className={`text-base sm:text-lg font-bold ${promo.textColor} leading-snug mb-1`}>
                    {promo.title}
                  </h3>
                  <p className="text-xs text-gray-600 line-clamp-1 mb-4">
                    {promo.subtitle}
                  </p>
                </div>

                {/* Bottom CTA */}
                <div className="relative z-10 flex items-center gap-1.5 text-xs font-bold text-emerald-800 group-hover:text-emerald-950 group-hover:translate-x-1 transition-all">
                  <span>Shop Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
