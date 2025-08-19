import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import type { AcademicYear, AcademicYearCreatePayload } from "@/types";

export const academicYearService = {
  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const response = await apiClient<AcademicYear[]>(
      API_ENDPOINTS.ACADEMIC_YEARS.GET_ALL,
      {
        method: "GET",
      }
    );
    return response.data;
  },

  createAcademicYear: async (
    academicYearData: AcademicYearCreatePayload
  ): Promise<void> => {
    await apiClient(API_ENDPOINTS.ACADEMIC_YEARS.CREATE, {
      method: "POST",
      body: JSON.stringify(academicYearData),
    });
  },

  updateAcademicYear: async (
    id: number,
    academicYearData: Partial<AcademicYearCreatePayload>
  ): Promise<void> => {
    await apiClient(API_ENDPOINTS.ACADEMIC_YEARS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(academicYearData),
    });
  },

  deleteAcademicYear: async (id: number): Promise<void> => {
    await apiClient(API_ENDPOINTS.ACADEMIC_YEARS.DELETE(id), {
      method: "DELETE",
    });
  },
};
