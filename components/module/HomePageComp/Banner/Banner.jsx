import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";

const BannerData = [
  {
    id: 1,
    imageUrl:
      "https://mybacola.myshopify.com/cdn/shop/files/slider-image-3.jpg?v=1736516959",
    altText: "Banner 1",
    offer: "Up to 50% Off",
    heading: "Specialist in the grocery store",
    subHeading: "Only this week. Don't miss...",
    from: "100BDT",
  },
  {
    id: 2,
    imageUrl:
      "https://mybacola.myshopify.com/cdn/shop/files/slider-image-4.jpg?v=1736517083",
    altText: "Banner 2",
    offer: "Up to 30% Off",
    heading: "Fresh Groceries Delivered Fast",
    subHeading: "Grab your favorite items today!",
    from: "120BDT",
  },
  {
    id: 3,
    imageUrl:
      "https://mybacola.myshopify.com/cdn/shop/files/slider-image-5.jpg?v=1736517083",
    altText: "Banner 3",
    offer: "Save Big Today",
    heading: "Healthy Food, Happy Life",
    subHeading: "Get the best deals now!",
    from: "150BDT",
  },
];

export default function Banner() {
  return (
    <div className="bg-[#D8F1E5]/10">
      <div className="pt-5 container px-5 md:mx-auto max-w-7xl">
        <Carousel className="rounded-md overflow-hidden">
          <CarouselContent>
            {BannerData.map((banner) => (
              <CarouselItem key={banner.id}>
                <div
                  className="relative w-full h-[400px] md:h-[500px] flex items-center justify-center bg-cover bg-center"
                  style={{ backgroundImage: `url(${banner.imageUrl})` }}
                >
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/30"></div>

                  {/* Text Content */}
                  <div className="relative z-10 text-center text-white px-4 md:px-10">
                    <p className="text-sm md:text-lg font-semibold text-yellow-300">
                      {banner.offer}
                    </p>
                    <h2 className="text-2xl md:text-5xl font-bold my-2">
                      {banner.heading}
                    </h2>
                    <p className="text-base md:text-xl mb-4">
                      {banner.subHeading}
                    </p>
                    <p className="text-lg font-semibold bg-yellow-400 text-black px-5 py-2 rounded-full inline-block">
                      From {banner.from}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
