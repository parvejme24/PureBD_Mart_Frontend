"use client";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function UserListSkeleton() {
  return (
    <div className="p-4">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5">
        <div>
          <div className="h-7 bg-gray-200 rounded-lg w-48 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded-lg w-32 mt-2 animate-pulse" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded-full w-64 animate-pulse" />
          <div className="h-10 bg-gray-200 rounded-md w-40 animate-pulse" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded w-36 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-4 bg-gray-200 rounded w-28 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="h-8 bg-gray-200 rounded w-24 animate-pulse" />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <div className="h-8 bg-gray-200 rounded w-8 animate-pulse" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

