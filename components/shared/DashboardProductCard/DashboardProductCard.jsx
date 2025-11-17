import { Button } from "@/components/ui/button";
import { Edit, ShoppingCart, Trash, Trash2 } from "lucide-react";
import React from "react";

export default function DashboardProductCard({ product }) {
  // Truncate description if longer than 44 characters
  const truncateDescription = (desc, maxLength = 44) => {
    if (!desc) return "";
    return desc.length > maxLength ? desc.slice(0, maxLength) + "..." : desc;
  };

  return (
    <div>
      <div
        key={product.id}
        className="bg-[#D8F1E5]/10 rounded-md p-5 border transition-transform hover:-translate-y-1"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full object-contain rounded-lg mb-3"
        />
        <hr className="mb-2" />
        <span className="uppercase text-green-700 font-bold text-xs">
          In Stock
        </span>
        <h3 className="font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600">
          {truncateDescription(product.description)}
        </p>
        <div className="flex justify-between items-center mt-2">
          <p className="mt-2 font-bold text-[#3BB77E]">{product.price}৳</p>
          <div className="space-x-2">
            <Button
              variant={"outline"}
              className={"cursor-pointer bg-[#DEF9EC] text-[#50BB88] font-bold"}
            >
              <Edit />
            </Button>
            <Button
              variant={"outline"}
              className={"cursor-pointer bg-red-400 hover:bg-red-600 text-white hover:text-white font-bold"}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
