import Banner from "@/components/module/HomePageComp/Banner/Banner";
import Category from "@/components/module/HomePageComp/Category/Category";
import Product from "@/components/module/HomePageComp/Product/Product";
import React from "react";

export default function HomePage() {
  return (
    <div>
      <Banner />
      <Category />
      <Product />
    </div>
  );
}
