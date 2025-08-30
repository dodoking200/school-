// src/lib/apiClient.ts
import { ApiResponse } from "@/types"; // ✅ Import the type
// import { API_ENDPOINTS } from "./constants";

// Get the base URL from environment variables
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api";
  // "https://school-back-end-5e44.onrender.com/api";

/**
 * Builds a full API URL by combining the base URL with the endpoint
 * @param endpoint - The API endpoint (e.g., '/users/signin')
 * @returns Full API URL
 */
// src/lib/apiClient.ts
export function buildApiUrl(endpoint: string): string {
  console.log("Building URL:", { API_BASE_URL, endpoint });

  if (!endpoint) {
    throw new Error("Endpoint cannot be empty");
  }

  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not configured");
  }

  // Remove leading/trailing slashes for proper concatenation
  const cleanBase = API_BASE_URL.replace(/\/+$/, "");
  const cleanEndpoint = endpoint.replace(/^\/+/, "");
  const fullUrl = `${cleanBase}/${cleanEndpoint}`;

  console.log("Built URL:", fullUrl);
  return fullUrl;
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
  console.log("API Request:", {
    endpoint,
    fullUrl,
    method: options.method || "GET",
  });

  // Log the request body if present

  try {
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // Log response details regardless of success/failure
    console.log("API Response Details:", {
      endpoint,
      fullUrl,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      ok: response.ok,
      url: response.url,
      type: response.type,
      redirected: response.redirected,
    });
    if (options.body) {
      console.log("Request Body:", options.body);
    }

    // Add debug logging for non-JSON responses
    if (!response.ok) {
      let errorMessage;
      let responseText = "";

      try {
        // Try to get response text for debugging
        responseText = await response.text();
        console.log("Error Response Text:", responseText);

        const errorData = JSON.parse(responseText);

        // Handle validation errors (array of validation messages)
        if (errorData.error && Array.isArray(errorData.error)) {
          errorMessage = errorData.error
            .map(
              (err: { msg?: string; message?: string }) =>
                err.msg || err.message
            )
            .join(", ");
        } else {
          errorMessage =
            errorData.error || errorData.message || response.statusText;
        }
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
        responseText: responseText.substring(0, 1000), // Log first 1000 chars of response
      });

      throw new Error(errorMessage);
    }

    // Get response text first for logging
    const responseText = await response.text();
    console.log("Success Response Text:", responseText);

    // Parse the response text as JSON
    const data = JSON.parse(responseText);

    // Log successful response
    console.log("API Response Success:", {
      endpoint,
      fullUrl,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data,
      responseText: responseText.substring(0, 1000), // Log first 1000 chars of response
    });

    return {
      data,
      success: true,
    };
  } catch (error) {
    console.error("API Request Failed:", error);
    console.error("Request details:", {
      endpoint,
      fullUrl,
      method: options.method || "GET",
      API_BASE_URL,
    });

    // Handle specific fetch errors
    if (
      error instanceof TypeError &&
      error.message.includes("Failed to fetch")
    ) {
      throw new Error(
        "Network error: Unable to connect to the server. Please check if the backend is running."
      );
    }

    throw error;
  }
}

// Quiz-specific API functions
export interface QuizAuthRequest {
  email: string;
  password: string;
  quizId: string;
}

export interface QuizAuthResponse {
  success: boolean;
  message: string;
  quiz: {
    id: number;
    uuid: string;
    title: string;
    description: string;
    time_limit: number;
    total_mark: number;
  };
  student: {
    id: number;
    user_id: number;
    name: string;
  };
}

export interface QuizQuestion {
  id: number;
  question: string;
  type: string;
  mark: number;
  options: {
    id: string;
    text: string;
  }[];
}

export interface QuizData {
  id: string;
  title: string;
  description: string;
  time_limit: number;
  total_mark: number;
  questions: QuizQuestion[];
}

export interface QuizSubmissionRequest {
  email: string;
  answers: {
    questionId: number;
    optionId: string;
  }[];
}

export interface QuizSubmissionResponse {
  success: boolean;
  totalScore: number;
  totalQuestions: number;
  correctAnswers: number;
  passed: boolean;
  passingScore: number;
  results: {
    questionId: number;
    isCorrect: boolean;
    markAwarded: number;
    correctOptionId: number;
  }[];
}

export const quizApi = {
  async authenticateQuizAccess(
    data: QuizAuthRequest
  ): Promise<ApiResponse<QuizAuthResponse>> {
    return apiClient<QuizAuthResponse>("/exams/quiz/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  async getQuizData(
    quizId: string,
    email: string
  ): Promise<ApiResponse<QuizData>> {
    return apiClient<QuizData>(
      `/exams/quiz/${quizId}/data?email=${encodeURIComponent(email)}`
    );
  },

  async submitQuizAnswers(
    quizId: string,
    data: QuizSubmissionRequest
  ): Promise<ApiResponse<QuizSubmissionResponse>> {
    return apiClient<QuizSubmissionResponse>(`/exams/quiz/${quizId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },
};
