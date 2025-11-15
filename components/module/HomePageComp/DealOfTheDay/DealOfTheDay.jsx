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
import { ArrowRight } from "lucide-react";

const productsData = [
  {
    id: "1",
    name: "Fresh Apples",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "180 BDT",
    description: "Crisp and juicy apples sourced from local farms.",
    quantity: "1 kg",
  },
  {
    id: "2",
    name: "Organic Bananas",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_3b821ada-6a37-40a8-b57e-9cdda2ae2ec5.jpg?v=1736510606&width=533",
    price: "90 BDT",
    description: "Sweet and ripe organic bananas for daily nutrition.",
    quantity: "1 dozen",
  },
  {
    id: "3",
    name: "Fresh Tomatoes",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "70 BDT",
    description: "Bright red tomatoes perfect for cooking and salads.",
    quantity: "1 kg",
  },
  {
    id: "4",
    name: "Premium Rice",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "110 BDT",
    description: "High-quality long-grain rice for every meal.",
    quantity: "1 kg",
  },
  {
    id: "5",
    name: "Natural Honey",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "450 BDT",
    description: "100% pure honey collected from organic bee farms.",
    quantity: "500 g",
  },
];

export default function DealOfTheDay() {
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
          <Button
            variant={"outline"}
            className={"md:w-[115px] rounded-full cursor-pointer"}
          >
            View All <ArrowRight />
          </Button>
        </div>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {productsData.map((product) => (
            <CarouselItem
              key={product.id}
              className="pl-2 md:pl-4 basis-full md:basis-1/2"
            >
              <Card className="shadow-md hover:shadow-lg transition rounded-xl overflow-hidden bg-[#D8F1E5]/10">
                <CardContent className="flex items-center gap-5 p-5">
                  {/* Left: Image */}
                  <div className="w-1/3">
                    <img
                      src={product.image}
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
                      {product.description}
                    </p>
                    <p className="text-[#60B77E] font-bold">{product.price}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Qty: {product.quantity}
                    </p>
                    <Button className="cursor-pointer bg-[#DEF9EC] hover:bg-[#50BB88]/30  text-[#50BB88] font-bold w-full">
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
