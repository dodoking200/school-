import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { Semester } from "@/types";

class SemesterService {
  async getSemesters(): Promise<Semester[]> {
    const response = await apiClient<Semester[]>(
      API_ENDPOINTS.SEMESTERS.GET_ALL
    );
    return response.data;
  }
}

export const semesterService = new SemesterService();
