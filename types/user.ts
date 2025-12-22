export type UserTotalRes = {
  userId: number;
  email: string;
  address: string;
  zipcode: number;
  totalSpent: number;
};

export type UserInfoUpdateReq = {
  // email은 화면에서 수정 불가지만,
  // 백엔드가 email을 요구한다면 함께 보내기 위해 포함(고정값으로만 사용)
  email?: string;
  address: string;
  zipcode: number;
};
