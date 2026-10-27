"use client";

import React from "react";
import { Star, Quote, CheckCircle, Sparkles } from "lucide-react";
import Image from "next/image";

const reviews = [
  {
    name: "Dr. Farhana Yasmin",
    role: "Nutritionist & Mother",
    location: "Gulshan, Dhaka",
    rating: 5,
    review:
      "Finding genuine formalin-free vegetables in Dhaka used to be stressful. PureBD Mart's morning harvest deliveries are exceptionally crisp, naturally sweet, and always on time.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    verified: "Verified Buyer",
  },
  {
    name: "Tanvir Ahmed",
    role: "Software Engineer",
    location: "Uttara, Dhaka",
    rating: 5,
    review:
      "The cold-pressed mustard oil and raw Sundarbans honey remind me of our village. Excellent packaging, polite delivery team, and the 30-min express grocery service is a lifesaver!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    verified: "Verified Buyer",
  },
  {
    name: "Nusrat Jahan",
    role: "Home Baker",
    location: "Dhanmondi, Dhaka",
    rating: 5,
    review:
      "I source their organic butter, flour, and natural spices for my bakery. The consistent quality and zero adulteration have earned my complete trust. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    verified: "Verified Buyer",
  },
];

export default function Testimonials() {
  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-2 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Community Love</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
            Loved by Over 10,000+ Happy Households
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Read what our conscious food lovers and regular shoppers have to say.
          </p>
        </div>

        {/* 3 Review Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {reviews.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white rounded-3xl p-6 sm:p-7 border border-emerald-50 shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Top Quote Icon & Stars */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <Quote className="w-6 h-6 text-emerald-200" />
              </div>

              {/* Review Text */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6 italic">
                &ldquo;{item.review}&rdquo;
              </p>

              {/* Reviewer Details */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 mt-auto">
                <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-emerald-200">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="44px"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-gray-900 truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate">
                    {item.role} • {item.location}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[10px] text-emerald-600 font-semibold mt-0.5">
                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                    <span>{item.verified}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
