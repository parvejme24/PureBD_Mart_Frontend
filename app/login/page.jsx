"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FcGoogle } from "react-icons/fc";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Lock,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Star,
  Leaf,
  Check,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { login, loginWithGoogle, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, isLoading, router]);

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data) {
    setIsSubmitting(true);
    try {
      await login(data);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Show loading state while checking auth
  if (isLoading) {
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
          {/* Subtle Pill */}
          <div className="inline-flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 px-3 py-1 rounded-full text-xs font-medium mb-5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Certified Organic Food</span>
          </div>

          {/* Clean Editorial Title */}
          <h1 className="text-2xl xl:text-3xl font-extrabold text-white leading-snug tracking-tight max-w-sm">
            Good food starts with honest farming.
          </h1>

          <p className="text-emerald-100/80 text-xs xl:text-sm mt-3 max-w-sm leading-relaxed font-light">
            Naturally harvested vegetables, cold-pressed oils, and farm-fresh dairy delivered directly to Dhaka homes.
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
              <span className="text-xs text-white font-medium">100% Formalin & chemical-free batches</span>
            </div>

            <div className="flex items-center gap-2.5 text-left bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs text-white font-medium">30–60 min express delivery in Dhaka</span>
            </div>

            <div className="flex items-center gap-2.5 text-left bg-white/5 border border-white/10 backdrop-blur-sm rounded-xl px-3.5 py-2">
              <div className="w-5 h-5 rounded-full bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs text-white font-medium">Fair farmer pricing with zero middlemen</span>
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

      {/* ================= RIGHT SIDE: CLEAN & USER-FRIENDLY FORM ================= */}
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
              <Leaf className="w-3 h-3 text-emerald-600" /> 100% Organic
            </span>
            <span className="text-emerald-300">•</span>
            <span>⚡ 30m Express</span>
            <span className="text-emerald-300">•</span>
            <span>⭐ 4.9 Rating</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="my-auto max-w-md w-full mx-auto">
          {/* Welcome Title */}
          <div className="mb-7 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full mb-2.5">
              <Leaf className="w-3 h-3 text-emerald-600" /> Member Access
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
              Sign in to manage your orders and personalized grocery basket.
            </p>
          </div>

          {/* Quick Social Sign In */}
          <button
            type="button"
            onClick={loginWithGoogle}
            disabled={isSubmitting}
            className="w-full h-11 flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 font-medium text-sm rounded-xl border border-gray-200 shadow-xs transition-all duration-150 hover:border-gray-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <FcGoogle className="w-4 h-4" />
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-[#F8FAF9] px-3 text-gray-400 font-normal">
                or sign in with email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      placeholder="yourname@mail.com"
                      disabled={isSubmitting}
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
                      Password
                    </label>
                    <span className="text-xs text-emerald-700 hover:text-emerald-800 font-medium cursor-pointer">
                      Forgot?
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                      className={`w-full pl-9 pr-10 py-2.5 bg-white rounded-xl border text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:outline-none focus:ring-2 ${
                        fieldState.invalid
                          ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                          : "border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/15"
                      } disabled:bg-gray-50`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
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
                  {fieldState.error && (
                    <p className="mt-1 text-xs text-red-600 font-medium">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 border-gray-300 focus:ring-emerald-500"
                />
                <span className="text-xs text-gray-600">Remember my session</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#16a34a] hover:bg-[#15803d] text-white font-semibold text-sm rounded-xl shadow-xs transition-all duration-150 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 text-center bg-white p-3.5 rounded-xl border border-gray-200/80 shadow-xs">
            <p className="text-xs text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline transition-colors"
              >
                Sign up free
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Guarantee Strip */}
        <div className="pt-6 border-t border-gray-200/80 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure SSL Encryption</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} PureBD Mart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
