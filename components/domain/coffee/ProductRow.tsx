"use client";

import { ColorButton } from "@/components/ui/buttons/ColorButton";
import { cn } from "@/lib/cn";
import type { Product } from "@/types/product";

type Props = {
  product: Product;
  imageUrl: string | null;
  onAdd?: () => void; // ✅ optional
};

export function ProductRow({ product, imageUrl, onAdd }: Props) {
  return (
    <div className="w-full border border-neutral-200 bg-white p-4">
      <div className="flex gap-4">
        {imageUrl ? (
          <img src={imageUrl} alt="" className="h-24 w-24 shrink-0 object-cover" />
        ) : (
          <div className="h-24 w-24 shrink-0 border border-neutral-200 bg-neutral-50" />
        )}

        <div className="flex w-full items-start justify-between gap-4">
          {/* 왼쪽 내용 */}
          <div className="flex w-full flex-col">
            <div className="flex items-baseline gap-2">
              <div className="text-base font-semibold text-neutral-900">{product.name}</div>
              <div className="text-xs text-neutral-600">{product.type}</div>
            </div>

            <hr className="my-2 border-neutral-200" />

            <div className="text-sm text-neutral-900">가격: {product.cost.toLocaleString()}원</div>
            <div className={cn("mt-1 text-sm text-neutral-700", "whitespace-pre-wrap")}>
              {product.description}
            </div>
          </div>

          {/* 오른쪽 추가 버튼 */}
          <div className="shrink-0">
            {onAdd && (
              <ColorButton color="white" onClick={onAdd}>
                추가
              </ColorButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
