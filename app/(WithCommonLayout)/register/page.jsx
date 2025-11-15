"use client";

import React, { useState } from "react";
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
import { toast } from "sonner";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";

// ----------------- VALIDATION SCHEMA -----------------
const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const onSubmit = (data) => {
    toast("Registration Successful!", {
      description: (
        <pre className="bg-black text-white p-4 rounded-md mt-2 text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      ),
      position: "bottom-right",
    });
  };

  const googleRegister = () => {
    toast.success("Google Register clicked!");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full bg-blue-50/20">
      <Card className="w-full sm:max-w-md mx-5 md:mx-auto px-3 md:px-5 py-10">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Register</CardTitle>
          <CardDescription className="text-center pb-4">
            Create an account to continue.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="register-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
          >
            {/* ---------- NAME ---------- */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Name</label>
                  <Input
                    {...field}
                    placeholder="Your Name"
                    autoComplete="name"
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
                <div className="flex flex-col gap-1">
                  <label className="font-medium">Email</label>
                  <Input
                    {...field}
                    placeholder="example@email.com"
                    autoComplete="email"
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
                <div className="flex flex-col gap-1 relative">
                  <label className="font-medium">Password</label>

                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      autoComplete="new-password"
                    />

                    {/* TOGGLE BUTTON */}
                    <button
                      type="button"
                      className="absolute right-3 top-2.5 text-gray-500 hover:text-black"
                      onClick={togglePassword}
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
              className="cursor-pointer bg-blue-500 hover:bg-blue-700"
            >
              Register
            </Button>

            {/* --- GOOGLE REGISTER BUTTON --- */}
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 w-full cursor-pointer"
              onClick={googleRegister}
            >
              <FcGoogle size={20} />
              Register with Google
            </Button>

            {/* --- LOGIN LINK --- */}
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline text-blue-600">
                Login
              </Link>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
