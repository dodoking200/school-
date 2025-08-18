// src/types/index.ts
export type User = {
  id: number;
  name: string;
  email: string;
  role?: string;
  role_id?: string;
  phone: string;
  birth_date: string;
};

export type Teacher = User & {
  subjects: string[];
  subject_ids?: number[];
  specialization?: string;
  hire_date?: string;
  qualification?: string;
};

export type Subject = {
  id: number;
  name: string;
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

export type Class = {
  id: number;
  name: string;
  floor: number;
  grade: number;
};

export type ApiResponse<T> = {
  data: T;
  success: boolean;
};
export type Permission = string;

export type Role = {
  id: number;
  name: string;
  permissions: Permission[];
};
