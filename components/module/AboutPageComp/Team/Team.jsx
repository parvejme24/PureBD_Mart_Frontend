import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";
import Image from "next/image";

const teams = [
  {
    id: 1,
    title: "H. Marinda",
    designation: "CEO & Co-Founder",
    image: "/member2.png",
  },
  {
    id: 2,
    title: "Dilan Specter",
    designation: "Head Engineer",
    image: "/member1.png",
  },
];

export default function Team() {
  return (
    <div className="bg-gray-50/50 py-14">
      <div className="container mx-auto max-w-7xl px-5">
        <div className="text-center mb-10">
          <span className="text-sm text-[#3BB77E] font-semibold uppercase tracking-wide">
            Our Team
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-3">
            Meet Our Expert Team
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our dedicated team of professionals is committed to bringing you the
            finest quality products and exceptional service. We work tirelessly
            to ensure your shopping experience with PureBD Mart is nothing short
            of excellent.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teams.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative w-full aspect-square overflow-hidden">
                <Image
                  src={item.image}
                  alt={`${item.title} - ${item.designation}`}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  unoptimized
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="text-[#3BB77E] font-medium mt-1 mb-4">
                  {item.designation}
                </p>
                <div className="flex justify-center items-center gap-4">
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#3BB77E] transition-colors"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#3BB77E] transition-colors"
                    aria-label="Twitter"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#3BB77E] transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#3BB77E] transition-colors"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#3BB77E] transition-colors"
                    aria-label="YouTube"
                  >
                    <Youtube className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
