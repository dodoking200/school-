import { Student, SemesterMarks } from "@/types";
import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../constants";

export const studentService = {
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

  async createStudent(studentData: Omit<Student, "id">): Promise<Student> {
    try {
      const response = await apiClient<Student>(API_ENDPOINTS.STUDENTS.CREATE, {
        method: "POST",
        body: JSON.stringify(studentData),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create student:", error);
      throw new Error("Failed to create student");
    }
  },

  async updateStudent(
    id: number,
    studentData: Partial<Student>
  ): Promise<Student> {
    try {
      const response = await apiClient<Student>(
        API_ENDPOINTS.STUDENTS.GET_BY_ID(id),
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
};
