import { jsPDF } from "jspdf";
import { loadBanglaFont, containsBangla } from "@/lib/banglaFont";

// Shipping charge (you can make this dynamic)
export const SHIPPING_CHARGE = 0;

// Helper function to format address object to string
export const formatAddress = (address) => {
  if (!address) return "N/A";
  if (typeof address === "string") return address;

  const parts = [
    address.detailsAddress,
    address.upazila,
    address.district,
    address.division,
    address.postalCode ? `Postal: ${address.postalCode}` : "",
    address.country,
  ].filter(Boolean);

  return parts.join(", ") || "N/A";
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Get status color classes
export const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "shipped":
      return "bg-indigo-100 text-indigo-800 border-indigo-200";
    case "delivered":
      return "bg-green-100 text-green-800 border-green-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Get payment status color classes
export const getPaymentStatusColor = (status) => {
  switch (status) {
    case "paid":
      return "bg-green-100 text-green-800 border-green-200";
    case "unpaid":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    case "refunded":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Status filter options
export const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

// Payment method filter options
export const PAYMENT_METHOD_OPTIONS = [
  { value: "all", label: "All Payments" },
  { value: "COD", label: "Cash on Delivery" },
  { value: "ShurjoPay", label: "ShurjoPay" },
];

// Payment status filter options
export const PAYMENT_STATUS_OPTIONS = [
  { value: "all", label: "All Payment Status" },
  { value: "paid", label: "Paid" },
  { value: "unpaid", label: "Unpaid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

// Generate Professional Invoice PDF with Bangla support
export const generateInvoicePDF = async (order) => {
  // Calculate dynamic page height based on content
  const itemCount = order.items?.length || 0;
  const addressText = formatAddress(order.customer?.address);

  // Estimate address lines (roughly 60 chars per line)
  const estimatedAddressLines = Math.ceil(addressText.length / 60);

  // Calculate heights for each section
  const headerHeight = 40;
  const orderInfoHeight = 30;
  const customerBaseHeight = 55;
  const customerAddressExtra = Math.max(0, (estimatedAddressLines - 1) * 5);
  const tableHeaderHeight = 25;
  const tableRowHeight = 10;
  const tableContentHeight = itemCount * tableRowHeight;
  const totalsHeight = 50;
  const footerHeight = 40;
  const padding = 30;

  // Total dynamic height
  const dynamicHeight =
    headerHeight +
    orderInfoHeight +
    customerBaseHeight +
    customerAddressExtra +
    tableHeaderHeight +
    tableContentHeight +
    totalsHeight +
    footerHeight +
    padding;

  // Minimum height of 250 (roughly A5), maximum reasonable height
  const pageHeight = Math.max(250, Math.min(dynamicHeight, 500));

  // Create PDF with custom dimensions
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [210, pageHeight],
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Load and register Bangla font if needed
  let hasBanglaFont = false;
  const customerName = order.customer?.name || "";
  const productNames =
    order.items?.map((item) => item.title || item.product?.name || "") || [];
  const allText = [customerName, addressText, ...productNames].join(" ");

  if (containsBangla(allText)) {
    try {
      const fontBase64 = await loadBanglaFont();
      if (fontBase64) {
        doc.addFileToVFS("NotoSansBengali-Regular.ttf", fontBase64);
        doc.addFont("NotoSansBengali-Regular.ttf", "NotoSansBengali", "normal");
        hasBanglaFont = true;
      }
    } catch (error) {
      console.error("Error loading Bangla font:", error);
    }
  }

  // Helper function to set smart font based on text content
  const setFont = (text) => {
    if (hasBanglaFont && containsBangla(text)) {
      doc.setFont("NotoSansBengali", "normal");
    } else {
      doc.setFont("helvetica", "normal");
    }
  };

  // Colors
  const primaryColor = [59, 183, 126];
  const darkColor = [31, 41, 55];
  const lightGray = [156, 163, 175];
  const bgGray = [249, 250, 251];

  // Calculate totals
  const subtotal =
    order.items?.reduce((sum, item) => sum + item.price * item.qty, 0) || 0;
  const shipping = SHIPPING_CHARGE;
  const total = order.total || subtotal + shipping;

  let y = 15;

  // ===== HEADER SECTION =====
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont("helvetica", "bold");
  doc.text("PureBD Mart", 20, 25);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Quality Products, Trusted Service", 20, 33);

  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("INVOICE", pageWidth - 20, 25, { align: "right" });

  y = 55;

  // ===== ORDER INFO SECTION =====
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Order ID:", 20, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...primaryColor);
  doc.text(`#${order._id?.slice(-8).toUpperCase() || "N/A"}`, 50, y);

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  doc.text("Date:", pageWidth - 70, y);
  doc.setFont("helvetica", "normal");
  doc.text(formatDate(order.createdAt), pageWidth - 55, y);

  y += 8;
  doc.setFont("helvetica", "bold");
  doc.text("Status:", 20, y);
  doc.setFont("helvetica", "normal");
  const statusText =
    order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pending";
  doc.setTextColor(...primaryColor);
  doc.text(statusText, 50, y);

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "bold");
  doc.text("Payment:", pageWidth - 70, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.paymentMethod || "COD", pageWidth - 55, y);

  y += 15;

  // ===== CUSTOMER DETAILS SECTION =====
  const addressMaxWidth = pageWidth - 70;
  const addressLines = doc.splitTextToSize(addressText, addressMaxWidth);
  const addressHeight = addressLines.length * 5;

  const baseBoxHeight = 50;
  const extraAddressHeight = Math.max(0, addressHeight - 5);
  const customerBoxHeight = baseBoxHeight + extraAddressHeight;

  doc.setFillColor(...bgGray);
  doc.roundedRect(15, y - 5, pageWidth - 30, customerBoxHeight, 3, 3, "F");

  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Customer Details", 20, y + 5);

  y += 15;
  doc.setTextColor(...darkColor);
  doc.setFontSize(10);

  doc.setFont("helvetica", "bold");
  doc.text("Name:", 20, y);
  const customerNameText = order.customer?.name || "N/A";
  setFont(customerNameText);
  doc.text(customerNameText, 45, y);

  doc.setFont("helvetica", "bold");
  doc.text("Email:", 20, y + 8);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer?.email || "N/A", 45, y + 8);

  doc.setFont("helvetica", "bold");
  doc.text("Phone:", 110, y);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer?.phone || "N/A", 135, y);

  y += 20;
  doc.setFont("helvetica", "bold");
  doc.text("Address:", 20, y);
  setFont(addressText);

  addressLines.forEach((line, index) => {
    doc.text(line, 20, y + 6 + index * 5);
  });

  y += 10 + addressLines.length * 5;

  // ===== PRODUCTS TABLE =====
  doc.setTextColor(...primaryColor);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Order Items", 20, y);

  y += 8;

  doc.setFillColor(...primaryColor);
  doc.rect(15, y, pageWidth - 30, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("#", 20, y + 7);
  doc.text("Product Name", 30, y + 7);
  doc.text("Qty", 120, y + 7);
  doc.text("Unit Price", 140, y + 7);
  doc.text("Total", pageWidth - 25, y + 7, { align: "right" });

  y += 12;

  doc.setTextColor(...darkColor);
  doc.setFont("helvetica", "normal");

  if (order.items && order.items.length > 0) {
    order.items.forEach((item, index) => {
      const isEven = index % 2 === 0;
      if (isEven) {
        doc.setFillColor(249, 250, 251);
        doc.rect(15, y - 2, pageWidth - 30, 10, "F");
      }

      const productName = item.title || item.product?.name || "Product";
      const truncatedName =
        productName.length > 40
          ? productName.substring(0, 40) + "..."
          : productName;
      const itemTotal = item.price * item.qty;

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(String(index + 1), 20, y + 5);

      setFont(productName);
      doc.text(truncatedName, 30, y + 5);

      doc.setFont("helvetica", "normal");
      doc.text(String(item.qty), 122, y + 5);
      doc.text(`৳${item.price.toFixed(2)}`, 140, y + 5);
      doc.setFont("helvetica", "bold");
      doc.text(`৳${itemTotal.toFixed(2)}`, pageWidth - 25, y + 5, {
        align: "right",
      });
      doc.setFont("helvetica", "normal");

      y += 10;
    });
  }

  doc.setDrawColor(...lightGray);
  doc.line(15, y, pageWidth - 15, y);

  y += 10;

  // ===== TOTALS SECTION =====
  const totalsX = pageWidth - 80;

  doc.setFontSize(10);
  doc.setTextColor(...darkColor);
  doc.text("Subtotal:", totalsX, y);
  doc.text(`৳${subtotal.toFixed(2)}`, pageWidth - 25, y, { align: "right" });

  y += 8;

  doc.text("Shipping:", totalsX, y);
  if (shipping === 0) {
    doc.setTextColor(...primaryColor);
    doc.text("FREE", pageWidth - 25, y, { align: "right" });
  } else {
    doc.text(`৳${shipping.toFixed(2)}`, pageWidth - 25, y, { align: "right" });
  }

  y += 3;
  doc.setDrawColor(...lightGray);
  doc.line(totalsX - 5, y, pageWidth - 15, y);

  y += 10;

  doc.setFillColor(...primaryColor);
  doc.roundedRect(totalsX - 10, y - 6, 80, 14, 2, 2, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text("Total Payable:", totalsX, y + 3);
  doc.setFontSize(12);
  doc.text(`৳${total.toFixed(2)}`, pageWidth - 25, y + 3, { align: "right" });

  y += 25;

  // ===== FOOTER SECTION =====
  doc.setDrawColor(...lightGray);
  doc.line(15, y, pageWidth - 15, y);

  y += 10;

  doc.setTextColor(...darkColor);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Thank you for shopping with PureBD Mart!", pageWidth / 2, y, {
    align: "center",
  });

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...lightGray);
  doc.text(
    "For any queries, contact us at support@purebdmart.com | +880 1XXX-XXXXXX",
    pageWidth / 2,
    y,
    { align: "center" }
  );

  y += 5;
  doc.text("www.purebdmart.com", pageWidth / 2, y, { align: "center" });

  // Save the PDF
  doc.save(`Invoice_${order._id || "order"}.pdf`);
};

