import { useState, useEffect } from "react";
import Table from "../ui/Table";
import TeacherModal from "./TeacherModal";
import { Teacher } from "@/types";

export default function TeacherInfo() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  // Initialize teachers data
  useEffect(() => {
    setTeachers([
      {
        id: 1,
        name: "Dr. Evelyn Reed",
        email: "evelyn.reed@example.com",
        role: "teacher",
        phone: "(555) 123-4567",
        birth_date: "1980-08-15",
        subjects: ["Mathematics", "Physics"],
        created_at: "2023-01-10",
        updated_at: "2023-01-10",
      },
      {
        id: 2,
        name: "Mr. Samuel Grant",
        email: "samuel.grant@example.com",
        role: "teacher",
        phone: "(555) 987-6543",
        birth_date: "1975-03-22",
        subjects: ["History", "Geography"],
        created_at: "2023-02-15",
        updated_at: "2023-02-15",
      },
    ]);
  }, []);

  // Handle opening the modal for adding a new teacher
  const handleAddTeacher = () => {
    setSelectedTeacher(null);
    setIsModalOpen(true);
  };

  // Handle opening the modal for editing an existing teacher
  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  // Handle submitting the teacher form
  const handleSubmitTeacher = (teacherData: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    birthdate: string;
    subjects: string[];
  }) => {
    const now = new Date().toISOString();
    if (teacherData.id) {
      // Update existing teacher
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === teacherData.id
            ? {
                ...teacher,
                ...teacherData,
                birth_date: teacherData.birthdate,
                updated_at: now,
              }
            : teacher
        )
      );
    } else {
      // Add new teacher with a new ID
      const newId = Math.max(0, ...teachers.map((t) => t.id)) + 1;
      setTeachers([
        ...teachers,
        {
          ...teacherData,
          id: newId,
          role: "teacher",
          birth_date: teacherData.birthdate,
          created_at: now,
          updated_at: now,
        },
      ]);
    }
  };

  // Handle removing a teacher
  const handleRemoveTeacher = (teacherId: number) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== teacherId));
  };

  return (
    <>
      <TeacherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmitTeacher}
        teacher={
          selectedTeacher
            ? { ...selectedTeacher, birthdate: selectedTeacher.birth_date }
            : null
        }
        title={selectedTeacher ? "Edit Teacher" : "Add New Teacher"}
      />
      <Table
        title="Teacher Info"
        actions={
          <button
            onClick={handleAddTeacher}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white px-4 py-2 rounded-md"
          >
            Add Teacher
          </button>
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
              Subjects
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
            {teachers.map((teacher) => (
              <tr
                key={teacher.id}
                className=" text-left hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {teacher.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {teacher.birth_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-.500">
                  {teacher.subjects.join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    className="text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEditTeacher(teacher)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900 ml-4"
                    onClick={() => handleRemoveTeacher(teacher.id)}
                  >
                    Remove
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
