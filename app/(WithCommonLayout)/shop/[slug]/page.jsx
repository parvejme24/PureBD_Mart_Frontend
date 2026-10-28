"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import ProductDetails from "@/components/module/ShopPageComp/ProductDetails/ProductDetails";
import ProductDetailsSkeleton from "@/components/module/ShopPageComp/ProductDetails/ProductDetailsSkeleton";
import { ArrowLeft, SearchX } from "lucide-react";

export default function ProductPage() {
  const params = useParams();
  const rawSlug = params?.slug ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : "";
  const slug = decodeURIComponent(rawSlug);

  const { data: productData, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !productData?.product) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="max-w-md mx-auto bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <SearchX className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">
            Product Not Found
          </h1>
          <p className="text-sm text-gray-500 mb-6 leading-relaxed">
            The item you are searching for might have been relocated, sold out, or is temporarily unavailable.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-6 py-3 rounded-2xl hover:bg-emerald-700 transition-all shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Explore All Products
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetails product={productData.product} />;
}
