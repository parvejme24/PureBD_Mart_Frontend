import Banner from "@/components/module/HomePageComp/Banner/Banner";
import Category from "@/components/module/HomePageComp/Category/Category";
import DealOfTheDay from "@/components/module/HomePageComp/DealOfTheDay/DealOfTheDay";
import Product from "@/components/module/HomePageComp/Product/Product";
import Testimonial from "@/components/module/HomePageComp/Testimonial/Testimonial";
import React from "react";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Category />
      <Product />
      <DealOfTheDay />
      <Testimonial />
    </div>
  );
}
