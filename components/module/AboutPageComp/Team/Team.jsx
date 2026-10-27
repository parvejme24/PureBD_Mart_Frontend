"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Linkedin, Twitter, Mail, Sparkles, Award } from "lucide-react";

const teamMembers = [
  {
    name: "Mahmudur Rahman",
    role: "Founder & Chief Executive",
    bio: "Passionate advocate for chemical-free living, connecting rural organic farmers with conscious Bangladeshi households.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    badge: "Vision & Strategy",
  },
  {
    name: "Dr. Farhana Yasmin",
    role: "Head of Food Quality & Nutrition",
    bio: "Senior nutritionist ensuring 100% formalin-free purity testing across all perishable and dairy supplies.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    badge: "Quality Assurance",
  },
  {
    name: "Tanvir Ahmed",
    role: "Director of Cold-Chain Logistics",
    bio: "Spearheading 30-minute express deliveries in Dhaka and temperature-controlled farm-to-door transit.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    badge: "Operations",
  },
];

export default function Team() {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Passionate People</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight mb-2.5">
            Meet the PureBD Mart Leadership
          </h2>

          <p className="text-xs sm:text-base text-gray-600">
            A dedicated group of food lovers, agricultural specialists, and logistics experts on a mission to safeguard family nutrition.
          </p>
        </div>

        {/* 3 Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {teamMembers.map((member, idx) => (
            <div
              key={idx}
              className="group bg-white rounded-3xl p-5 border border-emerald-100 hover:border-emerald-300 shadow-sm hover:shadow-xl hover:shadow-emerald-950/8 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    {member.badge}
                  </div>
                </div>

                {/* Details */}
                <h3 className="font-extrabold text-lg text-gray-900 group-hover:text-emerald-700 transition-colors">
                  {member.name}
                </h3>
                <p className="text-xs font-bold text-emerald-600 mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>

              {/* Social icons */}
              <div className="flex items-center gap-2 pt-4 border-t border-gray-100 mt-4 text-gray-400">
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="mailto:support@purebdmart.com"
                  className="p-1.5 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
