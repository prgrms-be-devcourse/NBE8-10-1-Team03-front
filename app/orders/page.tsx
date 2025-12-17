import { ProductsClient } from "./productsClient";

export default function OrdersPage() {
  return (
    <main className="min-h-dvh bg-neutral-50 p-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-2xl font-bold text-neutral-900">상품 목록</div>
        <p className="mt-2 text-sm text-neutral-700">
          오른쪽 “추가” 버튼으로 장바구니에 담습니다.
        </p>

        <div className="mt-6">
          <ProductsClient />
        </div>
      </div>
    </main>
  );
}
