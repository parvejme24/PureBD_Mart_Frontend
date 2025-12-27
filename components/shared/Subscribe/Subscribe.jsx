"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Swal from "sweetalert2";

export default function Subscribe() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email
    if (!email.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Email Required",
        text: "Please enter your email address",
        confirmButtonColor: "#3BB77E",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address",
        confirmButtonColor: "#dc2626",
      });
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Subscribed Successfully!",
          text: result.message || "Thank you for subscribing to PureBD Mart!",
          confirmButtonColor: "#3BB77E",
          timer: 3000,
          timerProgressBar: true,
        });
        setEmail("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Subscription Failed",
          text: result.message || "Failed to subscribe. Please try again.",
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error subscribing:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to subscribe. Please try again later.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container px-5 md:mx-auto max-w-7xl my-10">
      <div
        className="rounded-xl"
        style={{
          backgroundImage:
            'url("https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/banner-10-min.png")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          padding: "80px 50px",
        }}
      >
        <div className="max-w-lg space-y-4 text-left">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-gray-800">
            Stay home & get your daily needs from our shop
          </h2>
          <p className="text-gray-600 text-sm md:text-base">
            Start your daily shopping with{" "}
            <span className="text-[#3BB77E] font-semibold">PureBD Mart</span>
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row mt-4 space-y-1">
            <Input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
              className="rounded-full px-5 py-5 bg-white/90 border-gray-300"
              required
            />
            <Button
              type="submit"
              disabled={submitting}
              className="md:-ml-[113px] cursor-pointer py-4 mt-[3px] rounded-full bg-[#3BB77E] hover:bg-[#29A56C] text-white px-6 disabled:opacity-60"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
