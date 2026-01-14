"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  X,
  Loader2,
  ImagePlus,
  ArrowLeft,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategory";
import { useCreateProduct } from "@/hooks/useProduct";

export default function AddProductPage() {
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priceInput, setPriceInput] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [purchasePriceInput, setPurchasePriceInput] = useState("");
  const [transportCostInput, setTransportCostInput] = useState("");
  const [otherCostInput, setOtherCostInput] = useState("");
  const [expiryDateInput, setExpiryDateInput] = useState("");
  const [expiryWarningDaysInput, setExpiryWarningDaysInput] = useState("30");
  const [isDeliveryChargeFree, setIsDeliveryChargeFree] = useState(false);
  const [expiryTracking, setExpiryTracking] = useState(false);
  const [weightUnit, setWeightUnit] = useState("kg");
  const imageInputRef = useRef(null);

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories = categoriesData?.categories || [];

  // Get selected category name
  const selectedCategoryName = categories.find(
    (cat) => cat._id === selectedCategory
  )?.name;

  // Create product mutation
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove preview + clear file
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const discountedPrice = useMemo(() => {
    const price = Number(priceInput) || 0;
    const discount = Math.max(0, Number(discountInput) || 0);
    const value = price - discount;
    return value > 0 ? value : 0;
  }, [priceInput, discountInput]);

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      return;
    }

    if (!selectedImage) {
      return;
    }

    const form = e.target;
    const formData = new FormData();

    // Basic Information
    formData.append("name", form.name.value);
    formData.append("shortDescription", form.shortDescription.value);
    formData.append("description", form.description.value);
    if (form.sku.value) formData.append("sku", form.sku.value);

    // Pricing & Inventory
    formData.append("price", form.price.value);
    formData.append("category", selectedCategory);
    formData.append("stock", form.stock.value);
    formData.append("minStockLevel", form.minStockLevel.value || "0");
    if (form.discount.value) formData.append("discount", form.discount.value);
    if (form.purchasePrice.value) formData.append("purchasePrice", form.purchasePrice.value);

    // Shipping & Weight
    if (form.weight.value) formData.append("weight", form.weight.value);
    formData.append("weightUnit", weightUnit);
    formData.append("isDeliveryChargeFree", isDeliveryChargeFree.toString());
    if (form.transportCost.value) formData.append("transportCost", form.transportCost.value);
    if (form.otherCost.value) formData.append("otherCost", form.otherCost.value);

    // Expiry & Tracking
    formData.append("expiryTracking", expiryTracking.toString());
    if (form.expiryWarningDays.value) formData.append("expiryWarningDays", form.expiryWarningDays.value);
    if (form.productExpiryDays.value) formData.append("productExpiryDays", form.productExpiryDays.value);

    // Additional
    if (form.note.value) formData.append("note", form.note.value);
    formData.append("image", selectedImage);

    createProduct(formData, {
      onSuccess: () => {
        router.push("/dashboard/products");
      },
    });
  };

  // Handle Reset
  const handleReset = () => {
    setSelectedCategory("");
    setPriceInput("");
    setDiscountInput("");
    setPurchasePriceInput("");
    setTransportCostInput("");
    setOtherCostInput("");
    setExpiryDateInput("");
    setExpiryWarningDaysInput("30");
    setIsDeliveryChargeFree(false);
    setExpiryTracking(false);
    setWeightUnit("kg");
    handleRemoveImage();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard/products">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer h-9 w-9"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information Section */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            <p className="text-sm text-gray-600">Essential product details</p>
          </div>

          {/* Product Name & SKU */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="name">
                Product Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter product name"
                required
                disabled={isCreating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU (Product Code)</Label>
              <Input
                id="sku"
                name="sku"
                type="text"
                placeholder="Optional product code"
                disabled={isCreating}
              />
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <Label htmlFor="shortDescription">
              Short Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              placeholder="Brief product description for listings..."
              required
              disabled={isCreating}
            />
          </div>

          {/* Full Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Full Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Detailed product information..."
              required
              disabled={isCreating}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-red-500">*</span>
            </Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={categoryOpen}
                  className="w-full justify-between cursor-pointer font-normal"
                  disabled={isCreating || isCategoriesLoading}
                >
                  {isCategoriesLoading ? (
                    <span className="text-muted-foreground">Loading...</span>
                  ) : selectedCategoryName ? (
                    <div className="flex items-center gap-2">
                      {categories.find((cat) => cat._id === selectedCategory)
                        ?.image?.url && (
                        <Image
                          src={
                            categories.find(
                              (cat) => cat._id === selectedCategory
                            )?.image?.url
                          }
                          alt={selectedCategoryName}
                          width={20}
                          height={20}
                          className="rounded object-cover"
                        />
                      )}
                      <span className="truncate">{selectedCategoryName}</span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">
                      Select category...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>No category found.</CommandEmpty>
                    <CommandGroup>
                      {categories.map((category) => (
                        <CommandItem
                          key={category._id}
                          value={category.name}
                          onSelect={() => {
                            setSelectedCategory(category._id);
                            setCategoryOpen(false);
                          }}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            {category.image?.url && (
                              <Image
                                src={category.image.url}
                                alt={category.name}
                                width={24}
                                height={24}
                                className="rounded object-cover"
                              />
                            )}
                            <span>{category.name}</span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedCategory === category._id
                                ? "opacity-100 text-[#3BB77E]"
                                : "opacity-0"
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
        </div>

        {/* Pricing & Inventory Section */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Pricing & Inventory</h3>
            <p className="text-sm text-gray-600">Set prices and manage stock levels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Selling Price */}
            <div className="space-y-2">
              <Label htmlFor="price">
                Selling Price (৳) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                placeholder="Enter selling price"
                required
                disabled={isCreating}
                value={priceInput}
                onChange={(e) => setPriceInput(e.target.value)}
              />
            </div>

            {/* Purchase Price */}
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price (৳)</Label>
              <Input
                id="purchasePrice"
                name="purchasePrice"
                type="number"
                min="0"
                step="0.01"
                placeholder="Cost price"
                disabled={isCreating}
                value={purchasePriceInput}
                onChange={(e) => setPurchasePriceInput(e.target.value)}
              />
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discount (৳)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                step="0.01"
                placeholder="Absolute discount"
                disabled={isCreating}
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
              />
            </div>

            {/* Stock */}
            <div className="space-y-2">
              <Label htmlFor="stock">
                Stock Quantity <span className="text-red-500">*</span>
              </Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                placeholder="Available stock"
                required
                disabled={isCreating}
              />
            </div>

            {/* Min Stock Level */}
            <div className="space-y-2">
              <Label htmlFor="minStockLevel">Min Stock Alert</Label>
              <Input
                id="minStockLevel"
                name="minStockLevel"
                type="number"
                min="0"
                placeholder="Minimum stock level"
                defaultValue="0"
                disabled={isCreating}
              />
            </div>
          </div>

          {/* Price Preview */}
          <div className="rounded-md border border-dashed border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <div className="flex items-center justify-between">
              <span>Final price after discount</span>
              <span className="font-semibold">৳{discountedPrice.toFixed(2)}</span>
            </div>
            {purchasePriceInput && (
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200">
                <span>Estimated profit per unit</span>
                <span className="font-semibold">
                  ৳{(discountedPrice - Number(purchasePriceInput || 0)).toFixed(2)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Shipping & Weight Section */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Shipping & Weight</h3>
            <p className="text-sm text-gray-600">Configure shipping options and weight details</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Weight */}
            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                name="weight"
                type="number"
                min="0"
                step="0.01"
                placeholder="Product weight"
                disabled={isCreating}
              />
            </div>

            {/* Weight Unit */}
            <div className="space-y-2">
              <Label htmlFor="weightUnit">Weight Unit</Label>
              <select
                id="weightUnit"
                name="weightUnit"
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isCreating}
              >
                <option value="kg">Kilogram (kg)</option>
                <option value="g">Gram (g)</option>
                <option value="pcs">Pieces (pcs)</option>
                <option value="box">Box</option>
                <option value="packet">Packet</option>
                <option value="liter">Liter (L)</option>
              </select>
            </div>

            {/* Transport Cost */}
            <div className="space-y-2">
              <Label htmlFor="transportCost">Transport Cost (৳)</Label>
              <Input
                id="transportCost"
                name="transportCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="Additional transport cost"
                disabled={isCreating}
                value={transportCostInput}
                onChange={(e) => setTransportCostInput(e.target.value)}
              />
            </div>

            {/* Other Cost */}
            <div className="space-y-2">
              <Label htmlFor="otherCost">Other Cost (৳)</Label>
              <Input
                id="otherCost"
                name="otherCost"
                type="number"
                min="0"
                step="0.01"
                placeholder="Additional costs"
                disabled={isCreating}
                value={otherCostInput}
                onChange={(e) => setOtherCostInput(e.target.value)}
              />
            </div>
          </div>

          {/* Free Delivery Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="isDeliveryChargeFree"
              checked={isDeliveryChargeFree}
              onCheckedChange={setIsDeliveryChargeFree}
              disabled={isCreating}
            />
            <Label htmlFor="isDeliveryChargeFree" className="text-sm font-medium">
              Free delivery for this product
            </Label>
          </div>
        </div>

        {/* Expiry & Alerts Section */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Expiry & Alerts</h3>
            <p className="text-sm text-gray-600">Configure expiry tracking and alert settings</p>
          </div>

          {/* Expiry Tracking Toggle */}
          <div className="flex items-center space-x-2">
            <Switch
              id="expiryTracking"
              checked={expiryTracking}
              onCheckedChange={setExpiryTracking}
              disabled={isCreating}
            />
            <Label htmlFor="expiryTracking" className="text-sm font-medium">
              Enable expiry date tracking
            </Label>
          </div>

          {expiryTracking && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Expiry Date */}
              <div className="space-y-2">
                <Label htmlFor="productExpiryDays">Expiry Date</Label>
                <Input
                  id="productExpiryDays"
                  name="productExpiryDays"
                  type="date"
                  disabled={isCreating}
                />
              </div>

              {/* Warning Days */}
              <div className="space-y-2">
                <Label htmlFor="expiryWarningDays">Warning Days Before Expiry</Label>
                <Input
                  id="expiryWarningDays"
                  name="expiryWarningDays"
                  type="number"
                  min="1"
                  placeholder="Days before expiry to show warning"
                  defaultValue="30"
                  disabled={isCreating}
                />
              </div>
            </div>
          )}
        </div>

        {/* Media Section */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Media</h3>
            <p className="text-sm text-gray-600">Upload product images</p>
          </div>

          <div className="space-y-2">
            <Label>
              Product Image <span className="text-red-500">*</span>
            </Label>

            {!imagePreview ? (
              <div
                onClick={() => imageInputRef.current?.click()}
                className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#3BB77E] transition-colors"
              >
                <ImagePlus className="h-12 w-12 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">Click to upload image</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
            ) : (
              <div className="relative inline-block">
                <div className="relative w-40 h-40 rounded-lg overflow-hidden border">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full cursor-pointer"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Additional Notes Section */}
        <div className="space-y-6">
          <div className="border-b pb-2">
            <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
            <p className="text-sm text-gray-600">Any additional notes or information</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Notes</Label>
            <Textarea
              id="note"
              name="note"
              rows={3}
              placeholder="Additional notes about the product..."
              disabled={isCreating}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isCreating}
            className="cursor-pointer"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={isCreating || !selectedCategory || !selectedImage}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Product...
              </>
            ) : (
              "Add Product"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
