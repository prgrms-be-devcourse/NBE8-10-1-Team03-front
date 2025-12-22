import UserTotalClient from "./userTotalClient";

type PageProps = {
  searchParams: Promise<{ email?: string }>;
};

export default async function Page({ searchParams }: PageProps) {
  const sp = await searchParams;
  const email = sp?.email ?? "";

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="text-xl font-semibold">유저 정보</div>
      <div className="mt-1 text-sm text-neutral-600">
        이메일로 유저의 총 소비금액과 배송지 정보를 확인/수정합니다.
      </div>

      <div className="mt-6">
        <UserTotalClient initialEmail={email} />
      </div>
    </div>
  );
}