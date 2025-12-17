const KEY_PREFIX = "coffee:image:";
const TTL_MS = 3 * 24 * 60 * 60 * 1000; // 3일

type CacheEntry = {
  dataUrl: string;      // data:image/...;base64,...
  expiresAt: number;    // epoch ms
};

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

export function getCachedImage(imageId: number): string | null {
  if (typeof window === "undefined") return null;

  const key = `${KEY_PREFIX}${imageId}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.dataUrl;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function setCachedImage(imageId: number, dataUrl: string) {
  if (typeof window === "undefined") return;

  const key = `${KEY_PREFIX}${imageId}`;
  const entry: CacheEntry = { dataUrl, expiresAt: Date.now() + TTL_MS };
  try {
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // 용량 초과 등 발생 시: 전체 청소 후 재시도(보수적으로)
    cleanupExpiredImageCache();
    try {
      localStorage.setItem(key, JSON.stringify(entry));
    } catch {
      // 그래도 안 되면 캐시 포기
    }
  }
}
