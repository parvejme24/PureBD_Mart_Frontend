"use client";

import { Controller } from "react-hook-form";
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
import { Loader2, Save } from "lucide-react";
import { divisions } from "@/data/bangladesh-address";

export default function ProfileEditForm({
  form,
  displayEmail,
  isUpdating,
  availableDistricts,
  availableUpazilas,
  selectedDivisionId,
  selectedDistrictId,
  onDivisionChange,
  onDistrictChange,
  onSubmit,
  onCancel,
}) {
  return (
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
                <label className="text-sm text-gray-600">Full Name</label>
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
            <p className="text-xs text-gray-400">Email cannot be changed</p>
          </div>

          <Controller
            name="phone"
            control={form.control}
            render={({ field, fieldState }) => (
              <div className="space-y-1">
                <label className="text-sm text-gray-600">Phone Number</label>
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
                <label className="text-sm text-gray-600">Division</label>
                <Select
                  value={field.value}
                  onValueChange={onDivisionChange}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.name}>
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
                <label className="text-sm text-gray-600">District</label>
                <Select
                  value={field.value}
                  onValueChange={onDistrictChange}
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
                      <SelectItem key={district.id} value={district.name}>
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
                      <SelectItem key={upazila.id} value={upazila.name}>
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
                <label className="text-sm text-gray-600">Post Code</label>
                <Input
                  {...field}
                  placeholder="1216"
                  className="bg-white"
                  disabled={isUpdating}
                />
              </div>
            )}
          />

          {/* Details Address */}
          <Controller
            name="detailsAddress"
            control={form.control}
            render={({ field }) => (
              <div className="space-y-1 md:col-span-2">
                <label className="text-sm text-gray-600">Detail Address</label>
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
          onClick={onCancel}
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
  );
}


