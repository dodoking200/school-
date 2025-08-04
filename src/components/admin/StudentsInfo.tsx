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
  const [students, setStudents] = useState<Student[]>([

    ]);  
  
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
    ]);
  }, []);

  // Get unique grades for filter options
  const uniqueGrades = [...new Set(students.map((student) => student.grade))];

  // Filter students based on selected grade
  const filteredStudents = selectedGrade
    ? students.filter((student) => student.grade === parseInt(selectedGrade))
    : students;
    
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
      setStudents(students.map(student => 
        student.id === studentData.id ? { ...studentData as Student } : student
      ));
    } else {
      // Add new student with a new ID
      const newId = Math.max(0, ...students.map(s => s.id)) + 1;
      setStudents([...students, { ...studentData, id: newId } as Student]);
    }
  };

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
        <button
          onClick={handleAddStudent}
          className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
        >
          Add Student
        </button>
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
          {filteredStudents.map((student) => (
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
    </>
  );
}
