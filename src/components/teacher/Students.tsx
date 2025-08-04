import React, { useState } from "react";
import Table from "../ui/Table"; // Adjust the import path if needed
import MarkInputModal from "./MarkInputModal";

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
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Get unique class names for filter dropdown
  const uniqueClasses = Array.from(
    new Set(studentsData.map((student) => student.className))
  );

  // Filter students based on selected class
  const filteredStudents =
    selectedClass === "All"
      ? studentsData
      : studentsData.filter((student) => student.className === selectedClass);

  // Handle opening the mark input modal
  const handleOpenModal = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // Handle submitting marks
  const handleSubmitMark = (mark: number, type: string) => {
    if (selectedStudent) {
      console.log(
        `Submitted mark ${mark} of type ${type} for student ${selectedStudent.name}`
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
                key={student.name}
                className="hover:bg-gray-50 transition duration-150 ease-in-out"
              >
                <td className="px-6 py-4">{student.name}</td>
                <td className="px-6 py-4">{student.className}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-2 bg-[var(--primary)]"
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
          studentName={selectedStudent.name}
          onSubmit={handleSubmitMark}
        />
      )}
    </>
  );
}
