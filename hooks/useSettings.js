"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSettings, updateSettings } from "@/lib/settings";
import { shippingKeys } from "./useShipping";

export const settingsKeys = {
  all: ["settings"],
};

export const useSettings = () => {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: getSettings,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
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

