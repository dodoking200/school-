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

// New types for the questions API response
export type QuestionOption = {
  option_id: number;
  option_text: string;
  is_correct: boolean;
};

export type QuestionItem = {
  question_id: number;
  question_text: string;
  type: string;
  options: QuestionOption[];
};

export type SubjectQuestions = {
  subject_id: number;
  subject_name: string;
  questions: QuestionItem[];
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
  class_name: string;
  floor_number: number;
  level_grade: number;
};

export type Student = {
  id: number;
  student_name: string;
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
  attendance_percentage?: number;
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

export type TeacherScheduleSubject = {
  start_time: string;
  end_time: string;
  subject_name: string;
};

export type TeacherScheduleDay = {
  name: string;
  subjects: TeacherScheduleSubject[];
};

// Student Marks Types
export type Assignment = {
  score: number;
  min_score: number;
  max_score: number;
  percentage: number;
};

export type GradeType = {
  type: string;
  assignments: Assignment[];
  typeAverage: number;
  assignment_count: number;
  typeTotal: number;
};

export type SubjectMarks = {
  subject_id: number;
  subject_name: string;
  grade_types: GradeType[];
  subjectAverage: number;
  totalAssignments: number;
  totalScore: number;
};

export type SemesterMarks = {
  semester_id: number;
  semester_name: string;
  subjects: SubjectMarks[];
  semesterAverage: number;
  totalSemesterAssignments: number;
  totalSemesterScore: number;
};

// Attendance Types
export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export type StudentAttendance = {
  student_id: number;
  student_name: string;
  status: AttendanceStatus;
  notes?: string;
};

export type ClassAttendance = {
  id?: number;
  class_id: number;
  class_name: string;
  date: string;
  students: StudentAttendance[];
  created_at?: string;
  updated_at?: string;
};

export type AttendanceSummary = {
  total_students: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_percentage: number;
};
