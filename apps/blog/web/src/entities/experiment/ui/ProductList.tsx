"use client";

import { useProductsSuspense } from "@/entities/experiment";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  category: string;
}

export function ProductList({ category }: ProductListProps) {
  const { data: products } = useProductsSuspense(category);

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
