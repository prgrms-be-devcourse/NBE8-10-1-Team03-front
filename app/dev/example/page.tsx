import { DemoPanel } from "@/components/examples/DemoPanel";

export default function Page() {
  return (
    <main className="min-h-dvh bg-neutral-50 p-6">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="text-2xl font-bold text-neutral-900">UI 컴포넌트 데모</h1>
        <p className="mt-2 text-sm text-neutral-700">
          입력/체크/버튼/메뉴/출력 블럭을 한 번에 확인하는 페이지
        </p>

        <div className="mt-6">
          <DemoPanel />
        </div>
      </div>
    </main>
  );
}