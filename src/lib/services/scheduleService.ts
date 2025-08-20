import { Schedule, ScheduleCreatePayload } from "@/types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export const scheduleService = {
  async getSchedulesByClass(classId: number): Promise<Schedule[]> {
    try {
      const response = await apiClient<Schedule[]>(
        API_ENDPOINTS.SCHEDULES.GET_BY_CLASS(classId),
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch schedules by class:", error);
      throw new Error("Failed to fetch schedules by class");
    }
  },

  async createSchedule(scheduleData: ScheduleCreatePayload): Promise<Schedule> {
    try {
      const response = await apiClient<Schedule>(
        API_ENDPOINTS.SCHEDULES.CREATE,
        {
          method: "POST",
          body: JSON.stringify(scheduleData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create schedule:", error);
      throw new Error("Failed to create schedule");
    }
  },

  async updateSchedule(
    id: number,
    scheduleData: Partial<ScheduleCreatePayload>
  ): Promise<Schedule> {
    try {
      const response = await apiClient<Schedule>(
        API_ENDPOINTS.SCHEDULES.UPDATE(id),
        {
          method: "PUT",
          body: JSON.stringify(scheduleData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update schedule:", error);
      throw new Error("Failed to update schedule");
    }
  },

  async deleteSchedule(id: number): Promise<void> {
    try {
      await apiClient(API_ENDPOINTS.SCHEDULES.DELETE(id), {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete schedule:", error);
      throw new Error("Failed to delete schedule");
    }
  },
};
