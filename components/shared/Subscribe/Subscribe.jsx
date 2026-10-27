"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Image from "next/image";
import { Send, Sparkles, CheckCircle2, ShieldCheck, Mail } from "lucide-react";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address",
        confirmButtonColor: "#16a34a",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Subscribed Successfully!",
          text: result.message || "Thank you for subscribing to PureBD Mart! Check your inbox for your ৳100 voucher.",
          confirmButtonColor: "#16a34a",
          timer: 3500,
          timerProgressBar: true,
        });
        setEmail("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Subscription Failed",
          text: result.message || "Failed to subscribe. Please try again.",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to subscribe. Please try again later.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-10 sm:py-16">
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white p-6 sm:p-10 lg:p-14 shadow-2xl shadow-emerald-950/20 border border-emerald-700/50">
          
          {/* Subtle Ambient Glow Circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/15 backdrop-blur-md text-emerald-200 border border-white/10">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Get ৳100 Off Your First Order</span>
              </div>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Fresh & Organic Food Delivered To Your Doorstep
              </h2>

              <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-xl">
                Subscribe to the PureBD Mart weekly newsletter to unlock secret discount codes, morning harvest updates, and seasonal farmer drops.
              </p>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="pt-2 flex flex-col sm:flex-row gap-2.5 max-w-lg"
              >
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={submitting}
                    className="w-full pl-11 pr-4 py-3 h-12 bg-white/95 text-gray-900 placeholder:text-gray-400 rounded-2xl border-none shadow-inner text-xs sm:text-sm focus-visible:ring-2 focus-visible:ring-emerald-400"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 px-6 sm:px-8 bg-amber-500 hover:bg-amber-600 active:scale-95 text-gray-950 font-bold rounded-2xl shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Subscribing..." : "Claim ৳100 Off"}</span>
                </Button>
              </form>

              {/* Feature Checklist */}
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-emerald-200/90">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  No Spam Ever
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Instant Discount Code
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Unsubscribe Anytime
                </span>
              </div>
            </div>

            {/* Right Column: Visual illustration / image */}
            <div className="hidden lg:flex lg:col-span-5 justify-end">
              <div className="relative w-80 h-72 rounded-3xl overflow-hidden bg-white/10 backdrop-blur-md p-3 border border-white/15 shadow-2xl shadow-emerald-950/40 flex flex-col justify-between">
                <div className="relative w-full h-44 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80"
                    alt="Fresh organic harvest"
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                  <div className="absolute top-2 right-2 bg-emerald-600/95 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    Pure & Clean
                  </div>
                </div>

                <div className="bg-white/15 rounded-xl p-3 backdrop-blur-sm border border-white/10 text-white flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs leading-none">100% Quality Assured</h5>
                    <p className="text-[10px] text-emerald-200 mt-0.5">Over 50,000 orders successfully delivered</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
