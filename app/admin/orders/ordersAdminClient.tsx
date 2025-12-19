"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { ColorButton } from "@/components/ui/buttons/ColorButton";

type Order = {
  orderId: number;
  email: string;
  address: string;
  zipcode: number;
  productId: number;
  productName: string;
  quantity: number;
  totalPrice: number;
  status: string;
  orderDate: string;
  deliveryDate: string;
};

function toDateOnly(isoLike: string) {
  return (isoLike ?? "").slice(0, 10);
}

function formatDateTime(isoLike: string) {
  if (!isoLike) return "-";
  const [d, t] = isoLike.split("T");
  return t ? `${d} ${t.split(".")[0]}` : isoLike;
}

function OrderBlock({ o }: { o: Order }) {
  return (
    <div className="flex items-start justify-between gap-3 border border-neutral-200 bg-white p-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-neutral-900">
          #{o.orderId} · {o.productName} × {o.quantity}
        </div>
        <div className="mt-1 text-xs text-neutral-600">
          {o.totalPrice.toLocaleString()}원 · {o.status}
        </div>
        <div className="mt-1 text-xs text-neutral-600">
          주문: {formatDateTime(o.orderDate)} / 배송: {formatDateTime(o.deliveryDate)}
        </div>
        <div className="mt-1 text-xs text-neutral-600">
          {o.address} ({o.zipcode})
        </div>
      </div>
    </div>
  );
}

export default function OrdersAdminClient() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setLoading(true);
    setError(null);
    try {
      // 🔴 핵심 변경
      const data = await apiFetch<Order[]>("/orders", { method: "GET" });
      setOrders(data);
    } catch (e: any) {
      setError(e?.message ?? "unknown error");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  // email -> date -> orders[]
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, Order[]>>();

    for (const o of orders) {
      const email = o.email ?? "(unknown)";
      const date = toDateOnly(o.orderDate);

      if (!map.has(email)) map.set(email, new Map());
      const dateMap = map.get(email)!;

      if (!dateMap.has(date)) dateMap.set(date, []);
      dateMap.get(date)!.push(o);
    }

    for (const [, dateMap] of map) {
      for (const [date, list] of dateMap) {
        list.sort((a, b) =>
          (b.orderDate ?? "").localeCompare(a.orderDate ?? "")
        );
        dateMap.set(date, list);
      }
    }

    return map;
  }, [orders]);

  const sortedEmails = useMemo(() => {
    return Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
  }, [grouped]);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm text-neutral-700">
          총 {orders.length.toLocaleString()}건
        </div>
        <button
          onClick={reload}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50"
        >
          새로고침
        </button>
      </div>

      {loading ? (
        <div className="mt-3 text-sm text-neutral-700">불러오는 중...</div>
      ) : error ? (
        <div className="mt-3 text-sm text-red-600">에러: {error}</div>
      ) : orders.length === 0 ? (
        <div className="mt-3 text-sm text-neutral-600">주문 내역 없음</div>
      ) : (
        <div className="mt-4 flex flex-col gap-6">
          {sortedEmails.map((email) => {
            const dateMap = grouped.get(email)!;
            const sortedDates = Array.from(dateMap.keys()).sort((a, b) =>
              b.localeCompare(a)
            );

            return (
              <div
                key={email}
                className="rounded-lg border border-neutral-200 bg-neutral-50 p-4"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="text-base font-semibold text-neutral-900">
                    {email}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {sortedDates.reduce(
                      (acc, d) => acc + (dateMap.get(d)?.length ?? 0),
                      0
                    )}
                    건
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-4">
                  {sortedDates.map((date) => {
                    const list = dateMap.get(date)!;

                    return (
                      <div
                        key={date}
                        className="rounded-md border border-neutral-200 bg-white p-3"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="text-sm font-medium text-neutral-900">
                            {date}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {list.length}건
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          {list.map((o) => (
                            <OrderBlock key={o.orderId} o={o} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
