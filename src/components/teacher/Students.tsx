import React, { useState, useEffect } from "react";
import Table from "../ui/Table"; // Adjust the import path if needed
import MarkInputModal from "./MarkInputModal";
import { studentService } from "@/lib/services/studentService";
import { Student } from "@/types";
import { useAuth } from "@/lib/useAuth";

// Extended interface for display purposes
interface StudentDisplay extends Student {
  class_name: string;
  attendance_percentage: number;
  marks: number;
}

export default function Students() {
  const { getCurrentUser } = useAuth();
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(
    null
  );
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch students data function
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is a teacher
      const currentUser = getCurrentUser();
      if (!currentUser) {
        throw new Error("No user logged in. Please login again.");
      }

      if (currentUser.role !== "teacher") {
        throw new Error(
          `Access denied. User role is "${currentUser.role}", but "teacher" is required.`
        );
      }

      const fetchedStudents = await studentService.getStudentsByTeacher();

      // Transform the data to include display properties
      const transformedStudents: StudentDisplay[] = fetchedStudents.map(
        (student) => ({
          ...student,
          class_name: student.class_name || `Class ${student.class_id}`,
          attendance_percentage: student.attendance
            ? Math.round(
                (student.attendance.present / student.attendance.total) * 100
              )
            : 0,
          marks: 0, // Default marks, can be fetched separately if needed
        })
      );

      setStudents(transformedStudents);
      setError(null);
    } catch (err) {
      console.error("Detailed error fetching students:", err);

      let errorMessage = "Failed to fetch students";
      if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Fetch students data when component mounts
  useEffect(() => {
    fetchStudents();
  }, []);

  // Get unique class names for filter dropdown
  const uniqueClasses = Array.from(
    new Set(students.map((student) => student.class_name))
  );

  // Filter students based on selected class
  const filteredStudents =
    selectedClass === "All"
      ? students
      : students.filter((student) => student.class_name === selectedClass);

  // Handle opening the mark input modal
  const handleOpenModal = (student: StudentDisplay) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Handle submitting marks
  const handleSubmitMark = (mark: number, type: string) => {
    if (selectedStudent) {
      console.log(
        `Submitted mark ${mark} of type ${type} for student ${selectedStudent.student_name}`
      );
      // Here you would typically update the student's marks in your database
      // For this example, we'll just log the information
    }
  };

  // Define the filter dropdown
  const classFilter = (
    <select
      id="classFilter"
      className="border border-gray-300 rounded-4xl bg-gray-200 p-2"
      value={selectedClass}
      onChange={(e) => setSelectedClass(e.target.value)}
    >
      <option value="All">All Classes</option>
      {uniqueClasses.map((className) => (
        <option key={className} value={className}>
          {className}
        </option>
      ))}
    </select>
  );

  // Define actions component with add student button

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading students...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-2xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg mb-2">Error loading students</p>
          <p className="text-gray-600 mb-4">{error}</p>

          {/* Special help for "Teacher not found" error */}
          {error.includes("Teacher not found") && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-semibold text-yellow-800 mb-2">
                How to fix this:
              </h4>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Make sure you&apos;re logged in as a teacher account</li>
                <li>
                  2. Use the test account:{" "}
                  <code className="bg-yellow-100 px-2 py-1 rounded">
                    teacher@system.com
                  </code>{" "}
                  /{" "}
                  <code className="bg-yellow-100 px-2 py-1 rounded">
                    Teacher123
                  </code>
                </li>
                <li>3. Check that the backend database has teacher records</li>
                <li>4. Verify your user role is set to &quot;teacher&quot;</li>
              </ol>
            </div>
          )}

          {/* Special help for 404 errors */}
          {error.includes("404") && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 text-left">
              <h4 className="font-semibold text-red-800 mb-2">
                Backend Server Issue:
              </h4>
              <ol className="text-sm text-red-700 space-y-1">
                <li>1. Check if backend server is running on port 3001</li>
                <li>
                  2. Open terminal and run:{" "}
                  <code className="bg-red-100 px-2 py-1 rounded">
                    cd project_one && npm start
                  </code>
                </li>
                <li>
                  3. Verify you see: &quot;Server running on port 3001&quot;
                </li>
                <li>
                  4. Test endpoint:{" "}
                  <code className="bg-red-100 px-2 py-1 rounded">
                    curl http://localhost:3001/api/teachers/subjects
                  </code>
                </li>
              </ol>
            </div>
          )}

          <button
            onClick={fetchStudents}
            className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded hover:bg-opacity-80"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table
        title="Student"
        filter={classFilter}
        emptyMessage="No students found"
        responsive={true}
        tableClassName="border-collapse"
        tableHeader={
          <>
            <th className="px-6 py-4 font-medium w-[20%]">Student Name</th>
            <th className="px-6 py-4 font-medium w-[20%]">Class</th>
            <th className="px-6 py-4 font-medium w-[20%]">Attendance</th>
            <th className="px-6 py-4 font-medium w-[20%]">Marks</th>
            <th className="px-6 py-4 font-medium w-[20%]">Actions</th>
          </>
        }
        tableContent={
          <>
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td className="px-6 py-4">{student.student_name}</td>
                <td className="px-6 py-4">{student.class_name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-2 bg-[var(--primary)]"
                      style={{ width: `${student.attendance_percentage}%` }}
                    />
                    <span className="font-medium text-gray-800">
                      {student.attendance_percentage}%
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium text-[var(--primary)]">
                    {student.marks}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    className="text-[var(--primary)] hover:underline"
                    onClick={() => handleOpenModal(student)}
                  >
                    Input Marks
                  </button>
                </td>
              </tr>
            ))}
          </>
        }
      />

      {/* Mark Input Modal */}
      {selectedStudent && (
        <MarkInputModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          studentName={selectedStudent.student_name}
          onSubmit={handleSubmitMark}
        />
      )}
    </>
  );
}
