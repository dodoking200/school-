import React, { useState } from "react";

// src/types.ts
export interface Student {
  name: string;
  className: string;
  attendance: number;
  marks: number;
}

const studentsData: Student[] = [
  { name: "Liam Harper", className: "Grade 10", attendance: 95, marks: 88 },
  { name: "Sophia Carter", className: "Grade 10", attendance: 92, marks: 92 },
  { name: "Noah Parker", className: "Grade 10", attendance: 50, marks: 75 },
  { name: "Isabella Reed", className: "Grade 10", attendance: 90, marks: 85 },
  { name: "Jackson Ford", className: "Grade 10", attendance: 25, marks: 90 },
];

export default function Students() {
  const [selectedClass, setSelectedClass] = useState<string>("All");

  // Get unique class names for filter dropdown
  const uniqueClasses = Array.from(
    new Set(studentsData.map((student) => student.className))
  );

  // Filter students based on selected class
  const filteredStudents =
    selectedClass === "All"
      ? studentsData
      : studentsData.filter((student) => student.className === selectedClass);

  return (
    <div className="p-6   ">
      <div className="mb-4">
        {/* Class Filter Dropdown */}
        <div className="mb-4 flex-wrap flex justify-between">
          <h2 className="text-xl font-semibold mb-3 text-black">Student</h2>

          <select
            id="classFilter"
            className=" border border-gray-300  rounded-4xl bg-gray-200 p-2"
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
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-4xl shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 w-full text-left">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-300">
                <th className="px-6 py-4 font-medium w-[20%]">Student Name</th>
                <th className="px-6 py-4 font-medium w-[20%]">Class</th>
                <th className="px-6 py-4 font-medium w-[20%]">Attendance</th>
                <th className="px-6 py-4 font-medium w-[20%]">Marks</th>
                <th className="px-6 py-4 font-medium w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.name}
                  className="hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.className}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-24 h-2 bg-[var(--primary)]"
                        style={{ width: `${student.attendance}%` }}
                      />
                      <span className="font-medium text-gray-800">
                        {student.attendance}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-[var(--primary)]">
                      {student.marks}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[var(--primary)] hover:underline">
                      Input Marks
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
