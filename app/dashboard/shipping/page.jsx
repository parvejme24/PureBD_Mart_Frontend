"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MapPin, RefreshCw, Truck } from "lucide-react";
import { useShippingConfig, useShippingLocations } from "@/hooks/useShipping";
import { cn } from "@/lib/utils";

export default function ShippingPage() {
  const {
    data: config,
    isLoading: loadingConfig,
    isError: errorConfig,
    refetch: refetchConfig,
  } = useShippingConfig();
  const {
    data: locations,
    isLoading: loadingLocations,
    isError: errorLocations,
    refetch: refetchLocations,
  } = useShippingLocations();

  const refreshedAt = config?.updatedAt
    ? new Date(config.updatedAt).toLocaleString()
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Shipping</h1>
          <p className="text-sm text-gray-500">
            View shipping fees and location data fetched from backend APIs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            onClick={() => {
              refetchConfig();
              refetchLocations();
            }}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-[#3BB77E]" />
              Shipping config
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingConfig ? (
              <Loading />
            ) : errorConfig ? (
              <ErrorState onRetry={refetchConfig} />
            ) : (
              <div className="space-y-3 text-sm">
                <Row label="Inside Dhaka" value={`৳${config?.shippingInsideDhaka ?? "—"}`} />
                <Row label="Outside Dhaka" value={`৳${config?.shippingOutsideDhaka ?? "—"}`} />
                <Row
                  label="Free delivery enabled"
                  value={config?.freeDeliveryEnabled ? "Yes" : "No"}
                />
                <Row
                  label="Free delivery note"
                  value={config?.freeDeliveryNote || "—"}
                  wrap
                />
                <Row label="Last updated" value={refreshedAt} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#3BB77E]" />
              Locations (Divisions)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLocations ? (
              <Loading />
            ) : errorLocations ? (
              <ErrorState onRetry={refetchLocations} />
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                {locations?.divisions?.map((d) => (
                  <div
                    key={d.id}
                    className="rounded-md border border-gray-100 bg-white px-3 py-2 text-gray-700"
                  >
                    {d.name}
                    {d.nameBn ? (
                      <span className="block text-xs text-gray-500">{d.nameBn}</span>
                    ) : null}
                  </div>
                )) || <p className="text-gray-500">No data</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value, wrap }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-gray-500">{label}</span>
      <span className={cn("font-medium text-gray-800", wrap ? "text-right break-words" : "")}>
        {value}
      </span>
    </div>
  );
}

function Loading() {
  return (
    <div className="flex items-center gap-2 text-gray-500 text-sm">
      <Loader2 className="h-4 w-4 animate-spin" />
      Loading...
    </div>
  );
}

function ErrorState({ onRetry }) {
  return (
    <div className="flex items-center gap-3 text-sm text-red-600">
      Failed to load data.
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={onRetry}
      >
        Retry
      </Button>
    </div>
  );
}

