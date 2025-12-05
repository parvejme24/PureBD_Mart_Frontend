"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Search,
  X,
  Users,
  Shield,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useAllUsers,
  useChangeUserRole,
  useDeleteUser,
  useAuth,
} from "@/hooks/useAuth";
import UserListSkeleton from "./UserListSkeleton";

// Get user initials
const getInitials = (name) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// Format address
const formatAddress = (address) => {
  if (!address) return "Not set";
  const parts = [address.upazila, address.district, address.division].filter(
    Boolean
  );
  return parts.length > 0 ? parts.join(", ") : "Not set";
};

export default function UserList() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Get auth state
  const { user: currentUser } = useAuth();

  // Fetch users (includes auth loading state and isAdmin check)
  const { data, isLoading, isError, refetch, isAdmin } = useAllUsers();
  const { mutate: changeRole, isPending: isChangingRole } = useChangeUserRole();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const users = useMemo(() => data?.users || [], [data?.users]);

  // Filter users based on search and role
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        user.fullName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        user.phone?.toLowerCase().includes(searchLower);

      // Role filter
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  // Handle role change
  const handleRoleChange = (userId, newRole) => {
    changeRole({ userId, role: newRole });
  };

  // Open delete dialog
  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  // Handle delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;
    deleteUser(selectedUser._id, {
      onSuccess: () => {
        setDeleteDialogOpen(false);
        setSelectedUser(null);
      },
    });
  };

  // Loading state (includes auth loading)
  if (isLoading) {
    return <UserListSkeleton />;
  }

  // Not admin state
  if (!isAdmin) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-64 text-amber-500">
          <Shield className="h-12 w-12 mb-4" />
          <p className="font-medium text-gray-800">Access Denied</p>
          <p className="text-sm text-gray-500 mt-1">
            You need admin permissions to view this page
          </p>
          <p className="text-xs text-gray-400 mt-3">
            Current role:{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              {currentUser?.role || "none"}
            </span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Please logout and login again if you recently became an admin
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-4">
        <div className="flex flex-col items-center justify-center h-64 text-red-500">
          <AlertCircle className="h-12 w-12 mb-4" />
          <p className="font-medium">Failed to load users</p>
          <p className="text-sm text-gray-500 mt-1">
            Something went wrong. Please try again.
          </p>
          <Button
            variant="outline"
            className="mt-4 cursor-pointer"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} total users
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <Users className="h-16 w-16 mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600">
            {searchQuery || roleFilter !== "all"
              ? "No users found"
              : "No users yet"}
          </h3>
          <p className="text-sm mt-1">
            {searchQuery
              ? `No users matching "${searchQuery}"`
              : roleFilter !== "all"
              ? `No ${roleFilter}s found`
              : "Users will appear here"}
          </p>
        </div>
      )}

      {/* Users Table */}
      {filteredUsers.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-gray-50">
                  {/* User Info */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image?.url} />
                        <AvatarFallback className="bg-[#3BB77E]/10 text-[#3BB77E]">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.fullName || "No name"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Email */}
                  <TableCell>
                    <span className="text-gray-600">{user.email}</span>
                  </TableCell>

                  {/* Phone */}
                  <TableCell>
                    <span className="text-gray-600">
                      {user.phone || "Not set"}
                    </span>
                  </TableCell>

                  {/* Address */}
                  <TableCell>
                    <span className="text-gray-600 text-sm">
                      {formatAddress(user.address)}
                    </span>
                  </TableCell>

                  {/* Role */}
                  <TableCell>
                    <Select
                      value={user.role}
                      onValueChange={(value) =>
                        handleRoleChange(user._id, value)
                      }
                      disabled={isChangingRole}
                    >
                      <SelectTrigger
                        className={`w-28 ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-200"
                            : "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          <Shield className="h-3 w-3" />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDeleteDialog(user)}
                      className="cursor-pointer h-8 w-8 p-0 bg-red-50 text-red-500 border-red-200 hover:bg-red-100 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;
              {selectedUser?.fullName || selectedUser?.email}&quot;? This action
              cannot be undone and will remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
