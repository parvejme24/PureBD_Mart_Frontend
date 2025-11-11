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

export default function Category() {
  return (
    <div className="bg-blue-50/40">
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-center">
          {categoriesData.map((category) => (
            <div
              key={category.id}
              className="bg-white rounded p-5 border flex flex-col items-center justify-center transition-transform hover:-translate-y-1 cursor-pointer"
            >
              {category.icon}
              <p className="mt-3 text-gray-700 font-medium">{category.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
