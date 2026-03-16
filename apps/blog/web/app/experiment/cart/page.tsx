"use client";

import { useCartStore } from "@/shared/store";
import Image from "next/image";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQuantity,
    clearCart,
    totalPrice,
    totalCount,
  } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <p className="text-4xl mb-4">🛒</p>
        <p className="text-gray-400 mb-4">장바구니가 비어있어요</p>
        <Link href="/experiment" className="text-blue-600 underline">
          쇼핑 계속하기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">장바구니 ({totalCount()})</h1>
        <button
          onClick={clearCart}
          className="text-sm text-red-400 hover:text-red-600"
        >
          전체 삭제
        </button>
      </div>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 border rounded-xl p-4"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={100}
              height={100}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-blue-600 text-sm">
                {(item.price * item.quantity).toLocaleString()}원
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                −
              </button>
              <span className="w-6 text-center text-sm">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="text-gray-300 hover:text-red-400 ml-2 text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-lg font-bold">
          <span>총 결제금액</span>
          <span className="text-blue-600">
            {totalPrice().toLocaleString()}원
          </span>
        </div>
        <button className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
          결제하기
        </button>
        <Link
          href="/experiment"
          className="block text-center text-sm text-gray-400 hover:text-gray-600"
        >
          쇼핑 계속하기
        </Link>
      </div>
    </div>
  );
}
