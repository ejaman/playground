// src/app/page.tsx
"use client";

import { useState } from "react";

import Link from "next/link";
import { useProducts } from "@/entities/experiment";
import { useCartStore } from "@/shared/store";

const CATEGORIES = [
  { value: "all", label: "전체" },
  { value: "electronics", label: "전자기기" },
  { value: "fashion", label: "패션" },
  { value: "beauty", label: "뷰티" },
];

export default function HomePage() {
  const [category, setCategory] = useState("all");
  const { data: products, isLoading, isError, error } = useProducts(category);
  const { addItem, totalCount } = useCartStore();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );

  if (isError)
    return (
      <div className="p-8 text-center text-red-500">오류가 발생했습니다.</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">쇼핑몰</h1>
        <Link href="/experiment/cart" className="relative p-2">
          <span className="text-2xl">🛒</span>
          {totalCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalCount()}
            </span>
          )}
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm transition-colors ${
              category === cat.value
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {products?.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover rounded-lg mb-3"
            />
            <p className="text-xs text-gray-400 mb-1">{product.category}</p>
            <h3 className="font-medium mb-1">{product.name}</h3>
            <p className="text-sm text-gray-500 mb-2 line-clamp-1">
              {product.description}
            </p>
            <p className="text-blue-600 font-bold mb-3">
              {product.price.toLocaleString()}원
            </p>
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {product.stock === 0 ? "품절" : "장바구니 담기"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
