import React from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { FaRegEnvelope } from "react-icons/fa6";
import { LuPhoneCall } from "react-icons/lu";

export default function ContactInfo() {
  const items = [
    {
      icon: <FaMapMarkedAlt className="text-[#3BB77E] text-3xl" />,
      title: "Our Location",
      desc: "Dhaka, Bangladesh",
      detail: "House 12, Road 3, Dhanmondi",
    },
    {
      icon: <LuPhoneCall className="text-[#3BB77E] text-3xl" />,
      title: "Call Us",
      desc: "+880 1234-567890",
      detail: "Sat–Thu · 9am–8pm",
    },
    {
      icon: <FaRegEnvelope className="text-[#3BB77E] text-3xl" />,
      title: "Email Us",
      desc: "support@purebdmart.com",
      detail: "We reply within 24 hours",
    },
  ];

  return (
    <div className="space-y-6 py-6">
      <div className="text-center space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-[#3BB77E]">Contact</p>
        <h2 className="text-3xl font-semibold text-gray-800">Get in touch</h2>
        <p className="text-gray-500">Reach us any way you like. We’re quick to respond.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col gap-2"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#3BB77E]/10">
              {item.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
            <p className="text-[#3BB77E] font-medium">{item.desc}</p>
            <p className="text-gray-500 text-sm">{item.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
