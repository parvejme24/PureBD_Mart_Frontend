"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBasket,
  Folder,
  Users,
} from "lucide-react";

export default function DashboardSidebar() {
  const pathname = usePathname();

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Add Product",
      href: "/dashboard/products/add",
      icon: <PlusCircle size={18} />,
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: <ShoppingBasket size={18} />,
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: <Folder size={18} />,
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: <Folder size={18} />,
    },
    { name: "Users", href: "/dashboard/users", icon: <Users size={18} /> },
  ];

  return (
    <div className="w-64 min-h-screen bg-green-50/50 border p-5 rounded-lg">
      <ul className="space-y-2">
        {menu.map((item, idx) => {
          const active = pathname === item.href;
          return (
            <li key={idx}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all shadow-sm border
                ${
                  active
                    ? "bg-[#3BB77E] text-white border-[#3BB77E]"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
