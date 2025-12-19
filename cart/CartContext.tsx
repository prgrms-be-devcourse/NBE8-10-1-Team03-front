"use client";

import * as React from "react";
import type { CartItem } from "./cartTypes";

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (productId: number) => void;
  changeQty: (productId: number, qty: number) => void;
  clear: () => void;

  /** 서버 전송용 payload 변환 */
  toOrderPayload: () => { items: Array<{ productId: number; qty: number }> };
};

const CartContext = React.createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);

  const add = (item: CartItem) => {
    setItems((prev) => {
      const idx = prev.findIndex((x) => x.productId === item.productId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + 1 };
        return copy;
      }
      return [...prev, item];
    });
  };

  const remove = (productId: number) => {
    setItems((prev) => prev.filter((x) => x.productId !== productId));
  };

  const changeQty = (productId: number, qty: number) => {
    setItems((prev) =>
      prev
        .map((x) => (x.productId === productId ? { ...x, quantity: qty } : x))
        .filter((x) => x.quantity > 0)
    );
  };

  const clear = () => setItems([]);

  const toOrderPayload = () => ({
    items: items.map((x) => ({ productId: x.productId, qty: x.quantity })),
  });

  return (
    <CartContext.Provider value={{ items, add, remove, changeQty, clear, toOrderPayload }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
