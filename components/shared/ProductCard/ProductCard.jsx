import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import React from "react";

export default function ProductCard({ product }) {
  return (
    <div>
      <div
        key={product.id}
        className="bg-[#D8F1E5]/10 rounded-md p-5 border transition-transform hover:-translate-y-1"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full object-container rounded-lg mb-3"
        />
        <hr className="mb-2" />
        <span className="uppercase text-green-700 font-bold text-xs">
          In Stock
        </span>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="mt-2 font-bold text-[#3BB77E]">{product.price}</p>
          <Button
            variant={"outline"}
            className={"cursor-pointer bg-[#DEF9EC]  text-[#50BB88] font-bold"}
          >
            <ShoppingCart /> Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
