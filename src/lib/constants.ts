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
    GET_PROFILE: "users/current-user",
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

  SEMESTERS: {
    GET_ALL: "semesters",
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
    INPUT_MARKS: "teachers/input-marks",
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

  // ================================================================
  // DASHBOARD AND ANALYTICS
  // ================================================================
  DASHBOARD: {
    STATS: "dashboard/stats",
    BASIC_STATS: "dashboard/stats/basic",
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

  GRADES: {
    CREATE: "grades",
    GET_ALL: "grades",
    GET_BY_ID: (id: number) => `grades/${id}`,
    UPDATE: (id: number) => `grades/${id}`,
    DELETE: (id: number) => `grades/${id}`,
    GET_BY_STUDENT: (studentId: number) => `grades/student/${studentId}`,
  },
};

/**
 * Frontend Permission Constants - Matching Backend Permission System
 * Total: 31 permissions organized by category
 */
export const USER_PERMISSIONS = {
  // ================================================================
  // CORE ACADEMIC MANAGEMENT (4 permissions)
  // ================================================================
  MANAGE_ACADEMIC_YEARS: 'manage_academic_years',
  MANAGE_SUBJECTS: 'manage_subjects',
  MANAGE_CLASSES: 'manage_classes',
  MANAGE_SCHEDULES: 'manage_schedules',

  // ================================================================
  // PEOPLE MANAGEMENT (4 permissions)
  // ================================================================
  MANAGE_STUDENTS: 'manage_students',
  MANAGE_TEACHERS: 'manage_teachers',
  MANAGE_USERS: 'manage_users',
  MANAGE_ROLES: 'manage_roles',

  // ================================================================
  // ASSESSMENT SYSTEM (6 permissions)
  // ================================================================
  MANAGE_EXAMS: 'manage_exams',
  TAKE_EXAMS: 'take_exams',
  VIEW_EXAM_RESULTS: 'view_exam_results',
  MANAGE_GRADES: 'manage_grades',
  MANAGE_QUESTIONS: 'manage_questions',
  VIEW_OWN_GRADES: 'view_own_grades',

  // ================================================================
  // ATTENDANCE SYSTEM (3 permissions)
  // ================================================================
  MANAGE_STUDENT_ATTENDANCE: 'manage_student_attendance',
  MANAGE_STAFF_ATTENDANCE: 'manage_staff_attendance',
  VIEW_ATTENDANCE_REPORTS: 'view_attendance_reports',

  // ================================================================
  // BEHAVIOR SYSTEM (2 permissions)
  // ================================================================
  MANAGE_BEHAVIORS: 'manage_behaviors',
  VIEW_OWN_BEHAVIORS: 'view_own_behaviors',

  // ================================================================
  // FINANCIAL SYSTEM (2 permissions)
  // ================================================================
  MANAGE_TUITION_PAYMENTS: 'manage_tuition_payments',
  VIEW_PAYMENT_REPORTS: 'view_payment_reports',

  // ================================================================
  // COMMUNICATION SYSTEM (3 permissions)
  // ================================================================
  MANAGE_NOTIFICATIONS: 'manage_notifications',
  VIEW_NOTIFICATIONS: 'view_notifications',
  MANAGE_FCM_TOKENS: 'manage_fcm_tokens',

  // ================================================================
  // DASHBOARD AND ACCESS (7 permissions)
  // ================================================================
  VIEW_DASHBOARD: 'view_dashboard',
  STUDENT_MOBILE_APP: 'student_mobile_app',
  ATTENDANCE_MOBILE_APP: 'attendance_mobile_app',
  EXPORT_DATA: 'export_data',
  MANAGE_PERMISSIONS: 'manage_permissions',
  VIEW_OWN_SCHEDULE: 'view_own_schedule',
  VIEW_SYSTEM_MESSAGES: 'view_system_messages',
} as const;

/**
 * Role-based permission sets for easy management
 */
export const ROLE_PERMISSIONS = {
  STUDENT: [
    USER_PERMISSIONS.STUDENT_MOBILE_APP,
    USER_PERMISSIONS.TAKE_EXAMS,
    USER_PERMISSIONS.VIEW_EXAM_RESULTS,
    USER_PERMISSIONS.VIEW_OWN_BEHAVIORS,
    USER_PERMISSIONS.VIEW_NOTIFICATIONS,
    USER_PERMISSIONS.MANAGE_FCM_TOKENS,
    USER_PERMISSIONS.VIEW_OWN_GRADES,
    USER_PERMISSIONS.VIEW_OWN_SCHEDULE,
  ],
  TEACHER: [
    USER_PERMISSIONS.MANAGE_STUDENTS,
    USER_PERMISSIONS.MANAGE_EXAMS,
    USER_PERMISSIONS.VIEW_EXAM_RESULTS,
    USER_PERMISSIONS.MANAGE_GRADES,
    USER_PERMISSIONS.MANAGE_QUESTIONS,
    USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE,
    USER_PERMISSIONS.MANAGE_BEHAVIORS,
    USER_PERMISSIONS.MANAGE_SCHEDULES,
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.ATTENDANCE_MOBILE_APP,
    USER_PERMISSIONS.VIEW_NOTIFICATIONS,
    USER_PERMISSIONS.MANAGE_FCM_TOKENS,
    USER_PERMISSIONS.VIEW_OWN_SCHEDULE,
  ],
  MANAGER: [
    USER_PERMISSIONS.MANAGE_STUDENTS,
    USER_PERMISSIONS.MANAGE_TEACHERS,
    USER_PERMISSIONS.MANAGE_CLASSES,
    USER_PERMISSIONS.MANAGE_SUBJECTS,
    USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS,
    USER_PERMISSIONS.MANAGE_SCHEDULES,
    USER_PERMISSIONS.VIEW_EXAM_RESULTS,
    USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
    USER_PERMISSIONS.MANAGE_BEHAVIORS,
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.EXPORT_DATA,
    USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE,
  ],
  ACCOUNTANT: [
    USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS,
    USER_PERMISSIONS.VIEW_PAYMENT_REPORTS,
    USER_PERMISSIONS.VIEW_DASHBOARD,
    USER_PERMISSIONS.EXPORT_DATA,
  ],
  ADMIN: [
    // Admin has all permissions
    ...Object.values(USER_PERMISSIONS),
  ],
} as const;
