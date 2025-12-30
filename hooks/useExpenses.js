"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExpense, getExpenses } from "@/lib/expenses";

export const expenseKeys = {
  all: ["expenses"],
};

export const useExpenses = () => {
  return useQuery({
    queryKey: expenseKeys.all,
    queryFn: getExpenses,
    staleTime: 0,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Expense recorded");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to record expense");
    },
  });
};













