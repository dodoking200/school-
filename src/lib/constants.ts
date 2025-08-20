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
    GET_ALL: "students",
    CREATE: "students",
    GET_BY_ID: (id: number) => `students/${id}`,
    GET_BY_CLASS: (classId: number) => `students/class/${classId}`,
  },

  ATTENDANCE: {
    GET_BY_STUDENT: (studentId: number) =>
      `attendance_students/student/${studentId}`,
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
  },

  TEACHER: {
    SCHEDULE: "teachers/subjects",
    GET_QUESTIONS: "teachers/questions",
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
  },
};
