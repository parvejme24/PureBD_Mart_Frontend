"use client";
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useDealOfTheDay } from "@/hooks/useProduct";
import { Skeleton } from "@/components/ui/skeleton";


export default function DealOfTheDay() {
  const { data, isLoading, isError } = useDealOfTheDay();
  const products = data?.products || [];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-5 py-10">
        <div className="mb-5 flex justify-between items-center w-full">
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-80" />
          </div>
          <Skeleton className="h-10 w-24 rounded-full" />
        </div>

        <div className="flex gap-4">
          {[1, 2].map((item) => (
            <div key={item} className="flex-1">
              <Card className="shadow-md rounded-xl overflow-hidden bg-[#D8F1E5]/10">
                <CardContent className="flex items-center gap-5 p-5">
                  <Skeleton className="w-1/3 h-32 md:h-40 rounded-lg" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error or no products
  if (isError || products.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto max-w-7xl px-5 py-10">
      <div className="mb-5 flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl md:text-2xl">Deal of the Day</h2>
          <p className="text-xs md:text-base text-gray-500">
            Dont miss this opportunity at a special discount just for this week.
          </p>
        </div>
        <div>
          <Link href={"/shop"}>
            <Button
              variant={"outline"}
              className={"md:w-[115px] rounded-full cursor-pointer"}
            >
              View All <ArrowRight />
            </Button>
          </Link>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product._id}
              className="pl-2 md:pl-4 basis-full md:basis-1/2"
            >
              <Card className="shadow-md hover:shadow-lg transition rounded-xl overflow-hidden bg-[#D8F1E5]/10">
                <CardContent className="flex items-center gap-5 p-5">
                  {/* Left: Image */}
                  <div className="w-1/3">
                    <img
                      src={product.image?.url || "/placeholder-product.jpg"}
                      alt={product.name}
                      className="rounded-lg object-cover w-full h-32 md:h-40"
                    />
                  </div>

                  {/* Right: Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description || "Premium quality product"}
                    </p>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[#60B77E] font-bold text-lg">
                        ৳{product.price}
                      </p>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <p className="text-gray-500 line-through text-sm">
                          ৳{product.originalPrice}
                        </p>
                      )}
                    </div>
                    {product.unit && (
                      <p className="text-xs text-gray-500 mb-3">
                        Qty: {product.unit}
                      </p>
                    )}
                    <Button className="cursor-pointer bg-[#DEF9EC] hover:bg-[#50BB88]/30 text-[#50BB88] font-bold w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className={"hidden lg:flex cursor-pointer"} />
        <CarouselNext className={"hidden lg:flex cursor-pointer"} />
      </Carousel>
    </div>
  );
}
