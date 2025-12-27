"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useExpenses, useCreateExpense } from "@/hooks/useExpenses";
import { Loader2, Wallet2 } from "lucide-react";
const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};

export default function ExpensesPage() {
  const { data, isLoading } = useExpenses();
  const expenses = data?.expenses || [];
  const total = data?.total || 0;
  const { mutate: createExpense, isPending } = useCreateExpense();

  const [form, setForm] = useState({
    expenseId: "",
    date: "",
    name: "",
    purpose: "",
    amount: "",
    category: "",
    note: "",
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.expenseId || !form.date || !form.purpose || !form.amount) return;
    createExpense({
      ...form,
      amount: Number(form.amount),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Expenses</h1>
          <p className="text-sm text-gray-500">Record operational expenses.</p>
        </div>
        <div className="rounded-lg border px-3 py-2 bg-white shadow-sm text-sm">
          Total: <span className="font-semibold text-[#3BB77E]">৳{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet2 className="h-5 w-5 text-[#3BB77E]" />
              Record Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Expense ID *</Label>
                  <Input
                    value={form.expenseId}
                    onChange={(e) => handleChange("expenseId", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Date *</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Purpose *</Label>
                  <Input
                    value={form.purpose}
                    onChange={(e) => handleChange("purpose", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Amount (৳) *</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={form.amount}
                    onChange={(e) => handleChange("amount", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Name (person)</Label>
                  <Input
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Category</Label>
                  <Input
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    placeholder="e.g. Delivery, Office"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Note</Label>
                <Textarea
                  rows={2}
                  value={form.note}
                  onChange={(e) => handleChange("note", e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
                >
                  {isPending ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Record Expense"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : !expenses || expenses.length === 0 ? (
              <p className="text-sm text-gray-500">No expenses recorded.</p>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                {expenses.map((exp) => (
                  <div key={exp._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between text-sm font-semibold text-gray-800">
                      <span>{exp.purpose}</span>
                      <span className="text-red-600">৳{exp.amount}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>ID: {exp.expenseId}</span>
                      <span>{formatDate(exp.date)}</span>
                    </div>
                    {exp.note ? (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">{exp.note}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

