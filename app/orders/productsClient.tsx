"use client";

import * as React from "react";
import { fetchProducts } from "@/lib/api/products";
import type { Product } from "@/types/product";
import { useProductImages } from "@/hooks/useProductImages";
import { ProductRow } from "@/components/domain/coffee/ProductRow";
import { useCart } from "@/cart/CartContext";
import { toCartItem } from "@/cart/cartTypes";
import { ColorButton } from "@/components/ui/buttons/ColorButton";

export function ProductsClient() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const { add, items, toOrderPayload, clear } = useCart();

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProducts();
        if (!cancelled) setProducts(list);
      } catch (e) {
        if (!cancelled) setErr("상품 목록을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const imageMap = useProductImages(products.map((p) => p.imageId));

  if (loading) return <div className="text-sm text-neutral-700">로딩 중...</div>;
  if (err) return <div className="text-sm text-red-600">{err}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      {/* 상품 리스트 */}
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <ProductRow
            key={p.id}
            product={p}
            imageUrl={p.imageId ? imageMap[p.imageId] : null}
            onAdd={() => add(toCartItem(p))}
          />
        ))}
      </div>

      {/* 장바구니 */}
      <aside className="h-fit border border-neutral-200 bg-white p-4">
        <div className="text-base font-semibold">장바구니</div>
        <hr className="my-3 border-neutral-200" />

        {items.length === 0 ? (
          <div className="text-sm text-neutral-600">비어있음</div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((it) => (
              <div key={it.productId} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-neutral-600">
                    {it.cost.toLocaleString()}원 · 수량 {it.qty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="my-3 border-neutral-200" />

        <div className="flex flex-col gap-2">
          <ColorButton
            color="green"
            fullWidth
            onClick={() => {
              // 추후: POST /orders 같은 API로 그대로 보내면 됨
              const payload = toOrderPayload();
              alert(JSON.stringify(payload, null, 2));
            }}
            disabled={items.length === 0}
          >
            주문 전송(payload 확인)
          </ColorButton>

          <ColorButton color="red" fullWidth onClick={clear} disabled={items.length === 0}>
            비우기
          </ColorButton>
        </div>
      </aside>
    </div>
  );
}
