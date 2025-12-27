"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Lightweight switch without external dependency
const Switch = React.forwardRef(
  ({ className, checked, defaultChecked, onCheckedChange, disabled, ...props }, ref) => {
    const [internalChecked, setInternalChecked] = React.useState(!!defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internalChecked;

    const toggle = () => {
      if (disabled) return;
      const next = !value;
      if (!isControlled) setInternalChecked(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={props["aria-label"]}
        ref={ref}
        onClick={toggle}
        disabled={disabled}
        className={cn(
          "peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3BB77E]/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          value ? "bg-[#3BB77E]" : "bg-gray-200",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200",
            value ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };

