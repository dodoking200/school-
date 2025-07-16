// src/types/index.ts
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string;
  birth_date: string;
  created_at: string;
  updated_at: string;
};
export type ApiResponse<T> = {
  data: T;
  success: boolean;
};
