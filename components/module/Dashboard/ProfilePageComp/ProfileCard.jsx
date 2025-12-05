"use client";

import { useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Mail, Phone, Shield, MapPin } from "lucide-react";
import { toast } from "sonner";

// Get user initials for avatar fallback
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function ProfileCard({
  user,
  displayName,
  displayEmail,
  displayImage,
  displayRole,
  address,
  isEditing,
  onImageChange,
}) {
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      onImageChange(file);
      toast.success("Image selected! Click 'Save Changes' to upload.");
    }
  };

  return (
    <Card className="lg:col-span-1">
      <CardContent className="pt-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
            <Avatar className="h-28 w-28 border-4 border-[#3BB77E]/20">
              {displayImage ? (
                <AvatarImage src={displayImage} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-[#3BB77E] text-white text-2xl font-bold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>

            {isEditing && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="h-8 w-8 text-white" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            {displayName}
          </h2>

          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <Mail className="h-4 w-4" />
            <span className="text-sm">{displayEmail}</span>
          </div>

          {user?.phone && (
            <div className="flex items-center gap-1 text-gray-500 mt-1">
              <Phone className="h-4 w-4" />
              <span className="text-sm">{user.phone}</span>
            </div>
          )}

          {/* Role Badge */}
          <div className="mt-3">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                displayRole === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-[#3BB77E]/10 text-[#3BB77E]"
              }`}
            >
              <Shield className="h-3 w-3" />
              {displayRole === "admin" ? "Administrator" : "Customer"}
            </span>
          </div>
        </div>

        {/* Address Info */}
        <div className="mt-6 pt-6 border-t">
          <div className="flex items-center gap-2 text-gray-700 mb-3">
            <MapPin className="h-4 w-4 text-[#3BB77E]" />
            <span className="font-medium">Address</span>
          </div>

          {address.street ||
          address.district ||
          address.division ||
          address.upazila ? (
            <div className="space-y-1 text-sm text-gray-600">
              {address.street && <p>{address.street}</p>}
              {address.upazila && <p>{address.upazila}</p>}
              {(address.district || address.division) && (
                <p>
                  {[address.district, address.division]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              )}
              {address.postalCode && <p>Post Code: {address.postalCode}</p>}
              <p>Bangladesh</p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No address added yet</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

