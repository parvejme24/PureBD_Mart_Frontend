"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { FaMinus, FaPlus, FaFilter } from "react-icons/fa";

const categories = ["Fruits", "Dates", "Fish", "Almond", "Oil"];
const discountOptions = ["10% Off", "20% Off", "30% Off", "40% Off", "50% Off"];

export default function ShopSidebar() {
  const [catOpen, setCatOpen] = useState(true);
  const [discOpen, setDiscOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(true);
  const [price, setPrice] = useState(500);
  const [showSidebar, setShowSidebar] = useState(false);

  // Section header with toggle
  const SectionHeader = ({ title, isOpen, toggle }) => (
    <div className="flex justify-between items-center mt-3">
      <h2 className="font-semibold text-lg text-gray-800">{title}</h2>
      <Button
        variant="outline"
        size="icon"
        className="border-none hover:bg-transparent cursor-pointer"
        onClick={toggle}
      >
        {isOpen ? <FaMinus /> : <FaPlus />}
      </Button>
    </div>
  );

  // Collapsible list for checkboxes
  const CollapsibleList = ({ isOpen, items }) => (
    <div
      className={`transition-all duration-300 overflow-hidden pb-3 ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <ul className="space-y-3 mt-3">
        {items.map((item, index) => {
          const id = `item-${index}`;
          return (
            <li key={id}>
              <label className="flex items-center gap-2 cursor-pointer text-gray-700 hover:text-green-600">
                <Checkbox id={id} />
                {item}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <>
      {/* ---------------- Filter Icon for Small Devices ---------------- */}
      <div className="sm:hidden fixed bottom-5 right-5 z-50">
        <Button
          className="bg-green-600 text-white rounded-full p-4 shadow-lg"
          onClick={() => setShowSidebar(true)}
        >
          <FaFilter className="w-5 h-5" />
        </Button>
      </div>

      {/* ---------------- Overlay for Mobile ---------------- */}
      <div
        className={`fixed inset-0 bg-black/40 sm:hidden transition-opacity duration-300 ${
          showSidebar ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setShowSidebar(false)}
      ></div>

      {/* ---------------- Sidebar ---------------- */}
      <div
        className={`fixed top-0 right-0 bg-green-50/95 p-5 shadow-lg transform transition-transform duration-300
          ${
            showSidebar
              ? "translate-x-0 z-50 h-full"
              : "translate-x-full h-full"
          }
          sm:static sm:translate-x-0 sm:w-[350px] sm:max-w-none sm:shadow-none sm:h-full
          lg:h-fit md:bg-green-50/40 md:border md:rounded-lg md:border-gray-200`}
      >
        {/* Close button on mobile */}
        <div className="flex justify-end sm:hidden mb-3">
          <Button
            variant="ghost"
            className="text-gray-700 hover:text-green-600"
            onClick={() => setShowSidebar(false)}
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* ---------------- Search Option ---------------- */}
        <div className="relative w-full mb-3">
          <Input
            type="text"
            placeholder="Search Product"
            className="w-full rounded-md pl-3 pr-12 focus-visible:ring-green-500 bg-white"
          />
          <Button
            variant="default"
            className="absolute top-1/2 right-1 transform -translate-y-1/2 bg-[#3BB77E] hover:bg-[#32a56f] text-white rounded-full p-2 cursor-pointer"
          >
            <Search className="h-5 w-5" />
          </Button>
        </div>

        {/* ---------------- Product Categories ---------------- */}
        <div>
          <SectionHeader
            title="Product Categories"
            isOpen={catOpen}
            toggle={() => setCatOpen(!catOpen)}
          />
          <CollapsibleList isOpen={catOpen} items={categories} />
        </div>

        <hr className="mt-3 border-green-200" />

        {/* ---------------- Discount Filter ---------------- */}
        <div>
          <SectionHeader
            title="Discount Filter"
            isOpen={discOpen}
            toggle={() => setDiscOpen(!discOpen)}
          />
          <CollapsibleList isOpen={discOpen} items={discountOptions} />
        </div>

        <hr className="mt-3 border-green-200" />

        {/* ---------------- Price Filter ---------------- */}
        <div>
          <SectionHeader
            title="Filter By Price"
            isOpen={priceOpen}
            toggle={() => setPriceOpen(!priceOpen)}
          />

          <div
            className={`transition-all duration-300 overflow-hidden ${
              priceOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="my-3">
              <Slider
                defaultValue={[price]}
                max={2000}
                step={10}
                className="w-full"
                onValueChange={(value) => setPrice(value[0])}
              />
            </div>

            <div className="flex justify-between items-center text-sm mb-3">
              <p className="uppercase font-medium text-gray-700">Price</p>
              <p className="font-semibold text-green-700">৳ {price}</p>
            </div>

            <Button
              variant="outline"
              className="w-full border rounded uppercase cursor-pointer"
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
