"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/lib/settings";
import { shippingKeys } from "./useShipping";
import { useEffect, useState } from "react";

export const settingsKeys = {
  all: ["settings"],
};

export const useSettings = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: isClient, // Only run on client side
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
      queryClient.invalidateQueries({ queryKey: shippingKeys.config });
      toast.success("Settings updated successfully");
    },
    onError: (error) => {
      const message =
        error.response?.data?.message || "Failed to update settings";
      toast.error(message);
    },
  });
};

