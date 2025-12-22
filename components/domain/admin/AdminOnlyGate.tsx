"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ColorButton } from "@/components/ui/buttons/ColorButton";

export function AdminOnlyGate({
  seconds = 3,
  to = "/orders",
}: {
  seconds?: number;
  to?: string;
}) {
  const router = useRouter();
  const [left, setLeft] = React.useState(seconds);

  React.useEffect(() => {
    const t1 = setInterval(() => setLeft((v) => Math.max(0, v - 1)), 1000);
    const t2 = setTimeout(() => router.replace(to), seconds * 1000);

    return () => {
      clearInterval(t1);
      clearTimeout(t2);
    };
  }, [router, seconds, to]);

  return (
    <div className="mx-auto max-w-xl border border-neutral-200 bg-white p-6">
      <div className="text-lg font-semibold">관리자만 접근 가능한 페이지입니다.</div>
      <div className="mt-2 text-sm text-neutral-600">
        {left}초 후 주문 페이지로 이동합니다.
      </div>

      <div className="mt-4">
        <ColorButton color="black" onClick={() => router.replace(to)}>
          지금 이동
        </ColorButton>
      </div>
    </div>
  );
}
