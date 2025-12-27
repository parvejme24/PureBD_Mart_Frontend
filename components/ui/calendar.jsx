"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"

/**
 * Lightweight calendar replacement using native date input to avoid external deps.
 * Keeps the same API surface (selected, onSelect, ...rest) used in the app.
 */
function Calendar({ selected, onSelect, className, ..._props }) {
  const value = React.useMemo(() => {
    if (!selected) return ""
    const d = new Date(selected)
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10)
  }, [selected])

  return (
    <div className="p-3">
      <Input
        type="date"
        value={value}
        onChange={(e) => {
          const v = e.target.value
          onSelect?.(v ? new Date(`${v}T00:00:00`) : undefined)
        }}
        className={className}
      />
    </div>
  )
}

Calendar.displayName = "Calendar"

export { Calendar }


