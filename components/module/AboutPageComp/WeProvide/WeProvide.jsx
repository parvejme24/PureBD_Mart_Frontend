import React from "react";
import Image from "next/image";

const data = [
  {
    id: 1,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-1.png",
    title: "Best Prices & Offers",
    description:
      "Enjoy competitive pricing on all premium quality products. We offer the best deals on authentic dates, pure honey, natural oils, nuts, and spices without compromising on quality.",
  },
  {
    id: 2,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-2.png",
    title: "Wide Assortment",
    description:
      "Browse through our extensive collection of natural and organic products including fresh dates, pure honey, natural oils, premium nuts, dry fruits, and high-quality cooking masalas.",
  },
  {
    id: 3,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-3.png",
    title: "Free Delivery",
    description:
      "Free delivery available in Dhaka! Fast and reliable doorstep delivery service across Bangladesh. Outside Dhaka delivery available with minimal shipping charges.",
  },
  {
    id: 4,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-4.png",
    title: "Easy Returns",
    description:
      "Not satisfied with your purchase? We offer hassle-free returns and exchanges. Contact us within 24-48 hours of delivery for quick resolution.",
  },
  {
    id: 5,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-5.png",
    title: "100% Satisfaction",
    description:
      "Every product is quality-checked and verified for authenticity. We guarantee freshness, purity, and great taste in every order you place with us.",
  },
  {
    id: 6,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-6.png",
    title: "Great Daily Deal",
    description:
      "Check out our daily deals and special offers on premium products. Save more on bulk purchases and enjoy exclusive discounts on selected items.",
  },
];

export default function WeProvide() {
  return (
    <div className="container mx-auto max-w-7xl px-5 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <div
            key={item.id}
            className="border px-5 py-10 rounded-lg space-y-2 bg-green-50/40"
          >
            <div className="w-[100px] h-[100px] mx-auto relative">
              <Image
                src={item.image}
                alt={item.title}
                width={100}
                height={100}
                className="object-contain"
                unoptimized
                draggable={false}
              />
            </div>
            <h3 className="text-center text-2xl font-semibold">{item.title}</h3>
            <p className="text-center">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
