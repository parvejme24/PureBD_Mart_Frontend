"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Loader2,
  ImagePlus,
  ArrowLeft,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useCategories } from "@/hooks/useCategory";
import { useProducts, useUpdateProduct } from "@/hooks/useProduct";

// Edit form component that receives product data as props
function EditProductForm({ product, categories, isCategoriesLoading, onSubmit, isUpdating }) {
  const [formData, setFormData] = useState({
    // Basic Information
    name: product.name || "",
    sku: product.sku || "",
    shortDescription: product.shortDescription || "",
    description: product.description || "",

    // Pricing & Inventory
    price: product.price?.toString() || "",
    purchasePrice: product.purchasePrice?.toString() || "",
    discount: product.discount?.toString() || "",
    stock: product.stock?.toString() || "",
    minStockLevel: product.minStockLevel?.toString() || "0",

    // Shipping & Weight
    weight: product.weight?.toString() || "",
    weightUnit: product.weightUnit || "kg",
    transportCost: product.transportCost?.toString() || "",
    otherCost: product.otherCost?.toString() || "",

    // Expiry & Tracking
    expiryTracking: product.expiryTracking || false,
    productExpiryDays: product.productExpiryDays || "",
    expiryWarningDays: product.expiryWarningDays?.toString() || "30",

    // Additional
    note: product.note || "",
  });

  const [selectedCategory, setSelectedCategory] = useState(product.category?._id || "");
  const [isDeliveryChargeFree, setIsDeliveryChargeFree] = useState(product.isDeliveryChargeFree || false);
  const [imagePreview, setImagePreview] = useState(product.image?.url || null);
  const [selectedImage, setSelectedImage] = useState(null);
  const imageInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  const handleRemoveImage = () => {
    setImagePreview(product.image?.url || null);
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Calculate discounted price
  const discountedPrice = (Number(formData.price) || 0) - (Number(formData.discount) || 0);
  const finalPrice = discountedPrice > 0 ? discountedPrice : 0;

  // Calculate profit
  const profit = finalPrice - (Number(formData.purchasePrice) || 0);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      return;
    }

    const submitData = new FormData();

    // Basic Information
    submitData.append("name", formData.name);
    submitData.append("shortDescription", formData.shortDescription);
    submitData.append("description", formData.description);
    if (formData.sku) submitData.append("sku", formData.sku);

    // Pricing & Inventory
    submitData.append("price", formData.price);
    submitData.append("category", selectedCategory);
    submitData.append("stock", formData.stock);
    submitData.append("minStockLevel", formData.minStockLevel);
    if (formData.discount) submitData.append("discount", formData.discount);
    if (formData.purchasePrice) submitData.append("purchasePrice", formData.purchasePrice);

    // Shipping & Weight
    if (formData.weight) submitData.append("weight", formData.weight);
    submitData.append("weightUnit", formData.weightUnit);
    submitData.append("isDeliveryChargeFree", isDeliveryChargeFree.toString());
    if (formData.transportCost) submitData.append("transportCost", formData.transportCost);
    if (formData.otherCost) submitData.append("otherCost", formData.otherCost);

    // Expiry & Tracking
    submitData.append("expiryTracking", formData.expiryTracking.toString());
    if (formData.expiryWarningDays) submitData.append("expiryWarningDays", formData.expiryWarningDays);
    if (formData.productExpiryDays) submitData.append("productExpiryDays", formData.productExpiryDays);

    // Additional
    if (formData.note) submitData.append("note", formData.note);

    // Image
    if (selectedImage) {
      submitData.append("image", selectedImage);
    }

    onSubmit(submitData);
  };

  return (
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
              value={formData.name}
              onChange={handleInputChange}
              required
              disabled={isUpdating}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU (Product Code)</Label>
            <Input
              id="sku"
              name="sku"
              type="text"
              placeholder="Optional product code"
              value={formData.sku}
              onChange={handleInputChange}
              disabled={isUpdating}
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
            value={formData.shortDescription}
            onChange={handleInputChange}
            required
            disabled={isUpdating}
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
            value={formData.description}
            onChange={handleInputChange}
            required
            disabled={isUpdating}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={isUpdating || isCategoriesLoading}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isCategoriesLoading ? "Loading..." : "Select category"} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category._id} value={category._id}>
                  <div className="flex items-center gap-2">
                    {category.image?.url && (
                      <Image
                        src={category.image.url}
                        alt={category.name}
                        width={20}
                        height={20}
                        className="rounded object-cover"
                      />
                    )}
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              value={formData.price}
              onChange={handleInputChange}
              required
              disabled={isUpdating}
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
              value={formData.purchasePrice}
              onChange={handleInputChange}
              disabled={isUpdating}
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
              value={formData.discount}
              onChange={handleInputChange}
              disabled={isUpdating}
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
              value={formData.stock}
              onChange={handleInputChange}
              required
              disabled={isUpdating}
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
              value={formData.minStockLevel}
              onChange={handleInputChange}
              disabled={isUpdating}
            />
          </div>
        </div>

        {/* Price Preview */}
        <div className="rounded-md border border-dashed border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-center justify-between">
            <span>Final price after discount</span>
            <span className="font-semibold">৳{finalPrice.toFixed(2)}</span>
          </div>
          {formData.purchasePrice && profit >= 0 && (
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-green-200">
              <span>Estimated profit per unit</span>
              <span className="font-semibold">৳{profit.toFixed(2)}</span>
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
              value={formData.weight}
              onChange={handleInputChange}
              disabled={isUpdating}
            />
          </div>

          {/* Weight Unit */}
          <div className="space-y-2">
            <Label htmlFor="weightUnit">Weight Unit</Label>
            <select
              id="weightUnit"
              name="weightUnit"
              value={formData.weightUnit}
              onChange={handleInputChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isUpdating}
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
              value={formData.transportCost}
              onChange={handleInputChange}
              disabled={isUpdating}
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
              value={formData.otherCost}
              onChange={handleInputChange}
              disabled={isUpdating}
            />
          </div>
        </div>

        {/* Free Delivery Toggle */}
        <div className="flex items-center space-x-2">
          <Switch
            id="isDeliveryChargeFree"
            checked={isDeliveryChargeFree}
            onCheckedChange={setIsDeliveryChargeFree}
            disabled={isUpdating}
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
            checked={formData.expiryTracking}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, expiryTracking: checked }))}
            disabled={isUpdating}
          />
          <Label htmlFor="expiryTracking" className="text-sm font-medium">
            Enable expiry date tracking
          </Label>
        </div>

        {formData.expiryTracking && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Expiry Date */}
            <div className="space-y-2">
              <Label htmlFor="productExpiryDays">Expiry Date</Label>
              <Input
                id="productExpiryDays"
                name="productExpiryDays"
                type="date"
                value={formData.productExpiryDays}
                onChange={handleInputChange}
                disabled={isUpdating}
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
                value={formData.expiryWarningDays}
                onChange={handleInputChange}
                disabled={isUpdating}
              />
            </div>
          </div>
        )}
      </div>

      {/* Media Section */}
      <div className="space-y-6">
        <div className="border-b pb-2">
          <h3 className="text-lg font-semibold text-gray-800">Media</h3>
          <p className="text-sm text-gray-600">Update product images</p>
        </div>

        <div className="space-y-2">
          <Label>Product Image</Label>

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
              {selectedImage && (
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-7 w-7 rounded-full cursor-pointer"
                  onClick={handleRemoveImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <p className="text-xs text-gray-400 mt-2">
                {selectedImage
                  ? "New image selected - click update to save"
                  : "Current image - click below to change"}
              </p>
            </div>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleImageChange}
            className="hidden"
          />

          {imagePreview && !selectedImage && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => imageInputRef.current?.click()}
              className="cursor-pointer"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Change Image
            </Button>
          )}
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
            value={formData.note}
            onChange={handleInputChange}
            disabled={isUpdating}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-6 border-t">
        <Link href="/dashboard/products">
          <Button
            type="button"
            variant="outline"
            disabled={isUpdating}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={isUpdating || !selectedCategory}
          className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
        >
          {isUpdating ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating Product...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Update Product
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  // Fetch categories
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();
  const categories = categoriesData?.categories || [];

  // Fetch products to get current product data
  const { data: productsData, isLoading: isProductsLoading } = useProducts();
  const products = productsData?.products || [];
  const currentProduct = products.find((p) => p._id === productId);

  // Update product mutation
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const handleUpdate = (formData) => {
    updateProduct(
      { id: productId, formData },
      {
        onSuccess: () => {
          router.push("/dashboard/products");
        },
      }
    );
  };

  // Loading state
  if (isProductsLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#3BB77E]" />
          <span className="ml-2 text-gray-600">Loading product...</span>
        </div>
      </div>
    );
  }

  // Product not found
  if (!currentProduct) {
    return (
      <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-600">Product not found</p>
          <Link href="/dashboard/products">
            <Button variant="outline" className="mt-4 cursor-pointer">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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
        <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
      </div>

      <EditProductForm
        key={currentProduct._id}
        product={currentProduct}
        categories={categories}
        isCategoriesLoading={isCategoriesLoading}
        onSubmit={handleUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
}
