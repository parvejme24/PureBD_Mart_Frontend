"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React from "react";
import { useForm, Controller } from "react-hook-form";

export default function ContactForm() {
  const { handleSubmit, control, reset } = useForm({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    alert("Message submitted successfully!");
    reset();
  };

  return (
    <div className="w-full p-10 rounded-lg border bg-[#3BB77E]/4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <h2 className="text-2xl font-semibold pb-3">Send Message</h2>
        {/* Name & Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Your Name</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="name"
                  placeholder="Type Your Name"
                  className={"bg-white"}
                />
              )}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Your Email</Label>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  id="email"
                  placeholder="example@gmail.com"
                  className={"bg-white"}
                />
              )}
            />
          </div>
        </div>

        {/* Subject */}
        <div className="space-y-1.5">
          <Label htmlFor="subject">Subject</Label>
          <Controller
            name="subject"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                id="subject"
                placeholder="Type your subject..."
                className={"bg-white"}
              />
            )}
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <Label htmlFor="message">Message</Label>
          <Controller
            name="message"
            control={control}
            render={({ field }) => (
              <Textarea
                {...field}
                id="message"
                placeholder="Type your message here."
                className={"bg-white"}
                row={10}
              />
            )}
          />
        </div>

        {/* Submit Button */}
        <div className="">
          <Button
            type="submit"
            className="bg-[#3BB77E] hover:bg-[#29A56C] duration-300 text-white cursor-pointer w-full md:w-auto px-10 py-5 font-bold"
          >
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
}
