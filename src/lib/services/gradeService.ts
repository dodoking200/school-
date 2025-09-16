import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export interface GradeCreatePayload {
  archive_id: number;
  subject_id: number;
  semester_id: number;
  min_score: number;
  max_score: number;
  grade: number;
  type: "worksheet" | "exam" | "quiz" | "assignment";
}

export interface Grade {
  id: number;
  archive_id: number;
  subject_id: number;
  semester_id: number;
  min_score: number;
  max_score: number;
  grade: number;
  type: "worksheet" | "exam" | "quiz" | "assignment";
  created_at: string;
  updated_at: string;
}

export const gradeService = {
  async createGrade(gradeData: GradeCreatePayload): Promise<Grade> {
    try {
      const response = await apiClient<Grade>(API_ENDPOINTS.GRADES.CREATE, {
        method: "POST",
        body: JSON.stringify(gradeData),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create grade:", error);
      throw new Error("Failed to create grade");
    }
  },

  async getGradesByStudent(studentId: number): Promise<Grade[]> {
    try {
      const response = await apiClient<Grade[]>(
        API_ENDPOINTS.GRADES.GET_BY_STUDENT(studentId),
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch grades by student:", error);
      throw new Error("Failed to fetch grades by student");
    }
  },

  async updateGrade(
    gradeId: number,
    gradeData: Partial<GradeCreatePayload>
  ): Promise<Grade> {
    try {
      const response = await apiClient<Grade>(
        API_ENDPOINTS.GRADES.UPDATE(gradeId),
        {
          method: "PUT",
          body: JSON.stringify(gradeData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update grade:", error);
      throw new Error("Failed to update grade");
    }
  },

  async deleteGrade(gradeId: number): Promise<void> {
    try {
      await apiClient(API_ENDPOINTS.GRADES.DELETE(gradeId), {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete grade:", error);
      throw new Error("Failed to delete grade");
    }
  },
};
