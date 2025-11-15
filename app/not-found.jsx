"use client";

import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4 text-center">
      <img
        src="https://www.radiustheme.com/demo/wordpress/themes/zilly/wp-content/themes/zilly/assets/img/404.png"
        alt="404 Not Found"
        className="max-w-sm w-full"
      />
      <h2 className="text-2xl md:text-3xl font-bold mt-5">
        Oops... Page Not Found!
      </h2>
      <p className="text-[#82848E] text-md md:text-xl mt-2">
        Sorry! This Page Is Not Available!
      </p>
      <Link href="/">
        <Button className="bg-[#3BB77E] hover:bg-[#29A56C] duration-300 text-white mt-3 md:mt-5 py-5 cursor-pointer">
          Go Back To Home Page
        </Button>
      </Link>
    </div>
  );
}
