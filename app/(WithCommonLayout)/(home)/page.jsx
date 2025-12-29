import Banner from "@/components/module/HomePageComp/Banner/Banner";
import DealOfTheDay from "@/components/module/HomePageComp/DealOfTheDay/DealOfTheDay";
import BestSellingProducts from "@/components/module/HomePageComp/BestSellingProducts/BestSellingProducts";
import Product from "@/components/module/HomePageComp/Product/Product";
import Subscribe from "@/components/shared/Subscribe/Subscribe";
import React from "react";
import Category from "@/components/module/HomePageComp/Category/Category";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Category />
      <DealOfTheDay />
      <Product />
      <BestSellingProducts />
      <Subscribe />
    </div>
  );
}
