"use client";

import ProductCard from "@/components/shared/ProductCard/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useProducts } from "@/hooks/useProduct";
import ProductSkeleton from "./ProductSkeleton";

export default function Product() {
  const { data, isLoading, isError } = useProducts();
  const products = data?.products?.slice(0, 10) || [];

  if (isLoading) {
    return <ProductSkeleton />;
  }

  if (isError || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <div className="mb-5 flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            Our Special Products
          </h2>
          <p className="text-xs md:text-base text-gray-500">
            Do not miss the current offers until the end of March.
          </p>
        </div>
        <div>
          <Link href="/shop">
            <Button
              variant={"outline"}
              className={"md:w-[115px] rounded-full cursor-pointer"}
            >
              View All <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
