import { useState } from "react";

interface Student {
  id: number;
  name: string;
  email: string;
  grade: number;
}

export default function StudentInfo() {
  const [selectedGrade, setSelectedGrade] = useState<string>("");

  const students: Student[] = [
    {
      id: 1,
      name: "Ethan Carter",
      email: "ethan.carter@example.com",
      grade: 10,
    },
    {
      id: 2,
      name: "Olivia Bennett",
      email: "olivia.bennett@example.com",
      grade: 11,
    },
    {
      id: 3,
      name: "Noah Thompson",
      email: "noah.thompson@example.com",
      grade: 9,
    },
    {
      id: 4,
      name: "Ava Rodriguez",
      email: "ava.rodriguez@example.com",
      grade: 12,
    },
    { id: 5, name: "Liam Harper", email: "liam.harper@example.com", grade: 10 },
  ];

  // Get unique grades for filter options
  const uniqueGrades = [...new Set(students.map((student) => student.grade))];

  // Filter students based on selected grade
  const filteredStudents = selectedGrade
    ? students.filter((student) => student.grade === parseInt(selectedGrade))
    : students;

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Student Info List</h1>

      {/* Filter Dropdown */}
      <div className="flex justify-end mb-4">
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-gray-50 transition duration-150"
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
                  <button className="text-indigo-600 hover:text-indigo-900">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
