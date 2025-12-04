"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export default function LoginForm() {
  const [showPassword, setShowPassword] = React.useState(false);
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
      className="flex justify-center items-center min-h-screen w-full"
    >
      <Card className="w-full sm:max-w-md mx-5 md:mx-auto px-3 md:px-5 py-10 bg-white/80 backdrop-blur-sm shadow-xl border-0">
        <CardHeader>
          <CardTitle className="text-2xl text-center font-bold text-gray-800">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center pb-5 text-gray-600">
            Please log in to continue shopping
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Email */}
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Email</FieldLabel>
                    <Input
                      {...field}
                      placeholder="yourname@example.com"
                      autoComplete="email"
                      className="bg-white"
                      disabled={isSubmitting}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Password */}
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="relative">
                    <FieldLabel>Password</FieldLabel>

                    {/* Input with toggle */}
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="pr-10 bg-white"
                        disabled={isSubmitting}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition-colors"
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter>
          <div className="flex flex-col w-full gap-3">
            <Button
              type="submit"
              form="login-form"
              className="cursor-pointer font-bold bg-[#3BB77E] hover:bg-[#29A56C] text-white h-11 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
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

            {/* Google Login */}
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 w-full cursor-pointer h-11 font-medium hover:bg-gray-50"
              onClick={loginWithGoogle}
              disabled={isSubmitting}
            >
              <FcGoogle size={22} />
              Continue with Google
            </Button>

            <p className="text-center mt-2">
              <small className="text-gray-600">
                New to PureBD Mart?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-[#3BB77E] hover:text-[#29A56C] hover:underline transition-colors"
                >
                  Create an account
                </Link>
              </small>
            </p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
