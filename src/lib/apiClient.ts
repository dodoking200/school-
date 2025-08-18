// src/lib/apiClient.ts
import { ApiResponse } from "@/types"; // ✅ Import the type
// import { API_ENDPOINTS } from "./constants";

// Get the base URL from environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";

/**
 * Builds a full API URL by combining the base URL with the endpoint
 * @param endpoint - The API endpoint (e.g., '/users/signin')
 * @returns Full API URL
 */
// src/lib/apiClient.ts
export function buildApiUrl(endpoint: string): string {
  // Remove leading/trailing slashes for proper concatenation
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  return `${cleanBase}/${cleanEndpoint}`;
}

function getToken(): string | null {
  // Client-side check
  if (typeof window === "undefined") return null;

  try {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  } catch (error) {
    console.error("Token access error:", error);
    return null;
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();

  const headers = new Headers(options.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Add token if available
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // Build the full URL using the base URL and endpoint
  const fullUrl = buildApiUrl(endpoint);
  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Add debug logging for non-JSON responses
    if (!response.ok) {
      let errorMessage;
      let responseText = "";

      try {
        // Try to get response text for debugging
        responseText = await response.text();
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || response.statusText;
      } catch (parseError) {
        console.error("Failed to parse error response:", parseError);
        console.error("Raw response:", responseText.substring(0, 500));

        // Handle non-JSON responses
        if (response.status === 401) {
          errorMessage = "Authentication failed. Please login again.";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission for this action.";
        } else if (response.status === 404) {
          errorMessage = "Resource not found.";
        } else if (response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        } else {
          errorMessage = response.statusText || "Unknown error occurred";
        }
      }

      // Log full error details
      console.error(`API Error: ${errorMessage}`, {
        status: response.status,
        endpoint,
        fullUrl,
      });

      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("API Request Failed:", error);
    throw error;
  }
}
