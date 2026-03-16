import { Product } from "@/entities/experiment";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type CartItem = Product & { quantity: number };

interface CartStore {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: () => number;
  totalCount: () => number;
}

export const useCartStore = create<CartStore>()(
  devtools(
    // 로컬스토리지로 자동 저장
    persist(
      (set, get) => ({
        items: [],

        addItem: (product) =>
          set((state) => {
            const exists = state.items.find((item) => item.id === product.id);
            if (exists) {
              return {
                items: state.items.map((item) =>
                  item.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item,
                ),
              };
            }
            return { items: [...state.items, { ...product, quantity: 1 }] };
          }),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),

        updateQuantity: (id, quantity) =>
          set((state) => {
            if (quantity <= 0) {
              return { items: state.items.filter((item) => item.id !== id) };
            }
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item,
              ),
            };
          }),

        clearCart: () => set({ items: [] }),

        totalPrice: () =>
          get().items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
          ),

        totalCount: () =>
          get().items.reduce((sum, item) => sum + item.quantity, 0),
      }),
      { name: "cart-storage" },
    ),
  ),
);
