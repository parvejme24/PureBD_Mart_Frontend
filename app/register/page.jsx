"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth, useRegister } from "@/hooks/useAuth";

// ----------------- VALIDATION SCHEMA -----------------
const registerSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
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
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = (data) => {
    register(data);
  };

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-white">
        <Loader2 className="h-10 w-10 animate-spin text-[#3BB77E]" />
      </div>
    );
  }

  // Don't render form if authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div
      style={{
        backgroundImage:
          'url("https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/banner-10-min.png")',
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
      className="flex justify-center items-center min-h-screen w-full py-8"
    >
      <Card className="w-full sm:max-w-md mx-5 md:mx-auto px-3 md:px-5 py-10 bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-gray-800">
            Create Account
          </CardTitle>
          <CardDescription className="text-center pb-4 text-gray-600">
            Join PureBD Mart and start shopping today
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="register-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* ---------- FULL NAME ---------- */}
            <Controller
              name="fullName"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-gray-700">Full Name</label>
                  <Input
                    {...field}
                    placeholder="John Doe"
                    autoComplete="name"
                    className="bg-white h-11"
                    disabled={isPending}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* ---------- EMAIL ---------- */}
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5">
                  <label className="font-medium text-gray-700">Email</label>
                  <Input
                    {...field}
                    placeholder="john@example.com"
                    autoComplete="email"
                    className="bg-white h-11"
                    disabled={isPending}
                  />
                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* ---------- PASSWORD WITH TOGGLE ---------- */}
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1.5 relative">
                  <label className="font-medium text-gray-700">Password</label>

                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="bg-white pr-10 h-11"
                      disabled={isPending}
                    />

                    {/* TOGGLE BUTTON */}
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                      onClick={togglePassword}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  {fieldState.error && (
                    <p className="text-red-500 text-sm">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              )}
            />
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex flex-col w-full gap-3">
            {/* --- REGISTER BUTTON --- */}
            <Button
              type="submit"
              form="register-form"
              className="cursor-pointer font-bold bg-[#3BB77E] hover:bg-[#29A56C] text-white h-11 text-base"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* --- GOOGLE REGISTER BUTTON --- */}
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 w-full cursor-pointer h-11 font-medium hover:bg-gray-50"
              onClick={loginWithGoogle}
              disabled={isPending}
            >
              <FcGoogle size={22} />
              Continue with Google
            </Button>

            {/* --- LOGIN LINK --- */}
            <p className="text-center text-sm mt-2 text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#3BB77E] hover:text-[#29A56C] hover:underline transition-colors"
              >
                Login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
