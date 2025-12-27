"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PlusCircle,
  ShoppingBasket,
  Folder,
  Users,
  Settings as SettingsIcon,
  Truck,
  PackageSearch,
  Trash2,
  Gift,
  Wallet2,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";
import { ImProfile } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const menu = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={18} />,
      adminOnly: false,
    },
    {
      name: "My Profile",
      href: "/dashboard/profile",
      icon: <ImProfile size={18} />,
      adminOnly: false,
    },
    {
      name: "Add Product",
      href: "/dashboard/products/add",
      icon: <PlusCircle size={18} />,
      adminOnly: true,
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: <ShoppingBasket size={18} />,
      adminOnly: true,
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
      icon: <Folder size={18} />,
      adminOnly: true,
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
      icon: <ShoppingCart size={18} />,
      adminOnly: false,
    },
    {
      name: "Users",
      href: "/dashboard/users",
      icon: <Users size={18} />,
      adminOnly: true,
    },
    {
      name: "Shipping",
      href: "/dashboard/shipping",
      icon: <Truck size={18} />,
      adminOnly: true,
    },
    {
      name: "Inventory",
      href: "/dashboard/inventory",
      icon: <PackageSearch size={18} />,
      adminOnly: true,
    },
    {
      name: "Waste",
      href: "/dashboard/waste",
      icon: <Trash2 size={18} />,
      adminOnly: true,
    },
    {
      name: "Gifts",
      href: "/dashboard/gifts",
      icon: <Gift size={18} />,
      adminOnly: true,
    },
    {
      name: "Expenses",
      href: "/dashboard/expenses",
      icon: <Wallet2 size={18} />,
      adminOnly: true,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: <SettingsIcon size={18} />,
      adminOnly: true,
    },
  ];

  // Filter menu items based on role
  const filteredMenu = menu.filter((item) => !item.adminOnly || isAdmin);

  const closeMobileMenu = () => setIsMobileOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="icon"
        className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full shadow-lg bg-[#3BB77E] text-white hover:bg-[#2a9c66] hover:text-white cursor-pointer"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen pt-20 bg-white border-r shadow-sm
          transition-transform duration-300 ease-in-out
          w-[280px]
          lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:shadow-none lg:border-0 lg:bg-transparent lg:pt-0
          ${
            isMobileOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        <div className="h-full overflow-y-auto px-4 py-5 lg:px-0 lg:py-0">
          <div className="bg-green-50/50 border rounded-lg p-4 lg:min-h-screen">
            {/* User Info on Mobile */}
            <div className="lg:hidden mb-4 pb-4 border-b">
              <p className="text-sm text-gray-500">Welcome back,</p>
              <p className="font-semibold text-gray-800 truncate">
                {user?.name || "User"}
              </p>
            </div>

            {/* Menu Items */}
            <ul className="space-y-2 w-full">
              {filteredMenu.map((item, idx) => {
                // Check if current path exactly matches or is a child route
                // But don't match parent if another menu item is more specific
                const isExactMatch = pathname === item.href;
                const isChildRoute = pathname.startsWith(item.href + "/");

                // For items with sub-routes in menu (like Products & Add Product)
                // Only match exact path, not child routes that have their own menu item
                const hasMoreSpecificMenuItem = filteredMenu.some(
                  (other) =>
                    other.href !== item.href &&
                    other.href.startsWith(item.href) &&
                    pathname.startsWith(other.href)
                );

                const active =
                  isExactMatch || (isChildRoute && !hasMoreSpecificMenuItem);

                return (
                  <li key={idx}>
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all shadow-sm border
                      ${
                        active
                          ? "bg-[#3BB77E] text-white border-[#3BB77E]"
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-100"
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
        </div>
      </aside>
    </>
  );
}
