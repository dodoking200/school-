import { useState, useEffect } from "react";
import Table from "../ui/Table";
import StudentModal from "./StudentModal";
import { studentService } from "@/lib/services/studentService";
import { toast } from "react-toastify";

interface Student {
  id: number;
  name: string;
  email: string;
  grade_level: number;
  class_name?: string;
  curriculum_grade?: string;
  phone: string;
  birth_date: string;
}

export default function StudentInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<{
    id: number;
    name: string;
    email: string;
    grade_level: number;
    class_name: string;
    phone: string;
    birth_date: string;
  } | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [allStudents, setAllStudents] = useState<Student[]>([]); // Store all students for filtering
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [studentsPerPage] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");

  // Fetch students from backend with pagination
  const fetchStudents = async (page: number = 1) => {
    setLoading(true);
    try {
      // For initial load, get more students to have enough data for filtering
      // For subsequent pages, use the standard page size
      const pageSize = studentsPerPage;
      
      console.log(`Fetching students from backend: page ${page}, pageSize ${pageSize}`);
      
      const response = await studentService.getStudentsWithPagination({
        page: page,
        pageSize: pageSize,
        orderBy: "name",
        orderDirection: "asc",
      });
      
             console.log('Backend response:', response);
       console.log('Response details:', {
         total: response.total,
         totalPages: response.totalPages,
         dataLength: response.data.length,
         page: response.page,
         pageSize: response.pageSize
       });
       console.log('Response keys:', Object.keys(response));
       console.log('Response type:', typeof response);
      
             // Store all students for filter options (we need this for the dropdowns)
       if (page === 1) {
         setAllStudents(response.data);
         setStudents(response.data);
         // Use backend pagination metadata for initial load
         const total = response.total || 0;
         // Calculate totalPages if backend doesn't provide it
         const totalPages = response.totalPages || (total > 0 ? Math.ceil(total / studentsPerPage) : 1);
         setTotalStudents(total);
         setTotalPages(totalPages);
         console.log('Setting pagination state:', { total, totalPages, studentsPerPage, calculated: Math.ceil(total / studentsPerPage) });
       } else {
         setStudents(response.data);
         setCurrentPage(page);
         // Update pagination info for subsequent pages
         setTotalStudents(response.total || totalStudents);
         setTotalPages(response.totalPages || totalPages);
       }
    } catch (error) {
      console.error("Failed to fetch students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchStudents(1);
  }, []); // Only fetch once on component mount

  // Handle filter changes - reset to first page and fetch filtered data
  useEffect(() => {
    if (allStudents.length === 0) return;
    
    // Reset to first page when filters change
    setCurrentPage(1);
    
    // For now, we'll do client-side filtering since backend doesn't support it
    // In the future, this could be updated to make backend calls with filter parameters
    let filtered = allStudents;
    
    if (selectedGrade) {
      const gradeNum = parseInt(selectedGrade);
      filtered = filtered.filter(student => {
        const studentGrade = student.grade_level !== undefined ? Number(student.grade_level) : null;
        if (studentGrade === null || isNaN(studentGrade)) {
          return false;
        }
        return studentGrade === gradeNum;
      });
    }
    
    if (selectedClass) {
      filtered = filtered.filter(student => student.class_name === selectedClass);
    }
    
    setStudents(filtered);
    
    // Don't override backend pagination state when filtering
    // Only update totalStudents for display purposes
    setTotalStudents(filtered.length);
    // Keep totalPages from backend pagination
  }, [allStudents, selectedGrade, selectedClass]);

  // Get filtered grades and classes based on current selections
  const getFilteredGrades = () => {
    let filteredStudents = allStudents;
    
    // If class is selected, only show grades that have that class
    if (selectedClass) {
      filteredStudents = filteredStudents.filter(student => student.class_name === selectedClass);
    }
    
    return [...new Set(filteredStudents.map(student => student.grade_level))].sort();
  };

  const getFilteredClasses = () => {
    let filteredStudents = allStudents;
    
    // If grade is selected, only show classes that have that grade
    if (selectedGrade) {
      const gradeNum = parseInt(selectedGrade);
      filteredStudents = filteredStudents.filter(student => {
        const studentGrade = student.grade_level !== undefined ? Number(student.grade_level) : null;
        return studentGrade === gradeNum;
      });
    }
    
    return [...new Set(filteredStudents.map(student => student.class_name).filter(Boolean))].sort();
  };

  const uniqueGrades = getFilteredGrades();
  const uniqueClasses = getFilteredClasses();

  // Backend pagination state
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalStudents, setTotalStudents] = useState<number>(0);
  
  // Backend pagination - students array contains the current page data
  const currentStudents = students;

  // Handle page change - make API call to backend for the new page
  const handlePageChange = (pageNumber: number) => {
    console.log('Page change requested:', { 
      fromPage: currentPage, 
      toPage: pageNumber, 
      totalStudents, 
      totalPages,
      studentsLength: students.length,
      currentStudentsLength: currentStudents.length
    });
    
    // Make API call to backend for the new page
    fetchStudents(pageNumber);
  };

  // Handle opening the modal for adding a new student
  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing student
  const handleEditStudent = (student: Student) => {
    // Convert Student type to match StudentModal interface
    const modalStudent = {
      id: student.id,
      name: student.name,
      email: student.email,
      grade_level: student.grade_level,
      class_name: student.class_name || "Class A", // Provide default value
      phone: student.phone,
      birth_date: student.birth_date,
    };
    setSelectedStudent(modalStudent);
    setIsModalOpen(true);
  };

  // Handle submitting the student form
  const handleSubmitStudent = (studentData: {
    id?: number;
    name: string;
    email: string;
    grade_level: number;
    class_name: string;
    phone: string;
    birth_date: string;
  }) => {
    if (studentData.id) {
      // Update existing student
      setStudents(
        students.map((student) =>
          student.id === studentData.id
            ? { 
                id: studentData.id,
                name: studentData.name,
                email: studentData.email,
                grade_level: studentData.grade_level,
                class_name: studentData.class_name,
                phone: studentData.phone,
                birth_date: studentData.birth_date,
              }
            : student
        )
      );
    } else {
      // Add new student with a new ID
      const newId = Math.max(0, ...students.map((s) => s.id)) + 1;
      setStudents([...students, { 
        id: newId,
        name: studentData.name,
        email: studentData.email,
        grade_level: studentData.grade_level,
        class_name: studentData.class_name,
        phone: studentData.phone,
        birth_date: studentData.birth_date,
      }]);
    }
  };

  // Note: Pagination is now handled by the backend

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
            {/* Grade Filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="grade-filter" className="text-sm font-medium text-gray-700">
                Grade:
              </label>
              <select
                id="grade-filter"
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="bg-white border border-gray-300 text-gray-600 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">All Grades</option>
                {uniqueGrades.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Class Filter */}
            <div className="flex items-center space-x-2">
              <label htmlFor="class-filter" className="text-sm font-medium text-gray-700">
                Class:
              </label>
              <select
                id="class-filter"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="bg-white border border-gray-300 text-gray-600 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((className) => (
                  <option key={className} value={className}>
                    {className}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(selectedGrade || selectedClass) && (
              <button
                onClick={() => {
                  setSelectedGrade("");
                  setSelectedClass("");
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
              disabled={loading}
              className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Student
            </button>
          </div>
        }
        filter={
          (selectedGrade || selectedClass) && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-4 text-sm text-blue-800">
                <span className="font-medium">Active Filters:</span>
                {selectedGrade && (
                  <span className="px-2 py-1 bg-blue-100 rounded">
                    Grade: {selectedGrade}
                  </span>
                )}
                {selectedClass && (
                  <span className="px-2 py-1 bg-blue-100 rounded">
                    Class: {selectedClass}
                  </span>
                )}
                                                                       <span className="text-blue-600">
                    Showing {students.length} students from current page
                  </span>
              </div>
            </div>
          )
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
            {loading ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  Loading students...
                </td>
              </tr>
            ) : currentStudents.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                  No students found
                </td>
              </tr>
            ) : (
              currentStudents.map((student) => (
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
                    {student.class_name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.birth_date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleEditStudent(student)}
                      disabled={loading}
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
       {console.log('Pagination render check:', { totalPages, shouldRender: totalPages > 1 })}
       {totalPages > 1 && (
         <div className="mt-6 flex items-center justify-between">
                                                  <div className="text-sm text-gray-700">
               Page {currentPage} of {totalPages}
               {selectedGrade || selectedClass ? (
                 <span className="ml-2 text-gray-500">
                   (with active filters)
                 </span>
               ) : null}
             </div>
           <div className="flex space-x-2">
             {/* Previous Page Button */}
             <button
               onClick={() => handlePageChange(currentPage - 1)}
               disabled={currentPage === 1 || loading}
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
                   disabled={loading}
                   className={`px-3 py-2 border text-sm font-medium rounded-md ${
                     currentPage === pageNumber
                       ? "bg-indigo-600 text-white border-indigo-600"
                       : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                   } disabled:opacity-50 disabled:cursor-not-allowed`}
                 >
                   {pageNumber}
                 </button>
               )
             )}

             {/* Next Page Button */}
             <button
               onClick={() => handlePageChange(currentPage + 1)}
               disabled={currentPage === totalPages || loading}
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
