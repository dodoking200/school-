import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import { Class } from "@/types";

export const classService = {
  getClasses: async (): Promise<Class[]> => {
    const response = await apiClient<Class[]>(
      API_ENDPOINTS.CLASS_ROOMS.GET_ALL,
      {
        method: "GET",
      }
    );
    return response.data;
  },

  createClass: async (classData: Omit<Class, "id">): Promise<void> => {
    await apiClient(API_ENDPOINTS.CLASS_ROOMS.CREATE, {
      method: "POST",
      body: JSON.stringify(classData),
    });
  },

  updateClass: async (id: number, classData: Partial<Class>): Promise<void> => {
    await apiClient(API_ENDPOINTS.CLASS_ROOMS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(classData),
    });
  },

  deleteClass: async (id: number): Promise<void> => {
    await apiClient(API_ENDPOINTS.CLASS_ROOMS.DELETE(id), {
      method: "DELETE",
    });
  },

  canDeleteClass: async (
    id: number
  ): Promise<{
    canDelete: boolean;
    reason: string;
    studentCount?: number;
    scheduleCount?: number;
  }> => {
    const response = await apiClient<{
      canDelete: boolean;
      reason: string;
      studentCount?: number;
      scheduleCount?: number;
    }>(API_ENDPOINTS.CLASS_ROOMS.CAN_DELETE(id), {
      method: "GET",
    });
    return response.data;
  },
};
