import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export interface AttendanceRecord {
  id: number;
  student_id: number;
  date: string;
  status: "present" | "absent" | "late" | "excused";
  created_at?: string;
  updated_at?: string;
}

export const attendanceService = {
  async getAttendanceByStudentId(
    studentId: number
  ): Promise<AttendanceRecord[]> {
    try {
      const response = await apiClient<AttendanceRecord[]>(
        API_ENDPOINTS.ATTENDANCE.GET_BY_STUDENT(studentId),
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch attendance by student ID:", error);
      throw new Error("Failed to fetch attendance");
    }
  },
};
