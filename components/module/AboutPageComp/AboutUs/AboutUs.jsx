import React from "react";

export default function AboutUs() {
  return (
    <div>
      <div className="container mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-5 items-center pt-14">
        <div>
          <img
            src="https://themepanthers.com/wp/nest/d1/wp-content/uploads/2022/05/about-1.png"
            alt="about image"
            className="rounded-lg"
          />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-2xl font-bold mb-3">Welcome to PureBD Mart</h2>

          <p>
            PureBD Mart is your trusted online grocery destination in
            Bangladesh, offering 100% authentic and premium quality products.
            From fresh dates, pure honey, and natural oils to nuts, dry fruits,
            and daily cooking masalas — we ensure every item is sourced from
            reliable suppliers to maintain purity, freshness, and great taste.
          </p>

          <p className="mt-2">
            Our mission is simple: make healthy, natural, and essential grocery
            products accessible to every household across Bangladesh. Whether
            you are looking for chemical-free cooking oil, delicious Arabian
            dates, premium nuts for your family, or high-quality spices for
            perfect cooking — PureBD Mart brings everything to your doorstep
            with fast delivery and affordable pricing.
          </p>

          <p className="mt-2">
            We believe health starts with what you consume. That’s why every
            product at PureBD Mart goes through strict quality checks. We work
            directly with farmers, importers, and trusted manufacturers to
            ensure you get nothing but the best. Our range of products continues
            to grow as we expand into more natural, organic, and premium grocery
            categories.
          </p>

          <p className="mt-2">
            At PureBD Mart, customer satisfaction is our top priority. With easy
            ordering, verified products, secure payments, and dedicated support,
            we aim to make your shopping journey smooth and enjoyable. Thank you
            for choosing PureBD Mart — your home for purity, quality, and
            healthy living.
          </p>
        </div>
      </div>
    </div>
  );
}
