"use client";

import Link from "next/link";
import { useCartStore } from "@/shared/store";

export function CartLink() {
  const totalCount = useCartStore((state) => state.totalCount());

  return (
    <Link href="/experiment/cart" className="relative p-2">
      <span className="text-2xl">🛒</span>
      {totalCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
