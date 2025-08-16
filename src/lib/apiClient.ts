// src/lib/apiClient.ts
import { ApiResponse } from "@/types"; // ✅ Import the type

// Get the base URL from environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

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

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const defaultHeaders = {
    "Content-Type": "application/json",
  };

  // Build the full URL using the base URL and endpoint
  const fullUrl = buildApiUrl(endpoint);
  console.log("API URL:", fullUrl);
  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    let errorMessage;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || response.statusText;

      // Handle 400 Bad Request specifically
      if (response.status === 400) {
        errorMessage = "Invalid email or password";
      }
    } catch {
      // Handle non-JSON error responses based on status code

      if (response.status === 401) {
        errorMessage = "Authentication failed. Please check your credentials.";
      } else if (response.status === 403) {
        errorMessage = "You do not have permission to access this resource.";
      } else if (response.status === 404) {
        errorMessage = "The requested resource was not found.";
      } else if (response.status >= 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = response.statusText || "Unknown error occurred";
      }
    }

    // Throw a formatted error with the determined message
    throw new Error(errorMessage);
  }

  const data = await response.json();

  return {
    data,
    success: true,
  };
}
