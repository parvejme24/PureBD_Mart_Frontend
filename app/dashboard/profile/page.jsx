"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  User,
  Camera,
  Loader2,
  X,
  Save,
  Mail,
  MapPin,
  Shield,
  Phone,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth, useCurrentUser, useUpdateProfile } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  divisions,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  getDivisionByName,
  getDistrictByName,
  getUpazilaByName,
  formatDisplayName,
} from "@/data/bangladesh-address";

// Validation schema for profile update
const profileSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  phone: z.string().optional(),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
  division: z.string().optional(),
  district: z.string().optional(),
  upazila: z.string().optional(),
  postalCode: z.string().optional(),
  street: z.string().optional(),
});

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

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  // Address cascading state
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");

  const { user: sessionUser } = useAuth();
  const { data: userData, isLoading, refetch } = useCurrentUser();
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  // Get user from API response or session
  const user = userData?.user || sessionUser;

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      password: "",
      division: "",
      district: "",
      upazila: "",
      postalCode: "",
      street: "",
    },
  });

  // Derive available districts based on selected division
  const availableDistricts = useMemo(() => {
    if (selectedDivisionId) {
      return getDistrictsByDivision(selectedDivisionId);
    }
    return [];
  }, [selectedDivisionId]);

  // Derive available upazilas based on selected district
  const availableUpazilas = useMemo(() => {
    if (selectedDistrictId) {
      return getUpazilasByDistrict(selectedDistrictId);
    }
    return [];
  }, [selectedDistrictId]);

  // Reset form with user data when entering edit mode
  const handleEditClick = () => {
    if (user) {
      const userDivision = getDivisionByName(user.address?.division);
      const userDistrict = getDistrictByName(
        user.address?.district,
        userDivision?.id
      );
      const userUpazila = getUpazilaByName(
        user.address?.upazila,
        userDistrict?.id
      );

      // Set cascading state - useMemo will derive districts/upazilas automatically
      setSelectedDivisionId(userDivision?.id || "");
      setSelectedDistrictId(userDistrict?.id || "");

      form.reset({
        fullName: user.fullName || user.name || "",
        phone: user.phone || "",
        password: "",
        division: userDivision?.name || "",
        district: userDistrict?.name || "",
        upazila: userUpazila?.name || "",
        postalCode: user.address?.postalCode || "",
        street: user.address?.street || "",
      });
    }
    setIsEditing(true);
  };

  // Cancel editing
  const handleCancel = () => {
    setIsEditing(false);
    setPreviewImage(null);
    setSelectedFile(null);
    setSelectedDivisionId("");
    setSelectedDistrictId("");
    form.reset();
  };

  // Handle image selection
  const handleImageChange = (e) => {
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
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      toast.success("Image selected! Click 'Save Changes' to upload.");
    }
  };

  // Handle division change
  const handleDivisionChange = (divisionName) => {
    const division = divisions.find((d) => d.name === divisionName);
    setSelectedDivisionId(division?.id || "");
    // Reset district and upazila when division changes
    setSelectedDistrictId("");
    form.setValue("division", divisionName);
    form.setValue("district", "");
    form.setValue("upazila", "");
  };

  // Handle district change
  const handleDistrictChange = (districtName) => {
    const district = availableDistricts.find((d) => d.name === districtName);
    setSelectedDistrictId(district?.id || "");
    // Reset upazila when district changes
    form.setValue("district", districtName);
    form.setValue("upazila", "");
  };

  // Submit form
  const onSubmit = (data) => {
    const formData = new FormData();

    // Add fullName
    formData.append("fullName", data.fullName || "");

    // Add phone
    if (data.phone) {
      formData.append("phone", data.phone);
    }

    // Add password if provided
    if (data.password && data.password.trim() !== "") {
      formData.append("password", data.password);
    }

    // Add address as JSON (updated structure with upazila instead of country)
    const address = {
      country: "Bangladesh",
      division: data.division || "",
      district: data.district || "",
      upazila: data.upazila || "",
      postalCode: data.postalCode || "",
      street: data.street || "",
    };
    formData.append("address", JSON.stringify(address));

    // Add image if selected
    if (selectedFile) {
      formData.append("image", selectedFile, selectedFile.name);
    }

    updateProfile(formData, {
      onSuccess: () => {
        setIsEditing(false);
        setPreviewImage(null);
        setSelectedFile(null);
        setSelectedDivisionId("");
        setSelectedDistrictId("");
        setAvailableDistricts([]);
        setAvailableUpazilas([]);
        refetch();
      },
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#3BB77E]" />
      </div>
    );
  }

  // Get display values
  const displayName = user?.fullName || user?.name || "User";
  const displayEmail = user?.email || "";
  const displayImage = previewImage || user?.image?.url || user?.image || null;
  const displayRole = user?.role || "user";
  const address = user?.address || {};

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 mt-1">
            Manage your account information and settings
          </p>
        </div>
        {!isEditing && (
          <Button
            onClick={handleEditClick}
            className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
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
                  onChange={handleImageChange}
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
                <p className="text-sm text-gray-400 italic">
                  No address added yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form / Info Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{isEditing ? "Edit Profile" : "Profile Information"}</span>
              {isEditing && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Info Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Controller
                      name="fullName"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            Full Name
                          </label>
                          <Input
                            {...field}
                            placeholder="Enter your full name"
                            className="bg-white"
                            disabled={isUpdating}
                          />
                          {fieldState.error && (
                            <p className="text-red-500 text-xs">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <div className="space-y-1">
                      <label className="text-sm text-gray-600">Email</label>
                      <Input
                        value={displayEmail}
                        disabled
                        className="bg-gray-50 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-400">
                        Email cannot be changed
                      </p>
                    </div>

                    <Controller
                      name="phone"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            Phone Number
                          </label>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            className="bg-white"
                            disabled={isUpdating}
                          />
                          {fieldState.error && (
                            <p className="text-red-500 text-xs">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />

                    <Controller
                      name="password"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            New Password (optional)
                          </label>
                          <Input
                            {...field}
                            type="password"
                            placeholder="Leave blank to keep current"
                            className="bg-white"
                            disabled={isUpdating}
                          />
                          {fieldState.error && (
                            <p className="text-red-500 text-xs">
                              {fieldState.error.message}
                            </p>
                          )}
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Address Section */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Shipping Address (Bangladesh)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Division Select */}
                    <Controller
                      name="division"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            Division
                          </label>
                          <Select
                            value={field.value}
                            onValueChange={handleDivisionChange}
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="bg-white w-full">
                              <SelectValue placeholder="Select Division" />
                            </SelectTrigger>
                            <SelectContent>
                              {divisions.map((division) => (
                                <SelectItem
                                  key={division.id}
                                  value={division.name}
                                >
                                  {division.name} ({division.nameBn})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    {/* District Select */}
                    <Controller
                      name="district"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            District
                          </label>
                          <Select
                            value={field.value}
                            onValueChange={handleDistrictChange}
                            disabled={isUpdating || !selectedDivisionId}
                          >
                            <SelectTrigger className="bg-white w-full">
                              <SelectValue
                                placeholder={
                                  selectedDivisionId
                                    ? "Select District"
                                    : "Select Division first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableDistricts.map((district) => (
                                <SelectItem
                                  key={district.id}
                                  value={district.name}
                                >
                                  {district.name} ({district.nameBn})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    {/* Upazila Select */}
                    <Controller
                      name="upazila"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            Upazila / Sub-district
                          </label>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            disabled={isUpdating || !selectedDistrictId}
                          >
                            <SelectTrigger className="bg-white w-full">
                              <SelectValue
                                placeholder={
                                  selectedDistrictId
                                    ? "Select Upazila"
                                    : "Select District first"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {availableUpazilas.map((upazila) => (
                                <SelectItem
                                  key={upazila.id}
                                  value={upazila.name}
                                >
                                  {upazila.name} ({upazila.nameBn})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    />

                    {/* Postal Code */}
                    <Controller
                      name="postalCode"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-1">
                          <label className="text-sm text-gray-600">
                            Post Code
                          </label>
                          <Input
                            {...field}
                            placeholder="1216"
                            className="bg-white"
                            disabled={isUpdating}
                          />
                        </div>
                      )}
                    />

                    {/* Street Address */}
                    <Controller
                      name="street"
                      control={form.control}
                      render={({ field }) => (
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-sm text-gray-600">
                            Detail Address
                          </label>
                          <Textarea
                            {...field}
                            placeholder="House #, Road #, Area, Village/Union"
                            className="bg-white resize-none"
                            rows={3}
                            disabled={isUpdating}
                          />
                        </div>
                      )}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isUpdating}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#3BB77E] hover:bg-[#2a9c66] text-white cursor-pointer"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </form>
            ) : (
              /* View Mode */
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-gray-900">{displayName}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="font-medium text-gray-900">{displayEmail}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <p className="font-medium text-gray-900">
                        {user?.phone || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Account Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {displayRole}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Shipping Address
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Division</p>
                      <p className="font-medium text-gray-900">
                        {address.division || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">District</p>
                      <p className="font-medium text-gray-900">
                        {address.district || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Upazila</p>
                      <p className="font-medium text-gray-900">
                        {address.upazila || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Post Code</p>
                      <p className="font-medium text-gray-900">
                        {address.postalCode || "Not set"}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg md:col-span-2">
                      <p className="text-xs text-gray-500 mb-1">
                        Detail Address
                      </p>
                      <p className="font-medium text-gray-900">
                        {address.street || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
