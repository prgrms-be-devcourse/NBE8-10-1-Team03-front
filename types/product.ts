export type Product = {
  id: number;
  name: string;
  type: string; // "coffee" 등
  cost: number;
  description: string;
  imageId?: number | null;
};

export type ApiResponse<T> = {
  data: T;
  message: string;
  status: "success" | "fail" | "error";
};
