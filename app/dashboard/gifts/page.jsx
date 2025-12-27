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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProducts } from "@/hooks/useProduct";
import { useCreateGift, useGifts } from "@/hooks/useGifts";
import { Loader2, Gift, Plus, Trash2 } from "lucide-react";
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

export default function GiftsPage() {
  const { data: productsData } = useProducts();
  const { data: gifts, isLoading } = useGifts();
  const { mutate: createGift, isPending } = useCreateGift();
  const products = productsData?.products || [];

  const [form, setForm] = useState({
    giftId: "",
    date: "",
    recipientName: "",
    recipientPhone: "",
    recipientAddress: "",
    shippingAddress: "",
    note: "",
  });

  const [items, setItems] = useState([
    { product: "", productName: "", sku: "", qty: "", unitPrice: "" },
  ]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (idx, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === idx
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, { product: "", productName: "", sku: "", qty: "", unitPrice: "" }]);
  };

  const removeItem = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.giftId || !form.date || !form.recipientName) return;
    if (!items.length || items.some((it) => !it.product || !it.qty)) return;

    const normalized = items.map((it) => {
      const prod = products.find((p) => p._id === it.product);
      return {
        product: it.product,
        productName: it.productName || prod?.name || "",
        sku: it.sku || prod?.sku || "",
        qty: Number(it.qty),
        unitPrice: Number(it.unitPrice) || 0,
      };
    });

    createGift({
      ...form,
      items: normalized,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Gifts</h1>
        <p className="text-sm text-gray-500">Record gifted items to recipients.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-[#3BB77E]" />
              Record Gift
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Gift ID *</Label>
                  <Input
                    value={form.giftId}
                    onChange={(e) => handleChange("giftId", e.target.value)}
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
                  <Label>Recipient Name *</Label>
                  <Input
                    value={form.recipientName}
                    onChange={(e) => handleChange("recipientName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Recipient Phone</Label>
                  <Input
                    value={form.recipientPhone}
                    onChange={(e) => handleChange("recipientPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Recipient Address</Label>
                  <Input
                    value={form.recipientAddress}
                    onChange={(e) => handleChange("recipientAddress", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Shipping Address</Label>
                <Textarea
                  rows={2}
                  value={form.shippingAddress}
                  onChange={(e) => handleChange("shippingAddress", e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-700">Gift Items</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItem}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add item
                  </Button>
                </div>

                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border p-3 bg-gray-50/60 space-y-2"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label>Product *</Label>
                          <Select
                            value={item.product}
                            onValueChange={(val) => {
                              const prod = products.find((p) => p._id === val);
                              handleItemChange(idx, "product", val);
                              handleItemChange(idx, "productName", prod?.name || "");
                              handleItemChange(idx, "sku", prod?.sku || "");
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
                          <Label>SKU</Label>
                          <Input
                            value={item.sku}
                            onChange={(e) => handleItemChange(idx, "sku", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-1.5">
                          <Label>Qty *</Label>
                          <Input
                            type="number"
                            min={0}
                            value={item.qty}
                            onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Unit Price</Label>
                          <Input
                            type="number"
                            min={0}
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(idx, "unitPrice", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Line Total</Label>
                          <Input
                            value={(
                              (Number(item.qty) || 0) * (Number(item.unitPrice) || 0)
                            ).toFixed(2)}
                            readOnly
                          />
                        </div>
                      </div>

                      {items.length > 1 && (
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={() => removeItem(idx)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
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
                    "Record Gift"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Recent Gifts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : !gifts || gifts.length === 0 ? (
              <p className="text-sm text-gray-500">No gifts recorded.</p>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                {gifts.map((g) => (
                  <div key={g._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between text-sm font-semibold text-gray-800">
                      <span>{g.giftId}</span>
                      <span>{formatDate(g.date)}</span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Recipient: {g.recipientName} {g.recipientPhone ? `(${g.recipientPhone})` : ""}
                    </p>
                    <p className="text-xs text-gray-500">Items: {g.items?.length || 0}</p>
                    {g.note ? <p className="text-xs text-gray-400 mt-1 line-clamp-1">{g.note}</p> : null}
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

