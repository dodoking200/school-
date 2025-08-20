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
};
