import { Period } from "@/types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export const periodService = {
  async getAllPeriods(): Promise<Period[]> {
    try {
      const response = await apiClient<Period[]>(
        API_ENDPOINTS.PERIODS.GET_ALL,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch periods:", error);
      throw new Error("Failed to fetch periods");
    }
  },
};
