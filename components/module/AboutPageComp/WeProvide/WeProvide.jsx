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
    <div className="bg-white py-14">
      <div className="container mx-auto max-w-7xl px-5">
        <div className="text-center mb-12">
          <span className="text-sm text-[#3BB77E] font-semibold uppercase tracking-wide">
            What We Provide
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-3">
            Why Choose PureBD Mart?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We are committed to providing you with the best shopping experience,
            from premium quality products to exceptional customer service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-[#3BB77E] transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-[100px] h-[100px] relative group-hover:scale-110 transition-transform duration-300">
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
                <h3 className="text-xl font-semibold text-gray-800 group-hover:text-[#3BB77E] transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
