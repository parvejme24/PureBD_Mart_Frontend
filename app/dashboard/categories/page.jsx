import React from "react";

import {
  GiFruitBowl,
  GiMilkCarton,
  GiMeat,
  GiWheat,
  GiCoffeeCup,
  GiSodaCan,
} from "react-icons/gi";
import { FaFish, FaBreadSlice } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";

const categoriesData = [
  {
    id: "1",
    name: "Fruits & Vegetables",
    icon: <GiFruitBowl className="w-10 h-10 text-green-600" />,
  },
  {
    id: "2",
    name: "Dairy & Eggs",
    icon: <GiMilkCarton className="w-10 h-10 text-blue-600" />,
  },
  {
    id: "3",
    name: "Meat & Poultry",
    icon: <GiMeat className="w-10 h-10 text-red-500" />,
  },
  {
    id: "4",
    name: "Bakery",
    icon: <FaBreadSlice className="w-10 h-10 text-yellow-600" />,
  },
  {
    id: "5",
    name: "Seafood",
    icon: <FaFish className="w-10 h-10 text-cyan-600" />,
  },
  {
    id: "6",
    name: "Grains & Cereals",
    icon: <GiWheat className="w-10 h-10 text-amber-600" />,
  },
  {
    id: "7",
    name: "Beverages",
    icon: <GiSodaCan className="w-10 h-10 text-orange-500" />,
  },
  {
    id: "8",
    name: "Tea & Coffee",
    icon: <GiCoffeeCup className="w-10 h-10 text-brown-600" />,
  },
];

export default function CategoriesPage() {
  return (
    <div className="container mx-auto max-w-7xl px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-xl font-bold">Categories</h2>

        <div className="w-full md:max-w-sm">
          <Input
            placeholder="Search Category..."
            className="rounded-full px-4"
          />
        </div>

        <Button className="bg-[#3BB77E] hover:bg-[#008236] cursor-pointer rounded-full px-6">
          Add New
        </Button>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
        {categoriesData.map((item) => (
          <div
            key={item.id}
            className="border p-6 rounded-lg flex flex-col items-center space-y-3 
            hover:shadow-xl hover:-translate-y-1 transition-all relative group"
          >
            <div>{item.icon}</div>

            <h3 className="font-semibold text-lg text-center">{item.name}</h3>

            {/* Hover Buttons */}
            <div
              className="
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-300 
              flex space-x-2 absolute top-4 right-4
            "
            >
              <Button
                variant={"outline"}
                className="cursor-pointer bg-[#DEF9EC] text-[#50BB88] font-bold hover:bg-[#c9f4e2]"
              >
                <Edit size={16} />
              </Button>
              <Button
                variant={"outline"}
                className="cursor-pointer bg-red-500 hover:bg-red-600 text-white font-bold"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
