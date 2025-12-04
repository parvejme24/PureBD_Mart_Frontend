"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IoClose } from "react-icons/io5";

export default function AddProductPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const imageInputRef = useRef(null); // to reset file input

  // Handle Image Preview
  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove preview + clear file
  const handleRemoveImage = () => {
    setImagePreview(null);

    // Clear the file input
    if (imageInputRef.current) {
      imageInputRef.current.value = null;
    }
  };

  // Form Submit Handler
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    const productData = {
      title: formData.get("title"),
      category: formData.get("category"),
      price: formData.get("price"),
      stock: formData.get("stock"),
      description: formData.get("description"),
      image: formData.get("image"), // File object
    };

    console.log("Submitted Product Data:", productData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-2000">
      <h2 className="text-center text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Title */}
        <div className="space-y-1">
          <Label>Product Title</Label>
          <Input
            name="title"
            type="text"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Category + Price + Stock */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label>Category</Label>
            <Input
              name="category"
              type="text"
              placeholder="e.g. Burger"
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Price (৳)</Label>
            <Input
              name="price"
              type="number"
              placeholder="Enter price"
              required
            />
          </div>

          <div className="space-y-1">
            <Label>Stock</Label>
            <Input
              name="stock"
              type="number"
              placeholder="Available stock"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            name="description"
            rows={5}
            placeholder="Write product details..."
          />
        </div>

        {/* Image Upload */}
        <div className="space-y-1">
          <Label>Product Image</Label>
          <Input
            ref={imageInputRef}
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* Preview + Remove Button */}
        {imagePreview && (
          <div className="mt-3">
            <Label>
              Preview:{" "}
              <Button
                type="button"
                variant="destructive"
                className="bg-red-500 text-white cursor-pointer w-2 h-[2px] rounded-full"
                onClick={handleRemoveImage}
              >
                <IoClose />
              </Button>
            </Label>
            <div className="flex items-center gap-4 mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button type="reset" className="bg-gray-200 text-black">
            Reset
          </Button>
          <Button type="submit" className="bg-[#3BB77E] text-white">
            Add Product
          </Button>
        </div>
      </form>
    </div>
  );
}
