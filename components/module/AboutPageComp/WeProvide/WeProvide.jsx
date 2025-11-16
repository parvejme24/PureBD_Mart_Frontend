import React from "react";

const data = [
  {
    id: 1,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-1.png",
    title: "Best Prices & Offers",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
  },
  {
    id: 2,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-2.png",
    title: "Wide Assortment",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
  },
  {
    id: 3,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-3.png",
    title: "Free Delivery",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
  },
  {
    id: 4,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-4.png",
    title: "Easy Returns",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
  },
  {
    id: 5,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-5.png",
    title: "100% Satisfaction",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
  },
  {
    id: 6,
    image:
      "https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/02/icon-6.png",
    title: "Great Daily Deal",
    description:
      "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form",
  },
];

export default function WeProvide() {
  return (
    <div className="container mx-auto max-w-7xl px-5 py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((item) => (
          <div key={item.id} className="border px-5 py-10 rounded-lg space-y-2 bg-green-50/40">
            <img src={item.image} alt="" className="w-[100px] mx-auto" />
            <h3 className="text-center text-2xl font-semibold">{item.title}</h3>
            <p className="text-center">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
