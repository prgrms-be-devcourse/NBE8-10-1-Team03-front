"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

type Order = {
  orderId: number;
  shipmentId: number | null; // ✅ 추가
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

function DateHeader({ date }: { date: string }) {
  return (
    <div className="rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-900">
      {date}
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
      const data = await apiFetch<Order[]>("/admin/orders", { method: "GET" });
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

  // email -> shipmentKey -> orders[]
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, Order[]>>();

    for (const o of orders) {
      const email = o.email ?? "(unknown)";
      const shipmentKey =
        o.shipmentId == null ? "NO_SHIPMENT" : String(o.shipmentId);

      if (!map.has(email)) map.set(email, new Map());
      const shipmentMap = map.get(email)!;

      if (!shipmentMap.has(shipmentKey)) shipmentMap.set(shipmentKey, []);
      shipmentMap.get(shipmentKey)!.push(o);
    }

    // shipment 내부 정렬: orderDate desc, 같으면 orderId desc
    for (const [, shipmentMap] of map) {
      for (const [shipmentKey, list] of shipmentMap) {
        list.sort((a, b) => {
          const c = (b.orderDate ?? "").localeCompare(a.orderDate ?? "");
          if (c !== 0) return c;
          return (b.orderId ?? 0) - (a.orderId ?? 0);
        });
        shipmentMap.set(shipmentKey, list);
      }
    }

    return map;
  }, [orders]);

  const sortedEmails = useMemo(() => {
    return Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
  }, [grouped]);

  const sortedShipmentKeys = (shipmentMap: Map<string, Order[]>) => {
    // NO_SHIPMENT은 맨 아래로, 나머지는 숫자 오름차순
    return Array.from(shipmentMap.keys()).sort((a, b) => {
      if (a === "NO_SHIPMENT" && b === "NO_SHIPMENT") return 0;
      if (a === "NO_SHIPMENT") return 1;
      if (b === "NO_SHIPMENT") return -1;
      return Number(a) - Number(b);
    });
  };

  const totalCountByEmail = (shipmentMap: Map<string, Order[]>) =>
    Array.from(shipmentMap.values()).reduce((acc, list) => acc + list.length, 0);

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
            const shipmentMap = grouped.get(email)!;
            const shipmentKeys = sortedShipmentKeys(shipmentMap);

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
                    {totalCountByEmail(shipmentMap)}건
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-4">
                  {shipmentKeys.map((shipmentKey) => {
                    const list = shipmentMap.get(shipmentKey)!;

                    const title =
                      shipmentKey === "NO_SHIPMENT"
                        ? "shipment 없음"
                        : `shipment #${shipmentKey}`;

                    return (
                      <div
                        key={shipmentKey}
                        className="rounded-md border border-neutral-200 bg-white p-3"
                      >
                        <div className="flex items-baseline justify-between">
                          <div className="text-sm font-medium text-neutral-900">
                            {title}
                          </div>
                          <div className="text-xs text-neutral-600">
                            {list.length}건
                          </div>
                        </div>

                        <div className="mt-3 flex flex-col gap-2">
                          {list.map((o, idx) => {
                            const curDate = toDateOnly(o.orderDate);
                            const prevDate =
                              idx === 0
                                ? null
                                : toDateOnly(list[idx - 1].orderDate);

                            return (
                              <div key={o.orderId} className="flex flex-col gap-2">
                                {idx === 0 || curDate !== prevDate ? (
                                  <DateHeader date={curDate} />
                                ) : null}
                                <OrderBlock o={o} />
                              </div>
                            );
                          })}
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
