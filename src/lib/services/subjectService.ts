import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { Subject } from "@/types";

export type SubjectListItem = { id: number; name: string };

export const subjectService = {
  getSubjectsList: async (): Promise<SubjectListItem[]> => {
    const response = await apiClient<SubjectListItem[]>(
      API_ENDPOINTS.SUBJECTS.LIST,
      {
        method: "GET",
      }
    );
    return response.data;
  },

  getSubjects: async (): Promise<Subject[]> => {
    const response = await apiClient<Subject[]>(
      API_ENDPOINTS.SUBJECTS.GET_ALL,
      {
        method: "GET",
      }
    );
    return response.data;
  },

  createSubject: async (subjectData: { name: string; grade: string }): Promise<Subject> => {
    const response = await apiClient<Subject>(
      API_ENDPOINTS.SUBJECTS.CREATE,
      {
        method: "POST",
        body: JSON.stringify({
          name: subjectData.name,
          level_grade: subjectData.grade,
        }),
      }
    );
    return response.data;
  },

  updateSubject: async (id: number, subjectData: { name: string; grade: string }): Promise<Subject> => {
    const response = await apiClient<Subject>(
      API_ENDPOINTS.SUBJECTS.UPDATE(id),
      {
        method: "PUT",
        body: JSON.stringify({
          name: subjectData.name,
          level_grade: subjectData.grade,
        }),
      }
    );
    return response.data;
  },

  deleteSubject: async (id: number): Promise<void> => {
    await apiClient(
      API_ENDPOINTS.SUBJECTS.DELETE(id),
      {
        method: "DELETE",
      }
    );
  },
};
