import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";

export type SubjectListItem = { id: number; name: string };

export const subjectService = {
  getSubjectsList: async (): Promise<SubjectListItem[]> => {
    const response = await apiClient<SubjectListItem[]>(API_ENDPOINTS.SUBJECTS.LIST, {
      method: "GET",
    });
    return response.data;
  },
};


