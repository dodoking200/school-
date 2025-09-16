// lib/permissionUtils.ts
import { Permission } from "@/types";
import { USER_PERMISSIONS, ROLE_PERMISSIONS } from "./constants";

/**
 * Utility functions for working with permissions in the frontend
 */

/**
 * Get all available permissions
 */
export const getAllPermissions = (): Permission[] => {
  return Object.values(USER_PERMISSIONS);
};

/**
 * Get permissions by category
 */
export const getPermissionsByCategory = () => {
  return {
    academic: [
      USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS,
      USER_PERMISSIONS.MANAGE_SUBJECTS,
      USER_PERMISSIONS.MANAGE_CLASSES,
      USER_PERMISSIONS.MANAGE_SCHEDULES,
    ],
    people: [
      USER_PERMISSIONS.MANAGE_STUDENTS,
      USER_PERMISSIONS.MANAGE_TEACHERS,
      USER_PERMISSIONS.MANAGE_USERS,
      USER_PERMISSIONS.MANAGE_ROLES,
    ],
    assessment: [
      USER_PERMISSIONS.MANAGE_EXAMS,
      USER_PERMISSIONS.TAKE_EXAMS,
      USER_PERMISSIONS.VIEW_EXAM_RESULTS,
      USER_PERMISSIONS.MANAGE_GRADES,
      USER_PERMISSIONS.MANAGE_QUESTIONS,
      USER_PERMISSIONS.VIEW_OWN_GRADES,
    ],
    attendance: [
      USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE,
      USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE,
      USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
    ],
    behavior: [
      USER_PERMISSIONS.MANAGE_BEHAVIORS,
      USER_PERMISSIONS.VIEW_OWN_BEHAVIORS,
    ],
    financial: [
      USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS,
      USER_PERMISSIONS.VIEW_PAYMENT_REPORTS,
    ],
    communication: [
      USER_PERMISSIONS.MANAGE_NOTIFICATIONS,
      USER_PERMISSIONS.VIEW_NOTIFICATIONS,
      USER_PERMISSIONS.MANAGE_FCM_TOKENS,
    ],
    dashboard: [
      USER_PERMISSIONS.VIEW_DASHBOARD,
      USER_PERMISSIONS.STUDENT_MOBILE_APP,
      USER_PERMISSIONS.ATTENDANCE_MOBILE_APP,
      USER_PERMISSIONS.EXPORT_DATA,
      USER_PERMISSIONS.MANAGE_PERMISSIONS,
      USER_PERMISSIONS.VIEW_OWN_SCHEDULE,
      USER_PERMISSIONS.VIEW_SYSTEM_MESSAGES,
    ],
  };
};

/**
 * Get human-readable permission names
 */
export const getPermissionDisplayName = (permission: Permission): string => {
  const displayNames: Record<string, string> = {
    [USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS]: "Manage Academic Years",
    [USER_PERMISSIONS.MANAGE_SUBJECTS]: "Manage Subjects",
    [USER_PERMISSIONS.MANAGE_CLASSES]: "Manage Classes",
    [USER_PERMISSIONS.MANAGE_SCHEDULES]: "Manage Schedules",
    [USER_PERMISSIONS.MANAGE_STUDENTS]: "Manage Students",
    [USER_PERMISSIONS.MANAGE_TEACHERS]: "Manage Teachers",
    [USER_PERMISSIONS.MANAGE_USERS]: "Manage Users",
    [USER_PERMISSIONS.MANAGE_ROLES]: "Manage Roles",
    [USER_PERMISSIONS.MANAGE_EXAMS]: "Manage Exams",
    [USER_PERMISSIONS.TAKE_EXAMS]: "Take Exams",
    [USER_PERMISSIONS.VIEW_EXAM_RESULTS]: "View Exam Results",
    [USER_PERMISSIONS.MANAGE_GRADES]: "Manage Grades",
    [USER_PERMISSIONS.MANAGE_QUESTIONS]: "Manage Questions",
    [USER_PERMISSIONS.VIEW_OWN_GRADES]: "View Own Grades",
    [USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE]: "Manage Student Attendance",
    [USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE]: "Manage Staff Attendance",
    [USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS]: "View Attendance Reports",
    [USER_PERMISSIONS.MANAGE_BEHAVIORS]: "Manage Behaviors",
    [USER_PERMISSIONS.VIEW_OWN_BEHAVIORS]: "View Own Behaviors",
    [USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS]: "Manage Tuition Payments",
    [USER_PERMISSIONS.VIEW_PAYMENT_REPORTS]: "View Payment Reports",
    [USER_PERMISSIONS.MANAGE_NOTIFICATIONS]: "Manage Notifications",
    [USER_PERMISSIONS.VIEW_NOTIFICATIONS]: "View Notifications",
    [USER_PERMISSIONS.MANAGE_FCM_TOKENS]: "Manage FCM Tokens",
    [USER_PERMISSIONS.VIEW_DASHBOARD]: "View Dashboard",
    [USER_PERMISSIONS.STUDENT_MOBILE_APP]: "Student Mobile App",
    [USER_PERMISSIONS.ATTENDANCE_MOBILE_APP]: "Attendance Mobile App",
    [USER_PERMISSIONS.EXPORT_DATA]: "Export Data",
    [USER_PERMISSIONS.MANAGE_PERMISSIONS]: "Manage Permissions",
    [USER_PERMISSIONS.VIEW_OWN_SCHEDULE]: "View Own Schedule",
    [USER_PERMISSIONS.VIEW_SYSTEM_MESSAGES]: "View System Messages",
  };

  return displayNames[permission] || permission;
};

/**
 * Get permission description
 */
export const getPermissionDescription = (permission: Permission): string => {
  const descriptions: Record<string, string> = {
    [USER_PERMISSIONS.MANAGE_ACADEMIC_YEARS]:
      "Create, update, and delete academic years",
    [USER_PERMISSIONS.MANAGE_SUBJECTS]: "Create, update, and delete subjects",
    [USER_PERMISSIONS.MANAGE_CLASSES]: "Create, update, and delete classes",
    [USER_PERMISSIONS.MANAGE_SCHEDULES]: "Create and manage class schedules",
    [USER_PERMISSIONS.MANAGE_STUDENTS]:
      "Create, update, and delete student records",
    [USER_PERMISSIONS.MANAGE_TEACHERS]:
      "Create, update, and delete teacher records",
    [USER_PERMISSIONS.MANAGE_USERS]: "Create, update, and delete user accounts",
    [USER_PERMISSIONS.MANAGE_ROLES]: "Create, update, and delete user roles",
    [USER_PERMISSIONS.MANAGE_EXAMS]: "Create, update, and delete exams",
    [USER_PERMISSIONS.TAKE_EXAMS]: "Access and take exams as a student",
    [USER_PERMISSIONS.VIEW_EXAM_RESULTS]: "View exam results and scores",
    [USER_PERMISSIONS.MANAGE_GRADES]: "Input and manage student grades",
    [USER_PERMISSIONS.MANAGE_QUESTIONS]: "Create and manage exam questions",
    [USER_PERMISSIONS.VIEW_OWN_GRADES]: "View personal academic grades",
    [USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE]:
      "Record and manage student attendance",
    [USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE]:
      "Record and manage staff attendance",
    [USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS]:
      "View attendance reports and analytics",
    [USER_PERMISSIONS.MANAGE_BEHAVIORS]:
      "Record and manage student behavior incidents",
    [USER_PERMISSIONS.VIEW_OWN_BEHAVIORS]: "View personal behavior records",
    [USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS]:
      "Process and manage tuition payments",
    [USER_PERMISSIONS.VIEW_PAYMENT_REPORTS]:
      "View payment reports and analytics",
    [USER_PERMISSIONS.MANAGE_NOTIFICATIONS]:
      "Create and manage system notifications",
    [USER_PERMISSIONS.VIEW_NOTIFICATIONS]: "View and receive notifications",
    [USER_PERMISSIONS.MANAGE_FCM_TOKENS]: "Manage push notification tokens",
    [USER_PERMISSIONS.VIEW_DASHBOARD]: "Access main dashboard",
    [USER_PERMISSIONS.STUDENT_MOBILE_APP]: "Access student mobile application",
    [USER_PERMISSIONS.ATTENDANCE_MOBILE_APP]:
      "Access attendance mobile application",
    [USER_PERMISSIONS.EXPORT_DATA]: "Export system data to files",
    [USER_PERMISSIONS.MANAGE_PERMISSIONS]: "Assign and manage user permissions",
    [USER_PERMISSIONS.VIEW_OWN_SCHEDULE]: "View personal class schedule",
    [USER_PERMISSIONS.VIEW_SYSTEM_MESSAGES]: "View system-wide messages",
  };

  return descriptions[permission] || "No description available";
};

/**
 * Get permission category
 */
export const getPermissionCategory = (permission: Permission): string => {
  const categories = getPermissionsByCategory();
  for (const [category, perms] of Object.entries(categories) as [
    string,
    Permission[]
  ][]) {
    if (perms.includes(permission)) {
      return category;
    }
  }
  return "unknown";
};

/**
 * Check if a permission is a management-level permission
 */
export const isManagementPermission = (permission: Permission): boolean => {
  return permission.startsWith("manage_");
};

/**
 * Check if a permission is a view-only permission
 */
export const isViewPermission = (permission: Permission): boolean => {
  return permission.startsWith("view_") || permission.startsWith("take_");
};

/**
 * Get permissions required for a specific feature/page
 */
export const getFeaturePermissions = (feature: string): Permission[] => {
  const featurePermissions: Record<string, Permission[]> = {
    students: [USER_PERMISSIONS.MANAGE_STUDENTS],
    teachers: [USER_PERMISSIONS.MANAGE_TEACHERS],
    classes: [USER_PERMISSIONS.MANAGE_CLASSES],
    subjects: [USER_PERMISSIONS.MANAGE_SUBJECTS],
    exams: [USER_PERMISSIONS.MANAGE_EXAMS, USER_PERMISSIONS.TAKE_EXAMS],
    grades: [USER_PERMISSIONS.MANAGE_GRADES, USER_PERMISSIONS.VIEW_OWN_GRADES],
    attendance: [
      USER_PERMISSIONS.MANAGE_STUDENT_ATTENDANCE,
      USER_PERMISSIONS.MANAGE_STAFF_ATTENDANCE,
      USER_PERMISSIONS.VIEW_ATTENDANCE_REPORTS,
    ],
    behaviors: [
      USER_PERMISSIONS.MANAGE_BEHAVIORS,
      USER_PERMISSIONS.VIEW_OWN_BEHAVIORS,
    ],
    payments: [
      USER_PERMISSIONS.MANAGE_TUITION_PAYMENTS,
      USER_PERMISSIONS.VIEW_PAYMENT_REPORTS,
    ],
    dashboard: [USER_PERMISSIONS.VIEW_DASHBOARD],
    settings: [
      USER_PERMISSIONS.MANAGE_PERMISSIONS,
      USER_PERMISSIONS.MANAGE_ROLES,
    ],
  };

  return featurePermissions[feature] || [];
};

/**
 * Get default permissions for a role
 */
export const getRoleDefaultPermissions = (roleName: string): Permission[] => {
  const roleKey = roleName.toUpperCase() as keyof typeof ROLE_PERMISSIONS;
  // Convert readonly Permission[] to mutable array
  return ROLE_PERMISSIONS[roleKey] ? Array.from(ROLE_PERMISSIONS[roleKey]) : [];
};

/**
 * Check if user has sufficient permissions for a feature
 */
export const hasFeatureAccess = (
  userPermissions: Permission[],
  feature: string,
  requireAll: boolean = false
): boolean => {
  const featurePerms = getFeaturePermissions(feature);

  if (featurePerms.length === 0) return true;

  if (requireAll) {
    return featurePerms.every((permission) =>
      userPermissions.includes(permission)
    );
  } else {
    return featurePerms.some((permission) =>
      userPermissions.includes(permission)
    );
  }
};

export default {
  getAllPermissions,
  getPermissionsByCategory,
  getPermissionDisplayName,
  getPermissionDescription,
  getPermissionCategory,
  isManagementPermission,
  isViewPermission,
  getFeaturePermissions,
  getRoleDefaultPermissions,
  hasFeatureAccess,
};
