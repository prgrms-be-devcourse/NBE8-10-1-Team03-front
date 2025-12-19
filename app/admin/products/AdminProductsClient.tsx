"use client";

import * as React from "react";
import type { AdminProduct, ProductInfoDto } from "@/types/adminProduct";
import { useProductImages } from "@/hooks/useProductImages";
import { ProductRow } from "@/components/domain/coffee/ProductRow";
import { ColorButton } from "@/components/ui/buttons/ColorButton";
import {
  fetchAdminProducts,
  uploadProductImage,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
} from "@/lib/api/adminProducts";

const emptyForm: ProductInfoDto = {
  name: "",
  type: "",
  cost: 0,
  description: "",
  imageId: null,
};

export function AdminProductsClient() {
  const [products, setProducts] = React.useState<AdminProduct[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [err, setErr] = React.useState<string | null>(null);

  // 우측 패널: 추가/수정 겸용
  const [mode, setMode] = React.useState<"create" | "edit">("create");
  const [editingId, setEditingId] = React.useState<number | null>(null);

  const [form, setForm] = React.useState<ProductInfoDto>(emptyForm);
  const [imageFile, setImageFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const reload = React.useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const list = await fetchAdminProducts();
      setProducts(list);
    } catch {
      setErr("상품 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void reload();
  }, [reload]);

  const imageMap = useProductImages(products.flatMap((p) => (p.imageId ? [p.imageId] : [])));

  const startCreate = () => {
    setMode("create");
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
  };

  const startEdit = (p: AdminProduct) => {
    setMode("edit");
    setEditingId(p.id);
    setForm({
      name: p.name,
      type: p.type,
      cost: p.cost,
      description: p.description,
      imageId: p.imageId ?? null,
    });
    setImageFile(null); // 새 이미지로 바꿀 때만 선택
  };

  const submit = async () => {
    if (!form.name.trim()) return setErr("상품명을 입력하세요.");
    if (!form.type.trim()) return setErr("타입을 입력하세요.");
    if (!form.cost || form.cost < 0) return setErr("가격을 올바르게 입력하세요.");

    setSubmitting(true);
    setErr(null);

    try {
      let imageId = form.imageId ?? null;

      // 이미지 파일을 선택했다면 먼저 업로드해서 imageId 갱신
      if (imageFile) {
        imageId = await uploadProductImage(imageFile);
      }

      const payload: ProductInfoDto = { ...form, imageId };

      if (mode === "create") {
        await createAdminProduct(payload);
      } else {
        if (editingId == null) throw new Error("no editingId");
        await updateAdminProduct(editingId, payload);
      }

      await reload();
      startCreate();
    } catch {
      setErr(mode === "create" ? "상품 추가에 실패했습니다." : "상품 수정에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (id: number) => {
    setErr(null);
    try {
      await deleteAdminProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingId === id) startCreate();
    } catch {
      setErr("상품 삭제에 실패했습니다.");
    }
  };

  if (loading) return <div className="text-sm text-neutral-700">로딩 중...</div>;
  if (err) return <div className="text-sm text-red-600">{err}</div>;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
      {/* 상품 리스트 */}
      <div className="flex flex-col gap-3">
        {products.map((p) => (
          <div key={p.id} className="border border-neutral-200 bg-white">
            <ProductRow
              product={p as any} 
              imageUrl={p.imageId ? imageMap[p.imageId] : null}
            />

            <div className="flex items-center justify-end gap-2 p-3 pt-0">
              <ColorButton color="blue" onClick={() => startEdit(p)}>
                수정
              </ColorButton>
              <ColorButton color="red" onClick={() => onDelete(p.id)}>
                삭제
              </ColorButton>
            </div>
          </div>
        ))}
      </div>

      {/* 우측: 상품 추가/수정 */}
      <aside className="h-fit border border-neutral-200 bg-white p-4">
        <div className="text-base font-semibold">
          {mode === "create" ? "상품 추가" : "상품 수정"}
        </div>
        <p className="mt-1 text-xs text-neutral-600">
          {mode === "create" ? "새로운 상품을 추가합니다." : `ID=${editingId} 상품을 수정합니다.`}
        </p>

        <hr className="my-3 border-neutral-200" />

        <div className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">상품명</span>
            <input
              className="border border-neutral-200 px-3 py-2 text-sm"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">타입</span>
            <input
              className="border border-neutral-200 px-3 py-2 text-sm"
              value={form.type}
              onChange={(e) => setForm((v) => ({ ...v, type: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">가격</span>
            <input
              type="number"
              className="border border-neutral-200 px-3 py-2 text-sm"
              value={form.cost}
              onChange={(e) => setForm((v) => ({ ...v, cost: Number(e.target.value) }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">설명</span>
            <textarea
              className="border border-neutral-200 px-3 py-2 text-sm"
              rows={4}
              value={form.description}
              onChange={(e) => setForm((v) => ({ ...v, description: e.target.value }))}
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-neutral-600">이미지 파일</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            />
            <span className="text-xs text-neutral-500">
              파일을 선택하면 저장 후 imageId가 적용됩니다.
            </span>
          </label>
        </div>

        <hr className="my-3 border-neutral-200" />

        <div className="flex flex-col gap-2">
          <ColorButton
            color="green"
            fullWidth
            onClick={submit}
            disabled={submitting}
          >
            {mode === "create" ? "추가" : "수정 저장"}
          </ColorButton>

          {mode === "edit" && (
            <ColorButton color="blue" fullWidth onClick={startCreate} disabled={submitting}>
              추가 모드로
            </ColorButton>
          )}
        </div>
      </aside>
    </div>
  );
}
