"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Save,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategory";
import { useProducts, useUpdateProduct } from "@/hooks/useProduct";

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });
  const imageInputRef = useRef(null);

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

  // Get selected category name
  const selectedCategoryName = categories.find(
    (cat) => cat._id === selectedCategory
  )?.name;

  // Load current product data into form
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name || "",
        description: currentProduct.description || "",
        price: currentProduct.price?.toString() || "",
        stock: currentProduct.stock?.toString() || "",
      });
      setSelectedCategory(currentProduct.category?._id || "");
      setImagePreview(currentProduct.image?.url || null);
    }
  }, [currentProduct]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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
    setImagePreview(currentProduct?.image?.url || null);
    setSelectedImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      return;
    }

    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("description", formData.description);
    submitData.append("price", formData.price);
    submitData.append("category", selectedCategory);
    submitData.append("stock", formData.stock);

    // Only append image if a new one is selected
    if (selectedImage) {
      submitData.append("image", selectedImage);
    }

    updateProduct(
      { id: productId, formData: submitData },
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
  if (!currentProduct && !isProductsLoading) {
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Product Name */}
        <div className="space-y-2">
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

        {/* Category + Price + Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Searchable Category Dropdown */}
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
                  disabled={isUpdating || isCategoriesLoading}
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

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (৳) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleInputChange}
              required
              disabled={isUpdating}
            />
          </div>

          {/* Stock */}
          <div className="space-y-2">
            <Label htmlFor="stock">
              Stock <span className="text-red-500">*</span>
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
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">
            Description <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Write product details..."
            value={formData.description}
            onChange={handleInputChange}
            required
            disabled={isUpdating}
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-2">
          <Label>Product Image</Label>

          {!imagePreview ? (
            <div
              onClick={() => imageInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-[#3BB77E] transition-colors"
            >
              <ImagePlus className="h-12 w-12 text-gray-300 mb-3" />
              <p className="text-sm text-gray-500">Click to upload image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
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
                  ? "New image selected"
                  : "Click below to change image"}
              </p>
            </div>
          )}

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
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

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t">
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
                Updating...
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
    </div>
  );
}

