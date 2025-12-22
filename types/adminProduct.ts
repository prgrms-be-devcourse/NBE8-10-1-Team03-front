export type AdminProduct = {
  id: number;
  name: string;
  type: string;
  cost: number;
  description: string;
  imageId: string | null;
  createdAt: string;  // LocalDateTime -> string
  updatedAt: string;
  adminId: number;
};

export type ProductInfoDto = {
  name: string;
  type: string;
  cost: number;
  description: string | null;
  imageId: string | null;
};
