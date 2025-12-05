"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, FolderOpen } from "lucide-react";

export default function CategoryCard({ category, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:border-[#3BB77E]/30 transition-all duration-300">
      {/* Category Image */}
      <div className="relative w-full aspect-square bg-gray-50">
        {category.image?.url ? (
          <Image
            src={category.image.url}
            alt={category.name}
            fill
            className="object-cover p-7"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#3BB77E]/10">
            <FolderOpen className="w-12 h-12 text-[#3BB77E]" />
          </div>
        )}
      </div>

      {/* Category Info & Actions */}
      <div className="p-3">
        <h3 className="font-medium text-center text-gray-800 line-clamp-1 mb-2">
          {category.name}
        </h3>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="flex-1 cursor-pointer h-8 text-xs bg-[#DEF9EC] text-[#3BB77E] border-[#3BB77E]/20 hover:bg-[#c9f4e2]"
          >
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(category)}
            className="flex-1 cursor-pointer h-8 text-xs bg-red-50 text-red-500 border-red-200 hover:bg-red-100"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
