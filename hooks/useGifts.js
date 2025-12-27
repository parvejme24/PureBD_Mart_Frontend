"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGift, getGifts } from "@/lib/gifts";

export const giftKeys = {
  all: ["gifts"],
};

export const useGifts = () => {
  return useQuery({
    queryKey: giftKeys.all,
    queryFn: getGifts,
    staleTime: 0,
  });
};

export const useCreateGift = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createGift,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: giftKeys.all });
      toast.success("Gift recorded");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record gift");
    },
  });
};








