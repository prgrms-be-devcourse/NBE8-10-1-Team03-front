import type { Product } from "@/types/product";

export type CartItem = {
  productId: number;
  name: string;
  cost: number;
  quantity: number;
  type: string;
};

export function toCartItem(p: Product): CartItem {
  return {
    productId: p.id,
    name: p.name,
    cost: p.cost,
    quantity: 1,
    type: p.type,
  };
}
