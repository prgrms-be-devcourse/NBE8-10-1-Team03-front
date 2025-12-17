"use client";

import * as React from "react";
import { fetchProductImages } from "@/lib/api/products";
import { cleanupExpiredImageCache, getCachedImage, setCachedImage } from "@/lib/image/imageCache";
import { toDataUrl } from "@/lib/image/imageCodec";

export function useProductImages(imageIds: Array<number | null | undefined>) {
  const [map, setMap] = React.useState<Record<number, string>>({});

  React.useEffect(() => {
    cleanupExpiredImageCache();

    const unique = Array.from(new Set(imageIds.filter((v): v is number => typeof v === "number")));
    if (unique.length === 0) return;

    // 1) 캐시에서 먼저 채움
    const cached: Record<number, string> = {};
    const missing: number[] = [];

    for (const id of unique) {
      const hit = getCachedImage(id);
      if (hit) cached[id] = hit;
      else missing.push(id);
    }

    if (Object.keys(cached).length > 0) {
      setMap((prev) => ({ ...prev, ...cached }));
    }

    // 2) 없는 것만 서버에서 가져옴
    if (missing.length === 0) return;

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchProductImages(missing); // { "1": "...", ... }
        if (cancelled) return;

        const next: Record<number, string> = {};
        for (const id of missing) {
          const raw = (data as any)[String(id)];
          const url = toDataUrl(raw);
          if (url) {
            next[id] = url;
            setCachedImage(id, url);
          }
        }

        if (Object.keys(next).length > 0) {
          setMap((prev) => ({ ...prev, ...next }));
        }
      } catch {
        // 이미지 실패는 화면을 죽이지 않음
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(imageIds)]);

  return map; // imageId -> dataUrl
}
