import React from "react";
import Banner from "@/components/module/HomePageComp/Banner/Banner";
import FeaturesBar from "@/components/module/HomePageComp/FeaturesBar/FeaturesBar";
import Category from "@/components/module/HomePageComp/Category/Category";
import DealOfTheDay from "@/components/module/HomePageComp/DealOfTheDay/DealOfTheDay";
import Product from "@/components/module/HomePageComp/Product/Product";
import PromoBanners from "@/components/module/HomePageComp/PromoBanners/PromoBanners";
import Testimonials from "@/components/module/HomePageComp/Testimonials/Testimonials";
import Subscribe from "@/components/shared/Subscribe/Subscribe";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Hero Banner with Carousel & Promo Highlights */}
      <Banner />

      {/* 2. Trust & Service Value Proposition Bar */}
      <FeaturesBar />

      {/* 3. Category Showcase (16 Categories on Large Devices, Scroll on Mobile) */}
      <Category />

      {/* 4. Highlighted Mega Deal of the Day (Bestsellers + Flash Discounts with Live Timer) */}
      <DealOfTheDay />

      {/* 5. Our Special Products with Category Tabs Filter */}
      <Product />

      {/* 6. Promotional Mid-Page Visual Banners */}
      <PromoBanners />

      {/* 7. Social Proof / Verified Customer Testimonials */}
      <Testimonials />

      {/* 8. High-converting Newsletter & Discount Voucher Banner */}
      <Subscribe />
    </div>
  );
}
