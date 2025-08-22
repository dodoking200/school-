import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Teacher, TeacherCreatePayload } from "@/types";

export const teacherService = {
  getTeachers: async (): Promise<Teacher[]> => {
    const response = await apiClient<Teacher[]>(
      API_ENDPOINTS.TEACHERS.GET_ALL,
      {
        method: "GET",
      }
    );
    return response.data.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      phone: t.phone,
      birth_date: t.birth_date,
      role: "teacher",
      subjects:
        t.subjects?.map((s) => ({
          id: s.id,
          name: s.name,
        })) || [],

      specialization: t.specialization,
      hire_date: t.hire_date,
      qualification: t.qualification,
    }));
  },

  createTeacher: async (payload: TeacherCreatePayload): Promise<void> => {
    await apiClient(API_ENDPOINTS.TEACHERS.CREATE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateTeacher: async (
    id: number,
    payload: Partial<Teacher> & { subject_ids?: number[] }
  ): Promise<void> => {
    await apiClient(API_ENDPOINTS.TEACHERS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  deleteTeacher: async (id: number): Promise<void> => {
    await apiClient(API_ENDPOINTS.TEACHERS.DELETE(id), {
      method: "DELETE",
    });
  },
};
