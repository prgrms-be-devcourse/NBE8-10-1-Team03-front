const KEY_PREFIX = "coffee:image:";
const TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3일

type CacheEntry = {
  dataUrl: string;      // data:image/...;base64,...
  expiresAt: number;    // epoch ms
};

type ImageId = string; // ✅ 변경

function toKey(imageId: ImageId) {
  return `${KEY_PREFIX}${imageId}`;
}

/** 만료된 캐시를 정리 (페이지 진입 시 1번 정도 호출 권장) */
export function cleanupExpiredImageCache() {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(KEY_PREFIX)) keys.push(k);
  }

  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
      const entry = JSON.parse(raw) as CacheEntry;
      if (!entry.expiresAt || entry.expiresAt <= now) localStorage.removeItem(k);
    } catch {
      localStorage.removeItem(k);
    }
  }
}

export function getCachedImage(imageId: ImageId): string | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(toKey(imageId));
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(toKey(imageId));
      return null;
    }
    return entry.dataUrl;
  } catch {
    localStorage.removeItem(toKey(imageId));
    return null;
  }
}

export function setCachedImage(imageId: ImageId, dataUrl: string) {
  if (typeof window === "undefined") return;

  const key = toKey(imageId);
  const entry: CacheEntry = { dataUrl, expiresAt: Date.now() + TTL_MS };

  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    cleanupExpiredImageCache();
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // 캐시 포기
    }
  }
}
