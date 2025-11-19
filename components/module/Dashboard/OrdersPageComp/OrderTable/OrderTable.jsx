"use client";

import React, { useState } from "react";
import { jsPDF } from "jspdf";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Mock productsData
const productsData = [
  { id: "1", name: "Fresh Apples", price: 180, quantity: "1 kg" },
  { id: "2", name: "Organic Bananas", price: 90, quantity: "1 dozen" },
  { id: "3", name: "Fresh Tomatoes", price: 70, quantity: "1 kg" },
];

// Mock orders
const ordersData = [
  {
    id: "1001",
    userName: "John Doe",
    email: "john@example.com",
    phone: "0123456789",
    address: "Dhaka, Bangladesh",
    products: [productsData[0], productsData[1]],
    status: "Pending",
  },
  {
    id: "1002",
    userName: "Jane Smith",
    email: "jane@example.com",
    phone: "01987654321",
    address: "Chittagong, Bangladesh",
    products: [productsData[2]],
    status: "Complete",
  },
];

export default function OrdersTable() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleDownloadInvoice = (order) => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Invoice", 105, 15, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Order ID: ${order.id}`, 20, 30);
    doc.text(`Customer: ${order.userName}`, 20, 40);
    doc.text(`Email: ${order.email}`, 20, 50);
    doc.text(`Phone: ${order.phone}`, 20, 60);
    doc.text(`Address: ${order.address}`, 20, 70);

    let startY = 90;
    doc.text("Products:", 20, startY);
    order.products.forEach((p, index) => {
      doc.text(`${index + 1}. ${p.name} - ${p.quantity} - ৳${p.price}`, 25, startY + 10 * (index + 1));
    });

    const total = order.products.reduce((acc, p) => acc + p.price, 0);
    doc.text(`Total: ৳${total}`, 20, startY + 10 * (order.products.length + 2));

    doc.save(`invoice_order_${order.id}.pdf`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "Approved":
        return "bg-blue-200 text-blue-800";
      case "Shipped":
        return "bg-indigo-200 text-indigo-800";
      case "Complete":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Total Products</TableHead>
            <TableHead>Total Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ordersData.map((order) => {
            const totalPrice = order.products.reduce((acc, p) => acc + p.price, 0);
            return (
              <TableRow key={order.id}>
                <TableCell>{order.userName}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.products.length}</TableCell>
                <TableCell>৳{totalPrice}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => handleViewInvoice(order)}>
                    View Invoice
                  </Button>
                  <Button size="sm" onClick={() => handleDownloadInvoice(order)}>
                    Download PDF
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Invoice Modal */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invoice for Order {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p>
              <strong>Customer:</strong> {selectedOrder?.userName}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder?.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder?.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder?.address}
            </p>
            <div className="mt-4">
              <strong>Products:</strong>
              <ul className="list-disc list-inside">
                {selectedOrder?.products.map((p) => (
                  <li key={p.id}>
                    {p.name} - {p.quantity} - ৳{p.price}
                  </li>
                ))}
              </ul>
            </div>
            <p className="mt-4">
              <strong>
                Total: ৳
                {selectedOrder?.products.reduce((acc, p) => acc + p.price, 0)}
              </strong>
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
