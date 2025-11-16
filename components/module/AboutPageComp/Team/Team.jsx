import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import React from "react";

const teams = [
  {
    id: 1,
    title: "H. Marinda",
    designation: "CEO & Co-Founder",
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/05/about-6.png",
  },
  {
    id: 2,
    title: "Dilan Specter",
    designation: "Head Engineer",
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/05/about-6.png",
  },
];

export default function Team() {
  return (
    <div className="container mx-auto max-w-7xl px-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <h3 className="text-2xl font-bold">Our Team</h3>
          <h2 className="text-lg text-gray-500 font-semibold mt-1">
            Meet Our Expert Team
          </h2>
          <p className="mt-3">
            Proin ullamcorper pretium orci. Donec necscele risque leo. Nam massa
            dolor imperdiet neccon sequata congue idsem. Maecenas malesuada
            faucibus finibus.
          </p>
          <p className="mt-3">
            Proin ullamcorper pretium orci. Donec necscele risque leo. Nam massa
            dolor imperdiet neccon sequata congue idsem. Maecenas malesuada
            faucibus finibus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {teams.map((item) => (
            <div key={item.id}>
              <img src={item.image} alt="" className="rounded-lg" />
              <h3 className="text-center text-xl font-semibold mt-2">
                {item.title}
              </h3>
              <p className="text-center mt-2">{item.designation}</p>
              <ul className="flex justify-center items-center gap-5 mt-5">
                <li>
                  <Link href={"/"}>
                    <Facebook />
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <Twitter />
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <Instagram />
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <Linkedin />
                  </Link>
                </li>
                <li>
                  <Link href={"/"}>
                    <Youtube />
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
