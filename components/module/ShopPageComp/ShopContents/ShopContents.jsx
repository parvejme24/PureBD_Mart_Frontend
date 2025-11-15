import ProductCard from "@/components/shared/ProductCard/ProductCard";
import React from "react";

const productsData = [
  {
    id: "1",
    name: "Fresh Apples",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-carrot-300x300.jpg",
    price: "180",
    description: "Crisp and juicy apples sourced from local farms.",
    quantity: "1 kg",
  },
  {
    id: "2",
    name: "Organic Bananas",
    image:
      "https://mybacola.myshopify.com/cdn/shop/files/product-image_3b821ada-6a37-40a8-b57e-9cdda2ae2ec5.jpg?v=1736510606&width=533",
    price: "90",
    description: "Sweet and ripe organic bananas for daily nutrition.",
    quantity: "1 dozen",
  },
  {
    id: "3",
    name: "Fresh Tomatoes",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/beef-steak-300x300.jpg",
    price: "70",
    description: "Bright red tomatoes perfect for cooking and salads.",
    quantity: "1 kg",
  },
  {
    id: "4",
    name: "Premium Rice",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-cucumber-300x300.jpg",
    price: "110",
    description: "High-quality long-grain rice for every meal.",
    quantity: "1 kg",
  },
  {
    id: "5",
    name: "Pure Mustard Oil",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/fresh-banana-300x300.jpg",
    price: "320",
    description: "Cold-pressed mustard oil rich in aroma and nutrients.",
    quantity: "1 liter",
  },
  {
    id: "6",
    name: "Farm Fresh Eggs",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/10/fruit-product-3.jpg",
    price: "140",
    description: "Protein-rich, fresh eggs collected daily from farms.",
    quantity: "12 pcs",
  },
  {
    id: "7",
    name: "Premium Lentils",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-milk-300x300.jpg",
    price: "160",
    description: "High-quality red lentils perfect for everyday meals.",
    quantity: "1 kg",
  },
  {
    id: "8",
    name: "Fresh Milk",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/green-gabbage-300x300.jpg",
    price: "90",
    description: "Pure and fresh milk packed with essential nutrients.",
    quantity: "1 liter",
  },
  {
    id: "9",
    name: "Natural Honey",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/pig-food-300x300.jpg",
    price: "450",
    description: "100% pure honey collected from organic bee farms.",
    quantity: "500 g",
  },
  {
    id: "10",
    name: "Brown Bread",
    image:
      "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-tomato-300x300.jpg",
    price: "80",
    description: "Soft, fresh, and healthy brown bread for daily breakfast.",
    quantity: "1 pack",
  },
];

export default function Product() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {productsData.map((product) => (
          <ProductCard product={product} />
        ))}
      </div>
    </div>
  );
}
