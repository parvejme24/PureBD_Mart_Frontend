import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@radix-ui/react-label";
import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { LuPhoneCall } from "react-icons/lu";
import ContactForm from "../ContactForm/ContactForm";

export default function ContactInfo() {
  return (
    <div className="space-y-2 py-10">
      <h2 className="text-center text-2xl font-semibold">Get In Touch</h2>
      <p className="text-center">
        Feel free to reach out to us through any of the following methods:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
        <div className="border p-5 rounded-md flex flex-col justify-center items-center space-y-2 text-center py-10">
          <FaMapMarkedAlt className="text-[#3BB77E] text-4xl" />
          <h3 className="text-lg font-semibold text-[#3BB77E]">Our Location</h3>
          <p className="text-gray-500">123 Main Street, Anytown, USA</p>
        </div>
        <div className="border p-5 rounded-md flex flex-col justify-center items-center space-y-2 text-center py-10">
          <LuPhoneCall className="text-[#3BB77E] text-4xl" />
          <h3 className="text-lg font-semibold text-[#3BB77E]">Call Us</h3>
          <p className="text-gray-500">+1 (555) 123-4567</p>
        </div>

        <div className="border p-5 rounded-md flex flex-col justify-center items-center space-y-2 text-center py-10">
          <FaRegEnvelope className="text-[#3BB77E] text-4xl" />
          <h3 className="text-lg font-semibold text-[#3BB77E]">Email Us</h3>
          <p className="text-gray-500">purebdmart@gmail.com</p>
        </div>
      </div>
    </div>
  );
}
