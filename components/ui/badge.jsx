import * as React from "react";
import { cn } from "@/lib/utils";

const badgeVariants = {
  default: "border-transparent bg-[#3BB77E] text-white hover:bg-[#2a9c66]",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-500 text-white hover:bg-red-600",
  outline: "border-gray-300 text-gray-900 bg-transparent",
};

function Badge({ className, variant = "default", ...props }) {
  const variantClass = badgeVariants[variant] || badgeVariants.default;

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variantClass,
        className
      )}
      {...props}
    />
  );
}

export { Badge };
