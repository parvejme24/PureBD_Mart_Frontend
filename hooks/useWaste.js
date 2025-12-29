"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createWaste, getWaste } from "@/lib/waste";

export const wasteKeys = {
  all: ["waste"],
};

export const useWaste = () => {
  return useQuery({
    queryKey: wasteKeys.all,
    queryFn: getWaste,
    staleTime: 0,
  });
};

export const useCreateWaste = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWaste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: wasteKeys.all });
      toast.success("Waste recorded");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record waste");
    },
  });
};












