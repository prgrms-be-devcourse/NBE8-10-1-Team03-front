import { API_BASE_URL } from "@/config/api";
import type { ApiResponse, Product } from "@/types/product";

/**
 * GET /products
 */
export async function fetchProducts(): Promise<Product[]> {
  const url = `${API_BASE_URL}/products`;

  console.log("[fetchProducts] GET", url);

  const res = await fetch(url, { cache: "no-store" });

  console.log("[fetchProducts] status", res.status);

  if (!res.ok) throw new Error("상품 목록 조회 실패");

  const json = (await res.json()) as ApiResponse<Product[]>;

  console.log("[fetchProducts] data length", json.data?.length ?? 0);

  return json.data ?? [];
}

/**
 * GET /products/images?imageIds=1&imageIds=2...
 *
 * 서버 응답의 data가 다음 형태라고 가정:
 * {
 *   "data": { "1": "<base64 or bytecode>", "2": "<...>" },
 *   "message": "...",
 *   "status": "success"
 * }
 */
export async function fetchProductImages(imageIds: number[]): Promise<Record<string, unknown>> {
  if (imageIds.length === 0) return {};

  const qs = imageIds.map((id) => `imageIds=${encodeURIComponent(id)}`).join("&");
  const res = await fetch(`${API_BASE_URL}/products/images?${qs}`, { cache: "no-store" });
  if (!res.ok) throw new Error("이미지 조회 실패");

  const json = (await res.json()) as ApiResponse<Record<string, unknown>>;
  return json.data ?? {};
}
