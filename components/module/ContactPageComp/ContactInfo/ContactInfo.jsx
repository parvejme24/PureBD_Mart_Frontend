"use client";

import React from "react";
import { MapPin, Phone, Mail, MessageCircle, Clock, Sparkles } from "lucide-react";

export default function ContactInfo() {
  const cards = [
    {
      icon: MapPin,
      title: "Our Headquarters",
      primary: "Banani, Dhaka, Bangladesh",
      detail: "House 42, Road 11, Block D, Banani",
      badge: "Hub & Office",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100 hover:border-emerald-400",
    },
    {
      icon: Phone,
      title: "Direct Phone Line",
      primary: "+880 1700-000000",
      detail: "Saturday – Thursday · 9 AM – 10 PM",
      badge: "Fastest Response",
      action: "tel:+8801700000000",
      actionText: "Call Now →",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100 hover:border-amber-400",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp Helpline",
      primary: "+880 1700-000000",
      detail: "Instant live agent assistance",
      badge: "Live Chat",
      action: "https://wa.me/8801700000000",
      actionText: "Chat on WhatsApp →",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100 hover:border-emerald-400",
    },
    {
      icon: Mail,
      title: "Support Email",
      primary: "support@purebdmart.com",
      detail: "Replies within 12-24 hours",
      badge: "24/7 Ticketing",
      action: "mailto:support@purebdmart.com",
      actionText: "Send Email →",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100 hover:border-blue-400",
    },
  ];

  return (
    <div className="pt-10 sm:pt-14 pb-8 sm:pb-10">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 mb-2.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>We&apos;re Here For You</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-950 tracking-tight mb-2.5">
          Get in Touch With Our Care Team
        </h1>

        <p className="text-xs sm:text-base text-gray-600 leading-relaxed">
          Have questions about an ongoing order, farm sourcing, or wholesale delivery? Reach us through any channel below.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {cards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className={`p-5 sm:p-6 rounded-3xl bg-white border ${item.border} shadow-sm hover:shadow-xl hover:shadow-emerald-950/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-11 h-11 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-gray-900 mb-1">
                  {item.title}
                </h3>

                <p className="font-black text-xs sm:text-sm text-emerald-700 truncate mb-1">
                  {item.primary}
                </p>

                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.detail}
                </p>
              </div>

              {item.action && (
                <div className="pt-3 border-t border-gray-100 mt-4">
                  <a
                    href={item.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors inline-block"
                  >
                    {item.actionText}
                  </a>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
