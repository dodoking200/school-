import { useState, useEffect } from "react";
import Table from "../ui/Table";
import StudentModal from "./StudentModal";

interface Student {
  id: number;
  name: string;
  email: string;
  grade: number;
  className: string;
  phone: string;
  birthdate: string;
}

export default function StudentInfo() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [studentsPerPage] = useState<number>(10);

  // Initialize students data
  useEffect(() => {
    setStudents([
      {
        id: 1,
        name: "Ethan Carter",
        email: "ethan.carter@example.com",
        grade: 10,
        className: "Class A",
        phone: "(555) 123-4567",
        birthdate: "2006-05-15",
      },
      {
        id: 2,
        name: "Olivia Bennett",
        email: "olivia.bennett@example.com",
        grade: 11,
        className: "Class B",
        phone: "(555) 234-5678",
        birthdate: "2005-08-22",
      },
      {
        id: 3,
        name: "Noah Thompson",
        email: "noah.thompson@example.com",
        grade: 9,
        className: "Class C",
        phone: "(555) 345-6789",
        birthdate: "2007-03-10",
      },
      {
        id: 4,
        name: "Ava Rodriguez",
        email: "ava.rodriguez@example.com",
        grade: 12,
        className: "Class A",
        phone: "(555) 456-7890",
        birthdate: "2004-11-30",
      },
      {
        id: 5,
        name: "Liam Harper",
        email: "liam.harper@example.com",
        grade: 10,
        className: "Class B",
        phone: "(555) 567-8901",
        birthdate: "2006-07-18",
      },
      {
        id: 6,
        name: "Sophia Martinez",
        email: "sophia.martinez@example.com",
        grade: 11,
        className: "Class A",
        phone: "(555) 678-9012",
        birthdate: "2005-04-12",
      },
      {
        id: 7,
        name: "William Johnson",
        email: "william.johnson@example.com",
        grade: 9,
        className: "Class C",
        phone: "(555) 789-0123",
        birthdate: "2007-09-25",
      },
      {
        id: 8,
        name: "Isabella Davis",
        email: "isabella.davis@example.com",
        grade: 12,
        className: "Class B",
        phone: "(555) 890-1234",
        birthdate: "2004-12-03",
      },
      {
        id: 9,
        name: "James Wilson",
        email: "james.wilson@example.com",
        grade: 10,
        className: "Class A",
        phone: "(555) 901-2345",
        birthdate: "2006-01-20",
      },
      {
        id: 10,
        name: "Mia Anderson",
        email: "mia.anderson@example.com",
        grade: 11,
        className: "Class C",
        phone: "(555) 012-3456",
        birthdate: "2005-06-14",
      },
      {
        id: 11,
        name: "Alexander Taylor",
        email: "alexander.taylor@example.com",
        grade: 9,
        className: "Class B",
        phone: "(555) 123-4567",
        birthdate: "2007-02-28",
      },
      {
        id: 12,
        name: "Charlotte Brown",
        email: "charlotte.brown@example.com",
        grade: 12,
        className: "Class A",
        phone: "(555) 234-5678",
        birthdate: "2004-08-17",
      },
    ]);
  }, []);

  // Get unique grades for filter options
  const uniqueGrades = [...new Set(students.map((student) => student.grade))];

  // Filter students based on selected grade and search term
  const filteredStudents = students.filter((student) => {
    const matchesGrade =
      !selectedGrade || student.grade === parseInt(selectedGrade);
    const matchesSearch =
      !searchTerm ||
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.className.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesGrade && matchesSearch;
  });

  // Pagination logic
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle opening the modal for adding a new student
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing student
  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Handle submitting the student form
  const handleSubmitStudent = (studentData: {
    id?: number;
    name: string;
    email: string;
    grade: number;
    className: string;
    phone: string;
    birthdate: string;
  }) => {
    if (studentData.id) {
      // Update existing student
      setStudents(
        students.map((student) =>
          student.id === studentData.id
            ? { ...(studentData as Student) }
            : student
        )
      );
    } else {
      // Add new student with a new ID
      const newId = Math.max(0, ...students.map((s) => s.id)) + 1;
      setStudents([...students, { ...studentData, id: newId } as Student]);
    }
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGrade, searchTerm]);

  return (
    <>
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitStudent}
        student={selectedStudent}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
      />
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

            {/* Add Student Button */}
            <button
              onClick={handleAddStudent}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
            >
              Add Student
            </button>
          </div>
        }
        filter={
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
              Grade
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
              Birthdate
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
            {currentStudents.map((student) => (
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
                  {student.grade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.className}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {student.birthdate}
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
            ))}
          </>
        }
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstStudent + 1} to{" "}
            {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
            {filteredStudents.length} results
          </div>
          <div className="flex space-x-2">
            {/* Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
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
              disabled={currentPage === totalPages}
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
