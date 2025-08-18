import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";
import type { Role } from "@/types";

export const roleService = {
  getRoles: async (): Promise<Role[]> => {
    const response = await apiClient<Role[]>(API_ENDPOINTS.ROLES.GET_ALL_EMP, {
      method: "GET",
    });
    // The API now returns an empty array, so response.data will be [].
    return response.data;
  },
};
