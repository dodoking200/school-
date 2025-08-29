/**
 * API endpoints used throughout the application
 */
export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: "users/signin",
    SIGNOUT: "users/signout",
    RESET_PASSWORD: "",
  },

  USERS: {
    CREATE: "users",
    GET_ALL: "users/employees",
    DELETE: (id: number) => `users/${id}`,
    UPDATE: (id: number) => `users/${id}`,
  },

  STUDENTS: {
    PAGINATE: "pagination",
    GET_ALL: "students",
    CREATE: "students",
    UPDATE: (id: number) => `students/${id}`,
    GET_BY_ID: (id: number) => `students/${id}`,
    GET_BY_CLASS: (classId: number) => `students/class/${classId}`,
    SCHEDULE: "students/schedule",
    SEARCH_ADVANCED: "students/search/advanced", // POST endpoint
  },

  ATTENDANCE: {
    CREATE_ATTENDANCE: "attendance_students",
    GET_BY_STUDENT: (studentId: number) =>
      `attendance_students/student/${studentId}`,
    // Use the existing endpoints that are actually implemented
    GET_BY_CLASS: (classId: number) => `attendance_students/class/${classId}`,
    CREATE_CLASS_ATTENDANCE: "attendance_students/class",
    UPDATE_CLASS_ATTENDANCE: (id: number) => `attendance_students/class/${id}`,
    GET_CLASS_ATTENDANCE_HISTORY: (classId: number) =>
      `attendance_students/class/${classId}`,
    // New endpoint for getting attendance with date and student list
    GET_ATTENDANCE_BY_DATE: "attendance_students",
    // New endpoints for user and teacher attendance
    CREATE_USER_ATTENDANCE: "attendance_employees",
    CREATE_TEACHER_ATTENDANCE: "attendance_teachers",
  },

  SCHEDULES: {
    GET_ALL: "schedules",
    GET_BY_CLASS: (classId: number) => `schedules/class/${classId}`,
    CREATE: "schedules",
    UPDATE: (id: number) => `schedules/${id}`,
    DELETE: (id: number) => `schedules/${id}`,
  },

  DAYS: {
    GET_ALL: "days",
  },

  PERIODS: {
    GET_ALL: "periods",
  },

  BEHAVIOR: {
    CREATE: "behaviors",
  },

  TEACHERS: {
    GET_ALL: "teachers",
    GET_BY_ID: (id: number) => `teachers/${id}`,
    COURSES: (id: number) => `teachers/${id}/courses`,
    CREATE: "teachers",
    UPDATE: (id: number) => `teachers/${id}`,
    DELETE: (id: number) => `teachers/${id}`,
  },

  STUDENT: {
    SCHEDULE: "students/schedule",
    MARKS: "students/scorecard",
    UPCOMING_QUIZZES: "exams/student-nextquizzes",
    UPCOMING_EXAMS: "exams/student-nextexams",
  },

  TEACHER: {
    SCHEDULE: "teachers/schedule",
    GET_QUESTIONS: "teachers/questions",
    CREATE_QUESTION: "questions",
    CREATE_EXAM: "exams",
    UPDATE_QUESTION: (id: number) => `questions/${id}`,
    DELETE_QUESTION: (id: number) => `questions/${id}`,
    GET_STUDENTS: "teachers/students",
  },

  ROLES: {
    GET_ALL: "roles",
    GET_ALL_EMP: "roles/employees",
    CREATE: "roles",
    UPDATE_PERMISSIONS: "roles/update-role",
    GET_ROLE_PERMISSIONS: (id: number) => `roles/${id}/permissions`,
    DELETE: (id: number) => `roles/${id}`,
    UPDATE: (id: number) => `roles/${id}`,
  },
  SUBJECTS: {
    LIST: "subjects/list",
    GET_ALL: "subjects",
    CREATE: "subjects",
    UPDATE: (id: number) => `subjects/${id}`,
    DELETE: (id: number) => `subjects/${id}`,
  },
  PERMISSIONS: {
    GET_ALL: "permissions",
  },
  ACADEMIC_YEARS: {
    GET_ALL: "academic_years",
    CREATE: "academic_years",

    UPDATE: (id: number) => `academic_years/${id}`,
    DELETE: (id: number) => `academic_years/${id}`,
  },

  CLASS_ROOMS: {
    GET_ALL: "classes",
    CREATE: "classes",
    UPDATE: (id: number) => `classes/${id}`,
    DELETE: (id: number) => `classes/${id}`,
    CAN_DELETE: (id: number) => `classes/${id}/can-delete`,
  },

  PAGINATION: {
    STUDENTS: "pagination",
  },

  TUITION_PAYMENTS: {
    CREATE: "tuition-payments",
    GET_ALL: "tuition-payments",
    GET_BY_ID: (id: number) => `tuition-payments/${id}`,
    UPDATE: (id: number) => `tuition-payments/${id}`,
    DELETE: (id: number) => `tuition-payments/${id}`,
    VERIFY: (id: number) => `tuition-payments/${id}/verify`,
    GET_STUDENT_PAYMENTS: (studentId: number) =>
      `tuition-payments/student/${studentId}`,
    GET_STUDENT_BALANCE: (studentId: number) =>
      `tuition-payments/student/${studentId}/balance`,
    GET_STUDENT_PAYMENT_TOTAL: (studentId: number) =>
      `tuition-payments/student/${studentId}/total`,
    GET_OUTSTANDING: "tuition-payments/outstanding",
    GET_STATS: "tuition-payments/stats",
    GET_BY_DATE_RANGE: "tuition-payments/date-range",
    BULK_CREATE: "tuition-payments/bulk",
  },
};
