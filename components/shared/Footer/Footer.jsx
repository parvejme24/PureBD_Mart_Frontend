"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import LOGO from "@/public/logo.png";
import { useSettings } from "@/hooks/useSettings";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { data: settings } = useSettings();

  return (
    <footer className="bg-slate-950 text-gray-300 border-t border-emerald-950/60 pt-12 pb-6">
      
      {/* 1. Value Highlights Band */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pb-12 border-b border-gray-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">Free Express Shipping</h5>
              <p className="text-[11px] text-gray-400">On all orders over ৳500</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">100% Organic Purity</h5>
              <p className="text-[11px] text-gray-400">Chemical & formalin free</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">Instant Replacement</h5>
              <p className="text-[11px] text-gray-400">No questions asked return</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/5 border border-white/5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs sm:text-sm font-bold text-white">Secure Checkout</h5>
              <p className="text-[11px] text-gray-400">bKash, Nagad & Cards</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-block">
              <div className="bg-white/95 px-3 py-1.5 rounded-2xl inline-block shadow-md">
                <Image
                  src={settings?.siteLogo?.url || LOGO}
                  alt={settings?.siteTitle || "PureBD Mart Logo"}
                  width={110}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
              PureBD Mart is your trusted destination for 100% authentic, unadulterated food harvested directly from certified local Bangladeshi farms. Healthy food for happy families.
            </p>

            <div className="space-y-2 pt-2 text-xs text-gray-300">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>House 42, Road 11, Banani, Dhaka, Bangladesh</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hotline: +880 1700-000000 (9 AM - 10 PM)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@purebdmart.com</span>
              </div>
            </div>
          </div>

          {/* Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: "Fresh Vegetables", href: "/shop?categories=vegetables" },
                { label: "Seasonal Fruits", href: "/shop?categories=fruits" },
                { label: "Cold-Pressed Oils", href: "/shop?categories=oil" },
                { label: "Sundarbans Honey", href: "/shop?categories=honey" },
                { label: "Organic Dairy & Ghee", href: "/shop?categories=dairy" },
                { label: "Traditional Spices", href: "/shop?categories=spices" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: "Track Your Order", href: "/dashboard/orders" },
                { label: "Shipping & Delivery Policy", href: "/about" },
                { label: "Return & Refund Policy", href: "/contact" },
                { label: "Frequently Asked Questions", href: "/contact" },
                { label: "Help Center & Complaints", href: "/contact" },
                { label: "Terms & Conditions", href: "/about" },
              ].map((item, idx) => (
                <li key={idx}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-1 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment & Trust (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Safe & Instant Payments
            </h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              We support all major Bangladeshi payment channels with instant confirmation & bank-grade 256-bit encryption.
            </p>

            {/* Payment methods badge strip */}
            <div className="flex flex-wrap gap-2 pt-1">
              {["bKash", "Nagad", "Rocket", "Visa", "Mastercard", "COD"].map((pay, i) => (
                <span
                  key={i}
                  className="bg-white/10 hover:bg-white/20 text-gray-200 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/10 transition-colors"
                >
                  {pay}
                </span>
              ))}
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 p-2.5 rounded-xl">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Orders dispatched within 30 minutes in Dhaka city.</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Bottom Copyright & Social Media Bar */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-6 border-t border-gray-800/60">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <p className="text-xs text-gray-500 text-center sm:text-left flex items-center gap-1">
            <span>© {currentYear} PureBD Mart. Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
            <span>for healthy Bangladeshi households.</span>
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {[
              { href: "https://facebook.com", Icon: Facebook, label: "Facebook" },
              { href: "https://instagram.com", Icon: Instagram, label: "Instagram" },
              { href: "https://youtube.com", Icon: Youtube, label: "YouTube" },
              { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
            ].map(({ href, Icon, label }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-emerald-600 hover:text-white border border-white/10 flex items-center justify-center text-gray-400 transition-all hover:scale-110 active:scale-95"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

        </div>
      </div>

    </footer>
  );
}
