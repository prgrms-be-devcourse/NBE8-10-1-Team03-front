import { API_BASE_URL } from "@/config/api";
import { getAccessToken } from "@/lib/auth";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: string;
};

type ApiFetchOptions = {
  method: HttpMethod;
  body?: any;                 // 선택
  headers?: HeadersInit;      // 선택
};

/**
 * 모든 HTTP 요청 공통 처리
 * - Authorization: Bearer <token> 자동 첨부
 * - token 없으면 Authorization 없이 요청
 * - 서버 응답이 { data: ... } 구조면 data만 반환
 */
export async function apiFetch<T>(
  path: string,
  { method, body, headers }: ApiFetchOptions
): Promise<T> {
  const token = getAccessToken();
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  const finalHeaders: HeadersInit = {
    ...(!isFormData && body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: finalHeaders,
    body: body
      ? isFormData
        ? body
        : JSON.stringify(body)
      : undefined,
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(json?.message ?? `HTTP ${res.status}`);
  }

  if (json && typeof json === "object" && "data" in json) {
    return json.data as T;
  }

  return json as T;
}
