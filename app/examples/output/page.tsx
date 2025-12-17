import { OutputPage } from "@/components/ui/display/OutputPage";
import { ColorButton } from "@/components/ui/buttons/ColorButton";

export default function OutputExamplePage() {
  return (
    <main className="min-h-dvh bg-neutral-50 p-6">
      <OutputPage
        title="주문 상세: 아메리카노 ICE"
        imageUrls={[
          "https://picsum.photos/200?coffee1",
          "https://picsum.photos/200?coffee2",
          "https://picsum.photos/200?coffee3",
        ]}
        meta={
          <div className="flex flex-col gap-1">
            <div>주문번호: #A-1024</div>
            <div>가격: 4,500원</div>
            <div>옵션: 샷 2, 얼음 보통</div>
          </div>
        }
        body={
          <div className="whitespace-pre-wrap">
            {"요청사항\n- 덜 달게\n- 빨대 1개\n\n매장 픽업 예정"}
          </div>
        }
        extra={
          <div className="flex gap-2">
            <ColorButton color="green">결제</ColorButton>
            <ColorButton color="red">취소</ColorButton>
          </div>
        }
      />
    </main>
  );
}
