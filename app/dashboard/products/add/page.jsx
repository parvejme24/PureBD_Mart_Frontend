"use client";

import { useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
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

    formData.append("name", form.name.value);
    formData.append("description", form.description.value);
    formData.append("price", form.price.value);
    formData.append("category", selectedCategory);
    formData.append("stock", form.stock.value);
    formData.append("image", selectedImage);
    if (form.discount.value) formData.append("discount", form.discount.value);
    if (form.weight.value) formData.append("weight", form.weight.value);

    createProduct(formData, {
      onSuccess: () => {
        router.push("/dashboard/products");
      },
    });
  };

  // Handle Reset
  const handleReset = () => {
    setSelectedCategory("");
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
            required
            disabled={isCreating}
          />
        </div>

        {/* Category + Price + Stock + Discount + Weight */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
              required
              disabled={isCreating}
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
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
              placeholder="Optional absolute discount"
              disabled={isCreating}
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
            />
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.01"
              placeholder="Optional weight for shipping"
              disabled={isCreating}
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
              required
              disabled={isCreating}
            />
          </div>
        </div>

        {/* Discounted price preview */}
        <div className="rounded-md border border-dashed border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          <div className="flex items-center justify-between">
            <span>Calculated price after discount</span>
            <span className="font-semibold">৳{discountedPrice.toFixed(2)}</span>
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
            required
            disabled={isCreating}
          />
        </div>

        {/* Image Upload */}
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

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isCreating}
            className="cursor-pointer"
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={isCreating || !selectedCategory || !selectedImage}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
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
