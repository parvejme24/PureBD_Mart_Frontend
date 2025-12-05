"use client";

export default function ProfileViewMode({
  displayName,
  displayEmail,
  displayRole,
  phone,
  address,
}) {
  return (
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
            <p className="font-medium text-gray-900">{phone || "Not set"}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Account Type</p>
            <p className="font-medium text-gray-900 capitalize">{displayRole}</p>
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
            <p className="text-xs text-gray-500 mb-1">Detail Address</p>
            <p className="font-medium text-gray-900">
              {address.street || "Not set"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

