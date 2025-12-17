import type { Product } from "@/types/product";

export type CartItem = {
  productId: number;
  name: string;
  cost: number;
  qty: number;
  type: string;
};

export function toCartItem(p: Product): CartItem {
  return {
    productId: p.id,
    name: p.name,
    cost: p.cost,
    qty: 1,
    type: p.type,
  };
}
