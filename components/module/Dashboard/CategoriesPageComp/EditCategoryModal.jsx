"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Edit, Loader2, ImagePlus } from "lucide-react";
import { useUpdateCategory } from "@/hooks/useCategory";

export default function EditCategoryModal({ isOpen, onClose, category }) {
  const [categoryName, setCategoryName] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();

  // Set initial values when category changes
  useEffect(() => {
    if (category) {
      setCategoryName(category.name || "");
      setImagePreview(category.image?.url || null);
      setSelectedImage(null);
    }
  }, [category]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        return;
      }
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setCategoryName("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  // Handle update category
  const handleUpdate = () => {
    if (!categoryName.trim() || !category) return;

    const formData = new FormData();
    formData.append("name", categoryName.trim());
    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    updateCategory(
      { id: category._id, formData },
      {
        onSuccess: () => {
          onClose();
          resetForm();
        },
      }
    );
  };

  // Handle dialog close
  const handleOpenChange = (open) => {
    if (!open) {
      resetForm();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category name or image.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Category Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={isUpdating}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Category Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#3BB77E] transition-colors"
            >
              {imagePreview ? (
                <div className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <>
                  <ImagePlus className="h-10 w-10 text-gray-300 mb-2" />
                  <p className="text-sm text-gray-500">Click to upload image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <p className="text-xs text-gray-400">
              Leave empty to keep current image
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            disabled={isUpdating}
            className="cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || !categoryName.trim()}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Edit className="h-4 w-4 mr-2" />
                Update Category
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

