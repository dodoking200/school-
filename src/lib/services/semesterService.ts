import { apiClient } from "@/lib/apiClient";
import { Semester } from "@/types";

class SemesterService {
  async getSemesters(): Promise<Semester[]> {
    const response = await apiClient<Semester[]>("/semesters");
    return response.data;
  }
}

export const semesterService = new SemesterService();
