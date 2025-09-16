import { apiClient } from "@/lib/apiClient";
import { ExamCreatePayload, UpcomingQuiz, UpcomingExam } from "@/types";
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

  async getUpcomingQuizzes(): Promise<UpcomingQuiz[]> {
    try {
      const response = await apiClient<UpcomingQuiz[]>(
        API_ENDPOINTS.STUDENT.UPCOMING_QUIZZES
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming quizzes:", error);
      throw error;
    }
  },

  async getUpcomingExams(): Promise<UpcomingExam[]> {
    try {
      const response = await apiClient<UpcomingExam[]>(
        API_ENDPOINTS.STUDENT.UPCOMING_EXAMS
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching upcoming exams:", error);
      throw error;
    }
  },
};
