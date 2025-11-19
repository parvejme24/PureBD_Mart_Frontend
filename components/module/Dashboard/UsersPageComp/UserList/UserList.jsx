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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash, Trash2 } from "lucide-react";

// Mock Users Data (10 users)
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
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    phone: "01710000003",
    address: "Khulna, Bangladesh",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "01710000004",
    address: "Rajshahi, Bangladesh",
    role: "User",
    avatar: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 5,
    name: "William Brown",
    email: "william@example.com",
    phone: "01710000005",
    address: "Sylhet, Bangladesh",
    role: "User",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: 6,
    name: "Olivia Wilson",
    email: "olivia@example.com",
    phone: "01710000006",
    address: "Barisal, Bangladesh",
    role: "Moderator",
    avatar: "https://i.pravatar.cc/150?img=6",
  },
  {
    id: 7,
    name: "James Taylor",
    email: "james@example.com",
    phone: "01710000007",
    address: "Rangpur, Bangladesh",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    id: 8,
    name: "Sophia Martinez",
    email: "sophia@example.com",
    phone: "01710000008",
    address: "Mymensingh, Bangladesh",
    role: "User",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    id: 9,
    name: "Benjamin Anderson",
    email: "benjamin@example.com",
    phone: "01710000009",
    address: "Tangail, Bangladesh",
    role: "User",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 10,
    name: "Isabella Thomas",
    email: "isabella@example.com",
    phone: "01710000010",
    address: "Comilla, Bangladesh",
    role: "Moderator",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState(usersData);

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
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
        Swal.fire("Deleted!", "User has been deleted.", "success");
      }
    });
  };

  const handleViewOrders = (user) => {
    Swal.fire({
      title: `${user.name}'s Orders`,
      html: `<p>Email: ${user.email}</p><p>Phone: ${user.phone}</p><p>Address: ${user.address}</p><p>Orders functionality coming soon...</p>`,
      icon: "info",
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Users Management</h2>
      <Table>
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
                  onClick={() => handleViewOrders(user)}
                  className={"cursor-pointer"}
                >
                  View Orders
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDeleteUser(user.id)}
                  className={"cursor-pointer"}
                >
                  <Trash2 />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
