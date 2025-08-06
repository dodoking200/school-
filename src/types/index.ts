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

export type AcademicYear = {
  id: number;
  name: string;
  tuition_fee: number;
  created_at: string;
  updated_at: string;
};
export type ApiResponse<T> = {
  data: T;
  success: boolean;
};
import { AllPermissions } from "@/lib/permissions";

export type Permission = (typeof AllPermissions)[number];

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
};
