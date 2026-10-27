"use client";

import React from "react";
import { MapPin, Clock, Navigation, CheckCircle } from "lucide-react";

export default function GoogleMap() {
  return (
    <div className="flex flex-col h-full rounded-3xl overflow-hidden border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
      
      {/* Hub Header Card */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 text-white space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full">
            Central Distribution Hub
          </span>
          <span className="text-xs text-emerald-200 flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Open for Pickups
          </span>
        </div>

        <div>
          <h3 className="font-black text-lg text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>PureBD Mart - Dhaka Hub</span>
          </h3>
          <p className="text-xs text-emerald-100/90 mt-0.5">
            House 42, Road 11, Block D, Banani, Dhaka, Bangladesh - 1213
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-200/90 pt-1 border-t border-emerald-700/50">
          <Clock className="w-3.5 h-3.5 text-amber-300" />
          <span>Hours: Sat–Thu 9:00 AM – 10:00 PM · Fri 2:00 PM – 9:00 PM</span>
        </div>
      </div>

      {/* Embedded Map */}
      <div className="relative flex-1 w-full min-h-[300px]">
        <iframe
          title="PureBD Mart Dhaka Hub Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14602.700142907498!2d90.3980!3d23.7937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7a0f70deb73%3A0x30c36498f90fe23!2sBanani%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
          width="100%"
          height="100%"
          style={{ border: 0, minHeight: "320px" }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      
    </div>
  );
}
