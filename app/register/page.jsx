"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  User,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Star,
  Leaf,
  Check,
  Gift,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth, useRegister } from "@/hooks/useAuth";

const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters.")
    .max(50, "Name must be less than 50 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms and Privacy Policy.",
  }),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const {
    loginWithGoogle,
    isAuthenticated,
    isLoading: authLoading,
  } = useAuth();
  const { mutate: register, isPending } = useRegister();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, authLoading, router]);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      agreeTerms: true,
    },
    mode: "onChange",
  });

  const passwordValue =
    useWatch({
      control: form.control,
      name: "password",
      defaultValue: "",
    }) || "";

  // Password strength calculation
  let passwordStrength = { score: 0, text: "", color: "", textColor: "" };
  if (passwordValue) {
    let score = 0;
    if (passwordValue.length >= 6) score += 1;
    if (passwordValue.length >= 8) score += 1;
    if (/[0-9]/.test(passwordValue)) score += 1;
    if (/[^A-Za-z0-9]/.test(passwordValue) || /[A-Z]/.test(passwordValue)) score += 1;

    if (score <= 1) passwordStrength = { score: 1, text: "Weak", color: "bg-red-500", textColor: "text-red-500" };
    else if (score <= 2) passwordStrength = { score: 2, text: "Fair", color: "bg-amber-500", textColor: "text-amber-500" };
    else if (score <= 3) passwordStrength = { score: 3, text: "Good", color: "bg-teal-500", textColor: "text-teal-600" };
    else passwordStrength = { score: 4, text: "Strong", color: "bg-emerald-600", textColor: "text-emerald-600" };
  }

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = (data) => {
    register({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
    });
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-[#F8FAF9]">
        <div className="relative flex items-center justify-center">
          <div className="w-14 h-14 rounded-full border-3 border-emerald-200 border-t-emerald-600 animate-spin" />
          <Leaf className="w-5 h-5 text-emerald-600 absolute animate-pulse" />
        </div>
        <p className="mt-4 text-xs font-semibold text-emerald-800 tracking-wide uppercase">
          Verifying session...
        </p>
      </div>
    );
  }

  // Don't render form if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#F8FAF9] text-gray-800 selection:bg-emerald-200 selection:text-emerald-900 font-sans">
      {/* ================= LEFT SIDE: MINIMALISTIC BRAND SHOWCASE ================= */}
      <div className="relative hidden lg:flex lg:w-1/2 xl:w-5/12 bg-gradient-to-br from-[#064e3b] via-[#065f46] to-[#022c22] p-10 xl:p-14 text-white flex-col justify-between overflow-hidden">
        {/* Soft Ambient Organic Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-300/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top: Minimal Brand Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-md p-1.5 transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="PureBD Mart"
                width={36}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white block leading-none">
                PureBD<span className="text-emerald-400">Mart</span>
              </span>
              <span className="text-[10px] font-medium text-emerald-200/80 tracking-widest uppercase mt-0.5 block">
                Organic & Fresh
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-200/90 hover:text-white transition-all bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm border border-white/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
        </div>

        {/* Center: Minimalist Hero Visual & Value Pitch */}
        <div className="relative z-10 my-auto py-6 flex flex-col items-center text-center">
          {/* Subtle Gift Pill */}
          <div className="inline-flex items-center gap-1.5 bg-amber-400/20 border border-amber-300/30 text-amber-200 px-3 py-1 rounded-full text-xs font-medium mb-5">
            <Gift className="w-3.5 h-3.5 text-amber-300" />
            <span>Instant ৳100 Welcome Voucher on Sign Up</span>
          </div>

          {/* Clean Editorial Title */}
          <h1 className="text-2xl xl:text-3xl font-extrabold text-white leading-snug tracking-tight max-w-sm">
            Eat healthier, feel better every day.
          </h1>

          <p className="text-emerald-100/80 text-xs xl:text-sm mt-3 max-w-sm leading-relaxed font-light">
            Join thousands of families in Dhaka who enjoy fresh, chemical-free groceries at honest farm prices.
          </p>

          {/* Clean Floating Organic Visual */}
          <div className="relative my-6 w-full max-w-[240px] aspect-[4/3] flex items-center justify-center">
            <div className="absolute inset-0 bg-emerald-400/10 rounded-full blur-2xl" />
            <Image
              src="/vegetables.png"
              alt="Fresh Organic Produce"
              fill
              className="object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>

          {/* Minimalist Micro-Features (Clean 3-row chips) */}
          <div className="w-full max-w-xs space-y-2">
            <div className="flex items-center gap-2.5 text-left bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs text-white font-medium">৳100 discount coupon on your first order</span>
            </div>

            <div className="flex items-center gap-2.5 text-left bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs text-white font-medium">Free express delivery on first 3 orders</span>
            </div>

            <div className="flex items-center gap-2.5 text-left bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs text-white font-medium">100% purity & freshness replacement guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom: Minimalist Trust Pill */}
        <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-emerald-200/80">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-300">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-amber-300" />
              ))}
            </div>
            <span className="text-[11px] font-medium text-emerald-100">4.9/5 from 52,000+ homes</span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-300/80 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted & Safe</span>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: CLEAN & USER-FRIENDLY REGISTER FORM ================= */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16 max-w-xl mx-auto lg:max-w-none w-full">
        {/* Mobile & Tablet Friendly Header */}
        <div className="lg:hidden pb-5 mb-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm p-1 border border-gray-100">
                <Image
                  src="/logo.png"
                  alt="PureBD Mart"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span className="text-base font-black tracking-tight text-gray-900">
                PureBD<span className="text-emerald-600">Mart</span>
              </span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 hover:text-emerald-700 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-xs"
            >
              <ArrowLeft className="w-3 h-3" />
              Store
            </Link>
          </div>

          {/* Minimalist Mobile Brand Highlights Bar */}
          <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-100 rounded-xl px-3 py-1.5 text-[11px] text-emerald-800 font-medium">
            <span className="flex items-center gap-1">
              <Gift className="w-3 h-3 text-amber-600" /> ৳100 Bonus
            </span>
            <span className="text-emerald-300">•</span>
            <span>🌱 100% Organic</span>
            <span className="text-emerald-300">•</span>
            <span>⭐ 4.9 Rating</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto max-w-md w-full mx-auto">
          {/* Welcome Title */}
          <div className="mb-6 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full mb-2.5">
              <Leaf className="w-3 h-3 text-emerald-600" /> Free Membership
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Create an account
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Get started with PureBD Mart and receive your ৳100 welcome voucher.
            </p>
          </div>

          {/* Quick Social Sign Up */}
          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={isPending}
            className="w-full h-11 flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl border border-gray-200 shadow-xs transition-all duration-150 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <FcGoogle className="w-4 h-4" />
            <span>Sign up with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F8FAF9] px-3 text-gray-400 font-normal">
                or register with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Full Name Field */}
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      {...field}
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Tanvir Hossain"
                      disabled={isPending}
                      className={`w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 ${
                        fieldState.invalid
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/15"
                      } disabled:bg-gray-50`}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Email Field */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      {...field}
                      type="email"
                      autoComplete="email"
                      placeholder="e.g. tanvir@mail.com"
                      disabled={isPending}
                      className={`w-full pl-9 pr-4 py-2.5 bg-white rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 ${
                        fieldState.invalid
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/15"
                      } disabled:bg-gray-50`}
                    />
                  </div>
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Password Field */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700">
                      Create Password
                    </label>
                    {passwordStrength.score > 0 && (
                      <span className={`text-[11px] font-semibold ${passwordStrength.textColor}`}>
                        {passwordStrength.text}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      disabled={isPending}
                      className={`w-full pl-9 pr-10 py-2.5 bg-white rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 ${
                        fieldState.invalid
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/15"
                      } disabled:bg-gray-50`}
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Password Strength Meter */}
                  {passwordValue.length > 0 && (
                    <div className="mt-1.5">
                      <div className="grid grid-cols-4 gap-1 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-full rounded-full transition-all duration-200 ${
                              passwordStrength.score >= step
                                ? passwordStrength.color
                                : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Terms and Privacy Checkbox */}
            <Controller
              name="agreeTerms"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="pt-0.5">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500 cursor-pointer"
                    />
                    <span className="text-xs text-gray-600 leading-tight">
                      I agree to the{" "}
                      <Link href="/about" className="text-emerald-700 font-semibold hover:underline">
                        Terms
                      </Link>{" "}
                      and{" "}
                      <Link href="/about" className="text-emerald-700 font-semibold hover:underline">
                        Privacy Policy
                      </Link>
                      .
                    </span>
                  </label>
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer mt-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Get ৳100</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-5 text-center bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
            <p className="text-xs text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Guarantee Strip */}
        <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Purity Guarantee</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} PureBD Mart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
