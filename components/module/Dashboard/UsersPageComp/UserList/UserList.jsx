"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";

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
import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import UserOrdersModal from "../UserOrdersModal/UserOrdersModal";



// Mock users
const usersData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "01710000001",
    address: "Dhaka, Bangladesh",
    role: "User",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "01710000002",
    address: "Chittagong, Bangladesh",
    role: "Moderator",
    avatar: "https://i.pravatar.cc/150?img=2",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(usersData);

  const [selectedUser, setSelectedUser] = useState(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  const openOrderModal = (user) => {
    setSelectedUser(user);
    setOrderModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold mb-4">Users Management</h2>

        <Input
          type="text"
          placeholder="Search by email or phone"
          className="rounded-full px-5 max-w-sm"
        />

        <div className="w-[180px] border rounded-sm">
          <Select>
            <SelectTrigger className="w-full border-none shadow-none">
              <SelectValue placeholder="Filter Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="admin">Admins</SelectItem>
              <SelectItem value="moderator">Moderators</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table className="mt-5">
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
              </TableCell>

              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>{user.address}</TableCell>

              <TableCell>
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(user.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Moderator">Moderator</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </TableCell>

              <TableCell className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => openOrderModal(user)}
                >
                  View Orders
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Order Dialog Component */}
      <UserOrdersModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
