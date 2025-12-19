// src/lib/auth.ts
const KEY = "admin_access_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setAccessToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearAccessToken() {
  localStorage.removeItem(KEY);
}

export function isAuthed() {
  return !!getAccessToken();
}
