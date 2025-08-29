import { Behavior, BehaviorCreatePayload } from "@/types";
import { apiClient } from "@/lib/apiClient";
import { API_ENDPOINTS } from "@/lib/constants";

export const behaviorService = {
  async createBehavior(behaviorData: BehaviorCreatePayload): Promise<Behavior> {
    const response = await apiClient<Behavior>(API_ENDPOINTS.BEHAVIOR.CREATE, {
      method: "POST",
      body: JSON.stringify(behaviorData),
    });
    return response.data;
  },

  async getBehaviorsByStudent(studentId: number): Promise<Behavior[]> {
    const response = await apiClient<Behavior[]>(
      `${API_ENDPOINTS.BEHAVIOR.CREATE}/student/${studentId}`,
      {
        method: "GET",
      }
    );
    return response.data || [];
  },

  async getAllBehaviors(): Promise<Behavior[]> {
    const response = await apiClient<Behavior[]>(
      API_ENDPOINTS.BEHAVIOR.CREATE,
      {
        method: "GET",
      }
    );
    return response.data || [];
  },

  async updateBehavior(
    id: number,
    updates: Partial<BehaviorCreatePayload>
  ): Promise<Behavior> {
    const response = await apiClient<Behavior>(
      `${API_ENDPOINTS.BEHAVIOR.CREATE}/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(updates),
      }
    );
    return response.data;
  },

  async deleteBehavior(id: number): Promise<void> {
    await apiClient(`${API_ENDPOINTS.BEHAVIOR.CREATE}/${id}`, {
      method: "DELETE",
    });
  },
};
