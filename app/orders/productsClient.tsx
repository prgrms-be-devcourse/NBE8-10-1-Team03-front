"use client";

import * as React from "react";
import { fetchProducts } from "@/lib/api/products";
import type { Product } from "@/types/product";
import { useProductImages } from "@/hooks/useProductImages";
import { ProductRow } from "@/components/domain/coffee/ProductRow";
import { useCart } from "@/cart/CartContext";
import { toCartItem } from "@/cart/cartTypes";
import { ColorButton } from "@/components/ui/buttons/ColorButton";
import { checkUserEmail } from "@/lib/api/users";
import {
  fetchUserOrders,
  deleteOrder,
  createOrder,
  type UserOrderItemResponse,
} from "@/lib/api/orders";

export function ProductsClient() {
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  const { add, items, toOrderPayload, clear } = useCart();

  // 결제 입력
  const [checkoutEmail, setCheckoutEmail] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [zipcode, setZipcode] = React.useState("");
  const [paying, setPaying] = React.useState(false);
  const [payErr, setPayErr] = React.useState<string | null>(null);

  // 주문내역 조회
  const [historyEmail, setHistoryEmail] = React.useState("");
  const [orders, setOrders] = React.useState<UserOrderItemResponse[]>([]);
  const [historyLoading, setHistoryLoading] = React.useState(false);
  const [historyErr, setHistoryErr] = React.useState<string | null>(null);
  const [needAddress, setNeedAddress] = React.useState(false);
  const [historyLoadedEmail, setHistoryLoadedEmail] = React.useState<string | null>(null);


  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const list = await fetchProducts();
        if (!cancelled) setProducts(list);
      } catch {
        if (!cancelled) setErr("상품 목록을 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

const imageIds = products.flatMap((p) => (p.imageId ? [p.imageId] : []));
const imageMap = useProductImages(imageIds); // Record<string, string>

  const totalAmount = React.useMemo(() => {
    // items 구조: { cost, qty } 기준
    return items.reduce((sum, it) => sum + it.cost * it.quantity, 0);
  }, [items]);

  const loadHistory = async () => {
    const email = historyEmail.trim();
    if (!email) {
      setHistoryErr("이메일을 입력하세요.");
      return;
    }
    setHistoryErr(null);
    setHistoryLoading(true);
    try {
      const list = await fetchUserOrders(email);
      setOrders(list);
      setHistoryOpen(true);

      // ✅ "조회 성공" 기준: API 호출 성공 + 결과 세팅
      // (주문이 0건이어도 '조회 성공'으로 보고 버튼 노출하려면 아래처럼 유지)
      setHistoryLoadedEmail(email);
    } catch {
      setHistoryErr("주문 내역을 불러오지 못했습니다.");
      setHistoryLoadedEmail(null);
    } finally {
      setHistoryLoading(false);
    }
  };
  const removeOrder = async (orderId: number) => {
    setHistoryErr(null);
    try {
      await deleteOrder(orderId);
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    } catch {
      setHistoryErr("주문 삭제에 실패했습니다.");
    }
  };

const pay = async () => {
  setPayErr(null);

  const email = checkoutEmail.trim();
  if (!email) return setPayErr("이메일을 입력하세요.");
  if (items.length === 0) return;

  const addr = address.trim();
  const zip = Number(zipcode);

  // 🔹 1. 주소가 이미 다 입력된 경우 → 바로 검증 후 주문
  const hasAddress =
    addr.length > 0 && Number.isInteger(zip) && zip > 0;

  setPaying(true);

  try {
    // 🔹 2. 주소가 없는 경우에만 이메일 체크
    if (!hasAddress) {
      const ok = await checkUserEmail(email);
      if (!ok) {
        setNeedAddress(true);
        setPayErr("추가 배송 정보를 입력해주세요.");
        return;
      }
    }

    // 🔹 3. 주소가 필요한 상황이면 여기서 검증
    if (needAddress || hasAddress) {
      if (!addr) return setPayErr("주소를 입력하세요.");
      if (!Number.isInteger(zip) || zip <= 0)
        return setPayErr("우편번호를 올바르게 입력하세요.");
    }

    const details = items.map((it) => ({
      productId: it.productId,
      quantity: it.quantity,
    }));

    await createOrder({
      email,
      address: hasAddress ? addr : null,
      zipcode: hasAddress ? zip : null,
      details,
    });

    clear();
    setCheckoutEmail("");
    setAddress("");
    setZipcode("");
    setNeedAddress(false);
  } catch {
    setPayErr("결제(주문 생성)에 실패했습니다.");
  } finally {
    setPaying(false);
  }
};



  if (loading) return <div className="text-sm text-neutral-700">로딩 중...</div>;
  if (err) return <div className="text-sm text-red-600">{err}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      {/* 좌측: 상품 + (상단) 주문내역 조회 */}
      <div className="flex flex-col gap-4">
        {/* 주문 내역 조회 바 */}
        <div className="border border-neutral-200 bg-white p-4">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="text-sm font-semibold text-neutral-900">주문 내역 조회</div>
              <input
                className="mt-2 w-full border border-neutral-200 px-3 py-2 text-sm"
                placeholder="이메일"
                value={historyEmail}
                onChange={(e) => setHistoryEmail(e.target.value)}
              />
            </div>
              <div className="flex gap-2">
                <ColorButton color="blue" onClick={loadHistory} disabled={historyLoading}>
                  주문 내역 확인하기
                </ColorButton>

                <ColorButton
                  color="black"
                  onClick={() => setHistoryOpen((v) => !v)}
                  disabled={orders.length === 0}
                >
                  {historyOpen ? "접기" : "펼치기"}
                </ColorButton>
              </div>
          </div>

          {historyLoadedEmail && (
            <a
              href={`/user/total?email=${encodeURIComponent(historyLoadedEmail)}`}
              className="block"
            >
              <ColorButton color="green" fullWidth>
                유저 정보 보기 (총 소비금액 / 배송지 정보 수정) · {historyLoadedEmail}
              </ColorButton>
            </a>
          )}
          {historyErr && <div className="mt-2 text-sm text-red-600">{historyErr}</div>}

          {historyLoading ? (
            <div className="mt-3 text-sm text-neutral-700">불러오는 중...</div>
          ) : orders.length === 0 ? (
            <div className="mt-3 text-sm text-neutral-600">주문 내역 없음</div>
          ) : historyOpen ? (
            <div className="mt-3 flex flex-col gap-2">
              {orders.map((o) => (
                <div
                  key={o.orderId}
                  className="flex items-start justify-between gap-3 border border-neutral-200 p-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      #{o.orderId} · {o.productName} × {o.quantity}
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">
                      {o.totalPrice.toLocaleString()}원 · {o.status}
                    </div>
                    <div className="mt-1 text-xs text-neutral-600">
                      주문: {o.orderDate} / 배송: {o.deliveryDate}
                    </div>
                  </div>

                  <ColorButton color="red" onClick={() => removeOrder(o.orderId)}>
                    삭제
                  </ColorButton>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-3 text-sm text-neutral-600">
              주문 내역이 있습니다. “펼치기”를 누르면 표시됩니다.
            </div>
          )}

        </div>

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
      </div>

      {/* 우측: 주문/결제 패널 */}
      <aside className="h-fit border border-neutral-200 bg-white p-4">
        <div className="text-base font-semibold">주문 / 결제</div>
        <hr className="my-3 border-neutral-200" />

        {/* 주문 항목 */}
        {items.length === 0 ? (
          <div className="text-sm text-neutral-600">장바구니가 비어있습니다.</div>
        ) : (
          <div className="flex flex-col gap-2">
            {items.map((it) => (
              <div key={it.productId} className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{it.name}</div>
                  <div className="text-xs text-neutral-600">
                    {it.cost.toLocaleString()}원 · 수량 {it.quantity}
                  </div>
                </div>
                <div className="text-sm font-semibold">
                  {(it.cost * it.quantity).toLocaleString()}원
                </div>
              </div>
            ))}
          </div>
        )}

        <hr className="my-3 border-neutral-200" />

        {/* 배송/결제 정보 입력 */}
        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">이메일</span>
            <input
              className="border border-neutral-200 px-3 py-2 text-sm"
              value={checkoutEmail}
              onChange={(e) => setCheckoutEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">주소</span>
            <input
              className="border border-neutral-200 px-3 py-2 text-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="도로명/상세주소"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">우편번호</span>
            <input
              className="border border-neutral-200 px-3 py-2 text-sm"
              value={zipcode}
              onChange={(e) => setZipcode(e.target.value)}
              inputMode="numeric"
              placeholder="00000"
            />
          </label>

          <div className="text-xs text-neutral-600">
            당일 오후 2시 이후의 주문은 다음날 배송을 시작합니다.
          </div>
        </div>

        <hr className="my-3 border-neutral-200" />

        {/* 총액 + 결제 */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-700">총 금액</div>
          <div className="text-base font-semibold">{totalAmount.toLocaleString()}원</div>
        </div>

        {payErr && <div className="mt-2 text-sm text-red-600">{payErr}</div>}

        <div className="mt-3 flex flex-col gap-2">
          <ColorButton
            color="green"
            fullWidth
            onClick={pay}
            disabled={items.length === 0 || paying}
          >
            결제하기
          </ColorButton>

          <ColorButton color="red" fullWidth onClick={clear} disabled={items.length === 0 || paying}>
            비우기
          </ColorButton>

        </div>
      </aside>
    </div>
  );
}
