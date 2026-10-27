"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, User, Mail, Phone, MessageSquare, Tag, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState("Order Inquiry");

  const topics = ["Order Inquiry", "Product Quality", "Wholesale / Bulk", "Feedback"];

  const { handleSubmit, control, reset, setValue } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "Order Inquiry",
      message: "",
    },
  });

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    setValue("subject", topic);
  };

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        Swal.fire({
          icon: "success",
          title: "Message Received!",
          text: "Thank you for reaching out. Our support desk will contact you within 12-24 hours.",
          confirmButtonColor: "#16a34a",
          timer: 3500,
          timerProgressBar: true,
        });
        reset();
      } else {
        const errorMsg = result.message || "Failed to send message. Please try again.";
        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMsg,
          confirmButtonColor: "#dc2626",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Error",
        text: "Could not send your message. Please call our hotline or try again shortly.",
        confirmButtonColor: "#dc2626",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full p-6 sm:p-8 md:p-10 rounded-3xl border border-emerald-100 bg-white shadow-xl shadow-emerald-950/5">
      <div className="mb-6">
        <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
          Direct Message
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
          Send Us a Note
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Fill out this form and our support desk will respond via email or phone.
        </p>
      </div>

      {/* Quick Topic Pills */}
      <div className="mb-6">
        <label className="text-xs font-bold text-gray-700 block mb-2">
          What is this regarding?
        </label>
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => handleTopicClick(t)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedTopic === t
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-bold text-gray-700">
              Full Name *
            </Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Controller
                name="name"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="e.g. Tanvir Ahmed"
                    className="pl-10 h-11 bg-gray-50/70 border-gray-200 text-xs sm:text-sm rounded-xl focus:bg-white"
                    required
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-bold text-gray-700">
              Email Address *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Controller
                name="email"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="tanvir@example.com"
                    className="pl-10 h-11 bg-gray-50/70 border-gray-200 text-xs sm:text-sm rounded-xl focus:bg-white"
                    required
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Phone & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-bold text-gray-700">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="phone"
                    placeholder="+880 17XXXXXXXX"
                    className="pl-10 h-11 bg-gray-50/70 border-gray-200 text-xs sm:text-sm rounded-xl focus:bg-white"
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="subject" className="text-xs font-bold text-gray-700">
              Subject *
            </Label>
            <div className="relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Controller
                name="subject"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="subject"
                    placeholder="Subject..."
                    className="pl-10 h-11 bg-gray-50/70 border-gray-200 text-xs sm:text-sm rounded-xl focus:bg-white"
                    required
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message" className="text-xs font-bold text-gray-700">
            How can we help you? *
          </Label>
          <Controller
            name="message"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Textarea
                {...field}
                id="message"
                placeholder="Write your question, feedback, or delivery request..."
                className="bg-gray-50/70 border-gray-200 min-h-[120px] text-xs sm:text-sm rounded-xl focus:bg-white p-3"
                required
              />
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto h-11 px-8 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <Send className="w-4 h-4" />
          <span>{submitting ? "Sending Message..." : "Send Message"}</span>
        </Button>
      </form>
    </div>
  );
}
