import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React from "react";

export default function Testimonial() {
  return (
    <div className="container px-5 md:mx-auto max-w-7xl my-10">
      <div
      className="rounded-xl"
        style={{
          backgroundImage:
            'url("https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/banner-10-min.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 50px",
        }}
      >
        <div className="max-w-lg space-y-4 text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
            Stay home & get your daily needs from our shop
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Start your daily shopping with{" "}
            <span className="text-[#3BB77E] font-semibold">PureBD Mart</span>
          </p>

          <div className="flex flex-col sm:flex-row mt-4 space-y-1">
            <Input
              placeholder="Enter email address"
              className="rounded-full px-5 py-5 bg-white/90 border-gray-300"
            />
            <Button className="md:-ml-[113px] cursor-pointer py-4 mt-[3px] rounded-full bg-[#3BB77E] hover:bg-[#29A56C] text-white px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
