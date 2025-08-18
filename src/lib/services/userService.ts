import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import type { User } from "@/types";

export const userService = {
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient<User[]>(API_ENDPOINTS.USERS.GET_ALL, {
      method: "GET",
    });
    // The API now returns an empty array, so response.data will be [].
    return response.data;
  },

  createUser: async (userData: Omit<User, "id">): Promise<void> => {
    await apiClient(API_ENDPOINTS.USERS.CREATE, {
      method: "POST",
      body: JSON.stringify(userData),
    });
    // The API now returns an empty success response.
  },

  updateUser: async (
    id: number,
    userData: Partial<Omit<User, "id">>
  ): Promise<void> => {
    await apiClient(API_ENDPOINTS.USERS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(userData),
    });
    // The API now returns an empty success response.
  },

  deleteUser: async (id: number): Promise<void> => {
    await apiClient(API_ENDPOINTS.USERS.DELETE(id), {
      method: "DELETE",
    });
  },
};
