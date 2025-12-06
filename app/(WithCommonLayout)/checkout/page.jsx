"use client";

import { useState, useMemo } from "react";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrder";
import { useInitPayment } from "@/hooks/usePayment";
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
  CreditCard,
  MapPin,
  User,
  Tag,
  Check,
  X,
  Percent,
  Banknote,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";

// Sample coupon codes (in real app, this would come from backend)
const VALID_COUPONS = {
  SAVE10: { type: "percentage", value: 10, minOrder: 500 },
  SAVE20: { type: "percentage", value: 20, minOrder: 1000 },
  FLAT50: { type: "fixed", value: 50, minOrder: 300 },
  FLAT100: { type: "fixed", value: 100, minOrder: 800 },
  WELCOME: { type: "percentage", value: 15, minOrder: 0 },
};

// Payment method options
const PAYMENT_METHODS = [
  {
    value: "COD",
    label: "Cash on Delivery",
    icon: Banknote,
    description: "Pay with cash when your order is delivered.",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
  },
  {
    value: "ShurjoPay",
    label: "Online Payment",
    icon: Wallet,
    description: "Pay securely with bKash, Nagad, Cards, or Bank Transfer.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
];

// Checkout form component
function CheckoutForm({
  user,
  cart,
  cartTotal,
  getOrderItems,
  isPending,
  isPaymentPending,
  onSubmitCOD,
  onSubmitOnlinePayment,
}) {
  // Initialize form with user data if available
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    division: user?.address?.division || "",
    district: user?.address?.district || "",
    upazila: user?.address?.upazila || "",
    postalCode: user?.address?.postalCode || "",
    detailsAddress: user?.address?.detailsAddress || "",
    paymentMethod: "COD",
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const isProcessing = isPending || isPaymentPending;

  // Get available districts based on selected division
  const availableDistricts = useMemo(() => {
    if (!formData.division) return [];
    const selectedDivision = divisions.find(
      (d) => d.name === formData.division
    );
    if (!selectedDivision) return [];
    return districts.filter((d) => d.divisionId === selectedDivision.id);
  }, [formData.division]);

  // Get available upazilas based on selected district
  const availableUpazilas = useMemo(() => {
    if (!formData.district) return [];
    const selectedDistrict = districts.find(
      (d) => d.name === formData.district
    );
    if (!selectedDistrict) return [];
    return upazilas.filter((u) => u.districtId === selectedDistrict.id);
  }, [formData.district]);

  // Check if all required fields are filled
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

  // Calculate discount
  const discount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percentage") {
      return (cartTotal * appliedCoupon.value) / 100;
    }
    return appliedCoupon.value;
  }, [appliedCoupon, cartTotal]);

  // Calculate final total
  const finalTotal = useMemo(() => {
    return Math.max(0, cartTotal - discount);
  }, [cartTotal, discount]);

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

  // Apply coupon
  const handleApplyCoupon = () => {
    setCouponError("");
    setIsApplyingCoupon(true);

    setTimeout(() => {
      const code = couponCode.trim().toUpperCase();
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
      setCouponError("");
      toast.success(`Coupon "${code}" applied successfully!`);
      setIsApplyingCoupon(false);
    }, 500);
  };

  // Remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.success("Coupon removed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare order data
    const orderData = {
      items: getOrderItems(),
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
      },
      total: finalTotal,
      paymentMethod: formData.paymentMethod,
      coupon: appliedCoupon ? appliedCoupon.code : null,
      discount: discount,
    };

    // Route to appropriate handler based on payment method
    if (formData.paymentMethod === "ShurjoPay") {
      onSubmitOnlinePayment(orderData);
    } else {
      onSubmitCOD(orderData);
    }
  };

  const selectedPaymentMethod = PAYMENT_METHODS.find(
    (m) => m.value === formData.paymentMethod
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <User className="h-5 w-5 text-[#3BB77E]" />
              Customer Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className={
                    !formData.fullName.trim()
                      ? "border-gray-300"
                      : "border-green-300"
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className={
                    !formData.email.trim()
                      ? "border-gray-300"
                      : "border-green-300"
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number (e.g., 01XXXXXXXXX)"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className={
                    !formData.phone.trim()
                      ? "border-gray-300"
                      : "border-green-300"
                  }
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#3BB77E]" />
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Division */}
              <div className="space-y-2">
                <Label>Division *</Label>
                <Select
                  value={formData.division}
                  onValueChange={handleDivisionChange}
                  disabled={isProcessing}
                >
                  <SelectTrigger
                    className={`w-full ${
                      !formData.division
                        ? "border-gray-300"
                        : "border-green-300"
                    }`}
                  >
                    <SelectValue placeholder="Select Division" />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division.id} value={division.name}>
                        {division.name} ({division.nameBn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* District */}
              <div className="space-y-2">
                <Label>District *</Label>
                <Select
                  value={formData.district}
                  onValueChange={handleDistrictChange}
                  disabled={isProcessing || !formData.division}
                >
                  <SelectTrigger
                    className={`w-full ${
                      !formData.district
                        ? "border-gray-300"
                        : "border-green-300"
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        formData.division
                          ? "Select District"
                          : "Select Division first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableDistricts.map((district) => (
                      <SelectItem key={district.id} value={district.name}>
                        {district.name} ({district.nameBn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Upazila */}
              <div className="space-y-2">
                <Label>Upazila / Sub-district *</Label>
                <Select
                  value={formData.upazila}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, upazila: value }))
                  }
                  disabled={isProcessing || !formData.district}
                >
                  <SelectTrigger
                    className={`w-full ${
                      !formData.upazila ? "border-gray-300" : "border-green-300"
                    }`}
                  >
                    <SelectValue
                      placeholder={
                        formData.district
                          ? "Select Upazila"
                          : "Select District first"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableUpazilas.map((upazila) => (
                      <SelectItem key={upazila.id} value={upazila.name}>
                        {upazila.name} ({upazila.nameBn})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Postal Code */}
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal / ZIP Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="Enter postal code"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                />
              </div>

              {/* Details Address */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="detailsAddress">Detailed Address *</Label>
                <Textarea
                  id="detailsAddress"
                  name="detailsAddress"
                  placeholder="House no, Road, Area, Landmark etc."
                  value={formData.detailsAddress}
                  onChange={handleInputChange}
                  rows={3}
                  disabled={isProcessing}
                  className={
                    !formData.detailsAddress.trim()
                      ? "border-gray-300"
                      : "border-green-300"
                  }
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white border rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-[#3BB77E]" />
              Payment Method
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PAYMENT_METHODS.map((method) => {
                const Icon = method.icon;
                const isSelected = formData.paymentMethod === method.value;

                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        paymentMethod: method.value,
                      }))
                    }
                    disabled={isProcessing}
                    className={`p-4 rounded-lg border-2 text-left transition-all cursor-pointer ${
                      isSelected
                        ? `${method.borderColor} ${method.bgColor}`
                        : "border-gray-200 hover:border-gray-300"
                    } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-full ${
                          isSelected ? method.bgColor : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`h-5 w-5 ${
                            isSelected ? method.color : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <p
                          className={`font-semibold ${
                            isSelected ? method.color : "text-gray-800"
                          }`}
                        >
                          {method.label}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {method.description}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className={`h-5 w-5 ${method.color}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Method Info */}
            {selectedPaymentMethod && (
              <div
                className={`mt-4 p-3 rounded-lg ${selectedPaymentMethod.bgColor} border ${selectedPaymentMethod.borderColor}`}
              >
                <p className={`text-sm ${selectedPaymentMethod.color}`}>
                  {formData.paymentMethod === "ShurjoPay" ? (
                    <>
                      <strong>Secure Online Payment:</strong> You will be
                      redirected to ShurjoPay to complete your payment using
                      bKash, Nagad, Visa, Mastercard, or Bank Transfer.
                    </>
                  ) : (
                    <>
                      <strong>Cash on Delivery:</strong> Pay with cash when your
                      order is delivered to your doorstep.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border rounded-lg p-6 shadow-sm sticky top-24">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Order Summary
            </h2>

            {/* Cart Items */}
            <div className="space-y-3 max-h-[200px] overflow-y-auto border-b pb-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                    <p className="text-sm font-semibold text-[#3BB77E]">
                      ৳{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="py-4 border-b">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4" />
                Coupon Code
              </Label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Percent className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs text-green-600">
                        {appliedCoupon.type === "percentage"
                          ? `${appliedCoupon.value}% off`
                          : `৳${appliedCoupon.value} off`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 hover:bg-green-100 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4 text-green-600" />
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value);
                        setCouponError("");
                      }}
                      disabled={isProcessing || isApplyingCoupon}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleApplyCoupon}
                      disabled={
                        !couponCode.trim() || isProcessing || isApplyingCoupon
                      }
                      className="cursor-pointer"
                    >
                      {isApplyingCoupon ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Apply"
                      )}
                    </Button>
                  </div>
                  {couponError && (
                    <p className="text-xs text-red-500">{couponError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Totals */}
            <div className="space-y-3 py-4 border-b">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">৳{cartTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Discount ({appliedCoupon.code})
                  </span>
                  <span className="font-medium">-৳{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
            </div>

            <div className="flex justify-between py-4">
              <span className="text-lg font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-[#3BB77E]">
                ৳{finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Form validation status */}
            {!isFormValid && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-700 font-medium">
                  Please fill in all required fields (*) to proceed
                </p>
              </div>
            )}

            <Button
              type="submit"
              disabled={isProcessing || !isFormValid}
              className={`w-full h-12 text-lg cursor-pointer transition-all ${
                isFormValid
                  ? formData.paymentMethod === "ShurjoPay"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-[#3BB77E] hover:bg-[#2a9c66]"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  {isPaymentPending ? "Redirecting..." : "Placing Order..."}
                </>
              ) : isFormValid ? (
                <>
                  {formData.paymentMethod === "ShurjoPay" ? (
                    <>
                      <Wallet className="h-5 w-5 mr-2" />
                      Pay Now ৳{finalTotal.toFixed(2)}
                    </>
                  ) : (
                    <>
                      <Check className="h-5 w-5 mr-2" />
                      Place Order
                    </>
                  )}
                </>
              ) : (
                "Fill Required Fields"
              )}
            </Button>

            <p className="text-xs text-gray-400 text-center mt-4">
              By placing this order, you agree to our Terms of Service and
              Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function CheckoutPage() {
  const { cart, isLoaded, cartTotal, getOrderItems } = useCart();
  const { mutate: createOrder, isPending: isCODPending } = useCreateOrder();
  const { mutate: initPayment, isPending: isPaymentPending } = useInitPayment();
  const { data: userData, isLoading: isUserLoading } = useCurrentUser();
  const user = userData?.user || null;

  // Handle COD order
  const handleCODSubmit = (orderData) => {
    createOrder(orderData);
  };

  // Handle Online Payment
  const handleOnlinePayment = (orderData) => {
    initPayment(orderData);
  };

  // Loading state
  if (!isLoaded || isUserLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-[#3BB77E]" />
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Your cart is empty
          </h1>
          <p className="text-gray-500 mb-6">
            Add some products to your cart before checkout.
          </p>
          <Button
            asChild
            className="bg-[#3BB77E] hover:bg-[#2a9c66] cursor-pointer"
          >
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#3BB77E] mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Checkout
        </h1>
        {user && (
          <p className="text-sm text-gray-500 mt-1">
            Logged in as <span className="text-[#3BB77E]">{user.email}</span>
          </p>
        )}
      </div>

      <CheckoutForm
        key={user?._id || "guest"}
        user={user}
        cart={cart}
        cartTotal={cartTotal}
        getOrderItems={getOrderItems}
        isPending={isCODPending}
        isPaymentPending={isPaymentPending}
        onSubmitCOD={handleCODSubmit}
        onSubmitOnlinePayment={handleOnlinePayment}
      />
    </div>
  );
}
