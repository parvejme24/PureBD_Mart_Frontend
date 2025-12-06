"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded" />
          <div className="h-4 w-64 bg-gray-200 rounded mt-2" />
        </div>
        <div className="h-10 w-28 bg-gray-200 rounded" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Skeleton */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              {/* Avatar Skeleton */}
              <div className="h-28 w-28 bg-gray-200 rounded-full" />
              {/* Name Skeleton */}
              <div className="h-6 w-32 bg-gray-200 rounded mt-4" />
              {/* Email Skeleton */}
              <div className="h-4 w-48 bg-gray-200 rounded mt-2" />
              {/* Badge Skeleton */}
              <div className="h-6 w-24 bg-gray-200 rounded-full mt-3" />
            </div>

            {/* Address Skeleton */}
            <div className="mt-6 pt-6 border-t">
              <div className="h-5 w-20 bg-gray-200 rounded mb-3" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-4 w-1/2 bg-gray-200 rounded" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Card Skeleton */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="h-6 w-40 bg-gray-200 rounded" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Personal Info Skeleton */}
              <div>
                <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                      <div className="h-5 w-32 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Skeleton */}
              <div>
                <div className="h-5 w-36 bg-gray-200 rounded mb-3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`p-3 bg-gray-50 rounded-lg ${
                        i === 4 ? "md:col-span-2" : ""
                      }`}
                    >
                      <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                      <div className="h-5 w-32 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}



