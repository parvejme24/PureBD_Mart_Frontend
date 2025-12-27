"use client";

import { useQuery } from "@tanstack/react-query";
import { getShippingConfig, getShippingLocations } from "@/lib/shipping";

export const shippingKeys = {
  config: ["shipping", "config"],
  locations: ["shipping", "locations"],
};

export const useShippingConfig = () => {
  return useQuery({
    queryKey: shippingKeys.config,
    queryFn: getShippingConfig,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
  });
};

export const useShippingLocations = () => {
  return useQuery({
    queryKey: shippingKeys.locations,
    queryFn: getShippingLocations,
    staleTime: 60 * 60 * 1000, // cache locations longer
  });
};

