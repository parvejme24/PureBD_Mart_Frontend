"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Star, Zap } from "lucide-react";
import Link from "next/link";
import React from "react";

const BannerData = [
  {
    id: 1,
    imageUrl:
      "https://mybacola.myshopify.com/cdn/shop/files/slider-image-3.jpg?v=1736516959",
    altText: "Fresh Organic Groceries",
    badge: "🔥 HOT DEAL",
    badgeColor: "bg-red-500",
    offer: "Up to 50% OFF",
    heading: "Specialist in Premium Grocery Store",
    subHeading: "Fresh organic products delivered to your doorstep",
    ctaText: "Shop Now",
    ctaLink: "/shop",
    gradient: "from-green-600/20 via-emerald-500/10 to-teal-400/20",
  },
  {
    id: 2,
    imageUrl:
      "https://mybacola.myshopify.com/cdn/shop/files/slider-image-4.jpg?v=1736517083",
    altText: "Fast Delivery Service",
    badge: "⚡ FAST",
    badgeColor: "bg-blue-500",
    offer: "Express Delivery",
    heading: "Fresh Groceries in 30 Minutes",
    subHeading: "Lightning-fast delivery service for busy lifestyles",
    ctaText: "Order Now",
    ctaLink: "/shop",
    gradient: "from-blue-600/20 via-cyan-500/10 to-sky-400/20",
  },
  {
    id: 3,
    imageUrl:
      "https://mybacola.myshopify.com/cdn/shop/files/slider-image-5.jpg?v=1736517083",
    altText: "Healthy Lifestyle",
    badge: "🌱 ORGANIC",
    badgeColor: "bg-green-500",
    offer: "Healthy Living",
    heading: "Nutrition That Nourishes",
    subHeading: "Premium quality organic food for a healthier you",
    ctaText: "Explore More",
    ctaLink: "/shop",
    gradient: "from-purple-600/20 via-violet-500/10 to-fuchsia-400/20",
  },
];

export default function Banner() {
  return (
    <div className="relative bg-gradient-to-br from-[#D8F1E5]/20 via-white to-[#3BB77E]/10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-[#3BB77E] rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-[#50BB88] rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#DEF9EC] rounded-full blur-3xl"></div>
      </div>

      <div className="relative pt-5 container px-5 md:mx-auto max-w-7xl">
        <Carousel className="rounded-2xl overflow-hidden border border-white/20">
          <CarouselContent>
            {BannerData.map((banner, index) => (
              <CarouselItem key={banner.id}>
                <motion.div
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="relative w-full h-[400px] sm:h-[450px] md:h-[550px] lg:h-[600px] flex items-center justify-center bg-cover bg-center group"
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  {/* Animated Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${banner.gradient} opacity-80 group-hover:opacity-60 transition-opacity duration-700`}></div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700"></div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute top-6 right-4 sm:top-10 sm:right-10 opacity-20"
                  >
                    <Star className="w-8 h-8 text-yellow-400" />
                  </motion.div>

                  <motion.div
                    animate={{
                      y: [0, 15, 0],
                      x: [0, -5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                    className="absolute bottom-16 left-4 sm:bottom-20 sm:left-10 opacity-15"
                  >
                    <Zap className="w-10 h-10 text-blue-400" />
                  </motion.div>

                  {/* Main Content */}
                  <div className="relative z-10 text-center text-white px-4 sm:px-6 md:px-10 max-w-4xl mx-auto">
                    {/* Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.6 }}
                      className="inline-block mb-3 sm:mb-4"
                    >
                      <span className={`inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${banner.badgeColor} text-white shadow-lg`}>
                        {banner.badge}
                      </span>
                    </motion.div>

                    {/* Offer Text */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.6 }}
                      className="text-base sm:text-lg md:text-xl font-bold text-yellow-300 mb-2"
                    >
                      {banner.offer}
                    </motion.p>

                    {/* Main Heading */}
                    <motion.h2
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                      className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 leading-tight"
                    >
                      {banner.heading}
                    </motion.h2>

                    {/* Subheading */}
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.6 }}
                      className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-gray-100"
                    >
                      {banner.subHeading}
                    </motion.p>


                    {/* CTA Buttons */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.6 }}
                      className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
                    >
                      <Link href={banner.ctaLink}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2 cursor-pointer">
                            <ShoppingBag className="w-5 h-5" />
                            {banner.ctaText}
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Enhanced Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.5 }}
          >
            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border-0 shadow-lg hover:shadow-xl w-12 h-12 cursor-pointer" />
            <CarouselNext className="right-4 bg-white/90 hover:bg-white border-0 shadow-lg hover:shadow-xl w-12 h-12 cursor-pointer" />
          </motion.div>

          {/* Dots Indicator */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {BannerData.map((_, index) => (
              <motion.div
                key={index}
                className="w-3 h-3 rounded-full bg-white/50 cursor-pointer"
                whileHover={{ scale: 1.2, backgroundColor: "rgba(255,255,255,0.8)" }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </div>
  );
}
