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
  getAllRoles: async (): Promise<Role[]> => {
    const response = await apiClient<Role[]>(API_ENDPOINTS.ROLES.GET_ALL, {
      method: "GET",
    });
    return response.data;
  },
  createRole: async (name: string, permissions: number[]): Promise<void> => {
    await apiClient(API_ENDPOINTS.ROLES.CREATE, {
      method: "POST",
      body: JSON.stringify({ name, permissions }),
    });
  },
  updateRolePermissions: async (
    roleId: number,
    permissions: number[]
  ): Promise<void> => {
    await apiClient(API_ENDPOINTS.ROLES.UPDATE_PERMISSIONS, {
      method: "PUT",
      body: JSON.stringify({ roleId, permissions }),
    });
  },
  updateRoleName: async (roleId: number, name: string): Promise<void> => {
    await apiClient(API_ENDPOINTS.ROLES.UPDATE(roleId), {
      method: "PUT",
      body: JSON.stringify({ name }),
    });
  },
  deleteRole: async (roleId: number): Promise<void> => {
    await apiClient(API_ENDPOINTS.ROLES.DELETE(roleId), {
      method: "DELETE",
    });
  },
  getRolePermissions: async (
    roleId: number
  ): Promise<{ id: number; name: string }[]> => {
    const response = await apiClient<{ permission_id?: number; id?: number; name?: string; permission_name?: string }[]>(
      API_ENDPOINTS.ROLES.GET_ROLE_PERMISSIONS(roleId),
      { method: "GET" }
    );
    return response.data.map((p) => ({
      id: (p.permission_id ?? p.id)!,
      name: (p.name ?? p.permission_name)!,
    }));
  },
  getAllPermissions: async (): Promise<{ id: number; name: string }[]> => {
    const response = await apiClient<{ id: number; name: string }[]>(
      API_ENDPOINTS.PERMISSIONS.GET_ALL,
      { method: "GET" }
    );
    return response.data;
  },
};
