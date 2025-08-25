import { apiClient } from "@/lib/apiClient";
import { SubjectQuestions } from "@/types";
import { API_ENDPOINTS } from "@/lib/constants";

export const questionService = {
  async getTeacherQuestions(): Promise<SubjectQuestions[]> {
    try {
      const response = await apiClient<SubjectQuestions[]>(
        API_ENDPOINTS.TEACHER.GET_QUESTIONS
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching teacher questions:", error);
      throw error;
    }
  },

  async createQuestion(questionData: {
    question_text: string;
    type: string;
    options: { text: string; is_correct: boolean }[];
    subject_id: number;
  }) {
    try {
      const response = await apiClient("questions", {
        method: "POST",
        body: JSON.stringify(questionData),
      });
      return response.data;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  },

  async updateQuestion(
    questionId: number,
    questionData: {
      question_text: string;
      type: string;
      options: { text: string; is_correct: boolean }[];
      subject_id: number;
    }
  ) {
    try {
      const response = await apiClient(`questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(questionData),
      });
      return response.data;
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },

  async deleteQuestion(questionId: number) {
    try {
      const response = await apiClient(`questions/${questionId}`, {
        method: "DELETE",
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  },
};
