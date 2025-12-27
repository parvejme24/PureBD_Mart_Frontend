"use client";

import React, { useMemo, useState } from "react";
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
import { useWaste, useCreateWaste } from "@/hooks/useWaste";
import { useProducts } from "@/hooks/useProduct";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2 } from "lucide-react";
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

export default function WastePage() {
  const { data: waste, isLoading } = useWaste();
  const { data: productsData } = useProducts();
  const products = productsData?.products || [];
  const { mutate: createWaste, isPending } = useCreateWaste();

  const [form, setForm] = useState({
    product: "",
    productName: "",
    sku: "",
    qty: "",
    reason: "",
    date: "",
    note: "",
  });

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === form.product),
    [products, form.product]
  );

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.product || !form.qty || !form.date) return;
    createWaste({
      ...form,
      qty: Number(form.qty),
      productName: form.productName || selectedProduct?.name || "",
      sku: form.sku || selectedProduct?.sku || "",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Waste</h1>
        <p className="text-sm text-gray-500">Record damaged/expired items.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trash2 className="h-5 w-5 text-[#3BB77E]" />
              Record Waste
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Product *</Label>
                  <Select
                    value={form.product}
                    onValueChange={(val) => {
                      const prod = products.find((p) => p._id === val);
                      handleChange("product", val);
                      handleChange("productName", prod?.name || "");
                      handleChange("sku", prod?.sku || "");
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select product" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((p) => (
                        <SelectItem key={p._id} value={p._id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={form.qty}
                    onChange={(e) => handleChange("qty", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Input
                    value={form.reason}
                    onChange={(e) => handleChange("reason", e.target.value)}
                    placeholder="Damaged, expired, etc."
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
                    "Record Waste"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Waste</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : !waste || waste.length === 0 ? (
              <p className="text-sm text-gray-500">No waste records.</p>
            ) : (
              <div className="space-y-2 max-h-[480px] overflow-auto pr-1">
                {waste.map((w) => (
                  <div key={w._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between text-sm font-semibold text-gray-800">
                      <span>{w.productName}</span>
                      <span className="text-red-600">-{w.qty}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{w.reason || "No reason"}</span>
                      <span>{formatDate(w.date)}</span>
                    </div>
                    {w.note ? <p className="text-xs text-gray-400 mt-1 line-clamp-1">{w.note}</p> : null}
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

