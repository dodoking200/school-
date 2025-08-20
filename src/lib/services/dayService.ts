import { Day } from "@/types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export const dayService = {
  async getAllDays(): Promise<Day[]> {
    try {
      const response = await apiClient<Day[]>(API_ENDPOINTS.DAYS.GET_ALL, {
        method: "GET",
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch days:", error);
      throw new Error("Failed to fetch days");
    }
  },
};
