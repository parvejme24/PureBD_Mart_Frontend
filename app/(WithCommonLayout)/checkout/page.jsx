"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrder";
import { useCurrentUser } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { divisions, districts, upazilas } from "@/data/bangladesh-address";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  ArrowLeft,
  Loader2,
  MapPin,
  User,
  Tag,
  Check,
  X,
  Percent,
  Banknote,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Phone,
  Mail,
  FileText,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { useShippingConfig } from "@/hooks/useShipping";

// Available coupon codes
const VALID_COUPONS = {
  SAVE10: { type: "percentage", value: 10, minOrder: 500, label: "10% OFF" },
  SAVE20: { type: "percentage", value: 20, minOrder: 1000, label: "20% OFF" },
  FLAT50: { type: "fixed", value: 50, minOrder: 300, label: "৳50 Flat" },
  FLAT100: { type: "fixed", value: 100, minOrder: 800, label: "৳100 Flat" },
  WELCOME: { type: "percentage", value: 15, minOrder: 0, label: "15% Welcome" },
};

function CheckoutForm({
  user,
  cart,
  cartTotal,
  getOrderItems,
  isPending,
  onSubmitCOD,
}) {
  // Form state
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    division: user?.address?.division || "Dhaka",
    district: user?.address?.district || "",
    upazila: user?.address?.upazila || "",
    postalCode: user?.address?.postalCode || "",
    detailsAddress: user?.address?.detailsAddress || "",
    deliveryNotes: "",
    paymentMethod: "COD",
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Cascading districts based on selected division
  const availableDistricts = useMemo(() => {
    if (!formData.division) return [];
    const selectedDivision = divisions.find(
      (d) => d.name.toLowerCase() === formData.division.toLowerCase()
    );
    if (!selectedDivision) return [];
    return districts.filter((d) => d.divisionId === selectedDivision.id);
  }, [formData.division]);

  // Cascading upazilas based on selected district
  const availableUpazilas = useMemo(() => {
    if (!formData.district) return [];
    const selectedDistrict = districts.find(
      (d) => d.name.toLowerCase() === formData.district.toLowerCase()
    );
    if (!selectedDistrict) return [];
    return upazilas.filter((u) => u.districtId === selectedDistrict.id);
  }, [formData.district]);

  // Check form validity
  const isFormValid = useMemo(() => {
    return (
      formData.fullName.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.division !== "" &&
      formData.district !== "" &&
      formData.upazila !== "" &&
      formData.detailsAddress.trim() !== "" &&
      cart.length > 0
    );
  }, [formData, cart.length]);

  // Coupon Discount
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return (cartTotal * appliedCoupon.value) / 100;
    }
    return appliedCoupon.value;
  }, [appliedCoupon, cartTotal]);

  // Shipping calculation
  const { data: shippingConfig, isLoading: isShippingLoading } =
    useShippingConfig();

  const isFreeDelivery = cartTotal >= 500 || shippingConfig?.freeDeliveryEnabled;

  const shippingAmount = useMemo(() => {
    if (isFreeDelivery) return 0;
    const inside = Number(shippingConfig?.shippingInsideDhaka) || 60;
    const outside = Number(shippingConfig?.shippingOutsideDhaka) || 120;
    if (!formData.division) return inside;
    const isDhaka = formData.division.trim().toLowerCase() === "dhaka";
    return isDhaka ? inside : outside;
  }, [formData.division, isFreeDelivery, shippingConfig]);

  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discount + shippingAmount);
  }, [cartTotal, discount, shippingAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDivisionChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      division: value,
      district: "",
      upazila: "",
    }));
  };

  const handleDistrictChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      district: value,
      upazila: "",
    }));
  };

  const handleApplyCoupon = (codeToApply) => {
    const code = (codeToApply || couponCode).trim().toUpperCase();
    if (!code) return;

    setCouponError("");
    setIsApplyingCoupon(true);

    setTimeout(() => {
      const coupon = VALID_COUPONS[code];

      if (!coupon) {
        setCouponError("Invalid coupon code");
        setAppliedCoupon(null);
        setIsApplyingCoupon(false);
        return;
      }

      if (cartTotal < coupon.minOrder) {
        setCouponError(`Minimum order amount is ৳${coupon.minOrder}`);
        setAppliedCoupon(null);
        setIsApplyingCoupon(false);
        return;
      }

      setAppliedCoupon({ ...coupon, code });
      setCouponCode("");
      setCouponError("");
      toast.success(`Coupon "${code}" applied successfully!`);
      setIsApplyingCoupon(false);
    }, 400);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill in all required shipping fields marked with *");
      return;
    }

    const orderData = {
      items: getOrderItems ? getOrderItems() : cart,
      customer: {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        address: {
          country: "Bangladesh",
          division: formData.division,
          district: formData.district,
          upazila: formData.upazila,
          postalCode: formData.postalCode,
          detailsAddress: formData.detailsAddress,
        },
        deliveryNotes: formData.deliveryNotes,
      },
      total: finalTotal,
      subtotal: cartTotal,
      discount: discount,
      shipping: shippingAmount,
      paymentMethod: "COD",
      coupon: appliedCoupon ? appliedCoupon.code : null,
    };

    onSubmitCOD(orderData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: Shipping & Customer Form (7 cols)             */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Contact Information */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-150 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">
                    Contact Information
                  </h2>
                  <p className="text-xs text-gray-500">
                    We will send order tracking details and invoice to this contact.
                  </p>
                </div>
              </div>
              {user && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <Check className="w-3 h-3" /> Auto-filled
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="fullName" className="text-xs font-bold text-gray-700">
                  Full Name <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isPending}
                    className="h-11 rounded-2xl bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-400 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-bold text-gray-700">
                  Email Address <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isPending}
                    className="h-11 rounded-2xl bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-400 text-sm font-medium"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-bold text-gray-700">
                  Phone Number <span className="text-rose-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={isPending}
                    className="h-11 rounded-2xl bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 focus:ring-emerald-400 text-sm font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Delivery & Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-150 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 tracking-tight">
                    Delivery Destination
                  </h2>
                  <p className="text-xs text-gray-500">
                    Select your division, district, and exact address across Bangladesh.
                  </p>
                </div>
              </div>

              {/* Dynamic Shipping Badge */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {isFreeDelivery
                    ? "Free Delivery"
                    : formData.division?.toLowerCase() === "dhaka"
                    ? "Dhaka Express: ৳60"
                    : "Outside Dhaka: ৳120"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Division */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">
                  Division <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.division}
                  onValueChange={handleDivisionChange}
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full !h-11 rounded-2xl bg-gray-50/50 border-gray-200 px-4 text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-all">
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-2xl">
                    {divisions.map((d) => (
                      <SelectItem key={d.id} value={d.name} className="cursor-pointer">
                        {d.name} ({d.nameBn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">
                  District <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.district}
                  onValueChange={handleDistrictChange}
                  disabled={isPending || !formData.division}
                >
                  <SelectTrigger className="w-full !h-11 rounded-2xl bg-gray-50/50 border-gray-200 px-4 text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-all">
                    <SelectValue
                      placeholder={
                        formData.division ? "Select District" : "Choose Division First"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-2xl">
                    {availableDistricts.map((dist) => (
                      <SelectItem key={dist.id} value={dist.name} className="cursor-pointer">
                        {dist.name} ({dist.nameBn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upazila */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-gray-700">
                  Upazila / Thana <span className="text-rose-500">*</span>
                </Label>
                <Select
                  value={formData.upazila}
                  onValueChange={(val) =>
                    setFormData((prev) => ({ ...prev, upazila: val }))
                  }
                  disabled={isPending || !formData.district}
                >
                  <SelectTrigger className="w-full !h-11 rounded-2xl bg-gray-50/50 border-gray-200 px-4 text-sm font-medium focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400 cursor-pointer transition-all">
                    <SelectValue
                      placeholder={
                        formData.district ? "Select Upazila" : "Choose District First"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 rounded-2xl">
                    {availableUpazilas.map((u) => (
                      <SelectItem key={u.id} value={u.name} className="cursor-pointer">
                        {u.name} ({u.nameBn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Postal Code */}
              <div className="space-y-1.5">
                <Label htmlFor="postalCode" className="text-xs font-bold text-gray-700">
                  Postal / ZIP Code (Optional)
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="e.g. 1212"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className="h-11 rounded-2xl bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 text-sm font-medium"
                />
              </div>

              {/* Street Detailed Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="detailsAddress" className="text-xs font-bold text-gray-700">
                  Street &amp; House Details <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="detailsAddress"
                  name="detailsAddress"
                  placeholder="House #, Road #, Sector / Area name, Flat #, Landmark (e.g., Near City Hospital)"
                  value={formData.detailsAddress}
                  onChange={handleInputChange}
                  rows={2}
                  disabled={isPending}
                  className="rounded-2xl bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 text-sm font-medium resize-none"
                  required
                />
              </div>

              {/* Order Notes */}
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="deliveryNotes" className="text-xs font-bold text-gray-500">
                  Special Delivery Instructions (Optional)
                </Label>
                <Input
                  id="deliveryNotes"
                  name="deliveryNotes"
                  placeholder="e.g., Please call before delivering, deliver after 2 PM"
                  value={formData.deliveryNotes}
                  onChange={handleInputChange}
                  disabled={isPending}
                  className="h-10 rounded-2xl bg-gray-50/50 border-gray-200 focus:bg-white focus:border-emerald-500 text-xs font-medium"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-150 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">
                  Payment Method
                </h2>
                <p className="text-xs text-gray-500">
                  Zero advance fee required. Inspect your fresh groceries at doorstep before paying.
                </p>
              </div>
            </div>

            {/* Cash on Delivery Card */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-white flex items-start gap-4 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                <Banknote className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-gray-900 text-sm sm:text-base">
                    Cash on Delivery (COD)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3" /> Selected
                  </span>
                </div>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                  Pay with physical cash or digital money (bKash / Nagad / Upay) when the delivery agent hands over your fresh groceries.
                </p>
                <div className="flex items-center gap-2 mt-2.5 text-[11px] font-bold text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Secure &amp; Risk-Free Doorstep Inspection</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Order Summary & Coupon (5 cols)             */}
        {/* ========================================================= */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-gray-150 shadow-sm sticky top-24 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-gray-900 tracking-tight">
                  Order Summary
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                {cart.length} item{cart.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Cart Items List */}
            <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1 no-scrollbar">
              {cart.map((item) => {
                const img = item.image?.url || item.image || "/placeholder-product.png";
                return (
                  <div
                    key={item._id || item.productId}
                    className="flex items-center gap-3 p-2 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 flex items-center justify-center p-1">
                      <Image
                        src={img}
                        alt={item.name}
                        fill
                        sizes="56px"
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">
                        Qty: {item.qty} × ৳{item.price}
                      </p>
                    </div>
                    <span className="font-black text-sm text-gray-900 shrink-0">
                      ৳{(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 rounded-2xl bg-gray-50/70 border border-gray-150 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-emerald-600" /> Have a Promo Code?
                </span>
                {appliedCoupon && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-100/60 border border-emerald-300 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="text-xs font-black text-emerald-900 uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="text-[11px] text-emerald-700 block font-semibold">
                        {appliedCoupon.type === "percentage"
                          ? `${appliedCoupon.value}% discount applied`
                          : `৳${appliedCoupon.value} discount applied`}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-emerald-200/60 rounded-lg text-emerald-800 transition-colors cursor-pointer"
                    title="Remove coupon"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="e.g. SAVE10, WELCOME"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      disabled={isPending || isApplyingCoupon}
                      className="h-10 text-xs uppercase font-mono font-bold bg-white rounded-xl border-gray-200"
                    />
                    <Button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={!couponCode.trim() || isPending || isApplyingCoupon}
                      className="h-10 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>

                  {couponError && (
                    <p className="text-[11px] font-bold text-rose-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> {couponError}
                    </p>
                  )}

                  {/* Quick-tap coupon pills */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-[10px] text-gray-400 font-semibold">Try:</span>
                    {["WELCOME", "SAVE10", "FLAT50"].map((code) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => handleApplyCoupon(code)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 hover:text-emerald-700 hover:border-emerald-300 transition-all cursor-pointer"
                      >
                        {code}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Financial Totals */}
            <div className="space-y-2.5 text-sm pt-2 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">
                  ৳{cartTotal.toLocaleString()}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" /> Coupon Discount ({appliedCoupon.code})
                  </span>
                  <span>-৳{discount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-gray-400" /> Delivery Fee
                </span>
                {isShippingLoading ? (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Calculating...
                  </span>
                ) : isFreeDelivery ? (
                  <span className="font-black text-emerald-600 uppercase text-xs">
                    FREE DELIVERY
                  </span>
                ) : (
                  <span className="font-bold text-gray-900">
                    ৳{shippingAmount}
                  </span>
                )}
              </div>

              {isFreeDelivery && (
                <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  🎉 Free delivery applied on orders over ৳500!
                </p>
              )}

              {/* Grand Total */}
              <div className="pt-3 border-t border-gray-100 flex items-baseline justify-between">
                <div>
                  <span className="text-base font-black text-gray-900 block leading-tight">
                    Total Amount
                  </span>
                  <span className="text-[11px] text-gray-400 font-semibold">
                    Including all taxes &amp; charges
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                    ৳{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Form status hint */}
            {!isFormValid && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold text-amber-800 leading-snug">
                  Please complete your shipping address (Name, Phone, Division, District, Upazila &amp; Street Address) to place order.
                </p>
              </div>
            )}

            {/* Order Confirmation Button */}
            <Button
              type="submit"
              disabled={isPending || !isFormValid}
              className={`w-full h-13 font-black text-base rounded-2xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                isFormValid && !isPending
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-700/20 active:scale-98"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isPending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Confirming Order...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Place Order • ৳{finalTotal.toLocaleString()} (COD)</span>
                </>
              )}
            </Button>

            {/* Trust and Policy Footer */}
            <div className="space-y-2 pt-2 text-center">
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-gray-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Genuine Food
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-emerald-600" /> Easy Return
                </span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                By placing this order, you confirm you agree to PureBD Mart&apos;s Terms of Service and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, isLoaded, cartTotal, getOrderItems } = useCart();
  const { mutate: createOrder, isPending: isCODPending } = useCreateOrder();
  const { data: userData, isLoading: isUserLoading } = useCurrentUser();
  const user = userData?.user || null;

  const handleCODSubmit = (orderData) => {
    createOrder(orderData);
  };

  // Loading state
  if (!isLoaded || isUserLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600 mb-4" />
        <p className="text-sm font-bold text-gray-600">Loading your checkout...</p>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-gray-150 p-10 sm:p-14 shadow-xs max-w-lg mx-auto">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">
            Your Basket is Empty
          </h1>
          <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
            Looks like you haven&apos;t added any organic farm items yet. Explore our fresh harvest and start shopping!
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-md active:scale-98"
          >
            <span>Explore Fresh Mart</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20">
      {/* Top Breadcrumb & Stepper Header */}
      <div className="bg-white border-b border-gray-100 py-4 shadow-2xs">
        <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Title & Back link */}
            <div>
              <Link
                href="/cart"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-700 transition-colors mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Shopping Cart</span>
              </Link>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Secure Checkout
              </h1>
            </div>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                <Check className="w-3.5 h-3.5" /> 1. Cart
              </span>
              <span className="text-gray-300">→</span>
              <span className="flex items-center gap-1.5 text-white bg-emerald-600 px-3 py-1 rounded-full shadow-xs">
                2. Shipping &amp; Payment
              </span>
              <span className="text-gray-300">→</span>
              <span className="text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                3. Confirmation
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form Section */}
      <div className="container mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 pt-8 sm:pt-10">
        <CheckoutForm
          key={user?._id || "guest"}
          user={user}
          cart={cart}
          cartTotal={cartTotal}
          getOrderItems={getOrderItems}
          isPending={isCODPending}
          onSubmitCOD={handleCODSubmit}
        />
      </div>
    </div>
  );
}
