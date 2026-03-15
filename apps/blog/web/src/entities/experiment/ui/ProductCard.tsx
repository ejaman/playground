"use client";

import Image from "next/image";
import type { Product } from "@/entities/experiment";
import { useCartStore } from "@/shared/store";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="border rounded-xl p-4 hover:shadow-md transition-shadow">
      <Image
        src={product.image}
        alt={product.name}
        width={100}
        height={100}
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
  );
}
