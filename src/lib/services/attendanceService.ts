import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";
import {
  ClassAttendance,
  StudentAttendance,
  AttendanceSummary,
} from "@/types";

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  created_at?: string;
  updated_at?: string;
}

export const attendanceService = {
  // Mock data for demo purposes
  mockAttendanceData: new Map<string, ClassAttendance>(),

  async getAttendanceByStudentId(
    studentId: number
  ): Promise<any[]> {
    // Return mock data for demo
    return [
      {
        id: 1,
        student_id: studentId,
        date: "2025-01-20",
        status: "present",
        created_at: "2025-01-20T08:00:00Z",
        updated_at: "2025-01-20T08:00:00Z"
      },
      {
        id: 2,
        student_id: studentId,
        date: "2025-01-21",
        status: "absent",
        created_at: "2025-01-21T08:00:00Z",
        updated_at: "2025-01-21T08:00:00Z"
      },
      {
        id: 3,
        student_id: studentId,
        date: "2025-01-22",
        status: "present",
        created_at: "2025-01-22T08:00:00Z",
        updated_at: "2025-01-22T08:00:00Z"
      }
    ];
  },

  async getAttendanceByClass(
    classId: number
  ): Promise<ClassAttendance | null> {
    // Return mock data for demo
    const key = `${classId}`;
    return this.mockAttendanceData.get(key) || null;
  },

  async createClassAttendance(
    attendanceData: Omit<ClassAttendance, "id" | "created_at" | "updated_at">
  ): Promise<ClassAttendance> {
    // Store in mock data for demo
    const mockAttendance: ClassAttendance = {
      ...attendanceData,
      id: Math.floor(Math.random() * 1000),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const key = `${attendanceData.class_id}`;
    this.mockAttendanceData.set(key, mockAttendance);
    
    return mockAttendance;
  },

  async updateClassAttendance(
    id: number,
    attendanceData: Partial<ClassAttendance>
  ): Promise<ClassAttendance> {
    // Update mock data for demo
    const key = `${attendanceData.class_id}`;
    const existing = this.mockAttendanceData.get(key);
    if (!existing) {
      throw new Error("Attendance record not found");
    }
    
    const updatedAttendance: ClassAttendance = {
      ...existing,
      ...attendanceData,
      updated_at: new Date().toISOString()
    };
    
    this.mockAttendanceData.set(key, updatedAttendance);
    return updatedAttendance;
  },

  async getClassAttendanceHistory(classId: number): Promise<ClassAttendance[]> {
    // Return mock data for demo
    const key = `${classId}`;
    const attendance = this.mockAttendanceData.get(key);
    return attendance ? [attendance] : [];
  },

  // Helper function to calculate attendance summary
  calculateAttendanceSummary(students: StudentAttendance[]): AttendanceSummary {
    const total = students.length;
    const present = students.filter((s) => s.status === "present").length;
    const absent = students.filter((s) => s.status === "absent").length;
    const late = students.filter((s) => s.status === "late").length;
    const excused = students.filter((s) => s.status === "excused").length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      total_students: total,
      present,
      absent,
      late,
      excused,
      attendance_percentage: percentage,
    };
  },
};
