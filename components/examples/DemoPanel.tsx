"use client";

import * as React from "react";
import { TextInput } from "@/components/ui/inputs/TextInput";
import { PasswordInput } from "@/components/ui/inputs/PasswordInput";
import { CheckBox } from "@/components/ui/inputs/CheckBox";
import { ColorButton } from "@/components/ui/buttons/ColorButton";
import { MenuButton } from "@/components/ui/buttons/MenuButton";
import { OutputBlock } from "@/components/ui/display/OutputBlock";

export function DemoPanel() {
  // 서버로 보낼 값들이라고 생각하면 됨
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [agree, setAgree] = React.useState(false);

  const onSubmit = () => {
    // 실제로는 fetch로 서버 호출
    const payload = { username, password, agree };
    console.log("submit payload:", payload);
    alert(JSON.stringify(payload, null, 2));
  };

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Inputs */}
      <section className="flex flex-col gap-4 border border-neutral-200 bg-white p-4">
        <div className="text-base font-semibold">입력 컴포넌트</div>

        <TextInput
          name="username"
          label="유저명"
          placeholder="예: sleepyhoon"
          value={username}
          onChange={setUsername}
        />

        <PasswordInput
          name="password"
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={setPassword}
        />

        <CheckBox
          name="agree"
          label="약관에 동의합니다"
          checked={agree}
          onChange={setAgree}
        />
      </section>

      {/* Buttons */}
      <section className="flex flex-col gap-4 border border-neutral-200 bg-white p-4">
        <div className="text-base font-semibold">버튼 컴포넌트</div>

        <div className="flex flex-wrap gap-2">
          <ColorButton color="green" onClick={onSubmit}>
            초록 버튼(전송)
          </ColorButton>
          <ColorButton color="red" onClick={() => alert("취소")}>
            빨강 버튼
          </ColorButton>
          <ColorButton color="blue" onClick={() => alert("조회")}>
            파랑 버튼
          </ColorButton>
          <ColorButton color="black" onClick={() => alert("검은 버튼")}>
            검은 버튼
          </ColorButton>
          <ColorButton color="white" onClick={() => alert("흰 버튼")}>
            흰 버튼
          </ColorButton>
        </div>

        <div className="flex gap-2">
          <ColorButton color="green" size="sm">
            Small
          </ColorButton>
          <ColorButton color="blue" size="md">
            Medium
          </ColorButton>
          <ColorButton color="red" size="lg">
            Large
          </ColorButton>
          <ColorButton color="black" fullWidth onClick={() => alert("fullWidth")}>
            fullWidth
          </ColorButton>
        </div>

        <div className="flex items-center gap-2">
          <MenuButton label="메뉴 열기(오른쪽)" side="right">
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">메뉴</div>
              <button className="rounded border px-2 py-1 text-sm hover:bg-neutral-50">
                주문 내역
              </button>
              <button className="rounded border px-2 py-1 text-sm hover:bg-neutral-50">
                장바구니
              </button>
              <button className="rounded border px-2 py-1 text-sm hover:bg-neutral-50">
                설정
              </button>
            </div>
          </MenuButton>

          <MenuButton label="메뉴 열기(왼쪽)" side="left" panelWidthPx={280}>
            <div className="flex flex-col gap-2">
              <div className="text-sm font-semibold">필터</div>
              <div className="text-xs text-neutral-600">여기에 체크박스/토글/정렬 등을 넣으면 됨</div>
            </div>
          </MenuButton>
        </div>
      </section>

      {/* Output Blocks */}
      <section className="flex flex-col gap-3 border border-neutral-200 bg-white p-4">
        <div className="text-base font-semibold">출력 블럭</div>

        <div className="flex flex-col gap-2">
          <OutputBlock
            title="아메리카노 (ICE)"
            imageUrl="https://picsum.photos/200?1"
            body={"- 샷: 2\n- 시럽: 없음\n- 얼음: 보통\n\n메모: 덜 달게"}
            footer={<span>가격: 4,500원 · 픽업: 14:30</span>}
          />

          <OutputBlock
            title="카페라떼 (HOT)"
            body={"- 샷: 1\n- 우유: 저지방\n\n메모: 컵홀더 부탁"}
            footer={<span>가격: 5,000원 · 배달</span>}
          />
        </div>
      </section>
    </div>
  );
}
