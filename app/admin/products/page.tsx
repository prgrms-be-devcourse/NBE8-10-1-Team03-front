import { AdminProductsClient } from "./AdminProductsClient";

export default function AdminProductsPage() {
  return (
    <main className="min-h-dvh bg-neutral-50 p-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="text-2xl font-bold text-neutral-900">물품 관리</div>

        <div className="mt-6">
          <AdminProductsClient />
        </div>
      </div>
    </main>
  );
}
