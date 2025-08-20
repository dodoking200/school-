// src/types/index.ts
export type Subject = {
  id: number;
  name: string;
  grade?: string;
};

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
  subjects?: Subject[];
  specialization?: string;
  hire_date?: string;
  qualification?: string;
};

export type TeacherCreatePayload = {
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  specialization: string;
  hire_date: string;
  qualification: string;
  subject_ids: number[];
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
  start_year: string;
  end_year: string;
  full_tuition: number;
};

export type AcademicYearCreatePayload = {
  start_year: string;
  end_year: string;
  full_tuition: number;
};

export type Class = {
  id: number;
  name: string;
  floor: number;
  grade: number;
};

export type Student = {
  id: number;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  class_id: number;
  class_name?: string;
  attendance?: {
    present: number;
    absent: number;
    late: number;
    excused: number;
    total: number;
  };
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

export type Schedule = {
  id: number;
  class_id: number;
  day_id: number;
  period_id: number;
  subject_id: number;
  teacher_id: number;
  day_name?: string;
  period_time?: string;
  subject_name?: string;
  teacher_name?: string;
};

export type ScheduleCreatePayload = {
  class_id: number;
  day_id: number;
  period_id: number;
  subject_id: number;
  teacher_id: number;
};

export type Day = {
  id: number;
  name: string;
};

export type Period = {
  id: number;
  start_time: string;
  end_time: string;
};
