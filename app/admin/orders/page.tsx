// app/admin/order/page.tsx
import OrdersAdminClient from "./ordersAdminClient";

export default function AdminOrderPage() {
  return (
    <main className="mx-auto w-full max-w-4xl p-6">
      <div className="text-lg font-semibold text-neutral-900">주문 관리</div>
      <div className="mt-4">
        <OrdersAdminClient />
      </div>
    </main>
  );
}
