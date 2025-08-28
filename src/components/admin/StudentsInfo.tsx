import { useState, useEffect } from "react";
import Table from "../ui/Table";
import StudentModal from "./StudentModal";
import { studentService } from "@/lib/services/studentService";
import { classService } from "@/lib/services/classService";
import {
  StudentFromAPI,
  PaginationRequest,
  StudentCreatePayload,
  StudentUpdatePayload,
  Class,
} from "@/types";

// Interface for the modal (keeping compatibility)
interface StudentForModal {
  id: number;
  name: string;
  email: string;
  grade_level: number;
  class_name: string;
  curriculum_grade?: string;
  phone: string;
  birth_date: string;
  discount_percentage: number;
}

export default function StudentInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] =
    useState<StudentForModal | null>(null);
  const [students, setStudents] = useState<StudentFromAPI[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [classesLoading, setClassesLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [studentsPerPage] = useState<number>(11);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasNextPage, setHasNextPage] = useState<boolean>(false);
  const [hasPreviousPage, setHasPreviousPage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Fetch students with pagination
  const fetchStudents = async (page: number = 1) => {
    setLoading(true);
    try {
      const paginationData: PaginationRequest = {
        table: "students",
        page: page,
        pageSize: studentsPerPage,
        orderBy: "name",
        orderDirection: "asc",
        filters: {
          grade_level: selectedGrade ? parseInt(selectedGrade) : undefined,
          class_id: selectedClass ? parseInt(selectedClass) : undefined,
        },
      };

      const response = await studentService.getStudentsPaginated(
        paginationData
      );

      setStudents(response.data);
      setTotalPages(response.totalPages);
      setTotalStudents(parseInt(response.total));
      setHasNextPage(response.hasNextPage);
      setHasPreviousPage(response.hasPreviousPage);
      setCurrentPage(response.page);
    } catch (error) {
      console.error("Failed to fetch students:", error);
      // Fallback to empty state
      setStudents([]);
      setTotalPages(0);
      setTotalStudents(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch classes for dropdown
  const fetchClasses = async () => {
    setClassesLoading(true);
    try {
      const classesData = await classService.getClasses();
      setClasses(classesData);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    } finally {
      setClassesLoading(false);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchStudents(1);
    fetchClasses();
  }, []);

  // Refetch students when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchStudents(1);
  }, [selectedGrade, selectedClass]);

  // Get unique grades for filter options
  const uniqueGrades = [
    ...new Set(students.map((student) => student.grade_level)),
  ];

  // Filter students based on selected grade and search term
  const filteredStudents = students.filter((student) => {
    const matchesGrade =
      !selectedGrade || student.grade_level === selectedGrade;
    const matchesSearch =
      !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class_name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGrade && matchesSearch;
  });

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    fetchStudents(pageNumber);
  };

  // Handle opening the modal for adding a new student
  const handleAddStudent = () => {
    if (classes.length === 0) {
      alert("Please wait for classes to load before adding a student.");
      return;
    }
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing student
  const handleEditStudent = (student: StudentFromAPI) => {
    // Convert StudentFromAPI to the format expected by StudentModal
    const modalStudent: StudentForModal = {
      id: student.id,
      name: student.name,
      email: student.email,
      grade_level: parseInt(student.grade_level),
      class_name: student.class_name,
      phone: student.phone,
      birth_date: student.birth_date,
      discount_percentage: 0, // Default discount for existing students
    };
    setSelectedStudent(modalStudent);
    setIsModalOpen(true);
  };

  // Handle submitting the student form
  const handleSubmitStudent = async (studentData: {
    id?: number;
    name: string;
    email: string;
    grade_level: number;
    class_name: string;
    phone: string;
    birth_date: string;
    discount_percentage: number;
  }) => {
    try {
      if (studentData.id) {
        // Update existing student
        const updatePayload: StudentUpdatePayload = {
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          birth_date: studentData.birth_date,
          grade_level: studentData.grade_level, // Send as number (backend expects integer)
          // Note: We need to find the class_id from the class_name
          // For now, we'll use a default or find the first matching class
          class_id:
            classes.find((c) => c.class_name === studentData.class_name)?.id ||
            1, // Send as number (backend expects integer)
          discount_percentage: studentData.discount_percentage,
        };

        console.log("Update payload:", updatePayload);
        await studentService.updateStudent(studentData.id, updatePayload);
      } else {
        // Add new student
        const createPayload: StudentCreatePayload = {
          name: studentData.name,
          email: studentData.email,
          phone: studentData.phone,
          birth_date: studentData.birth_date,
          grade_level: studentData.grade_level, // Send as number (backend expects integer)
          // Note: We need to find the class_id from the class_name
          // For now, we'll use a default or find the first matching class
          class_id:
            classes.find((c) => c.class_name === studentData.class_name)?.id ||
            1, // Send as number (backend expects integer)
          discount_percentage: studentData.discount_percentage,
        };

        // Validate that we have a valid class_id
        if (!createPayload.class_id || createPayload.class_id === 1) {
          console.warn("Using default class_id. Available classes:", classes);
        }

        // Validate all required fields
        if (
          !createPayload.name ||
          !createPayload.email ||
          !createPayload.phone ||
          !createPayload.birth_date
        ) {
          throw new Error("All required fields must be filled");
        }

        // Validate class_id is not the default
        if (createPayload.class_id === 1 && classes.length > 0) {
          console.warn("Using default class_id. Please select a valid class.");
        }

        // Validate grade_level is valid (backend expects 9, 10, 11, or 12)
        if (![9, 10, 11, 12].includes(createPayload.grade_level)) {
          throw new Error("Grade level must be 9, 10, 11, or 12");
        }

        // Validate discount_percentage is valid (backend expects 0-100)
        if (
          createPayload.discount_percentage < 0 ||
          createPayload.discount_percentage > 100
        ) {
          throw new Error("Discount percentage must be between 0 and 100");
        }

        // Validate birth_date is a valid date
        const birthDate = new Date(createPayload.birth_date);
        if (isNaN(birthDate.getTime())) {
          throw new Error("Invalid birth date format");
        }

        console.log("Create payload:", createPayload);
        console.log("Available classes:", classes);
        console.log("Payload JSON:", JSON.stringify(createPayload, null, 2));
        console.log(
          "Date format check - birth_date:",
          createPayload.birth_date,
          "Type:",
          typeof createPayload.birth_date
        );
        console.log(
          "Discount percentage check:",
          createPayload.discount_percentage,
          "Type:",
          typeof createPayload.discount_percentage
        );
        console.log(
          "Grade level check:",
          createPayload.grade_level,
          "Type:",
          typeof createPayload.grade_level
        );
        console.log(
          "Class ID check:",
          createPayload.class_id,
          "Type:",
          typeof createPayload.class_id
        );
        await studentService.createStudent(createPayload);
      }

      // Refresh the data after adding/updating
      fetchStudents(currentPage);
    } catch (error) {
      console.error("Failed to save student:", error);
      setErrorMessage("Failed to save student. Please try again.");
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    if (selectedGrade || searchTerm) {
      fetchStudents(1);
    }
  }, [selectedGrade, searchTerm]);

  // Calculate pagination info for filtered results
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;

  return (
    <>
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitStudent}
        student={selectedStudent}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        classes={classes} // Pass all available classes to the modal
      />

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <Table
        title="Student Info"
        actions={
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Clear Filters Button */}
            {(selectedGrade || selectedClass) && (
              <button
                onClick={() => {
                  setSelectedGrade("");
                  setSelectedClass("");
                  setCurrentPage(1);
                }}
                className="text-gray-600 hover:text-gray-800 text-sm underline"
                disabled={loading}
              >
                Clear Filters
              </button>
            )}

            {/* Add Student Button */}
            <button
              onClick={handleAddStudent}
              disabled={classesLoading || classes.length === 0}
              className={`px-4 py-2 rounded-md ${
                classesLoading || classes.length === 0
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-[var(--primary)] hover:bg-[var(--primary-hover)]"
              } text-white`}
            >
              {classesLoading ? "Loading..." : "Add Student"}
            </button>
          </div>
        }
        filter={
          <div className="flex space-x-4">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="bg-white border border-gray-300 text-gray-600 py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Grades</option>
              {uniqueGrades.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-gray-300 text-gray-600 py-1 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>
        }
        tableHeader={
          <>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Email
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Grade Level
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Class Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Phone
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Birth Date
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </>
        }
        tableContent={
          <>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  Loading students...
                </td>
              </tr>
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No students found
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className=" text-left hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.grade_level}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.class_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.birth_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => handleEditStudent(student)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstStudent + 1} to{" "}
            {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
            {totalStudents} results
          </div>
          <div className="flex space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-2 border text-sm font-medium rounded-md ${
                    currentPage === pageNumber
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </button>
              )
            )}

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </>
  );
}
