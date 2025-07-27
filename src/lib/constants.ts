/**
 * API endpoints used throughout the application
 */
export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    SIGNIN: 'users/signin',
    SIGNUP: 'users/signup',
    SIGNOUT: 'users/signout',
    RESET_PASSWORD: 'users/reset-password',
  },
  
  // User endpoints
  USERS: {
    PROFILE: 'users/profile',
    UPDATE_PROFILE: 'users/profile/update',
  },
  
  // Student endpoints
  STUDENTS: {
    GET_ALL: 'students',
    GET_BY_ID: (id: number) => `students/${id}`,
    COURSES: (id: number) => `students/${id}/courses`,
  },
  
  // Teacher endpoints
  TEACHERS: {
    GET_ALL: 'teachers',
    GET_BY_ID: (id: number) => `teachers/${id}`,
    COURSES: (id: number) => `teachers/${id}/courses`,
  },
};