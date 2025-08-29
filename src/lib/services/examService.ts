import { apiClient } from "@/lib/apiClient";
import { ExamCreatePayload } from "@/types";
import { API_ENDPOINTS } from "@/lib/constants";

export const examService = {
  async createExam(examData: ExamCreatePayload) {
    try {
      const response = await apiClient(API_ENDPOINTS.TEACHER.CREATE_EXAM, {
        method: "POST",
        body: JSON.stringify(examData),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating exam:", error);
      throw error;
    }
  },
};
