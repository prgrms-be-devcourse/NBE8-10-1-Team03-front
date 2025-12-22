import { cn } from "@/lib/cn";

type OutputPageProps = {
  title: string;

  /** 사진 배열(없으면 섹션 자체가 제거됨) */
  imageUrls?: string[];

  /** 기타 정보(예: 주문 요약, 옵션, 결제 정보 등) */
  meta?: React.ReactNode;

  /** 본문(설명/가이드/영수증 텍스트 등) */
  body: React.ReactNode;

  /** 그 외(버튼, 링크, 추가 안내 등) */
  extra?: React.ReactNode;

  className?: string;
};

export function OutputPage({
  title,
  imageUrls,
  meta,
  body,
  extra,
  className,
}: OutputPageProps) {
  const hasImages = !!imageUrls && imageUrls.length > 0;

  return (
    <div className={cn("mx-auto w-full max-w-3xl bg-white p-6", className)}>
      <div className="text-xl font-bold text-neutral-900">{title}</div>
      <hr className="my-4 border-neutral-200" />

      {hasImages && (
        <>
          <div className="flex gap-3 overflow-x-auto">
            {imageUrls!.map((url, idx) => (
              <img
                key={url + idx}
                src={url}
                alt=""
                className="h-28 w-28 shrink-0 object-cover"
              />
            ))}
          </div>
          <hr className="my-4 border-neutral-200" />
        </>
      )}

      {meta && (
        <>
          <div className="text-sm text-neutral-800">{meta}</div>
          <hr className="my-4 border-neutral-200" />
        </>
      )}

      <div className="text-sm text-neutral-900">{body}</div>

      {extra && (
        <>
          <hr className="my-4 border-neutral-200" />
          <div className="text-sm text-neutral-800">{extra}</div>
        </>
      )}
    </div>
  );
}
