"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ColorButton } from "@/components/ui/buttons/ColorButton";
import { apiFetch } from "@/lib/apiClient";
import { clearAccessToken, getAccessToken, setAccessToken } from "@/lib/auth";

export default function HeaderShell() {
  const [open, setOpen] = useState(false);

  const [token, setToken] = useState<string | null>(null);
  const authed = !!token;

  useEffect(() => {
    setToken(getAccessToken());
  }, []);

  return (
    <>
      {/* Top bar */}
      <header className="fixed left-0 top-0 z-40 w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="text-sm font-semibold tracking-tight">Grids & Circles</div>

          <button
            onClick={() => setOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-md border border-neutral-200 hover:bg-neutral-50"
            aria-label="menu"
          >
            <div className="flex flex-col gap-1">
              <span className="block h-[2px] w-4 bg-neutral-800" />
              <span className="block h-[2px] w-4 bg-neutral-800" />
              <span className="block h-[2px] w-4 bg-neutral-800" />
            </div>
          </button>
        </div>
      </header>

      {/* Drawer */}
      {open && (
        <Drawer
          onClose={() => setOpen(false)}
          authed={authed}
          token={token}
          setToken={(t) => setToken(t)}
        />
      )}
    </>
  );
}

function Drawer({
  onClose,
  authed,
  setToken,
}: {
  onClose: () => void;
  authed: boolean;
  token: string | null;
  setToken: (t: string | null) => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminId, setAdminId] = useState("");
  const [adminPw, setAdminPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const menus = useMemo(() => {
    const base = [
      { href: "/orders", label: "상품 주문" },
      { href: "/user/total", label: "유저 조회" },
    ];

    if (authed) {
      base.push(
        { href: "/admin/orders", label: "주문 관리" },
        { href: "/admin/products", label: "물품 관리" },
        { href: "/admin/users", label: "유저 관리(미구현)" }
      );
    }
    return base;
  }, [authed]);

  const login = async () => {
    setLoading(true);
    setErr(null);

    try {
      // 서버 로그인 엔드포인트는 프로젝트에 맞춰 바꾸세요.
      // 예: POST /admin/login
      const accessToken = await apiFetch<string>("/admin/login", {
        method: "POST",
        body: JSON.stringify({ id: adminId, password: adminPw }),
      });

      setAccessToken(accessToken);
      setToken(accessToken);
      setAdminPw("");
    } catch (e: any) {
      setErr(e?.message ?? "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearAccessToken();
    setToken(null);
    onClose();
    // 관리자 페이지에 있으면 공개 페이지로 보내기
    if (pathname.startsWith("/admin")) router.push("/orders");
  };

  const go = (href: string) => {
    router.push(href);
    onClose();
  };

  return (
    <>
      {/* overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* panel */}
      <aside className="fixed right-0 top-0 z-50 h-dvh w-[340px] border-l border-neutral-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">메뉴</div>
          <button
            onClick={onClose}
            className="rounded-md border border-neutral-200 px-2 py-1 text-sm hover:bg-neutral-50"
          >
            닫기
          </button>
        </div>

        {/* Admin auth block */}
        <div className="mt-4 rounded-md border border-neutral-200 bg-neutral-50 p-3">
          {!authed ? (
            <>
              <div className="text-sm font-medium text-neutral-900">관리자 로그인</div>

              <div className="mt-3 flex flex-col gap-2">
                <input
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin id"
                  className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                />
                <input
                  value={adminPw}
                  onChange={(e) => setAdminPw(e.target.value)}
                  placeholder="password"
                  type="password"
                  className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm outline-none focus:border-neutral-400"
                />

                {err && <div className="text-xs text-red-600">{err}</div>}

                <ColorButton
                  color="black"
                  disabled={loading || !adminId || !adminPw}
                  onClick={login}
                >
                  {loading ? "로그인 중..." : "로그인"}
                </ColorButton>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-medium text-neutral-900">환영합니다. 관리자님</div>
              <ColorButton color="red" onClick={logout}>
                로그아웃
              </ColorButton>
            </div>
          )}
        </div>

        {/* Menu list */}
        <div className="mt-4 flex flex-col gap-2">
          {menus.map((m) => (
            <button
              key={m.href}
              onClick={() => go(m.href)}
              className="flex w-full items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-3 text-left text-sm hover:bg-neutral-50"
            >
              <span className="font-medium">{m.label}</span>
              <span className="text-xs text-neutral-500">{m.href}</span>
            </button>
          ))}
        </div>


      </aside>
    </>
  );
}
