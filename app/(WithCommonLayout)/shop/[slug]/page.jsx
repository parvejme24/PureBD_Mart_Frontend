"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useProduct } from "@/hooks/useProduct";
import ProductDetails from "@/components/module/ShopPageComp/ProductDetails/ProductDetails";
import ProductDetailsSkeleton from "@/components/module/ShopPageComp/ProductDetails/ProductDetailsSkeleton";

export default function ProductPage() {
  const params = useParams();
  const slug = decodeURIComponent(params.slug);

  const { data: productData, isLoading, isError } = useProduct(slug);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (isError || !productData?.product) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <Link
            href="/shop"
            className="inline-block bg-[#3BB77E] text-white px-6 py-3 rounded-lg hover:bg-[#2a9c66] transition-colors"
          >
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  return <ProductDetails product={productData.product} />;
}
