"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqData = [
  {
    id: "item-1",
    question: "What makes PureBD Mart different from other online grocery stores?",
    answer:
      "PureBD Mart stands out by focusing exclusively on 100% authentic and premium quality products. We work directly with farmers, importers, and trusted manufacturers to ensure purity, freshness, and great taste. Every product undergoes strict quality checks, and we specialize in natural, organic, and premium grocery items including fresh dates, pure honey, natural oils, nuts, dry fruits, and high-quality spices.",
  },
  {
    id: "item-2",
    question: "How do you ensure product quality and authenticity?",
    answer:
      "Quality is our top priority. We maintain direct relationships with reliable suppliers, farmers, and trusted manufacturers. Every product goes through rigorous quality checks before reaching our customers. We verify authenticity, check for freshness, and ensure that all items meet our high standards for purity and quality. Our commitment is to deliver nothing but the best to your doorstep.",
  },
  {
    id: "item-3",
    question: "What areas do you deliver to in Bangladesh?",
    answer:
      "We are committed to making healthy, natural, and essential grocery products accessible to every household across Bangladesh. We offer fast delivery services throughout the country. Delivery charges may vary based on your location - free delivery is available in Dhaka, while outside Dhaka areas may have a small shipping charge. Check our delivery policy for specific details about your area.",
  },
  {
    id: "item-4",
    question: "What payment methods do you accept?",
    answer:
      "Currently, we accept Cash on Delivery (COD) as our primary payment method. This allows you to pay securely when your order is delivered to your doorstep. We are working on adding more payment options in the future to make your shopping experience even more convenient.",
  },
  {
    id: "item-5",
    question: "Can I return or exchange products if I'm not satisfied?",
    answer:
      "Yes! Customer satisfaction is our top priority. We offer easy returns and exchanges for products that don't meet your expectations. If you receive a damaged, expired, or incorrect product, please contact our customer support team within 24-48 hours of delivery. We'll arrange a return or exchange at no extra cost to you.",
  },
  {
    id: "item-6",
    question: "How can I track my order?",
    answer:
      "Once your order is placed, you'll receive an order confirmation email with your Order ID. You can use this Order ID to track your order status. After successful order placement, you'll be redirected to an order success page where you can copy your Order ID. Our customer support team is also available to help you track your order at any time.",
  },
  {
    id: "item-7",
    question: "Do you offer bulk or wholesale pricing?",
    answer:
      "Yes, we offer competitive pricing for bulk orders. Whether you're purchasing for your family, restaurant, or business, we provide affordable pricing on all our products. For large quantity orders or wholesale inquiries, please contact our customer support team, and we'll be happy to provide you with special pricing and delivery arrangements.",
  },
  {
    id: "item-8",
    question: "Are your products suitable for special dietary needs?",
    answer:
      "Absolutely! We offer a wide range of products suitable for various dietary needs. Our selection includes natural, organic, and chemical-free options. We have products that are suitable for vegetarian, vegan, and halal dietary requirements. Each product listing includes detailed information about ingredients and dietary specifications to help you make informed choices.",
  },
];

export default function Performance() {
  // Split FAQs into two columns (4 FAQs each, can be extended to 5)
  const leftColumn = faqData.slice(0, Math.ceil(faqData.length / 2));
  const rightColumn = faqData.slice(Math.ceil(faqData.length / 2));

  return (
    <div className="container mx-auto max-w-7xl px-5 py-14">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to know about PureBD Mart
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Left Column */}
          <div>
            <Accordion type="single" collapsible className="w-full">
              {leftColumn.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-[#3BB77E] py-4 px-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Right Column */}
          <div>
            <Accordion type="single" collapsible className="w-full">
              {rightColumn.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className="border-b border-gray-200"
                >
                  <AccordionTrigger className="text-left font-semibold text-gray-800 hover:text-[#3BB77E] py-4 px-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 text-gray-600 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
