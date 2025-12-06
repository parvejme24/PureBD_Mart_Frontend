"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import { formatAddress, formatDate, getStatusColor } from "./orderUtils";

export default function OrderInvoiceModal({
  open,
  onOpenChange,
  order,
  onDownloadInvoice,
}) {
  if (!order) return null;

  // Calculate order subtotal
  const getOrderSubtotal = () => {
    return order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold text-[#3BB77E]">
                PureBD Mart
              </DialogTitle>
              <p className="text-sm text-gray-500">
                Quality Products, Trusted Service
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-800">INVOICE</p>
              <p className="text-sm text-gray-500">
                #{order._id?.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Info */}
          <div className="flex justify-between text-sm">
            <div>
              <span className="text-gray-500">Date: </span>
              <span className="font-medium">{formatDate(order.createdAt)}</span>
            </div>
            <div>
              <span className="text-gray-500">Status: </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
              </span>
            </div>
          </div>

          {/* Customer Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-[#3BB77E] mb-3">
              Customer Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Name</p>
                <p className="font-medium">{order.customer?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">{order.customer?.phone || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Email</p>
                <p className="font-medium">{order.customer?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-gray-500">Payment Method</p>
                <p className="font-medium">{order.paymentMethod || "COD"}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500">Shipping Address</p>
                <p className="font-medium">
                  {formatAddress(order.customer?.address)}
                </p>
              </div>
            </div>
          </div>

          {/* Products Table */}
          <div>
            <h3 className="font-semibold text-[#3BB77E] mb-3">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#3BB77E] text-white">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-center">Qty</th>
                    <th className="px-4 py-2 text-right">Price</th>
                    <th className="px-4 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">
                        {item.title || item.product?.name || "Product"}
                      </td>
                      <td className="px-4 py-3 text-center">{item.qty}</td>
                      <td className="px-4 py-3 text-right">
                        ৳{item.price?.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ৳{(item.price * item.qty).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>৳{getOrderSubtotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="text-[#3BB77E] font-medium">FREE</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-800">Total Payable</span>
                <span className="font-bold text-xl text-[#3BB77E]">
                  ৳{(order.total || getOrderSubtotal()).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t pt-4 text-center text-sm text-gray-500">
            <p className="font-medium text-gray-700">
              Thank you for shopping with PureBD Mart!
            </p>
            <p>For any queries, contact us at support@purebdmart.com</p>
          </div>
        </div>

        <DialogFooter className="border-t pt-4">
          <Button
            variant="outline"
            onClick={() => onDownloadInvoice(order)}
            className="cursor-pointer"
          >
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button
            onClick={() => onOpenChange(false)}
            className="cursor-pointer bg-[#3BB77E] hover:bg-[#2a9c66]"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

