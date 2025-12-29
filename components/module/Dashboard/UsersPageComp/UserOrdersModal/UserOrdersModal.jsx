"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserOrdersData = {
  userId: "123456987",
  userName: "John Doe",
  email: "johndoe@gmail.com",
  phone: "01712345678",
  shippingAddress: "",
  orders: [
    {
      orderId: "16465465asd665",
      orderDate: "2025-11-18",
      orderStatus: "Delivered",
      products: [
        {
          id: "asd45",
          name: "Fresh Apples",
          image:
            "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-carrot-300x300.jpg",
          quantity: "1 kg",
          price: "180",
          totalPrice: "180",
        },
        {
          id: "bcd32",
          name: "Organic Carrots",
          image:
            "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-carrot-300x300.jpg",
          quantity: "2 kg",
          price: "150",
          totalPrice: "300",
        },
      ],
    },
    {
      orderId: "23587bsdf1234",
      orderDate: "2025-11-19",
      orderStatus: "Processing",
      products: [
        {
          id: "xyz99",
          name: "Banana Bunch",
          image: "https://example.com/banana.jpg",
          quantity: "1.5 kg",
          price: "120",
          totalPrice: "180",
        },
      ],
    },
    {
      orderId: "9834dfg23545",
      orderDate: "2025-11-17",
      orderStatus: "Shipped",
      products: [
        {
          id: "asd45",
          name: "Fresh Apples",
          image:
            "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-carrot-300x300.jpg",
          quantity: "3 kg",
          price: "180",
          totalPrice: "540",
        },
        {
          id: "jk127",
          name: "Organic Tomatoes",
          image: "https://example.com/tomatoes.jpg",
          quantity: "1 kg",
          price: "200",
          totalPrice: "200",
        },
        {
          id: "bcd32",
          name: "Organic Carrots",
          image:
            "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-carrot-300x300.jpg",
          quantity: "1 kg",
          price: "150",
          totalPrice: "150",
        },
      ],
    },
    {
      orderId: "2345kjh98234",
      orderDate: "2025-11-20",
      orderStatus: "Delivered",
      products: [
        {
          id: "xyz99",
          name: "Banana Bunch",
          image: "https://example.com/banana.jpg",
          quantity: "2 kg",
          price: "120",
          totalPrice: "240",
        },
        {
          id: "jk127",
          name: "Organic Tomatoes",
          image: "https://example.com/tomatoes.jpg",
          quantity: "2 kg",
          price: "200",
          totalPrice: "400",
        },
        {
          id: "qwe56",
          name: "Cucumber",
          image: "https://example.com/cucumber.jpg",
          quantity: "1 kg",
          price: "100",
          totalPrice: "100",
        },
        {
          id: "zxc34",
          name: "Potatoes",
          image: "https://example.com/potato.jpg",
          quantity: "3 kg",
          price: "90",
          totalPrice: "270",
        },
      ],
    },
    {
      orderId: "0987uyt56432",
      orderDate: "2025-11-16",
      orderStatus: "Cancelled",
      products: [
        {
          id: "bcd32",
          name: "Organic Carrots",
          image:
            "https://agricoma.ninetheme.com/wp-content/uploads/2023/12/organic-carrot-300x300.jpg",
          quantity: "1.5 kg",
          price: "150",
          totalPrice: "225",
        },
      ],
    },
  ],
};

// Helper for status color
const getStatusClass = (status) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-700";
    case "Processing":
      return "bg-yellow-100 text-yellow-700";
    case "Shipped":
      return "bg-blue-100 text-blue-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Calculate total of an order
const calculateOrderTotal = (products) => {
  return products.reduce((total, item) => total + Number(item.totalPrice), 0);
};

export default function UserOrdersModal({ open, onClose, user }) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {user.name}&apos;s Orders
          </DialogTitle>
          <DialogDescription>
            User basic information and complete order details.
          </DialogDescription>
        </DialogHeader>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Phone:</strong> {user.phone}
          </p>
          <p>
            <strong>Address:</strong> {user.address}
          </p>
        </div>

        {/* Order Section */}
        <div className="bg-white border rounded-lg p-4 mt-4 shadow-sm">
          <p className="font-semibold text-lg mb-3">Order List</p>

          <Accordion type="single" collapsible className="w-full">
            {UserOrdersData.orders.map((order, index) => {
              const orderTotal = calculateOrderTotal(order.products);

              return (
                <AccordionItem
                  key={order.orderId}
                  value={`order-${index}`}
                  className="border rounded-md mb-3"
                >
                  <AccordionTrigger>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full text-left">
                      <div>
                        <h5 className="font-medium">
                          Order ID: {order.orderId}
                        </h5>
                        <p className="text-sm text-gray-600">
                          Date: {order.orderDate}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 mt-2 md:mt-0">
                        <span
                          className={`px-3 py-1 text-sm rounded-full ${getStatusClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>

                        <span className="font-semibold text-gray-800">
                          Total: {orderTotal}৳
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>

                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Image</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Price (৳)</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Total (৳)</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {order.products.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-12 w-12 object-cover rounded-md"
                              />
                            </TableCell>

                            <TableCell className="font-medium">
                              {product.name}
                            </TableCell>

                            <TableCell>{product.price}</TableCell>

                            <TableCell>{product.quantity}</TableCell>

                            <TableCell>{product.totalPrice}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Order total footer */}
                    <div className="flex justify-end mt-3">
                      <p className="font-semibold text-base">
                        Order Total: {orderTotal}৳
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>

        <Button className="mt-4 w-full" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
