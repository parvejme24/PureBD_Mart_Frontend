import React from "react";
import Image from "next/image";
import aboutImage from "@/public/about.png";

export default function AboutUs() {
  return (
    <div className="bg-gradient-to-b from-green-50/30 to-white">
      <div className="container mx-auto max-w-7xl px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-14 pb-14">
          <div className="order-2 md:order-1 relative w-full aspect-square md:aspect-auto">
            <Image
              src={aboutImage}
              alt="PureBD Mart - Your trusted online grocery destination in Bangladesh"
              width={600}
              height={600}
              className="rounded-lg shadow-lg w-full h-full object-cover"
              unoptimized
              priority
              draggable={false}
            />
          </div>

          <div className="md:col-span-2 order-1 md:order-2">
            <div className="inline-block mb-3">
              <span className="text-xl text-[#3BB77E] font-semibold uppercase tracking-wide">
                About Us
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
              Welcome to PureBD Mart
            </h2>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                PureBD Mart is your trusted online grocery destination in
                Bangladesh, offering{" "}
                <strong className="text-gray-800">
                  100% authentic and premium quality products
                </strong>
                . From fresh dates, pure honey, and natural oils to nuts, dry
                fruits, and daily cooking masalas — we ensure every item is
                sourced from reliable suppliers to maintain purity, freshness,
                and great taste.
              </p>

              <p>
                Our mission is simple:{" "}
                <strong className="text-gray-800">
                  make healthy, natural, and essential grocery products
                  accessible
                </strong>{" "}
                to every household across Bangladesh. Whether you are looking
                for chemical-free cooking oil, delicious Arabian dates, premium
                nuts for your family, or high-quality spices for perfect cooking
                — PureBD Mart brings everything to your doorstep with fast
                delivery and affordable pricing.
              </p>

              <p>
                At PureBD Mart,{" "}
                <strong className="text-gray-800">
                  customer satisfaction is our top priority
                </strong>
                . With easy ordering, verified products, secure payments, and
                dedicated support, we aim to make your shopping journey smooth
                and enjoyable. Thank you for choosing PureBD Mart — your home
                for purity, quality, and healthy living.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
