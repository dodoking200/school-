import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export interface StudentScheduleData {
  day_id: number;
  day_name: string;
  period_id: number;
  start_time: string;
  end_time: string;
  subject_name: string;
}

export const studentScheduleService = {
  async getStudentSchedule(): Promise<StudentScheduleData[]> {
    try {
      const response = await apiClient<StudentScheduleData[]>(
        API_ENDPOINTS.STUDENTS.SCHEDULE,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student schedule:", error);
      throw new Error("Failed to fetch student schedule");
    }
  },
};
