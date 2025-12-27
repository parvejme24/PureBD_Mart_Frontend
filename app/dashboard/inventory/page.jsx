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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useProducts } from "@/hooks/useProduct";
import {
  useCreatePurchase,
  useCreatePurchaseReturn,
  useExpiryAlerts,
  useLowStockProducts,
  usePurchaseReturns,
  useRecentPurchases,
  useStockSummary,
} from "@/hooks/useInventory";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Loader2, Plus, PackageSearch, Undo2, AlertTriangle, Clock3 } from "lucide-react";
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

const initialPurchaseForm = {
    product: "",
    productName: "",
    sku: "",
    quantity: "",
    unitPrice: "",
    transportCost: "",
    otherCost: "",
    note: "",
    source: "",
    collectedByName: "",
    collectedByEmail: "",
    collectedByPhone: "",
};

const initialReturnForm = {
  purchaseRecordId: "",
  quantity: "",
  reason: "",
  note: "",
};

const formatDateLabel = (iso) => {
  if (!iso) return "Select date";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "Select date";
  return d.toLocaleDateString();
};

export default function InventoryPage() {
  const { data: productsData } = useProducts();
  const { data: purchases, isLoading: loadingPurchases } = useRecentPurchases(20);
  const { data: stock, isLoading: loadingStock } = useStockSummary();
  const { data: purchaseReturns, isLoading: loadingReturns } = usePurchaseReturns();
  const { data: lowStock, isLoading: loadingLowStock } = useLowStockProducts();
  const [expiryFilters, setExpiryFilters] = useState({ windowDays: "30", startDate: "", endDate: "" });
  const { data: expiryAlerts, isLoading: loadingExpiry } = useExpiryAlerts(expiryFilters);
  const { mutate: createPurchase, isPending: savingPurchase } = useCreatePurchase();
  const { mutate: createPurchaseReturn, isPending: savingReturn } = useCreatePurchaseReturn();
  const products = productsData?.products || [];
  const stockSummary = stock || [];
  const purchaseList = purchases || [];
  const returnList = purchaseReturns || [];
  const lowStockProducts = lowStock || [];
  const expiryList = expiryAlerts || [];

  const [purchaseForm, setPurchaseForm] = useState(initialPurchaseForm);
  const [returnForm, setReturnForm] = useState(initialReturnForm);
  const [productPickerOpen, setProductPickerOpen] = useState(false);
  const [expiryForm, setExpiryForm] = useState({ windowDays: "30", startDate: "", endDate: "" });
  const [startCalendarOpen, setStartCalendarOpen] = useState(false);
  const [endCalendarOpen, setEndCalendarOpen] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((p) => p._id === purchaseForm.product),
    [products, purchaseForm.product]
  );

  const selectedReturnPurchase = useMemo(
    () => purchaseList.find((p) => p._id === returnForm.purchaseRecordId),
    [purchaseList, returnForm.purchaseRecordId]
  );

  const handlePurchaseChange = (field, value) => {
    setPurchaseForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleReturnChange = (field, value) => {
    setReturnForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePurchaseSubmit = (e) => {
    e.preventDefault();
    if (!purchaseForm.product || !purchaseForm.quantity || !purchaseForm.unitPrice) return;

    createPurchase(
      {
        product: purchaseForm.product,
        productName: purchaseForm.productName || selectedProduct?.name || "",
        sku: purchaseForm.sku || selectedProduct?.sku || "",
        quantity: Number(purchaseForm.quantity),
        unitPrice: Number(purchaseForm.unitPrice),
        transportCost: Number(purchaseForm.transportCost) || 0,
        otherCost: Number(purchaseForm.otherCost) || 0,
        note: purchaseForm.note,
        source: purchaseForm.source,
      collectedBy: {
          name: purchaseForm.collectedByName,
          email: purchaseForm.collectedByEmail,
          phone: purchaseForm.collectedByPhone,
      },
      },
      {
        onSuccess: () => setPurchaseForm(initialPurchaseForm),
      }
    );
  };

  const handleReturnSubmit = (e) => {
    e.preventDefault();
    if (!returnForm.purchaseRecordId || !returnForm.quantity) return;

    createPurchaseReturn(
      {
        purchaseRecordId: returnForm.purchaseRecordId,
        purchaseId: selectedReturnPurchase?.purchaseId,
        quantity: Number(returnForm.quantity),
        reason: returnForm.reason,
        note: returnForm.note,
      },
      {
        onSuccess: () => setReturnForm(initialReturnForm),
      }
    );
  };

  const applyExpiryFilters = () => {
    setExpiryFilters(expiryForm);
  };

  const clearExpiryFilters = () => {
    const defaults = { windowDays: "30", startDate: "", endDate: "" };
    setExpiryForm(defaults);
    setExpiryFilters(defaults);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Inventory</h1>
          <p className="text-sm text-gray-500">
            Record purchases, process returns, and monitor stock health.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        <SummaryTile label="In Stock (pcs)" value={stockSummary.reduce((sum, s) => sum + (s.inStock || 0), 0)} />
        <SummaryTile label="Approx Stock Value" value={`৳${stockSummary.reduce((sum, s) => sum + (s.approximateStockValue || 0), 0).toFixed(2)}`} />
        <SummaryTile label="Purchases" value={purchaseList.length} />
        <SummaryTile label="Returns" value={returnList.length} tone="red" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-[#3BB77E]" />
              Record Purchase
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handlePurchaseSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Product *</Label>
                  <Popover open={productPickerOpen} onOpenChange={setProductPickerOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-between"
                        onClick={() => setProductPickerOpen((o) => !o)}
                      >
                        {selectedProduct ? (
                          <div className="flex items-center gap-2 truncate">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={selectedProduct.image?.url || selectedProduct.image || "/placeholder-product.png"}
                              alt={selectedProduct.name}
                              className="h-8 w-8 rounded object-cover border"
                            />
                            <div className="flex flex-col text-left truncate">
                              <span className="text-sm truncate">{selectedProduct.name}</span>
                              <span className="text-xs text-gray-500 truncate">SKU: {selectedProduct.sku || "N/A"}</span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Search product</span>
                        )}
                        <ChevronDown className="h-4 w-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[320px]" align="start">
                      <Command>
                        <CommandInput placeholder="Search product..." />
                        <CommandList>
                          <CommandEmpty>No products found.</CommandEmpty>
                          <CommandGroup>
                            {products.map((p) => (
                              <CommandItem
                                key={p._id}
                                value={`${p.name} ${p.sku || ""}`}
                                onSelect={() => {
                                  handlePurchaseChange("product", p._id);
                                  handlePurchaseChange("productName", p.name || "");
                                  handlePurchaseChange("sku", p.sku || "");
                                  setProductPickerOpen(false);
                    }}
                  >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={p.image?.url || p.image || "/placeholder-product.png"}
                                  alt={p.name}
                                  className="h-8 w-8 rounded object-cover border mr-2"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm">{p.name}</span>
                                  <span className="text-xs text-gray-500">SKU: {p.sku || "N/A"}</span>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    purchaseForm.product === p._id ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                      ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1.5">
                  <Label>SKU</Label>
                  <Input
                    value={purchaseForm.sku}
                    onChange={(e) => handlePurchaseChange("sku", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Quantity *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={purchaseForm.quantity}
                    onChange={(e) => handlePurchaseChange("quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Unit Price *</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={purchaseForm.unitPrice}
                    onChange={(e) => handlePurchaseChange("unitPrice", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Total (computed)</Label>
                  <Input
                    value={(
                      (Number(purchaseForm.quantity) || 0) * (Number(purchaseForm.unitPrice) || 0)
                    ).toFixed(2)}
                    readOnly
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Transport Cost</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={purchaseForm.transportCost}
                    onChange={(e) => handlePurchaseChange("transportCost", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Other Cost</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={purchaseForm.otherCost}
                    onChange={(e) => handlePurchaseChange("otherCost", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Note</Label>
                <Textarea
                  rows={2}
                  value={purchaseForm.note}
                  onChange={(e) => handlePurchaseChange("note", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label>Source</Label>
                <Input
                  value={purchaseForm.source}
                  onChange={(e) => handlePurchaseChange("source", e.target.value)}
                  placeholder="Supplier or source"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Collected By (Name)</Label>
                  <Input
                    value={purchaseForm.collectedByName}
                    onChange={(e) => handlePurchaseChange("collectedByName", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Collected By (Email)</Label>
                  <Input
                    value={purchaseForm.collectedByEmail}
                    onChange={(e) => handlePurchaseChange("collectedByEmail", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Collected By (Phone)</Label>
                  <Input
                    value={purchaseForm.collectedByPhone}
                    onChange={(e) => handlePurchaseChange("collectedByPhone", e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={savingPurchase}
                  className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
                >
                  {savingPurchase ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Record Purchase"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Undo2 className="h-5 w-5 text-[#3BB77E]" />
              Record Purchase Return
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleReturnSubmit}>
              <div className="space-y-1.5">
                <Label>Purchase</Label>
                <Select
                  value={returnForm.purchaseRecordId}
                  onValueChange={(val) => handleReturnChange("purchaseRecordId", val)}
                  disabled={!purchaseList || purchaseList.length === 0}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select purchase" />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseList.map((p) => (
                      <SelectItem key={p._id} value={p._id}>
                        {p.purchaseId} — {p.productName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!purchaseList || purchaseList.length === 0 ? (
                  <p className="text-xs text-gray-500">Add a purchase first.</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Return Quantity *</Label>
                  <Input
                    type="number"
                    min={0}
                    value={returnForm.quantity}
                    onChange={(e) => handleReturnChange("quantity", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Reason</Label>
                  <Input
                    value={returnForm.reason}
                    onChange={(e) => handleReturnChange("reason", e.target.value)}
                    placeholder="Damaged, wrong item, etc."
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label>Note</Label>
                <Textarea
                  rows={2}
                  value={returnForm.note}
                  onChange={(e) => handleReturnChange("note", e.target.value)}
                />
              </div>

              {selectedReturnPurchase ? (
                <div className="rounded-md border bg-gray-50 p-3 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-700">{selectedReturnPurchase.productName}</span>
                    <span>ID: {selectedReturnPurchase.purchaseId}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Purchased: {selectedReturnPurchase.quantity}</span>
                    <span>Price: ৳{selectedReturnPurchase.unitPrice}</span>
                    <span>Date: {formatDate(selectedReturnPurchase.date)}</span>
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={savingReturn || !purchaseList || purchaseList.length === 0}
                  className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
                >
                  {savingReturn ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </span>
                  ) : (
                    "Record Return"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PackageSearch className="h-5 w-5 text-[#3BB77E]" />
                Stock Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingStock ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
            ) : !stockSummary || stockSummary.length === 0 ? (
                <p className="text-sm text-gray-500">No stock data.</p>
              ) : (
                <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                {stockSummary.map((item) => (
                    <div
                      key={item.productId}
                      className="border rounded-lg p-3 bg-white flex flex-col gap-1"
                    >
                      <div className="flex justify-between text-sm font-semibold text-gray-800">
                        <span className="line-clamp-1">{item.productName || "Unnamed"}</span>
                        <span className="text-[#3BB77E]">In stock: {item.inStock}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>Purchased: {item.purchaseQty}</span>
                        <span>Sold: {item.salesQty}</span>
                        <span>Gift: {item.giftQty}</span>
                        <span>Waste: {item.wasteQty}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                      <span>Avg unit cost: ৳{Number(item.averageUnitPurchasePrice ?? 0).toFixed(2)}</span>
                      <span>Value: ৳{Number(item.approximateStockValue ?? 0).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Low Stock Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingLowStock ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : !lowStockProducts || lowStockProducts.length === 0 ? (
              <p className="text-sm text-gray-500">No low stock items 🎉</p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between text-sm font-semibold text-gray-800">
                      <span className="line-clamp-1">{p.name}</span>
                      <span className="text-red-600">{p.stock ?? 0} in stock</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>SKU: {p.sku || "N/A"}</span>
                      <span>Reorder at: {p.reorderPoint || p.minStockLevel || 0}</span>
                      <span>Unit: {p.unit || "pcs"}</span>
                    </div>
                    {p.brand ? <p className="text-xs text-gray-400 mt-1 line-clamp-1">Brand: {p.brand}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Recent Purchases</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingPurchases ? (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Loading...
                </div>
            ) : !purchaseList || purchaseList.length === 0 ? (
                <p className="text-sm text-gray-500">No purchases yet.</p>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                {purchaseList.map((p) => (
                    <div key={p._id} className="border rounded-lg p-3 bg-white">
                      <div className="flex justify-between text-sm font-semibold text-gray-800">
                        <span>{p.productName}</span>
                        <span className="text-[#3BB77E]">৳{p.totalPrice?.toFixed?.(2) || ""}</span>
                      </div>
                      <div className="text-xs text-gray-500 flex justify-between">
                        <span>ID: {p.purchaseId}</span>
                        <span>{p.quantity} pcs @ ৳{p.unitPrice}</span>
                        <span>{formatDate(p.date)}</span>
                      </div>
                      {p.note ? <p className="text-xs text-gray-400 mt-1 line-clamp-1">{p.note}</p> : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>Purchase Returns</CardTitle>
          </CardHeader>
          <CardContent>
            {loadingReturns ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </div>
            ) : !returnList || returnList.length === 0 ? (
              <p className="text-sm text-gray-500">No returns recorded.</p>
            ) : (
              <div className="space-y-2 max-h-[300px] overflow-auto pr-1">
                {returnList.map((r) => (
                  <div key={r._id} className="border rounded-lg p-3 bg-white">
                    <div className="flex justify-between text-sm font-semibold text-gray-800">
                      <span>{r.productName}</span>
                      <span className="text-red-600">-{r.quantity}</span>
                    </div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>ID: {r.purchaseId}</span>
                      <span>{r.reason || "No reason"}</span>
                      <span>{formatDate(r.date)}</span>
                    </div>
                    {r.note ? <p className="text-xs text-gray-400 mt-1 line-clamp-1">{r.note}</p> : null}
                  </div>
                ))}
        </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock3 className="h-5 w-5 text-[#3BB77E]" />
            Expiry Alerts
          </CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <span>Filter</span>
            <Popover open={startCalendarOpen} onOpenChange={setStartCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 w-[170px] justify-between"
                  onClick={() => setStartCalendarOpen((o) => !o)}
                >
                  {formatDateLabel(expiryForm.startDate)}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryForm.startDate ? new Date(expiryForm.startDate) : undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setExpiryForm((prev) => ({
                      ...prev,
                      startDate: date ? date.toISOString().slice(0, 10) : "",
                    }));
                    setStartCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <Popover open={endCalendarOpen} onOpenChange={setEndCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 w-[170px] justify-between"
                  onClick={() => setEndCalendarOpen((o) => !o)}
                >
                  {formatDateLabel(expiryForm.endDate)}
                  <ChevronDown className="h-4 w-4 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Calendar
                  mode="single"
                  selected={expiryForm.endDate ? new Date(expiryForm.endDate) : undefined}
                  captionLayout="dropdown"
                  onSelect={(date) => {
                    setExpiryForm((prev) => ({
                      ...prev,
                      endDate: date ? date.toISOString().slice(0, 10) : "",
                    }));
                    setEndCalendarOpen(false);
                  }}
                />
              </PopoverContent>
            </Popover>

            <Select
              value={expiryForm.windowDays}
              onValueChange={(val) => setExpiryForm((prev) => ({ ...prev, windowDays: val }))}
              disabled={Boolean(expiryForm.startDate || expiryForm.endDate)}
            >
              <SelectTrigger className="w-[140px] h-9">
                <SelectValue placeholder="Window days" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Next 7 days</SelectItem>
                <SelectItem value="30">Next 30 days</SelectItem>
                <SelectItem value="60">Next 60 days</SelectItem>
                <SelectItem value="90">Next 90 days</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" variant="secondary" onClick={applyExpiryFilters} className="h-9">
              Apply
            </Button>
            <Button size="sm" variant="ghost" onClick={clearExpiryFilters} className="h-9">
              Clear
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loadingExpiry ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          ) : !expiryList || expiryList.length === 0 ? (
            <p className="text-sm text-gray-500">No items expiring in this window.</p>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
              {expiryList.map((item) => (
                <div key={item.id || item._id} className="border rounded-lg p-3 bg-white">
                  <div className="flex justify-between text-sm font-semibold text-gray-800">
                    <span className="line-clamp-1">{item.productName || "Unnamed"}</span>
                    <span className="text-amber-600">{item.daysLeft} days left</span>
                  </div>
                  <div className="text-xs text-gray-500 flex justify-between">
                    <span>Batch: {item.batchNumber || "N/A"}</span>
                    <span>{formatDate(item.expiryDate)}</span>
                    <span>Qty: {item.quantity}</span>
                  </div>
                  {item.warehouse ? (
                    <p className="text-xs text-gray-400 mt-1">Warehouse: {item.warehouse}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryTile({ label, value, tone = "green" }) {
  const toneClasses =
    tone === "red"
      ? "from-red-50 to-white border-red-100 text-red-700"
      : "from-emerald-50 to-white border-emerald-100 text-emerald-700";
  return (
    <div className={cn("rounded-xl border p-4 shadow-sm bg-gradient-to-br", toneClasses)}>
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-semibold mt-1">{value}</p>
    </div>
  );
}

