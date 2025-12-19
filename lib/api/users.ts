import { API_BASE_URL } from "@/config/api";
import type { UserTotalRes, UserInfoUpdateReq } from "@/types/user";

export async function fetchUserTotal(email: string): Promise<UserTotalRes> {
  const res = await fetch(
    `${API_BASE_URL}/users/total?email=${encodeURIComponent(email)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("failed to fetch user total");
  const json = await res.json();

  // CommonResponse.success(...) 형태라면 data로 감싸져 있을 확률이 큼
  return (json.data ?? json) as UserTotalRes;
}

export async function updateUserInfo(
  email: string,
  payload: Omit<UserInfoUpdateReq, "email">
): Promise<void> {
  // ✅ email을 body로 요구하는 백엔드라면 아래 주석 해제하고 body에 포함
  // const body = { email, ...payload };

  const res = await fetch(`${API_BASE_URL}/users?email=${encodeURIComponent(email)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("failed to update user info");
}

export async function checkUserEmail(email: string): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}/users/check?email=${encodeURIComponent(email)}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("fail");
  const json: { data: boolean } = await res.json();
  return json.data;
}