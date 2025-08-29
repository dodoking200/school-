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

export type Semester = {
  id: number;
  start_date: string;
  end_date: string;
  academic_year_id: number;
  semester_name: string;
  created_at: string;
  updated_at: string;
};

export type Class = {
  id: number;
  class_name: string;
  floor_number: number;
  level_grade: number;
};

export type Student = {
  id: number;
  student_name: string; // Changed from 'name' to 'student_name' to match API response
  email: string;
  phone: string;
  birth_date: string;
  grade_level: number;
  class_name?: string;
  curriculum_grade?: string;
  student_created_at?: string;
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

export type UserAttendance = {
  user_id: number;
  user_name: string;
  status: AttendanceStatus;
  notes?: string;
};

export type TeacherAttendance = {
  teacher_id: number;
  teacher_name: string;
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

// Pagination types
export type PaginationRequest = {
  table: string;
  page: number;
  pageSize: number;
  orderBy: string;
  orderDirection: "asc" | "desc";
  filters?: {
    grade_level?: number;
    class_id?: number;
  };
};

export type PaginationResponse<T> = {
  page: number;
  pageSize: number;
  total: string;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  table: string;
  data: T[];
};

// Updated Student type to match API response
export type StudentFromAPI = {
  id: number;
  grade_level: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  class_name: string;
  curriculum_grade: string;
};

// New types for creating and updating students
export type StudentCreatePayload = {
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  class_id: number; // Backend expects integer
  grade_level: number; // Backend expects integer (9, 10, 11, 12) for validation
  discount_percentage: number; // Backend expects float
};

export type StudentUpdatePayload = Partial<StudentCreatePayload>;

// Behavior Types
export type BehaviorType =
  | "Exam Issues"
  | "Attendance Problems"
  | "Academic Integrity"
  | "Behavior Concerns"
  | "Social Skills"
  | "Work Habits"
  | "Practical Skills"
  | "Good Behavior";

export type Behavior = {
  id: number;
  student_id: number;
  description: string;
  date: string;
  type: BehaviorType;
  created_at?: string;
  updated_at?: string;
};

export type BehaviorCreatePayload = {
  student_id: number;
  description: string;
  type: BehaviorType;
};

// Exam Types
export type ExamQuestion = {
  question_id: number;
  mark: number;
};

export type ExamCreatePayload = {
  title: string;
  description: string;
  semester_id: number;
  subject_id: number;
  time_limit: number;
  total_mark: number;
  passing_mark: number;
  start_datetime: string;
  end_datetime: string;
  announced: boolean;
  exam_type: string;
  questions: ExamQuestion[];
};

// New types for upcoming quizzes and exams
export type UpcomingQuiz = {
  id: number;
  uuid: string;
  subject_id: number;
  semester_id: number;
  title: string;
  description: string;
  time_limit: number;
  total_mark: number;
  passing_mark: number;
  start_datetime: string;
  end_datetime: string;
  announced: boolean;
  subject_name: string;
  subject_resources: string;
  curriculum_id: number;
};

export type UpcomingExam = {
  id: number;
  uuid: string;
  subject_id: number;
  semester_id: number;
  title: string;
  description: string;
  time_limit: number;
  total_mark: number;
  passing_mark: number;
  start_datetime: string;
  end_datetime: string;
  announced: boolean;
  subject_name: string;
  subject_resources: string;
  curriculum_id: number;
};

// Exam type for the /exams/exams API response
export type Exam = {
  id: number;
  subject_id: number;
  semester_id: number;
  title: string;
  description: string;
  time_limit: number;
  total_mark: number;
  passing_mark: number;
  start_datetime: string;
  end_datetime: string;
  created_at: string;
  updated_at: string;
  announced: boolean;
  exam_type: string;
  uuid: string;
};
