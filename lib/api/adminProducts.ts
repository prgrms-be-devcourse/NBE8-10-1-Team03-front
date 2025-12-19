import { apiFetch } from "@/lib/apiClient";
import type { AdminProduct, ProductInfoDto } from "@/types/adminProduct";

/** 상품 목록 조회 */
export function fetchAdminProducts(): Promise<AdminProduct[]> {
  return apiFetch<AdminProduct[]>("/admin/products", {
    method: "GET",
  });
}

/** 상품 생성 */
export function createAdminProduct(dto: ProductInfoDto): Promise<void> {
  return apiFetch<void>("/admin/products", {
    method: "POST",
    body: dto,
  });
}

/** 상품 수정 */
export function updateAdminProduct(
  productId: number,
  dto: ProductInfoDto
): Promise<void> {
  return apiFetch<void>(`/admin/products/${productId}`, {
    method: "PUT",
    body: dto,
  });
}

/** 상품 삭제 */
export function deleteAdminProduct(productId: number): Promise<void> {
  return apiFetch<void>(`/admin/products/${productId}`, {
    method: "DELETE",
  });
}

/** 이미지 업로드 */
export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  return apiFetch<string>("/products/images", {
    method: "POST",
    body: formData,
    headers: {}, // Content-Type 자동 설정 방지
  });
}
