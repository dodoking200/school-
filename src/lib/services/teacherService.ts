import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Teacher } from "@/types";

export type UpsertTeacherPayload = {
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  specialization: string;
  hire_date: string;
  qualification: string;
  subject_ids?: number[];
};

export const teacherService = {
  getTeachers: async (): Promise<Teacher[]> => {
    type ApiSubject = { id: number; name: string };
    type ApiTeacher = {
      id: number;
      name: string;
      email: string;
      phone: string;
      birth_date: string;
      specialization?: string;
      hire_date?: string;
      qualification?: string;
      subjects?: ApiSubject[];
    };

    const response = await apiClient<ApiTeacher[]>(API_ENDPOINTS.TEACHERS.GET_ALL, {
      method: "GET",
    });
    return response.data.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.email,
      phone: t.phone,
      birth_date: t.birth_date,
      role: "teacher",
      subjects: Array.isArray(t.subjects) ? t.subjects.map((s) => s.name) : [],
      subject_ids: Array.isArray(t.subjects) ? t.subjects.map((s) => s.id) : [],
      specialization: t.specialization,
      hire_date: t.hire_date,
      qualification: t.qualification,
    }));
  },

  createTeacher: async (payload: UpsertTeacherPayload): Promise<void> => {
    await apiClient(API_ENDPOINTS.TEACHERS.CREATE, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  updateTeacher: async (
    id: number,
    payload: Partial<UpsertTeacherPayload>
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


