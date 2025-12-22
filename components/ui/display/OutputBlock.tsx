import { cn } from "@/lib/cn";

type OutputBlockProps = {
  title: string;

  /** 본문(마크다운을 쓰고 싶다면 나중에 react-markdown으로 교체하기 좋은 위치) */
  body: string;

  /** 하단 기타 정보(예: 가격, 옵션, 태그 등) */
  footer?: React.ReactNode;

  /** 좌측 이미지 URL (없으면 텍스트 영역이 풀로 사용됨) */
  imageUrl?: string;

  className?: string;
};

export function OutputBlock({
  title,
  body,
  footer,
  imageUrl,
  className,
}: OutputBlockProps) {
  return (
    <div className={cn("w-full border border-neutral-200 bg-white p-4", className)}>
      <div className={cn("flex gap-4", !imageUrl && "gap-0")}>
        {imageUrl && (
          <div className="w-24 shrink-0">
            {/* next/image로 바꿔도 됨 */}
            <img
              src={imageUrl}
              alt=""
              className="h-24 w-24 object-cover"
            />
          </div>
        )}

        <div className="flex w-full flex-col">
          <div className="text-base font-semibold text-neutral-900">{title}</div>
          <hr className="my-2 border-neutral-200" />

          <div className="whitespace-pre-wrap text-sm text-neutral-800">
            {body}
          </div>

          <hr className="my-2 border-neutral-200" />

          <div className="text-xs text-neutral-700">
            {footer ?? <span className="text-neutral-400">-</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
