import { useState, useEffect, useCallback } from "react";
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
import {
  SearchColorIcon,
  AddColorIcon,
  EditColorIcon,
} from "@/components/icons/ColorfulIcons";

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
      // Use advanced search if there are search terms or filters
      if (searchTerm || selectedGrade || selectedClass) {
        const searchParams = {
          name: searchTerm || "",
          page: page,
          pageSize: studentsPerPage,
          sortBy: "name",
          sortOrder: "asc" as const,
        };

        const response = await studentService.searchStudentsAdvanced(
          searchParams
        );

        setStudents(response.students);
        setTotalPages(response.pagination.totalPages);
        setTotalStudents(response.pagination.total);
        setHasNextPage(
          response.pagination.page < response.pagination.totalPages
        );
        setHasPreviousPage(response.pagination.page > 1);
        setCurrentPage(response.pagination.page);
      } else {
        // Use regular pagination if no search terms
        const paginationData: PaginationRequest = {
          table: "students",
          page: page,
          pageSize: studentsPerPage,
          orderBy: "name",
          orderDirection: "asc",
          filters: {},
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
      }
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
  }, [selectedGrade, selectedClass, searchTerm]);

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

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (searchValue: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setSearchTerm(searchValue);
        }, 300);
      };
    })(),
    []
  );

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
            {/* Modern Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search students by name, email, or phone..."
                defaultValue={searchTerm}
                onChange={(e) => debouncedSearch(e.target.value)}
                className="modern-input w-64 pl-12 pr-4 text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchColorIcon size={18} />
              </div>
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    const input = document.querySelector(
                      'input[placeholder*="Search students"]'
                    ) as HTMLInputElement;
                    if (input) input.value = "";
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
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

            {/* Modern Add Student Button */}
            <button
              onClick={handleAddStudent}
              disabled={classesLoading || classes.length === 0}
              className={`btn-primary flex items-center gap-2 ${
                classesLoading || classes.length === 0
                  ? "opacity-50 cursor-not-allowed transform-none"
                  : ""
              }`}
            >
              {classesLoading ? (
                <div className="flex items-center gap-2">
                  <div className="loading-spinner w-4 h-4" />
                  <span>Loading...</span>
                </div>
              ) : (
                <>
                  <AddColorIcon size={18} />
                  <span>Add Student</span>
                </>
              )}
            </button>
          </div>
        }
        filter={
          <div className="flex space-x-4">
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="modern-input !w-auto min-w-32"
            >
              <option value="">🎓 All Grades</option>
              {uniqueGrades.map((grade) => (
                <option key={grade} value={grade}>
                  Grade {grade}
                </option>
              ))}
            </select>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="modern-input !w-auto min-w-32"
            >
              <option value="">🏫 All Classes</option>
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
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              👤 Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              📧 Email
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              🎓 Grade Level
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              🏫 Class Name
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              📱 Phone
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              🎂 Birth Date
            </th>
            <th
              scope="col"
              className="px-6 py-4 text-left text-sm font-bold text-white tracking-wide"
            >
              ⚡ Actions
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
                  className="text-left hover:bg-primary-50/50 hover:scale-[1.01] transition-all duration-200 group"
                >
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-semibold text-gray-900 group-hover:text-primary-600">
                    {student.name}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className="inline-flex px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                      Grade {student.grade_level}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {student.class_name}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {student.phone}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">
                    {student.birth_date}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    <button
                      className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-sm flex items-center gap-2"
                      onClick={() => handleEditStudent(student)}
                    >
                      <EditColorIcon size={16} />
                      <span>Edit</span>
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
          <div className="flex items-center space-x-2">
            {/* First Page Button */}
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go to first page"
            >
              First
            </button>

            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPreviousPage}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go to previous page"
            >
              Previous
            </button>

            {/* Current Page Display */}
            <div className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium">
              Page {currentPage} of {totalPages}
            </div>

            {/* Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNextPage}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go to next page"
            >
              Next
            </button>

            {/* Last Page Button */}
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Go to last page"
            >
              Last
            </button>
          </div>
        </div>
      )}
    </>
  );
}
