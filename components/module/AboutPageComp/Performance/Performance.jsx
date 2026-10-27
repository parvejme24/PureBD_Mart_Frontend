"use client";

import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, Phone, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const faqData = [
  {
    id: "item-1",
    question: "What makes PureBD Mart different from typical grocery stores?",
    answer:
      "PureBD Mart focuses strictly on 100% authentic, unadulterated, and premium-quality groceries. We partner directly with certified organic growers, traditional oil mills, and beekeepers across Bangladesh to deliver food that is completely free of formalin, synthetic ripeners, and chemical adulterants.",
  },
  {
    id: "item-2",
    question: "How do you ensure zero formalin and chemical purity?",
    answer:
      "Every harvest and batch goes through strict incoming quality screening. We test perishables for chemical residues and inspect cold-pressed oils, raw honey, and spices for natural aroma, purity, and unadulterated composition.",
  },
  {
    id: "item-3",
    question: "How fast is delivery and what are the shipping fees?",
    answer:
      "Within Dhaka city, we provide 30-minute to same-day express delivery! Delivery is 100% FREE on all orders over ৳500. For orders outside Dhaka, we dispatch via express temperature-safe couriers at minimal flat shipping rates.",
  },
  {
    id: "item-4",
    question: "What payment methods do you support?",
    answer:
      "We accept Cash on Delivery (COD), bKash, Nagad, Rocket, Visa, and Mastercard with 256-bit bank-grade encryption and instant payment verification.",
  },
  {
    id: "item-5",
    question: "What if I am unhappy with the freshness of my produce?",
    answer:
      "We have a 100% hassle-free replacement guarantee. If any produce fails to meet your freshness expectations upon delivery, simply let us know via WhatsApp or phone within 24 hours, and we will replace or refund it immediately with zero questions asked.",
  },
  {
    id: "item-6",
    question: "Do you offer wholesale and bulk family packs?",
    answer:
      "Yes! We offer bulk grocery packs and wholesale supplies for families, restaurants, and catering services. Contact our support team for bulk discount rates.",
  },
];

export default function Performance() {
  const leftColumn = faqData.slice(0, 3);
  const rightColumn = faqData.slice(3, 6);

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-emerald-50/20 to-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Got Questions?</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-950 tracking-tight mb-2.5">
            Frequently Asked Questions
          </h2>

          <p className="text-xs sm:text-base text-gray-600">
            Everything you need to know about our organic food sourcing, delivery, and guarantees.
          </p>
        </div>

        {/* 2-Column Accordion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-10">
          <div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {leftColumn.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-emerald-100 rounded-2xl bg-white px-4 shadow-xs data-[state=open]:border-emerald-400 transition-colors"
                >
                  <AccordionTrigger className="text-left font-bold text-xs sm:text-sm text-gray-900 hover:text-emerald-600 py-4 hover:no-underline cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {rightColumn.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border border-emerald-100 rounded-2xl bg-white px-4 shadow-xs data-[state=open]:border-emerald-400 transition-colors"
                >
                  <AccordionTrigger className="text-left font-bold text-xs sm:text-sm text-gray-900 hover:text-emerald-600 py-4 hover:no-underline cursor-pointer">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm text-gray-600 leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <div className="p-6 sm:p-8 rounded-3xl bg-emerald-950 text-white flex flex-col sm:flex-row items-center justify-between gap-5 border border-emerald-800">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-base sm:text-lg text-white">
              Still have questions or special requirements?
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200">
              Our customer care specialists in Dhaka are available 9 AM – 10 PM daily.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a href="tel:+8801700000000">
              <Button className="bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>Call Hotline</span>
              </Button>
            </a>
            <Link href="/contact">
              <Button variant="outline" className="border-emerald-700 text-white hover:bg-white/10 rounded-xl text-xs sm:text-sm">
                <span>Message Us</span>
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
