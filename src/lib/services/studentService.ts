import {
  Student,
  SemesterMarks,
  PaginationRequest,
  PaginationResponse,
  StudentFromAPI,
  StudentCreatePayload,
  StudentUpdatePayload,
} from "@/types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export const studentService = {
  async getStudentsPaginated(
    paginationData: PaginationRequest
  ): Promise<PaginationResponse<StudentFromAPI>> {
    try {
      const response = await apiClient<PaginationResponse<StudentFromAPI>>(
        API_ENDPOINTS.STUDENTS.PAGINATE,
        {
          method: "POST",
          body: JSON.stringify(paginationData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch students with pagination:", error);
      throw new Error("Failed to fetch students with pagination");
    }
  },

  async getStudentsByClass(classId: number): Promise<Student[]> {
    try {
      const response = await apiClient<Student[]>(
        API_ENDPOINTS.STUDENTS.GET_BY_CLASS(classId),
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch students by class:", error);
      throw new Error("Failed to fetch students by class");
    }
  },

  async getAllStudents(): Promise<Student[]> {
    try {
      const response = await apiClient<Student[]>(
        API_ENDPOINTS.STUDENTS.GET_ALL,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch students:", error);
      throw new Error("Failed to fetch students");
    }
  },

  async createStudent(
    studentData: StudentCreatePayload
  ): Promise<StudentFromAPI> {
    try {
      console.log("Sending create student request:", {
        endpoint: API_ENDPOINTS.STUDENTS.CREATE,
        data: studentData,
      });

      const response = await apiClient<StudentFromAPI>(
        API_ENDPOINTS.STUDENTS.CREATE,
        {
          method: "POST",
          body: JSON.stringify(studentData),
        }
      );

      console.log("Create student response:", response);
      return response.data;
    } catch (error) {
      console.error("Failed to create student:", error);
      // Log more details about the error
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Try to get more details about the error if it's a fetch error
      if (error instanceof Error && error.message.includes("Bad Request")) {
        console.error(
          "Bad Request error - this usually means validation failed"
        );
        console.error("Check the payload structure and required fields");
      }

      throw new Error("Failed to create student");
    }
  },

  async updateStudent(
    id: number,
    studentData: StudentUpdatePayload
  ): Promise<StudentFromAPI> {
    try {
      const response = await apiClient<StudentFromAPI>(
        API_ENDPOINTS.STUDENTS.UPDATE(id),
        {
          method: "PUT",
          body: JSON.stringify(studentData),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update student:", error);
      throw new Error("Failed to update student");
    }
  },

  async deleteStudent(id: number): Promise<void> {
    try {
      await apiClient(API_ENDPOINTS.STUDENTS.GET_BY_ID(id), {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Failed to delete student:", error);
      throw new Error("Failed to delete student");
    }
  },

  async getStudentsByTeacher(): Promise<Student[]> {
    try {
      const response = await apiClient<Student[]>(
        API_ENDPOINTS.TEACHER.GET_STUDENTS,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch students by teacher:", error);
      throw new Error("Failed to fetch students by teacher");
    }
  },

  async getStudentMarks(): Promise<SemesterMarks[]> {
    try {
      const response = await apiClient<SemesterMarks[]>(
        API_ENDPOINTS.STUDENT.MARKS,
        {
          method: "GET",
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student marks:", error);
      throw new Error("Failed to fetch student marks");
    }
  },

  async searchStudentsAdvanced(params: {
    name?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }): Promise<{
    students: StudentFromAPI[];
    pagination: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
    filters: any;
  }> {
    try {
      const response = await apiClient<{
        students: StudentFromAPI[];
        pagination: {
          page: number;
          pageSize: number;
          total: number;
          totalPages: number;
        };
        filters: any;
      }>(API_ENDPOINTS.STUDENTS.SEARCH_ADVANCED, {
        method: "POST",
        body: JSON.stringify(params),
      });

      return response.data;
    } catch (error) {
      console.error("Failed to search students:", error);
      throw new Error("Failed to search students");
    }
  },

  async bulkUploadStudents(file: File): Promise<{ message: string; count: number }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient<{ message: string; count: number }>(
        API_ENDPOINTS.STUDENTS.BULK_UPLOAD,
        {
          method: "POST",
          body: formData,
          headers: {
            // Don't set Content-Type header for FormData, let the browser set it
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to bulk upload students:", error);
      throw new Error("Failed to bulk upload students");
    }
  },
};
