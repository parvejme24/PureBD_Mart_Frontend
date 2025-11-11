import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import React from "react";

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
    name: "Pure Mustard Oil",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "320 BDT",
    description: "Cold-pressed mustard oil rich in aroma and nutrients.",
    quantity: "1 liter",
  },
  {
    id: "6",
    name: "Farm Fresh Eggs",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "140 BDT",
    description: "Protein-rich, fresh eggs collected daily from farms.",
    quantity: "12 pcs",
  },
  {
    id: "7",
    name: "Premium Lentils",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "160 BDT",
    description: "High-quality red lentils perfect for everyday meals.",
    quantity: "1 kg",
  },
  {
    id: "8",
    name: "Fresh Milk",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "90 BDT",
    description: "Pure and fresh milk packed with essential nutrients.",
    quantity: "1 liter",
  },
  {
    id: "9",
    name: "Natural Honey",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "450 BDT",
    description: "100% pure honey collected from organic bee farms.",
    quantity: "500 g",
  },
  {
    id: "10",
    name: "Brown Bread",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_902899d0-cfb0-4134-a55c-b6b46b9d858c.jpg?v=1736510563&width=533",
    price: "80 BDT",
    description: "Soft, fresh, and healthy brown bread for daily breakfast.",
    quantity: "1 pack",
  },
];

export default function Product() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-14">
      <div className="mb-5 flex justify-between items-center w-full">
        <div>
          <h2 className="text-xl md:text-2xl">Our Special Products</h2>
          <p className="text-xs md:text-base text-gray-500">
            Do not miss the current offers until the end of March.
          </p>
        </div>
        <div>
          <Button variant={"outline"} className={"md:w-[115px] rounded-full cursor-pointer"}>
            View All <ArrowRight />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {productsData.map((product) => (
          <div
            key={product.id}
            className="bg-blue-50/20 rounded p-5 border transition-transform hover:-translate-y-1"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-container rounded-lg mb-3"
            />
            <span className="uppercase text-green-700 font-bold text-xs">
              In Stock
            </span>
            <h3 className="font-semibold text-gray-800">{product.name}</h3>
            <p className="text-sm text-gray-600">{product.description}</p>
            <div className="flex justify-between items-center">
              <p className="mt-2 font-bold text-blue-600">{product.price}</p>
              <Button
                variant={"outline"}
                className={
                  "cursor-pointer bg-blue-600 text-white shadow-none duration-300 hover:bg-blue-700 hover:text-white"
                }
              >
                <ShoppingCart /> Buy Now
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
