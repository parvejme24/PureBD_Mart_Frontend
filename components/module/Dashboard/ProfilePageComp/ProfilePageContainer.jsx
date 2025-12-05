"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Edit, X } from "lucide-react";
import { useAuth, useCurrentUser, useUpdateProfile } from "@/hooks/useAuth";
import {
  divisions,
  getDistrictsByDivision,
  getUpazilasByDistrict,
  getDivisionByName,
  getDistrictByName,
  getUpazilaByName,
} from "@/data/bangladesh-address";
import ProfileCard from "./ProfileCard";
import ProfileEditForm from "./ProfileEditForm";
import ProfileViewMode from "./ProfileViewMode";
import ProfileSkeleton from "./ProfileSkeleton";

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

export default function ProfilePageContainer() {
  const [isEditing, setIsEditing] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

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

      // Set cascading state
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

  // Handle image change from ProfileCard
  const handleImageChange = (file) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle division change
  const handleDivisionChange = (divisionName) => {
    const division = divisions.find((d) => d.name === divisionName);
    setSelectedDivisionId(division?.id || "");
    setSelectedDistrictId("");
    form.setValue("division", divisionName);
    form.setValue("district", "");
    form.setValue("upazila", "");
  };

  // Handle district change
  const handleDistrictChange = (districtName) => {
    const district = availableDistricts.find((d) => d.name === districtName);
    setSelectedDistrictId(district?.id || "");
    form.setValue("district", districtName);
    form.setValue("upazila", "");
  };

  // Submit form
  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("fullName", data.fullName || "");

    if (data.phone) {
      formData.append("phone", data.phone);
    }

    if (data.password && data.password.trim() !== "") {
      formData.append("password", data.password);
    }

    const address = {
      country: "Bangladesh",
      division: data.division || "",
      district: data.district || "",
      upazila: data.upazila || "",
      postalCode: data.postalCode || "",
      street: data.street || "",
    };
    formData.append("address", JSON.stringify(address));

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
        refetch();
      },
    });
  };

  // Loading state
  if (isLoading) {
    return <ProfileSkeleton />;
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
        <ProfileCard
          user={user}
          displayName={displayName}
          displayEmail={displayEmail}
          displayImage={displayImage}
          displayRole={displayRole}
          address={address}
          isEditing={isEditing}
          onImageChange={handleImageChange}
        />

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
              <ProfileEditForm
                form={form}
                displayEmail={displayEmail}
                isUpdating={isUpdating}
                availableDistricts={availableDistricts}
                availableUpazilas={availableUpazilas}
                selectedDivisionId={selectedDivisionId}
                selectedDistrictId={selectedDistrictId}
                onDivisionChange={handleDivisionChange}
                onDistrictChange={handleDistrictChange}
                onSubmit={onSubmit}
                onCancel={handleCancel}
              />
            ) : (
              <ProfileViewMode
                displayName={displayName}
                displayEmail={displayEmail}
                displayRole={displayRole}
                phone={user?.phone}
                address={address}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

