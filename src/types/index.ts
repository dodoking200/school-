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

<<<<<<< HEAD
export type Teacher = User & {
  subjects: string[];
=======
export type Subject = {
  id: number;
  name: string;
>>>>>>> feature/subject-management-table
};

export type Question = {
  id: number;
  quizQuestion: string;
  choices: string[];
  correctAnswer: string;
  questionType: "multiple-choice" | "true-false";
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
export type Permission =
  | "view_users"
  | "edit_users"
  | "delete_users"
  | "view_roles"
  | "edit_roles"
  | "delete_roles";

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
  created_at: string;
  updated_at: string;
};
