"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";

export default function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);

  const { handleSubmit, control, reset, formState } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    setStatus(null);
    // Simulate API call
    await new Promise((res) => setTimeout(res, 900));
    setStatus("Message sent! We’ll get back shortly.");
    setSubmitting(false);
    reset();
  };

  return (
    <div className="w-full p-8 md:p-10 rounded-2xl border border-gray-100 bg-white shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#3BB77E] font-semibold uppercase tracking-wide">
              Contact form
            </p>
            <h2 className="text-2xl font-semibold text-gray-800">Send us a message</h2>
          </div>
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Your Name</Label>
            <Controller
              name="name"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Type your name"
                  className="bg-white"
                  required
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Your Email</Label>
            <Controller
              name="email"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  type="email"
                  placeholder="example@gmail.com"
                  className="bg-white"
                  required
                />
              )}
            />
          </div>
        </div>

        {/* Phone & Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="phone"
                  placeholder="+8801XXXXXXXXX"
                  className="bg-white"
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Controller
              name="subject"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <Input
                  {...field}
                  id="subject"
                  placeholder="Type your subject..."
                  className="bg-white"
                  required
                />
              )}
            />
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message">Message</Label>
          <Controller
            name="message"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <Textarea
                {...field}
                id="message"
                placeholder="Type your message here."
                className="bg-white min-h-[140px]"
                required
              />
            )}
          />
        </div>

        {/* Status */}
        <AnimateStatus status={status} />

        {/* Submit Button */}
        <div className="flex flex-wrap gap-3">
          <Button
            type="submit"
            className="bg-[#3BB77E] hover:bg-[#29A56C] duration-300 text-white cursor-pointer px-8 py-5 font-semibold disabled:opacity-60"
            disabled={submitting || !formState.isValid}
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function AnimateStatus({ status }) {
  if (!status) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="text-sm font-medium text-[#3BB77E]"
    >
      {status}
    </motion.div>
  );
}
