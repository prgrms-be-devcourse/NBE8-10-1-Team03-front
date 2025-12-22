"use client";

import * as React from "react";
import { ColorButton } from "@/components/ui/buttons/ColorButton";
import { fetchUserTotal, updateUserInfo } from "@/lib/api/users";
import type { UserTotalRes } from "@/types/user";

export default function UserTotalClient({ initialEmail }: { initialEmail: string }) {
  const [email, setEmail] = React.useState(initialEmail);
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const [user, setUser] = React.useState<UserTotalRes | null>(null);

  // 수정 폼 상태(✅ 기본값 세팅)
  const [address, setAddress] = React.useState("");
  const [zipcode, setZipcode] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [saveErr, setSaveErr] = React.useState<string | null>(null);
  const [savedMsg, setSavedMsg] = React.useState<string | null>(null);

  const load = async (targetEmail: string) => {
    const e = targetEmail.trim();
    if (!e) {
      setErr("이메일을 입력하세요.");
      return;
    }
    setErr(null);
    setSavedMsg(null);
    setLoading(true);
    try {
      const data = await fetchUserTotal(e);
      setUser(data);

      // ✅ 변경하지 않으면 기존 값을 보내야 하므로, 입력 기본값으로 세팅
      setAddress(data.address ?? "");
      setZipcode(String(data.zipcode ?? ""));
    } catch {
      setErr("유저 정보를 불러오지 못했습니다.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 초기 이메일이 쿼리로 왔다면 자동 로드
  React.useEffect(() => {
    if (initialEmail?.trim()) load(initialEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialEmail]);

  const save = async () => {
    if (!user) return;

    setSaveErr(null);
    setSavedMsg(null);

    const addr = address.trim();
    const zip = Number(zipcode);

    // ✅ "그대로 null로 바뀌는 문제" 방지: 빈 값 제출 막기(원하면 허용 가능)
    if (!addr) return setSaveErr("주소를 입력하세요.");
    if (!Number.isInteger(zip) || zip <= 0) return setSaveErr("우편번호를 올바르게 입력하세요.");

    setSaving(true);
    try {
      await updateUserInfo(user.email, { address: addr, zipcode: zip });

      // 화면도 즉시 반영
      setUser((prev) => (prev ? { ...prev, address: addr, zipcode: zip } : prev));
      setSavedMsg("변경이 저장되었습니다.");
    } catch {
      setSaveErr("정보 변경에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="border border-neutral-200 bg-white p-4">
      {/* 상단: 조회 */}
      <div className="flex flex-col gap-2">
        <div className="text-sm font-semibold text-neutral-900">유저 조회</div>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <input
              className="w-full border border-neutral-200 px-3 py-2 text-sm"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          <ColorButton color="blue" onClick={() => load(email)} disabled={loading}>
            조회
          </ColorButton>
        </div>

        {err && <div className="text-sm text-red-600">{err}</div>}
      </div>

      <hr className="my-4 border-neutral-200" />

      {/* 본문: 결과 */}
      {loading ? (
        <div className="text-sm text-neutral-700">불러오는 중...</div>
      ) : !user ? (
        <div className="text-sm text-neutral-600">조회 결과가 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {/* 요약 카드 */}
          <div className="border border-neutral-200 p-3">
            <div className="text-sm font-semibold">요약</div>
            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div className="text-sm">
                <div className="text-xs text-neutral-600">userId</div>
                <div className="font-medium">{user.userId}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-neutral-600">email</div>
                <div className="font-medium">{user.email}</div>
              </div>
              <div className="text-sm">
                <div className="text-xs text-neutral-600">총 소비금액</div>
                <div className="font-semibold">{user.totalSpent.toLocaleString()}원</div>
              </div>
            </div>
          </div>

          {/* 수정 폼 */}
          <div className="border border-neutral-200 p-3">
            <div className="text-sm font-semibold">배송 정보 수정</div>
            <div className="mt-1 text-xs text-neutral-600">
              email은 수정할 수 없습니다. 주소/우편번호만 변경 가능합니다.
            </div>

            <div className="mt-3 flex flex-col gap-3">
              <label className="flex flex-col gap-1">
                <span className="text-xs text-neutral-600">주소</span>
                <input
                  className="border border-neutral-200 px-3 py-2 text-sm"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="도로명/상세주소"
                  disabled={saving}
                />
              </label>

              <label className="flex flex-col gap-1">
                <span className="text-xs text-neutral-600">우편번호</span>
                <input
                  className="border border-neutral-200 px-3 py-2 text-sm"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  inputMode="numeric"
                  placeholder="00000"
                  disabled={saving}
                />
              </label>

              {saveErr && <div className="text-sm text-red-600">{saveErr}</div>}
              {savedMsg && <div className="text-sm text-green-700">{savedMsg}</div>}

              <div className="flex gap-2">
                <ColorButton color="green" onClick={save} disabled={saving}>
                  변경 저장
                </ColorButton>

                <ColorButton
                  color="black"
                  onClick={() => {
                    // ✅ 원복(기존값 유지)
                    setAddress(user.address ?? "");
                    setZipcode(String(user.zipcode ?? ""));
                    setSaveErr(null);
                    setSavedMsg(null);
                  }}
                  disabled={saving}
                >
                  원래 값으로 되돌리기
                </ColorButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
