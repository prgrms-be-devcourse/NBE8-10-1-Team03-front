import { API_BASE_URL } from "@/config/api";

type ApiResponse<T> = { data: T; message?: string; code?: string };


export type UserOrderItemResponse = {
  orderId: number;
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  orderDate: string;
  deliveryDate: string;
};


export type CreateOrderRequest = {
  email: string;
  address: string | null;
  zipcode: number | null;
  details: Array<{
    productId: number;
    quantity: number;
  }>;
};


function normalizeOrders(data: any): UserOrderItemResponse[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;

  // 흔한 케이스: data 안에 리스트가 한 번 더 감싸져 옴
  if (Array.isArray(data.orders)) return data.orders;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.content)) return data.content;

  // 단건이면 배열로 감싸기
  return [data];
}


export async function fetchUserOrders(email: string): Promise<UserOrderItemResponse[]> {
  const res = await fetch(
    `${API_BASE_URL}/orders/user?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("fail");

  const json: ApiResponse<any> = await res.json();
  return normalizeOrders(json.data);
}

export async function deleteOrder(orderId: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("fail");
}

export async function createOrder(dto: CreateOrderRequest): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/orders/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("fail");
}
