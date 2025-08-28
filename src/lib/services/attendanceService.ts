import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";
import { ClassAttendance, StudentAttendance, AttendanceSummary } from "@/types";

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  created_at?: string;
  updated_at?: string;
}

export const attendanceService = {
  // Create attendance using the real API endpoint
  async createAttendance(
    date: string,
    attendance: Array<{
      student_id: number;
      status: "present" | "absent" | "late" | "excused";
    }>
  ): Promise<{ id?: number; created_at?: string; updated_at?: string }> {
    try {
      const response = await apiClient(
        API_ENDPOINTS.ATTENDANCE.CREATE_ATTENDANCE,
        {
          method: "POST",
          body: JSON.stringify({
            date,
            attendance,
          }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create attendance:", error);
      throw error;
    }
  },

  // Get attendance by student ID
  async getAttendanceByStudentId(studentId: number): Promise<
    Array<{
      id: number;
      student_id: number;
      date: string;
      status: "present" | "absent" | "late" | "excused";
      created_at?: string;
      updated_at?: string;
    }>
  > {
    try {
      const response = await apiClient(
        API_ENDPOINTS.ATTENDANCE.GET_BY_STUDENT(studentId),
        {
          method: "GET",
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch attendance by student ID:", error);
      return [];
    }
  },

  // Get attendance by class
  async getAttendanceByClass(classId: number): Promise<ClassAttendance | null> {
    try {
      const response = await apiClient(
        API_ENDPOINTS.ATTENDANCE.GET_BY_CLASS(classId),
        {
          method: "GET",
        }
      );
      return response.data || null;
    } catch (error) {
      console.error("Failed to fetch attendance by class:", error);
      return null;
    }
  },

  // Create class attendance (legacy method - now uses real API)
  async createClassAttendance(
    attendanceData: Omit<ClassAttendance, "id" | "created_at" | "updated_at">
  ): Promise<ClassAttendance> {
    try {
      // Extract the attendance array from the class attendance data
      const attendanceArray = attendanceData.students.map((student) => ({
        student_id: student.student_id,
        status: student.status,
      }));

      // Use the new createAttendance method
      const result = await this.createAttendance(
        attendanceData.date,
        attendanceArray
      );

      // Return the result in the expected format
      return {
        class_id: attendanceData.class_id,
        class_name: attendanceData.class_name,
        date: attendanceData.date,
        students: attendanceData.students,
        id: result.id || Math.floor(Math.random() * 1000),
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
      };
    } catch (error) {
      console.error("Failed to create class attendance:", error);
      throw error;
    }
  },

  // Update class attendance
  async updateClassAttendance(
    id: number,
    attendanceData: Partial<ClassAttendance>
  ): Promise<ClassAttendance> {
    try {
      // For updates, we'll create new attendance records
      if (attendanceData.students && attendanceData.date) {
        const attendanceArray = attendanceData.students.map((student) => ({
          student_id: student.student_id,
          status: student.status,
        }));

        const result = await this.createAttendance(
          attendanceData.date,
          attendanceArray
        );

        return {
          class_id: attendanceData.class_id,
          class_name: attendanceData.class_name,
          date: attendanceData.date,
          students: attendanceData.students,
          id: result.id || id,
          created_at: result.created_at || new Date().toISOString(),
          updated_at: result.updated_at || new Date().toISOString(),
        };
      }

      throw new Error("Invalid attendance data for update");
    } catch (error) {
      console.error("Failed to update class attendance:", error);
      throw error;
    }
  },

  // Get class attendance history
  async getClassAttendanceHistory(classId: number): Promise<ClassAttendance[]> {
    try {
      const response = await apiClient(
        API_ENDPOINTS.ATTENDANCE.GET_CLASS_ATTENDANCE_HISTORY(classId),
        {
          method: "GET",
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Failed to fetch class attendance history:", error);
      return [];
    }
  },

  // Create user attendance
  async createUserAttendance(
    date: string,
    attendance: Array<{
      user_id: number;
      status: "present" | "absent" | "late" | "excused";
    }>
  ): Promise<{ id?: number; created_at?: string; updated_at?: string }> {
    try {
      const response = await apiClient(
        API_ENDPOINTS.ATTENDANCE.CREATE_USER_ATTENDANCE,
        {
          method: "POST",
          body: JSON.stringify({
            date,
            attendance,
          }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create user attendance:", error);
      throw error;
    }
  },

  // Create teacher attendance
  async createTeacherAttendance(
    date: string,
    attendance: Array<{
      teacher_id: number;
      status: "present" | "absent" | "late" | "excused";
    }>
  ): Promise<{ id?: number; created_at?: string; updated_at?: string }> {
    try {
      const response = await apiClient(
        API_ENDPOINTS.ATTENDANCE.CREATE_TEACHER_ATTENDANCE,
        {
          method: "POST",
          body: JSON.stringify({
            date,
            attendance,
          }),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create teacher attendance:", error);
      throw error;
    }
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
